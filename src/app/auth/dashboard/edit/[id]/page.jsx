"use client";
import FormUser from "@/components/form/formUser";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function editUserPage() {
  const router = useRouter();
  const { id } = useParams(); // ambil id dari url
  const [user, setUser] = useState(null);

  // get detail user
  useEffect(() => {
    fetch(`${apiBaseUrl}/users/detail/${id}`)
      .then((res) => res.json()) // menyimpan nilai res.json di variable res
      .then(setUser); // res ditampung di luar state user
  }, [id]);

  // edit user
  const handleEdit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    const res = await fetch(`${apiBaseUrl}/users/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.log(res.json());
    }
    console.log("updated");
    router.push("/auth/dashboard");
  };

  if (!user) return <div>Sedang mengambil data.....</div>;
  return <FormUser onSubmit={handleEdit} initialData={user} />;
}
