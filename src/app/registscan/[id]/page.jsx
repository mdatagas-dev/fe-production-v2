"use client";
import BtnBack from "@/components/btn/btnBack";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailRegistScanPage() {
  const params = useParams();
  const [dataResult, setDataResult] = useState([]);
  const registscanID = params.id;
  const endPoint = `${apiBaseUrl}/registscan?keyword=${registscanID}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchWithAuth(endPoint);
        setDataResult(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [registscanID]);

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
                <h5 className="text-[30px] font-bold">{item.model}</h5>
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
                    <label className="font-semibold text-[18px]">BOX</label>
                    <p className="text-[16px]">
                      {item.sn_box ? item.sn_box : "-"}
                    </p>
                    <p>Length: {item.sn_box ? item.sn_box.length : "-"}</p>
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
