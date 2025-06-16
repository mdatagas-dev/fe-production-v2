"use client";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [dataResult, setDataResult] = useState([]);
  const [subline, setSubline] = useState("line 1 assy input");
  const timeUPH = [
    "1 (07:00 - 08:00)",
    "2 (08:00 - 09:00)",
    "3 (09:00 - 10:00)",
    "4 (10:00 - 11:00)",
    "5 (11:00 - 12:00)",
    "6 (12:00 - 13:00)",
    "7 (13:00 - 14:00)",
    "8 (14:00 - 15:00)",
    "9 (15:00 - 16:00)",
    "10 (16:00 - 17:00)",
    "11 (17:00 - 18:00)",
    "12 (18:00 - 19:00)",
    "13 (19:00 - 20:00)",
    "14 (20:00 - 21:00)",
    "15 (21:00 - 22:00)",
    "16 (22:00 - 23:00)",
    "17 (23:00 - 00:00)",
    "18 (00:00 - 01:00)",
    "19 (01:00 - 02:00)",
    "20 (02:00 - 03:00)",
    "21 (03:00 - 04:00)",
    "22 (04:00 - 05:00)",
    "23 (05:00 - 06:00)",
    "24 (06:00 - 07:00)",
  ];

  const resultData = async (subline) => {
    try {
      const endPoint = `${apiBaseUrl}/rdps/dashboard?keyword=${subline}`;
      const result = await fetchWithAuth(endPoint);
      if (result.error) {
        return <div>Terjadi kesalahan di server</div>;
      } else {
        setDataResult(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    resultData(subline);
  }, [subline]);

  // if (dataResult?.data?.length <= 0 || dataResult.data === undefined) {
  //   return (
  //     <div className="w-full h-full flex justify-center item-center">
  //       <span className="loading loading-spinner loading-xl"></span>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full h-full px-4 py-2 gap-2">
      <div className="flex h-[20%] gap-4 overflow-x-auto flex-row p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="text-white min-w-[20%] grid grid-cols-2 bg-[#050350] p-2 rounded-md mb-4"
          >
            <div>
              <div>Normal Delivery</div>
              <h3 className="text-2xl font-semibold">50E330NP</h3>
              <div>K25081P & K25081Q</div>
            </div>
            <div className="w-full text-[10px] text-right flex flex-col gap-2">
              <p>Kits: 500</p>
              <p>Output: 100</p>
              <div>ATD: 10/06/2025</div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full h-[7%] flex gap-4">
        {dataResult?.subline?.length >= 1 ? (
          dataResult.subline.map((item, index) => (
            <button
              key={index}
              onClick={() => setSubline(item.subline)}
              className="btn text-white h-fit bg-[#050350] p-2 rounded-sm"
            >
              {item.subline}
            </button>
          ))
        ) : (
          <div>Tidak ada Data</div>
        )}
      </div>
      <div className="w-full h-[73%] overflow-auto">
        <table className="table table-zebra border border-black">
          <thead>
            <tr>
              <td className="border border-black">Jam</td>
              {dataResult?.data?.length >= 1 ? (
                dataResult.data.map((item, index) => (
                  <td key={index} className="border border-black">
                    {item.model}
                  </td>
                ))
              ) : (
                <td>Tidak ada Data</td>
              )}
            </tr>
          </thead>
          <tbody>
            {timeUPH.map((time, timeIndex) => (
              <tr key={timeIndex}>
                <td className="border border-black">{time}</td>
                {dataResult?.data?.length >= 1 ? (
                  dataResult.data.map((model, modelIndex) => (
                    <td key={modelIndex} className="border border-black">
                      {model.uph[timeIndex]?.record ?? "-"}
                    </td>
                  ))
                ) : (
                  <td> 0 </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
