"use client";
import FormBomlistPage from "@/components/form/formBomlist";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useRouter } from "next/navigation";

export default function CreateBomlistPage() {
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    const endPoint = `${apiBaseUrl}/bomlist/post`;
    try {
      const result = await fetchWithAuth(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (result.error) {
        console.log(error);
      } else {
        router.push("/bomlist?alert=Data Berhasil di tambahkan");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full px-4 py-2">
      <FormBomlistPage onSubmit={handleSubmit} />
    </div>
  );
}
