"use client";

import AlertError from "@/components/alert/error";
import FormUser from "@/components/form/formUser";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useRouter } from "next/navigation";
import { useState } from "react";

const createLogin = () => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const handleCreate = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    try {
      const endPoint = `${apiBaseUrl}/users/regist`;
      const result = await fetchWithAuth(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Sebelumnya kegagalan (mis. username sudah dipakai) hanya masuk console,
      // lalu halaman tetap bilang "user berhasil di tambahkan".
      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push("/auth/dashboard?alert=user berhasil di tambahkan");
    } catch (err) {
      console.error(err);
      setError("Gagal menambah user");
    }
  };

  return (
    <div className="w-full h-full py-2 px-4 ">
      {error && <AlertError text={error} />}
      <FormUser onSubmit={handleCreate} />
    </div>
  );
};

export default createLogin;
