"use client";

import AlertError from "@/components/alert/error";
import AlertSuccess from "@/components/alert/success";
import FormRecordScanPage from "@/components/form/formRecord";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useEffect, useRef, useState } from "react";

export default function ScanProdPage() {
  const snRef = useRef(null);

  const [total, setTotal] = useState(0);
  const [lastscan, setLastscan] = useState(null);
  const [dataResult, setDataResult] = useState([]);
  const [alert, setAlert] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);
  const [checkedTcl, setCheckedTcl] = useState(false);
  const [loading, setLoading] = useState(false);

  const [bomlist, setBomlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("toggle");
    if (saved !== null) {
      setCheckedTcl(saved === "true");
    }
    if (alert) {
      const timeout = setTimeout(() => {
        setAlert(null);
        setAlertMsg(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  const handleChange = (e) => {
    const value = e.target.checked;
    setCheckedTcl(value);
    localStorage.setItem("toggle", value);
  };

  const fetchData = async () => {
    const idRegist = sessionStorage.getItem("id_regist");
    const endPoint = `${apiBaseUrl}/rdps/scan`;
    try {
      if (idRegist) {
        const result = await fetchWithAuth(endPoint, {
          headers: {
            "Content-Type": "applicatoin/json",
            idregist: idRegist,
          },
        });
        setDataResult(result.validation);
        setTotal(result.total);
        setLastscan(result.last);
        setBomlist(result.bomlist);
      }
    } catch (error) {
      setAlert(true);
      setAlertMsg(error);
    }
  };

  useEffect(() => {
    fetchData();
    snRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // prevent multiple submissions

    setLoading(true);
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    for (const item of bomlist) {
      for (const key in item) {
        const valueOfBomlist = item[key];
        const valueOfData = data[key];

        if (valueOfData && !valueOfData.includes(valueOfBomlist)) {
          setAlertMsg(`tidak sesuai bomlist ${key} : ${valueOfBomlist}`);
          setAlert(true);
          setLoading(false);
          return;
        }
      }
    }

    try {
      const endPoint = `${apiBaseUrl}/rdps/post`;
      const result = await fetchWithAuth(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (result.error) {
        setAlertMsg(result.error);
        setAlert("error");
        setLoading(false);
      } else {
        setAlertMsg(result.message);
        setAlert("success");
        e.target.reset();
        snRef.current.focus();
        fetchData();
        setLoading(false);

        if (
          (checkedTcl === true && result.brand.toUpperCase() === "TCL") ||
          (result.brand.toUpperCase() === "IFFALCON" &&
            dataResult.subline.toUpperCase().includes("PACKING"))
        ) {
          console.log("Brand is TCL, calling TCL API...");

          // jika brand tcl maka panggil fungsi fetchingTCL
          const fetchingTCL = async () => {
            const tclResult = await fetch("/api/betcl", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                country: "印尼",
                orgCode: "GLOBAL ANUGERAH SETIA(GAS)",
                batch: result.odf || null,
                barcode: result.unit.sn || null,
                panelsn: result.unit.bplane || null,
                coresn: result.unit.mainboard || null,
                powerPanelSn: result.unit.powerboard || null,
                collectDate: new Date().toISOString(),
              }),
            });
            const resTclResult = await tclResult.json();
            console.log("Response from TCL API:", resTclResult);
            if (resTclResult.response.msg !== "success") {
              setAlertMsg("Failed to send data to TCL API");
              setAlert("error");
              return;
            } else {
              setAlertMsg("Data successfully sent to TCL API");
              const localrecord = await fetchWithAuth(
                `${apiBaseUrl}/rtcl/post`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    timestamps: new Date().toISOString(),
                    sn: result.unit.sn,
                    status: resTclResult.response.msg,
                  }),
                }
              );
              setAlert("success");
              setAlertMsg(
                "Data successfully sent to TCL API and saved locally"
              );
              console.log(localrecord);
            }
          };
          fetchingTCL();
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // agar tidak terjadi data changing
  if (!dataResult || Object.keys(dataResult).length <= 0) {
    return (
      <div className="w-full h-full flex justify-center item-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {alert === "success" ? (
        <AlertSuccess text={alertMsg} />
      ) : (
        <AlertError text={alertMsg} />
      )}

      <div className="bg-[#050350] flex text-white w-full h-[10%] px-4 py-2 justify-between">
        <div>
          <p className="font-bold text-[22px]">{dataResult?.model}</p>
          <p>PO NUMBER: {dataResult?.po_number}</p>
        </div>
        <div>
          <p className="text-[16px] font-semibold">{dataResult?.subline}</p>
          <p>Plan: {dataResult?.plan}</p>
          <p>Count: {total}</p>
        </div>
      </div>
      {dataResult.subline.toUpperCase().includes("PACKING") ? (
        <div className="w-full flex flex-col flex-row-reverse gap-2 items-center absolute p-2">
          <input
            type="checkbox"
            className="toggle"
            checked={checkedTcl}
            onChange={handleChange}
          />
          <p>Sync TCL: {checkedTcl ? "ON" : "OFF"}</p>
        </div>
      ) : (
        ""
      )}
      <FormRecordScanPage
        snRef={snRef}
        validation={dataResult}
        lastScan={lastscan}
        register={dataResult}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
