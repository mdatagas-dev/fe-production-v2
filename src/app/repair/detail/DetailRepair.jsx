"use client";
import { useSearchParams } from "next/navigation";
import SearchComp from "@/components/searching";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useEffect, useState } from "react";

export default function DetailRepairPage() {
  const [handleData, setHandleData] = useState([]);

  const searchParams = useSearchParams();
  const model = searchParams.get("model");
  const keyword = searchParams.get("keyword");
  const batch = searchParams.get("batch");
  const po_number = searchParams.get("po_number");

  const fetchData = async () => {
    const endPoint = `${apiBaseUrl}/repair/detail-repair?keyword=${encodeURIComponent(
      keyword
    )}&model=${encodeURIComponent(model)}&batch=${encodeURIComponent(
      batch
    )}&po_number=${encodeURIComponent(po_number)}`;

    try {
      const result = await fetchWithAuth(endPoint);
      if (result.error) {
        console.log(result.error);
      }
      setHandleData(result.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-[100%] h-[100%] p-2">
      <div className="w-full py-2">
        <SearchComp />
      </div>
      <div className="overflow-auto">
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Date</th>
              <th>Model</th>
              <th>Batch</th>
              <th>PO Number</th>
              <th>SN</th>
              <th>Boardcode</th>
              <th>itemcode</th>
              <th>DefectCode</th>
              <th>DefectReason</th>
            </tr>
          </thead>
          <tbody>
            {handleData?.length > 0 ? (
              handleData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {item.collectdate
                        ? new Date(item.collectdate).toLocaleDateString(
                            "id-ID",
                            {
                              timeZone: "Asia/Jakarta",
                            }
                          )
                        : "-"}
                    </td>
                    <td>{item.model || "-"}</td>
                    <td className="whitespace-nowrap">{item.batch || "-"}</td>
                    <td className="whitespace-nowrap">
                      {item.po_number || "-"}
                    </td>
                    <td className="whitespace-nowrap">{item.barcode || "-"}</td>
                    <td className="whitespace-nowrap">
                      {item.boardcode || "-"}
                    </td>
                    <td className="whitespace-nowrap">
                      {item.itemcode || "-"}
                    </td>
                    <td className="whitespace-nowrap">
                      {item.defectcode || "-"}
                    </td>
                    <td className="whitespace-nowrap">
                      {item.defectreason || "-"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
