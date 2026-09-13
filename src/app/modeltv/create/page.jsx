"use client";

import AlertError from "@/components/alert/error";
import FormModel from "@/components/form/formModel";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateModelPage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    const endPoint = `${apiBaseUrl}/model/post`;

    try {
      const result = await fetchWithAuth(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push("/modeltv?alert=Data berhasil di tambahkan");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full h-full px-4 py-2">
      <h1 className="text-2xl font-bold mb-2">Tambah Model</h1>
      {error && <AlertError text={error} />}
      <FormModel onSubmit={handleSubmit} />
    </div>
  );
}
