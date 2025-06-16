"use client";

import FormUser from "@/components/form/formUser";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useRouter } from "next/navigation";

const createLogin = () => {
  const router = useRouter();
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

      if (result.error) {
        console.log("trouble Endpoin frontEnd create user", result.error);
      }
      e.target.reset();
      router.push("/auth/dashboard?alert=user berhasil di tambahkan");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full h-full py-2 px-4 ">
      <FormUser onSubmit={handleCreate} />
    </div>
  );
};

export default createLogin;
