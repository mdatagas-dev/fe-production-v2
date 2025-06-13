"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiBaseUrl from "@/lib/urlEndPoint";

const token = sessionStorage.getItem("token");
export default function detailUserPage() {
  const { id } = useParams();
  const [dataUser, setDataUser] = useState([]); //menyimpan nilai datauser
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/users/detail/${id}`);
        const result = await res.json();

        if (!res.ok) {
          console.log(result);
        } else {
          setDataUser(result);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:2000/users/delete/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `bearer ${token}`,
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

  return (
    <div>
      <div>username: {dataUser.username}</div>
      <div>departement: {dataUser.departement}</div>
      <div>section: {dataUser.section}</div>
      <div>email: {dataUser.email}</div>
      <div>password: {dataUser.password}</div>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white rounded-md p-2"
      >
        Delete
      </button>
    </div>
  );
}
