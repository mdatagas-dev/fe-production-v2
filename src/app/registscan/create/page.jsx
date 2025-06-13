"use client";
import AlertError from "@/components/alert/error";
import FormRegist from "@/components/form/formRegisScan";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useRouter } from "next/navigation";
export default function RegistscanPage() {
  const { useState, useEffect } = require("react");
  const [error, setError] = useState(null);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    try {
      const result = await fetchWithAuth(`${apiBaseUrl}/registscan/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (result.error) {
        setError(result.error);
        const timeout = setTimeout(() => {
          setError(null);
        }, 3000);
        return () => clearTimeout(timeout);
      }
      e.target.reset();
      router.push("/registscan?alert=Data Successfuly saved");
    } catch (error) {
      console.log(error.message);
      setError(error);
    }
  };

  return (
    <div>
      {error && <AlertError text={error} />}
      <FormRegist onSubmit={handleSubmit} />
    </div>
  );
}
