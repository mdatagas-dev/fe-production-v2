"use client";

import AlertSuccess from "@/components/alert/success";
import Pagination from "@/components/pagination";
import SearchComp from "@/components/searching";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PackagePage() {
  const [handleData, setHandleData] = useState([]);
  const router = useRouter();
  const useParams = useSearchParams();
  const alert = useParams.get("alert") || "";
  const [alertMsg, setAlertMsg] = useState(null);
  const keyword = useParams.get("keyword") || "";
  const limit = useParams.get("limit") || 10;
  const page = useParams.get("page") || 1;

  const getDataTcl = async (limit, page, keyword) => {
    const endPoint = `${apiBaseUrl}/packagetcl?keyword=${encodeURIComponent(
      keyword,
    )}&limit=${encodeURIComponent(limit)}&page=${encodeURIComponent(page)}`;
    const result = await fetchWithAuth(endPoint);

    if (result?.err) {
      console.log(result.err);
    }

    setHandleData(result);
  };

  useEffect(() => {
    getDataTcl(limit, page, keyword);
    setAlertMsg(alert);
    if (alert) {
      const timeout = setTimeout(() => {
        setAlertMsg(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [limit, page, keyword, alert]);

  return (
    <div className="w-[100%] h-[100%] p-2">
      {alertMsg && <AlertSuccess text={alertMsg} />}
      <div className="flex justify-between">
        <SearchComp />
        <Link
          href={"/tcl/package/upload"}
          className="btn bg-green-500 text-white"
        >
          Upload Data
        </Link>
      </div>
      <div className="w-full">
        <div>
          <h3 className="text-2xl font-semibold my-4">
            PACKAGE TCL DATA RECORD {handleData.total || 0}
          </h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Timestamps</th>
              <th>SN Unit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {handleData.data?.length > 0 ? (
              handleData.data.map((item, index) => (
                <tr key={index}>
                  <td>
                    {new Date(item.timestamps).toLocaleString("id-ID", {
                      timeZone: "Asia/Jakarta",
                      hour12: false,
                    })}
                  </td>
                  <td>{item.sn || "Kosong"}</td>
                  <td>{item.status || "Kosong"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={handleData?.currentPages}
        totalPage={handleData?.totalPages}
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
