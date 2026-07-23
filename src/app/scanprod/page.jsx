"use client";

import AlertError from "@/components/alert/error";
import AlertSuccess from "@/components/alert/success";
import FormRecordScanPage from "@/components/form/formRecord";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ScanProdPage() {
  const snRef = useRef(null);

  const [total, setTotal] = useState(0);
  const [lastscan, setLastscan] = useState(null);
  const [dataResult, setDataResult] = useState([]);
  const [alert, setAlert] = useState();
  const [alertMsg, setAlertMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const [bomlist, setBomlist] = useState([]);

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => {
        setAlert(null);
        setAlertMsg(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

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
      setAlert("error");
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

    if (data.sn_carton && data.sn_carton !== data.sn) {
      setAlertMsg("SN CARTON tidak sama dengan SN UNIT");
      setAlert("error");
      setLoading(false);
      return;
    }

    // cek bomlist
    // console.log("bomlist:", bomlist);
    for (const item of bomlist) {
      for (const key in item) {
        const valueOfBomlist = item[key];
        const valueOfData = data[key];

        // console.log(
        //   `key: ${key}, valueOfBomlist: ${valueOfBomlist}, valueOfData: ${valueOfData}`,
        // );
        if (valueOfData && !valueOfData.includes(valueOfBomlist)) {
          // console.log(
          //    `tidak sesuai bomlist ${key} : ${valueOfBomlist}, valueOfData: ${valueOfData}`,
          // );
          setAlertMsg(`tidak sesuai bomlist ${key} : ${valueOfBomlist}`);
          setAlert("error");
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
      }
      setLoading(false);
    } catch (error) {
      console.log("error submit:", error);
      setAlert("error");
      setLoading(false);
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
        <div className="block">
          <AlertSuccess text={alertMsg} />
        </div>
      ) : (
        <div className={`${alert === "error" ? "block" : "hidden"}`}>
          <AlertError text={alertMsg} />
        </div>
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

      <div className="w-full flex flex-col flex-row-reverse gap-2 items-center absolute p-2">
        <Link href={"upload/production"} className="btn btn-primary">
          upload data
        </Link>
      </div>

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
