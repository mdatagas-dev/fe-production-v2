"use client";
import AlertError from "@/components/alert/error";
import BtnBack from "@/components/btn/btnBack";
import FormRegist from "@/components/form/formRegisScan";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditRegistscanPage() {
  const params = useParams();
  const [dataResult, setDataResult] = useState();
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const router = useRouter();
  const registscanID = params.id;
  const endPoint = `${apiBaseUrl}/registscan?keyword=${registscanID}`;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlert(false);
      setAlertMsg(null);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [alert]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchWithAuth(endPoint);
        setDataResult(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [registscanID]);

  if (!dataResult) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    const endPoint = `${apiBaseUrl}/registscan/edit/${registscanID}`;
    try {
      const result = await fetchWithAuth(endPoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (result.error) {
        setAlertMsg(result.error);
        setAlert(true);
      } else {
        router.push(`/registscan?alert=${result.message}`);
      }
    } catch (error) {
      setAlertMsg(error);
      setAlert(true);
      console.log(error);
    }
  };

  return (
    <div>
      {alert && <AlertError text={alertMsg} />}
      <FormRegist onSubmit={handleSubmit} initialData={dataResult?.data[0]} />
    </div>
  );
}
