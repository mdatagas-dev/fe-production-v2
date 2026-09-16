"use client";

import Pagination from "@/components/pagination";
import SearchComp from "@/components/searching";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import importExcel from "@/components/exportExcel";
import ErrorState from "@/components/state/errorState";
import ScanFeedback from "@/components/alert/scanFeedback";
import { displayModel } from "@/lib/categories";

export default function DatascanPage() {
  const [resultData, setResultData] = useState([]);
  const [error, setError] = useState(null);
  const [loadExport, setLoadExport] = useState(null);
  const [exportError, setExportError] = useState(null);
  const router = useRouter();

  const searchParams = useSearchParams();
  const alert = searchParams.get("alert");
  const keyword = searchParams.get("keyword") || "";
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 7;

  const handleData = async () => {
    const endPoint = `${apiBaseUrl}/rdps/total-po-scan?keyword=${encodeURIComponent(
      keyword,
    )}&page=${page}&limit=${limit}`;
    try {
      const result = await fetchWithAuth(endPoint, {
        cache: "no-store",
      });

      // Sebelumnya kegagalan hanya masuk console, sehingga tabel tampil
      // "No Data Available" seolah datanya memang kosong.
      if (result?.error || !Array.isArray(result?.data)) {
        setError(result?.error || "Gagal memuat data scan");
        return;
      }

      setError(null);
      setResultData(result);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data scan");
    }
  };

  const exportExcel = async (
    model,
    unit_type,
    po_number,
    order_number,
    subline,
  ) => {
    const endPoint = `${apiBaseUrl}/rdps/export-scan-history?model=${encodeURIComponent(
      model,
    )}&po_number=${encodeURIComponent(
      po_number ?? "",
    )}&order_number=${encodeURIComponent(
      order_number ?? "",
    )}&subline=${encodeURIComponent(
      subline ?? "",
    )}&unit_type=${encodeURIComponent(unit_type ?? "")}`;
    try {
      setExportError(null);
      const result = await fetchWithAuth(endPoint, {
        cache: "no-store",
      });

      if (result?.error || !Array.isArray(result?.data) || result.data.length === 0) {
        throw new Error(result?.error || "Tidak ada data scan untuk diekspor");
      }

      const fileName = [order_number, model, subline]
        .map((part) => String(part ?? "").trim())
        .filter(Boolean)
        .join("_")
        .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_");

      importExcel(result.data, `${fileName || "scan-history"}.xlsx`);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Gagal export data scan");
    } finally {
      setLoadExport(null);
    }
  };

  useEffect(() => {
    handleData();

    const refreshOnFocus = () => handleData();
    const refreshInterval = setInterval(handleData, 10000);

    window.addEventListener("focus", refreshOnFocus);
    return () => {
      window.removeEventListener("focus", refreshOnFocus);
      clearInterval(refreshInterval);
    };
  }, [page, limit, keyword]);

  if (error) {
    return <ErrorState text={error} />;
  }

  return (
    <div className="w-[100%] h-[100%] p-4 space-y-4">
      <ScanFeedback
        type={exportError ? "error" : null}
        message={exportError}
        onDismiss={() => setExportError(null)}
      />
      <div className="h-[10%] w-full">
        <h3 className="text-2xl font-semibold">Record Data Scan</h3>
        <SearchComp />
      </div>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Model</th>
              <th>Order Number</th>
              <th>PO Number</th>
              <th>Line</th>
              <th>Total</th>
              <th>Act</th>
            </tr>
          </thead>
          <tbody>
            {resultData?.data?.length > 0 ? (
              resultData.data.map((item) => {
                return (
                  <tr key={item.index}>
                    <td>{item.index}</td>
                    <td>{displayModel(item.model, item.unit_type)}</td>
                    <td>{item.order_number}</td>
                    <td>{item.po_number || "Kosong"}</td>
                    <td>{item.subline || "Kosong"}</td>
                    <td>{item.countsubline}</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => {
                          setLoadExport(item.index);
                          exportExcel(
                            item.model,
                            item.unit_type,
                            item.po_number,
                            item.order_number,
                            item.subline,
                          );
                        }}
                        className={`${
                          loadExport === item.index
                            ? "btn btn-disabled"
                            : "btn bg-green-500 text-white"
                        }`}
                      >
                        {loadExport === item.index ? (
                          <span className="loading loading-spinner"></span>
                        ) : (
                          "Export"
                        )}
                      </button>
                      <button className="btn bg-blue-500 text-white">
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={resultData?.currentPages}
        totalPage={resultData?.totalPages}
        onPageChange={(newPage) => {
          router.push(
            `?keyword=${encodeURIComponent(
              keyword,
            )}&page=${newPage}&limit=${limit}`,
          );
        }}
      />
    </div>
  );
}
