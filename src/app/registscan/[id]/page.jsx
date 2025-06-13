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
                    <label className="font-semibold text-[18px]">Panel 2</label>
                    <p className="text-[16px]">
                      {item.panel2 ? item.panel2 : "-"}
                    </p>
                    <p>Length: {item.panel2 ? item.panel2.length : "-"}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-[18px]">Bplane</label>
                    <p className="text-[16px]">
                      {item.bplane ? item.bplane : "-"}
                    </p>
                    <p>Length: {item.bplane ? item.bplane.length : "-"}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-[18px]">
                      Front Cover
                    </label>
                    <p className="text-[16px]">
                      {item.front_cover ? item.front_cover : "-"}
                    </p>
                    <p>
                      Length: {item.front_cover ? item.front_cover.length : "-"}
                    </p>
                  </div>

                  <div>
                    <label className="font-semibold text-[18px]">
                      Open Cell
                    </label>
                    <p className="text-[16px]">
                      {item.open_cell ? item.open_cell : "-"}
                    </p>
                    <p>
                      Length: {item.open_cell ? item.open_cell.length : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="font-semibold text-[18px]">
                      Mainboard
                    </label>
                    <p className="text-[16px]">
                      {item.mainboard ? item.mainboard : "-"}
                    </p>
                    <p>
                      Length: {item.mainboard ? item.mainboard.length : "-"}
                    </p>
                  </div>

                  <div>
                    <label className="font-semibold text-[18px]">
                      Power Board
                    </label>
                    <p className="text-[16px]">
                      {item.powerboard ? item.powerboard : "-"}
                    </p>
                    <p>
                      Length: {item.powerboard ? item.powerboard.length : "-"}
                    </p>
                  </div>

                  <div>
                    <label className="font-semibold text-[18px]">
                      Remote Control
                    </label>
                    <p className="text-[16px]">
                      {item.remote_control ? item.remote_control : "-"}
                    </p>
                    <p>
                      Length:{" "}
                      {item.remote_control ? item.remote_control.length : "-"}
                    </p>
                  </div>

                  <div>
                    <label className="font-semibold text-[18px]">Bracket</label>
                    <p className="text-[16px]">
                      {item.bracket ? item.bracket : "-"}
                    </p>
                    <p>Length: {item.bracket ? item.bracket.length : "-"}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-[18px]">Stand L</label>
                    <p className="text-[16px]">
                      {item.stand_l ? item.stand_l : "-"}
                    </p>
                    <p>Length: {item.stand_l ? item.stand_l.length : "-"}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-[18px]">Stand M</label>
                    <p className="text-[16px]">
                      {item.stand_m ? item.stand_m : "-"}
                    </p>
                    <p>Length: {item.stand_m ? item.stand_m.length : "-"}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-[18px]">Stand R</label>
                    <p className="text-[16px]">
                      {item.stand_r ? item.stand_r : "-"}
                    </p>
                    <p>Length: {item.stand_r ? item.stand_r.length : "-"}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-[18px]">T-Con</label>
                    <p className="text-[16px]">
                      {item.t_con ? item.t_con : "-"}
                    </p>
                    <p>Length: {item.t_con ? item.t_con.length : "-"}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-[18px]">
                      SN Accessories
                    </label>
                    <p className="text-[16px]">
                      {item.sn_accessories ? item.sn_accessories : "-"}
                    </p>
                    <p>
                      Length:{" "}
                      {item.sn_accessories ? item.sn_accessories.length : "-"}
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
