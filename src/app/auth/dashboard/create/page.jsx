"use client";

import FormUser from "@/components/form/formUser";
import apiBaseUrl from "@/lib/urlEndPoint";
import Link from "next/link";
const createLogin = () => {
  const handleCreate = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    try {
      const res = await fetch(`${apiBaseUrl}/users/regist`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
      console.log("registrasi berhasil");
      e.target.reset();
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="w-full h-full py-2 px-4">
      <FormUser onSubmit={handleCreate} />
    </div>
  );
};

export default createLogin;
