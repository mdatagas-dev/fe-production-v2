"use client";

import FormBomlistPage from "@/components/form/formBomlist";
import ErrorState from "@/components/state/errorState";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditBomlistPage() {
  const router = useRouter();
  const [dataResult, setDataResult] = useState(null);
  const [error, setError] = useState(null);
  const params = useParams();
  const id = params.id;
  const endPoint = `${apiBaseUrl}/bomlist?keyword=${id}`;

  const fetchData = async () => {
    try {
      const result = await fetchWithAuth(endPoint);

      if (result?.error || !Array.isArray(result?.data)) {
        setError(result?.error || "Gagal memuat data bomlist");
        return;
      }

      if (result.data.length === 0) {
        setError("Data bomlist tidak ditemukan");
        return;
      }

      setError(null);
      setDataResult(result.data[0]);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data bomlist");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    const endPoint = `${apiBaseUrl}/bomlist/edit/${id}`;
    try {
      // await-nya hilang sebelumnya, jadi hasilnya Promise dan halaman selalu
      // bilang "berhasil" walau backend menolak.
      const result = await fetchWithAuth(endPoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push("/bomlist?alert=Data berhasil di update");
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan perubahan bomlist");
    }
  };

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

  return (
    <div className="w-full h-full py-2 px-4 ">
      <FormBomlistPage initialData={dataResult} onSubmit={handleSubmit} />
    </div>
  );
}
