"use client";

import fetchWithAuth from "@/lib/fetchWithAuth";
import { useRouter } from "next/navigation";

export default function ModalConfirm({ endpoint, urlBack }) {
  const router = useRouter();
  const handleDelete = async (endpoint) => {
    const result = await fetchWithAuth(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "applicatoin/json",
      },
    });
    if (result.error) {
      console.log("terjadi kesalahan delete:", result.error);
    } else {
      router.push(`${urlBack}?alert=data berhasil di hapus`);
    }
  };
  return (
    <>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box ">
          <h3 className="font-bold text-lg">Confirm</h3>
          <p className="py-4">Apakah kamu yakin akan hapus data ini ?</p>
          <div className="modal-action">
            <form method="dialog">
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(endpoint)}
                  className="btn bg-red-500"
                >
                  Delete
                </button>
                <button className="btn bg-yellow-500">Close</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      <button
        className="btn bg-red-500"
        onClick={() => document.getElementById("my_modal_5").showModal()}
      >
        Delete
      </button>
    </>
  );
}
