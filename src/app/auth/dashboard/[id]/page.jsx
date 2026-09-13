"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiBaseUrl from "@/lib/urlEndPoint";
import fetchWithAuth from "@/lib/fetchWithAuth";
import BtnBack from "@/components/btn/btnBack";
import ErrorState from "@/components/state/errorState";

export default function detailUserPage() {
  const { id } = useParams();
  const [dataUser, setDataUser] = useState(null); //menyimpan nilai datauser
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchWithAuth(`${apiBaseUrl}/users?keyword=${id}`);

        // Sebelumnya kegagalan hanya masuk console: dataUser tetap array
        // kosong sehingga spinner berputar selamanya.
        if (result?.error || !Array.isArray(result?.data)) {
          setError(result?.error || "Gagal memuat data user");
          return;
        }

        if (result.data.length === 0) {
          setError("Data user tidak ditemukan");
          return;
        }

        setError(null);
        setDataUser(result.data[0]);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data user");
      }
    };
    fetchData();
  }, [id]);

  if (error) {
    return <ErrorState text={error} />;
  }

  if (!dataUser) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      const endPoint = `${apiBaseUrl}/users/delete/${id}`;
      // fetchWithAuth sudah mengembalikan JSON, jadi res.json() di sini
      // selalu gagal dan tombol Delete diam-diam tidak melakukan apa pun.
      const result = await fetchWithAuth(endPoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push("/auth/dashboard");
    } catch (err) {
      console.error("Handle Error: ", err);
      setError("Gagal menghapus user");
    }
  };

  const field = [
    {
      label: "USERNAME",
      defaultValue: dataUser.username || "-",
    },
    {
      label: "DEPARTEMENT",
      defaultValue: dataUser.departement || "-",
    },
    {
      label: "SECTION",
      defaultValue: dataUser.section || "-",
    },
    {
      label: "EMAIL",
      defaultValue: dataUser.email || "-",
    },
  ];

  return (
    <div className="w-full h-full px-4 py-2 flex flex-col gap-2">
      <div className=" w-full flex justify-between">
        <BtnBack url={"/auth/dashboard"} />
        <button onClick={handleDelete} className="btn btn-error">
          Delete
        </button>
      </div>

      <div className="w-full flex flex-col gap-2">
        {field.map((item, index) => (
          <div key={index}>
            <label className="font-semibold text-[18px]">{item.label}</label>
            <p className="text-[16px]">
              {item.defaultValue ? item.defaultValue : "-"}
            </p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}
