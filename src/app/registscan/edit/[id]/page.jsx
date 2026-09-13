"use client";
import AlertError from "@/components/alert/error";
import FormRegist from "@/components/form/formRegisScan";
import ErrorState from "@/components/state/errorState";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditRegistscanPage() {
  const params = useParams();
  const [dataResult, setDataResult] = useState();
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);
  const [models, setModels] = useState({});
  const [lines, setLines] = useState({});
  const router = useRouter();
  const registscanID = params.id;
  const endPoint = `${apiBaseUrl}/registscan?keyword=${registscanID}`;

  const getModelChildren = async (data) => {
    if (data !== undefined) {
      const getData = data;
      const model = getData?.map((item) => item.model);
      setModels(model);
    }
  };

  const getLineChildren = async (data) => {
    if (data !== undefined) {
      const getData = data;
      const line = getData?.map((item) => item.line);
      setLines(line);
    }
  };

  useEffect(() => {
    getModelChildren();
    getLineChildren();
    const fetchData = async () => {
      try {
        const result = await fetchWithAuth(endPoint);

        // Sebelumnya kegagalan membuat form kosong tanpa penjelasan apa pun.
        if (result?.error || !Array.isArray(result?.data)) {
          setError(result?.error || "Gagal memuat data registrasi");
          return;
        }

        if (result.data.length === 0) {
          setError("Data registrasi tidak ditemukan");
          return;
        }

        setError(null);
        setDataResult(result);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data registrasi");
      }
    };

    if (alert) {
      const timeout = setTimeout(() => {
        setAlert(null);
        setAlertMsg(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
    fetchData();
  }, [alert, registscanID, models, lines]);

  if (error) {
    return <ErrorState text={error} />;
  }

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
    const matchModel = models.includes(data.model);

    if (!matchModel) {
      setAlert("error");
      setAlertMsg("Model tidak di temukan");
      return;
    }

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
        setAlert("error");
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
      {alert === "error" && <AlertError text={alertMsg} />}
      <FormRegist
        onSubmit={handleSubmit}
        initialData={dataResult?.data[0]}
        handleLine={getLineChildren}
        handleModel={getModelChildren}
        load={"data"}
      />
    </div>
  );
}
