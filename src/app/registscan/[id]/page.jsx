"use client";
import BtnBack from "@/components/btn/btnBack";
import ErrorState from "@/components/state/errorState";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { displayModel } from "@/lib/categories";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailRegistScanPage() {
  const params = useParams();
  const [dataResult, setDataResult] = useState([]);
  const [error, setError] = useState(null);
  const registscanID = params.id;
  const endPoint = `${apiBaseUrl}/registscan?keyword=${registscanID}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchWithAuth(endPoint);

        // Sebelumnya kegagalan hanya masuk console, sehingga spinner berputar
        // selamanya karena dataResult tetap array kosong.
        if (result?.error || !Array.isArray(result?.data)) {
          setError(result?.error || "Gagal memuat detail registrasi");
          return;
        }

        setError(null);
        setDataResult(result);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat detail registrasi");
      }
    };
    fetchData();
  }, [registscanID]);

  if (error) {
    return <ErrorState text={error} />;
  }

  if (Object.keys(dataResult).length <= 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2 p-2">
      <BtnBack url="/registscan" />
      {dataResult?.data?.length >= 1 ? (
        dataResult.data.map((item) => {
          return (
            <div key={item.id} className="flex flex-col gap-4 h-full">
              <div className=" flex flex-col bg-gray-300 p-2">
                <p className="">
                  Timestamps:{" "}
                  {new Date(item.timestamps).toLocaleString("id-ID")}
                </p>
                <h5 className="text-[30px] font-bold">
                  {displayModel(item.model, item.unit_type)}
                </h5>
                <p className="text-[16px]">PO: {item.po_number}</p>
                <p className="text-[16px] font-semibold">{item.subline}</p>
              </div>
              <div className="w-full flex-row gap-2">
                <div>
                  <label htmlFor="" className="font-semibold text-[18px]">
                    SN
                  </label>
                  <p className="text-[16px]">{item.sn ? item.sn : "-"}</p>
                  <p>Length: {item.sn ? item.sn.length : "-"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-[18px]">MOTOR</label>
                    <p className="text-[16px]">
                      {item.sn_motor ? item.sn_motor : "-"}
                    </p>
                    <p>Length: {item.sn_motor ? item.sn_motor.length : "-"}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-[18px]">
                      PCB INDOOR
                    </label>
                    <p className="text-[16px]">
                      {item.pcb_idu ? item.pcb_idu : "-"}
                    </p>
                    <p>Length: {item.pcb_idu ? item.pcb_idu.length : "-"}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-[18px]">PCB ODU</label>
                    <p className="text-[16px]">
                      {item.pcb_odu ? item.pcb_odu : "-"}
                    </p>
                    <p>Length: {item.pcb_odu ? item.pcb_odu.length : "-"}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-[18px]">PCB WM</label>
                    <p className="text-[16px]">
                      {item.pcb_wm ? item.pcb_wm : "-"}
                    </p>
                    <p>Length: {item.pcb_wm ? item.pcb_wm.length : "-"}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-[18px]">FRAME PCB</label>
                    <p className="text-[16px]">
                      {item.frame_pcb ? item.frame_pcb : "-"}
                    </p>
                    <p>
                      Length: {item.frame_pcb ? item.frame_pcb.length : "-"}
                    </p>
                  </div>

                  <div>
                    <label className="font-semibold text-[18px]">
                      ACCESSORIES
                    </label>
                    <p className="text-[16px]">
                      {item.sn_accessories ? item.sn_accessories : "-"}
                    </p>
                    <p>
                      Length:{" "}
                      {item.sn_accessories ? item.sn_accessories.length : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="font-semibold text-[18px]">CARTON</label>
                    <p className="text-[16px]">
                      {item.sn_carton ? item.sn_carton : "-"}
                    </p>
                    <p>
                      Length: {item.sn_carton ? item.sn_carton.length : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div>tidak ada</div>
      )}
    </div>
  );
}
