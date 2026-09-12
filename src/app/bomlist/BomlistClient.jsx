"use client";
import AlertSuccess from "@/components/alert/success";
import BtnCreate from "@/components/btn/btnCreate";
import BtnDetail from "@/components/btn/btnDetail";
import BtnEdit from "@/components/btn/btnEdit";
import Pagination from "@/components/pagination";
import SearchComp from "@/components/searching";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BomlistClient() {
  const router = useRouter();
  const [dataResult, setDataResult] = useState();
  const searchParams = useSearchParams();
  const alert = searchParams.get("alert");
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 7;
  const keyword = searchParams.get("keyword") || "";

  const fetchData = async (limit, page, keyword) => {
    try {
      const endPoint = `${apiBaseUrl}/bomlist?keyword=${encodeURIComponent(
        keyword,
      )}&page=${page}&limit=${limit}`;

      const result = await fetchWithAuth(endPoint);
      setDataResult(result);
      if (result.error) {
        console.log(result.error);
      }
    } catch (error) {
      console.log("catch error:", error);
    }
  };

  useEffect(() => {
    fetchData(limit, page, keyword);
    if (alert) {
      const timeout = setTimeout(() => {
        router.push("/bomlist");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [limit, page, keyword, alert]);

  if (dataResult?.data?.length <= 0) {
    <div className="w-full h-full flex justify-center items-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }
  return (
    <div className="w-full h-full flex flex-col gap-2 py-2 px-4">
      {alert && <AlertSuccess text={alert} />}
      <div className="w-full flex justify-between">
        <SearchComp />
        <BtnCreate url={`/bomlist/create`} />
      </div>
      <div>
        <table className="table">
          <thead>
            <tr>
              <td>Time</td>
              <td>Model</td>
              <td>Batch</td>
              <td>SN Unit</td>
              <td>SN AC Motor</td>
              <td>PCB ODU</td>
              <td>SN Accessories</td>
              <td>SN Electrical System</td>
              <td>SN Carton</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {dataResult?.data?.length >= 0 ? (
              dataResult.data.map((item, index) => (
                <tr key={index}>
                  <td>
                    {new Date(item.timestamps).toLocaleString("id-ID") ?? "-"}
                  </td>
                  <td>{item.model ?? "-"}</td>
                  <td>{item.order_number ?? "-"}</td>
                  <td>{item.sn ?? "-"}</td>
                  <td>{item.sn_motor ?? "-"}</td>
                  <td>{item.pcb_odu ?? "-"}</td>
                  <td>{item.sn_accessories ?? "-"}</td>
                  <td>{item.pcb_idu ?? "-"}</td>
                  <td>{item.sn_carton ?? "-"}</td>
                  <td className="flex gap-2">
                    <BtnDetail url={`/bomlist/${item.id}`} />
                    <BtnEdit url={`/bomlist/edit/${item.id}`} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={dataResult?.currentPages}
        totalPage={dataResult?.totalPages}
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
