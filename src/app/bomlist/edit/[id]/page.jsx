"use client";

import FormBomlistPage from "@/components/form/formBomlist";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditBomlistPage() {
  const router = useRouter();
  const [dataResult, setDataResult] = useState([]);
  const params = useParams();
  const id = params.id;
  const endPoint = `${apiBaseUrl}/bomlist?keyword=${id}`;
  const fetchData = async () => {
    const result = await fetchWithAuth(endPoint);
    setDataResult(result.data[0]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    const endPoint = `${apiBaseUrl}/bomlist/edit/${id}`;
    try {
      const result = fetchWithAuth(endPoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (result.error) {
        console.log(result.error);
      } else {
        router.push("/bomlist?alert=Data berhasil di update");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full py-2 px-4 ">
      <FormBomlistPage initialData={dataResult} onSubmit={handleSubmit} />
    </div>
  );
}
