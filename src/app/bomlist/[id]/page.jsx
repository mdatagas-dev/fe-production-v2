"use client";

import BtnBack from "@/components/btn/btnBack";
import ModalConfirm from "@/components/modal/modal";
import ErrorState from "@/components/state/errorState";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { formatJakartaDateTime } from "@/lib/dateTime";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailBomlistPage() {
  const [dataResult, setDataResult] = useState(null);
  const [error, setError] = useState(null);
  const params = useParams();
  const id = params.id;

  const endPoint = `${apiBaseUrl}/bomlist?keyword=${id}`;
  const fetchData = async () => {
    try {
      const result = await fetchWithAuth(endPoint);

      // Sebelumnya kegagalan membuat dataResult undefined, lalu halaman ini
      // crash di dataResult.map() / spinner-nya tidak pernah dirender.
      if (result?.error || !Array.isArray(result?.data)) {
        setError(result?.error || "Gagal memuat detail bomlist");
        return;
      }

      setError(null);
      setDataResult(result.data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat detail bomlist");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  if (dataResult.length === 0) {
    return (
      <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
        <p className="font-semibold">Data bomlist tidak ditemukan</p>
        <BtnBack url={`/bomlist`} />
      </div>
    );
  }

  var field = {};
  dataResult.map((item) => {
    field = [
      {
        label: "Timestamps",
        value: formatJakartaDateTime(item.timestamps),
      },
      {
        label: "Model",
        value: item.model,
      },
      {
        label: "Order Number",
        value: item.order_number,
      },
      {
        label: "PO Number",
        value: item.po_number,
      },
      {
        label: "Serial number",
        value: item.sn,
      },
      {
        label: "PCB IDU",
        value: item.pcb_idu,
      },
      {
        label: "PCB ODU",
        value: item.pcb_odu,
      },
      {
        label: "PCB WM",
        value: item.pcb_wm,
      },
      {
        label: "FRAME PCB",
        value: item.frame_pcb,
      },
      {
        label: "SN Motor",
        value: item.sn_motor,
      },
      {
        label: "Accessories",
        value: item.sn_accessories,
      },
      {
        label: "Carton",
        value: item.sn_carton,
      },
    ];
  });
  return (
    <div className="w-full py-2 px-4">
      <div className="w-full flex justify-between p">
        <BtnBack url={`/bomlist`} />
        <ModalConfirm
          endpoint={`${apiBaseUrl}/bomlist/delete/${id}`}
          urlBack={`/bomlist`}
        />
      </div>
      <div className="w-full grid grid-cols-2 gap-4 ">
        {dataResult.length >= 1 ? (
          field.map((item, index) => {
            return (
              <div key={index}>
                <label htmlFor="" className="font-semibold text-[18px]">
                  {item.label}
                </label>
                <p className="text-[16px]">{item.value ? item.value : "-"}</p>
              </div>
            );
          })
        ) : (
          <div>Data Kosong </div>
        )}
      </div>

      <div>Detail Page Bomlist</div>
    </div>
  );
}
