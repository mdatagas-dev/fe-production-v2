"use client";
import AlertError from "@/components/alert/error";
import BtnBack from "@/components/btn/btnBack";
import FormRecordScanPage from "@/components/form/formRecord";
import ModalPin from "@/components/modal/pin";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function HistoryScanEdit() {
  const params = useParams();
  const router = useRouter();
  const [dataResult, setDataResult] = useState();
  const [valid, setValid] = useState([]);
  const [alert, setAlert] = useState(null);
  const [msgAlert, setMsgAlert] = useState(null);
  const snRef = useRef(null);
  const pinRef = useRef(null);
  const keyword = params.id || "";

  useEffect(() => {
    const endPoint = `${apiBaseUrl}/rdps/history?keyword=${encodeURIComponent(
      keyword
    )}`;
    const fetchData = async () => {
      try {
        const result = await fetchWithAuth(endPoint, {
          headers: {
            idregist: sessionStorage.getItem("id_regist"),
          },
        });

        setDataResult(result.data[0]);
        setValid(result.validation);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => {
        setAlert(null);
        setMsgAlert(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    const isPinValidate = await pinRef.current.openModal();

    if (isPinValidate !== true) {
      setAlert("error");
      setMsgAlert("Pin salah");
      return;
    }
    try {
      console.log("update di jalankan");
      const endPoint = `${apiBaseUrl}/rdps/edit/${dataResult.id}`;
      const result = await fetchWithAuth(endPoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (result.error) {
        setAlert("error");
        setMsgAlert(result.error);
      } else {
        router.push("/scanprod/history?alert=data berhasil di ubah");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (dataResult?.length <= 0 || dataResult === undefined) {
    return (
      <div className="w-full h-full flex justify-center item-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 w-full">
      {alert === "error" ? <AlertError text={msgAlert} /> : ""}
      <div className="w-full">
        <BtnBack url={"/scanprod/history"} />
      </div>
      <FormRecordScanPage
        initialData={dataResult}
        validation={valid}
        snRef={snRef}
        onSubmit={handleSubmit}
      />
      <ModalPin ref={pinRef} />
    </div>
  );
}
