"use client";
import FormPin from "@/components/form/formPin";
import FormUser from "@/components/form/formUser";
import ErrorState from "@/components/state/errorState";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function editUserPage() {
  const pinRef = useRef();
  const router = useRouter();
  const { id } = useParams(); // ambil id dari url
  const [dataResult, setDataResult] = useState(null);
  const [error, setError] = useState(null);

  // get detail user
  const fetchData = async () => {
    try {
      const endPoint = `${apiBaseUrl}/users?keyword=${id}`;
      const result = await fetchWithAuth(endPoint);

      // Sebelumnya kegagalan membuat form tampil kosong tanpa penjelasan.
      if (result?.error || !Array.isArray(result?.data)) {
        setError(result?.error || "Gagal memuat data user");
        return;
      }

      if (result.data.length === 0) {
        setError("Data user tidak ditemukan");
        return;
      }

      setError(null);
      setDataResult(result.data[0]);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data user");
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

      // Sebelumnya apa pun hasilnya selalu dianggap berhasil dan langsung
      // pindah halaman, termasuk saat backend menolak (mis. username duplikat).
      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push("/auth/dashboard");
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan perubahan user");
    }
  };

  if (error) {
    return <ErrorState text={error} />;
  }

  if (!dataResult)
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
