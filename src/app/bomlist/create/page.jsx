"use client";
import AlertError from "@/components/alert/error";
import FormBomlistPage from "@/components/form/formBomlist";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateBomlistPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    const endPoint = `${apiBaseUrl}/bomlist/post`;
    try {
      const result = await fetchWithAuth(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // `error` yang di-console di sini tidak terdefinisi (ReferenceError di
      // dalam try), jadi kegagalan simpan tidak pernah tampil di layar.
      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push("/bomlist?alert=Data Berhasil di tambahkan");
    } catch (err) {
      console.error(err);
      setError("Gagal menambah data bomlist");
    }
  };

  return (
    <div className="w-full h-full px-4 py-2">
      {error && <AlertError text={error} />}
      <FormBomlistPage onSubmit={handleSubmit} />
    </div>
  );
}
