"use client";

import fetchWithAuth from "@/lib/fetchWithAuth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ModalPin from "./pin";

export default function ModalConfirm({ endpoint, urlBack }) {
  const pinRef = useRef(null);
  const router = useRouter();
  const [currentEndpoint, setCurrentEndpoint] = useState(endpoint);

  useEffect(() => {
    setCurrentEndpoint(endpoint);
  }, [endpoint]);

  const handleDelete = async () => {
    const isPinValidate = await pinRef.current.openModal();
    console.log(isPinValidate);
    if (isPinValidate !== true) {
      return;
    }
    const result = await fetchWithAuth(currentEndpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
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
                <button onClick={handleDelete} className="btn bg-red-500">
                  Delete
                </button>
                <button className="btn bg-yellow-500">Close</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
      <ModalPin ref={pinRef} />
    </>
  );
}
