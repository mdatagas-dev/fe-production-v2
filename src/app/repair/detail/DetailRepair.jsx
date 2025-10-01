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
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Batch</th>
              <th>PO Number</th>
              <th>SN</th>
              <th>itemCode</th>
              <th>DefectCode</th>
              <th>DefectReason</th>
            </tr>
          </thead>
          <tbody>
            {handleData?.length > 0 ? (
              handleData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.model || "Data Kosong"}</td>
                    <td>{item.batch || "Data Kosong"}</td>
                    <td>{item.po_number || "Data Kosong"}</td>
                    <td>{item.barcode || "Data Kosong"}</td>
                    <td>{item.itemcode || "Data Kosong"}</td>
                    <td>{item.defectcode || "Data Kosong"}</td>
                    <td>{item.defectceason || "Data Kosong"}</td>
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
