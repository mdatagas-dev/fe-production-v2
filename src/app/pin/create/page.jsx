"use client";
import AlertError from "@/components/alert/error";
import AlertSuccess from "@/components/alert/success";
import FormPin from "@/components/form/formPin";
import ErrorState from "@/components/state/errorState";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function pinCreatePage() {
  const router = useRouter();
  const [alert, setalert] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);
  const [dataResult, setDataResult] = useState([]);
  const [error, setError] = useState(null);

  const handleData = async () => {
    try {
      const result = await fetchWithAuth(`${apiBaseUrl}/pin`);

      // Sebelumnya kegagalan hanya masuk console, sehingga tabel tampil kosong
      // seolah belum ada PIN yang dibuat.
      if (result?.error || !Array.isArray(result?.data)) {
        setError(result?.error || "Gagal memuat data pin");
        return;
      }

      setError(null);
      setDataResult(result.data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data pin");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    const endPoint = `${apiBaseUrl}/pin/post`;
    try {
      const result = await fetchWithAuth(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (result.error) {
        console.log(result);
        setAlertMsg(result?.error);
        setalert("error");
      } else {
        setAlertMsg(result?.message);
        setalert("success");
        e.target.reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const endPoint = `${apiBaseUrl}/pin/delete/${id}`;
    try {
      const result = await fetchWithAuth(endPoint, {
        method: "DELETE",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (result?.error) {
        setError(result.error);
        return;
      }

      await handleData();
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus pin");
    }
  };

  useEffect(() => {
    handleData();

    if (alert) {
      handleData();
      const time = setTimeout(() => {
        setalert(null);
        setAlertMsg(null);
      }, 3000);
      return () => clearTimeout(time);
    }
  }, [alert]);

  if (error) {
    return <ErrorState text={error} />;
  }

  return (
    <div className="w-full p-4">
      {alert === "error" ? (
        <AlertError text={alertMsg} />
      ) : (
        <AlertSuccess text={alertMsg} />
      )}
      <h1 className="text-2xl font-semibold">Form Pin For Auth</h1>
      <div className="w-full h-[90%] flex flex-col">
        <div className="w-full h-[10%]">
          <FormPin onSubmit={handleSubmit} />
        </div>
        <div className="w-full h-[90%] overflow-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Pin</th>
                <th>Act</th>
              </tr>
            </thead>
            <tbody>
              {dataResult?.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>
                      {new Date(item.date).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                      })}
                    </td>
                    <td>{item.pin}</td>
                    <td>
                      <button
                        className="btn btn-error"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
