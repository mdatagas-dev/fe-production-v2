"use client";

import BtnBack from "@/components/btn/btnBack";
import BtnEdit from "@/components/btn/btnEdit";
import ErrorState from "@/components/state/errorState";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function DetailModelPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const dialogRef = useRef(null);
  const [dataResult, setDataResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // keyword menerima UUID, jadi baris diambil langsung by id
        const result = await fetchWithAuth(
          `${apiBaseUrl}/model?keyword=${id}&limit=1`,
        );

        if (result?.error) {
          setError(result.error);
          return;
        }

        if (!Array.isArray(result?.data) || result.data.length === 0) {
          setError("Data model tidak ditemukan");
          return;
        }

        setError(null);
        setDataResult(result.data[0]);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data model");
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      const result = await fetchWithAuth(`${apiBaseUrl}/model/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (result?.error) {
        setError(result.error);
        dialogRef.current?.close();
        return;
      }

      router.push("/modeltv?alert=data berhasil di hapus");
    } catch (err) {
      setError(err.message);
      dialogRef.current?.close();
    }
  };

  // Cek error lebih dulu: sebelumnya spinner dirender duluan, sehingga pesan
  // error yang sudah di-set tidak pernah tampil dan halaman seperti loading
  // tanpa akhir.
  if (error) {
    return <ErrorState text={error} />;
  }

  if (!dataResult) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const field = [
    { label: "Brand", value: dataResult.brand },
    { label: "Model", value: dataResult.model },
    { label: "Unit Type", value: dataResult.unit_type },
    { label: "Product", value: dataResult.product },
    { label: "PK", value: dataResult.pk },
    { label: "Image Link", value: dataResult.linkimage },
  ];

  return (
    <div className="w-full h-full px-4 py-2 flex flex-col gap-4">
      <div className="w-full flex items-center justify-between">
        <BtnBack url="/modeltv" />
        <div className="flex gap-2">
          <BtnEdit url={`/modeltv/edit/${id}`} />
          <button
            className="btn btn-error"
            onClick={() => dialogRef.current?.showModal()}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-[320px]">
          {dataResult.linkimage ? (
            <img
              src={dataResult.linkimage}
              alt={dataResult.model}
              className="w-full h-60 object-cover rounded-sm"
            />
          ) : (
            <div className="w-full h-60 flex justify-center items-center bg-gray-200 rounded-sm">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>

        <div className="w-full grid grid-cols-2 gap-4">
          {field.map((item) => (
            <div key={item.label}>
              <label htmlFor="" className="font-semibold text-[18px]">
                {item.label}
              </label>
              <p className="text-[16px]">
                {item.value === null || item.value === "" ? "-" : item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm</h3>
          <p className="py-4">Apakah kamu yakin akan hapus data ini ?</p>
          <div className="modal-action">
            <button className="btn" onClick={() => dialogRef.current?.close()}>
              Close
            </button>
            <button className="btn bg-red-500" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
