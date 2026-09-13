"use client";

import FormModel from "@/components/form/formModel";
import ErrorState from "@/components/state/errorState";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditModelPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [dataResult, setDataResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // keyword menerima UUID, jadi baris diambil langsung by id
        const result = await fetchWithAuth(
          `${apiBaseUrl}/model?keyword=${id}&limit=1`,
        );

        if (result?.error) {
          setError(result.error);
          return;
        }

        if (!Array.isArray(result?.data) || result.data.length === 0) {
          setError("Data model tidak ditemukan");
          return;
        }

        setError(null);
        setDataResult(result.data[0]);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data model");
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    const endPoint = `${apiBaseUrl}/model/edit/${id}`;

    try {
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

      router.push("/modeltv?alert=Data berhasil di update");
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <ErrorState text={error} />;
  }

  // Form hanya dirender setelah datanya ada: nilai awal input dipasang sekali
  // saat mount, jadi data harus siap lebih dulu.
  if (!dataResult) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full h-full px-4 py-2">
      <h1 className="text-2xl font-bold mb-2">Edit Model</h1>
      <FormModel initialData={dataResult} onSubmit={handleSubmit} />
    </div>
  );
}
