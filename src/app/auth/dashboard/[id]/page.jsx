"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiBaseUrl from "@/lib/urlEndPoint";
import fetchWithAuth from "@/lib/fetchWithAuth";
import BtnBack from "@/components/btn/btnBack";

export default function detailUserPage() {
  const { id } = useParams();
  const [dataUser, setDataUser] = useState([]); //menyimpan nilai datauser
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchWithAuth(`${apiBaseUrl}/users?keyword=${id}`);

        if (result.error) {
          console.log(result.error);
        } else {
          setDataUser(result.data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  if (dataUser.length <= 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      const endPoint = `${apiBaseUrl}/users/delete/${id}`;
      const res = await fetchWithAuth(endPoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "Application/json",
        },
      });
      const result = await res.json();
      if (!res.ok) {
        console.log(`terjadi kesalahan:`, result);
      } else {
        router.push("/auth/dashboard");
      }
    } catch (error) {
      console.log("Handle Error: ", error);
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
    {
      label: "PASSWORD",
      defaultValue: dataUser.password || "-",
    },
  ];

  return (
    <div className="w-full h-full px-4 py-2 flex flex-col gap-2">
      <div className=" w-full flex justify-between">
        <BtnBack url={"/auth/dashboard"} />
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white rounded-md p-2"
        >
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
