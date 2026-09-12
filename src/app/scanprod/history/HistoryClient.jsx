"use client";
import BtnEdit from "@/components/btn/btnEdit";
import Pagination from "@/components/pagination";
import SearchComp from "@/components/searching";
import fetchWithAuth from "@/lib/fetchWithAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import importExcel from "@/components/exportExcel";
import apiBaseUrl from "@/lib/urlEndPoint";
import ModalConfirm from "@/components/modal/modal";
import AlertSuccess from "@/components/alert/success";

export default function HistoryScanClient() {
  //declaration
  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") || 1;
  const alert = searchParams.get("alert") || "";
  const limit = searchParams.get("limit") || 7;
  const keyword = searchParams.get("keyword") || "";
  const [dataResult, setDataResult] = useState([]);

  //fetching
  const fetchData = async () => {
    const endPoint = `${apiBaseUrl}/rdps/history?keyword=${encodeURIComponent(
      keyword,
    )}&page=${page}&limit=${limit}`;
    try {
      const fetch = await fetchWithAuth(endPoint, {
        cache: "no-store",
        headers: {
          idRegist: sessionStorage.getItem("id_regist"),
        },
      });
      setDataResult(fetch);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    if (alert) {
      const timeout = setTimeout(() => {
        router.push("/scanprod/history");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [page, limit, keyword, alert]);

  const exportExcel = async () => {
    const endPoint = `${apiBaseUrl}/rdps/history?keyword=${encodeURIComponent(
      keyword,
    )}`;
    try {
      const fetch = await fetchWithAuth(endPoint, {
        cache: "no-store",
        headers: {
          idRegist: sessionStorage.getItem("id_regist"),
        },
      });

      importExcel(fetch.data, "history.xlsx");
    } catch (error) {
      console.log("terjadi kesalahan export", error);
    }
  };

  if (Object.keys(dataResult).length <= 0) {
    return (
      <div className="w-full h-full flex justify-center item-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      {alert && <AlertSuccess text={alert} />}
      <div className="w-full flex justify-between">
        <SearchComp />

        <button onClick={exportExcel} className="btn bg-green-500">
          Export
        </button>
      </div>
      <div className="overflow-auto w-full">
        <table className="table min-w-[800px] text-sm">
          <thead>
            <tr>
              <th>TIME</th>
              <th>SN</th>
              <th>MOTOR</th>
              <th>PCB IDU</th>
              <th>PCB ODU</th>
              <th>ACCESSORIES</th>
              <th>CARTON</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {dataResult?.data?.length >= 1 ? (
              dataResult.data.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.timestamps).toLocaleString("id-ID")}</td>
                  <td>{item.sn}</td>
                  <td>{item.sn_motor}</td>
                  <td>{item.pcb_idu}</td>
                  <td>{item.pcb_odu}</td>
                  <td>{item.sn_accessories}</td>
                  <td>{item.sn_carton}</td>

                  <td className="flex gap-2">
                    <BtnEdit url={`history/${item.id}`} />

                    <button
                      className="btn bg-red-500"
                      onClick={() => {
                        setSelectedEndpoint(
                          `${apiBaseUrl}/rdps/delete/${item.id}`,
                        );
                        document.getElementById("my_modal_5").showModal();
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}

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

      <ModalConfirm urlBack={"/scanprod/history"} endpoint={selectedEndpoint} />
    </div>
  );
}
