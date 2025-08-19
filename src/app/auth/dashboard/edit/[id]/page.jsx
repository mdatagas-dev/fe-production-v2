"use client";
import FormPin from "@/components/form/formPin";
import FormUser from "@/components/form/formUser";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function editUserPage() {
  const pinRef = useRef();
  const router = useRouter();
  const { id } = useParams(); // ambil id dari url
  const [dataResult, setDataResult] = useState([]);

  // get detail user
  const fetchData = async () => {
    try {
      const endPoint = `${apiBaseUrl}/users?keyword=${id}`;
      const result = await fetchWithAuth(endPoint);

      setDataResult(result.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // edit user
  const handleEdit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    //jalankan component disini

    try {
      const result = await fetchWithAuth(`${apiBaseUrl}/users/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (result.error) {
        console.log(result.error);
      }
      console.log("updated");
      router.push("/auth/dashboard");
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!dataResult || dataResult.length <= 1)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  return (
    <div className="w-full h-full px-4 py-2">
      <FormUser onSubmit={handleEdit} initialData={dataResult} />
      {/* <FormPin ref={pinRef} /> */}
    </div>
  );
}
