"use client";
import BtnBack from "@/components/btn/btnBack";
import FormRecordScanPage from "@/components/form/formRecord";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function HistoryScanEdit() {
  const params = useParams();
  const router = useRouter();
  const [dataResult, setDataResult] = useState();
  const [valid, setValid] = useState([]);
  const snRef = useRef(null);
  const keyword = params.id || "";
  useEffect(() => {
    const endPoint = `http://localhost:2000/rdps/history?keyword=${encodeURIComponent(
      keyword
    )}`;
    const fetchData = async () => {
      try {
        const result = await fetchWithAuth(endPoint, {
          headers: {
            idregist: sessionStorage.getItem("id_regist"),
          },
        });
        console.log("hasil result :", result);
        setDataResult(result.data[0]);
        setValid(result.validation);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    try {
      const endPoint = `${apiBaseUrl}/rdps/edit/${dataResult.id}`;
      const result = await fetchWithAuth(endPoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (result.error) {
        console.log(result.error);
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
      <div className="w-full">
        <BtnBack url={"/scanprod/history"} />
      </div>
      <FormRecordScanPage
        initialData={dataResult}
        validation={valid}
        snRef={snRef}
        onSumbit={handleSubmit}
      />
    </div>
  );
}
