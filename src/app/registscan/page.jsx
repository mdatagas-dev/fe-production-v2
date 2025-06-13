"use client";
import AlertSuccess from "@/components/alert/success";
import BtnCreate from "@/components/btn/btnCreate";
import BtnDetail from "@/components/btn/btnDetail";
import BtnEdit from "@/components/btn/btnEdit";
import Pagination from "@/components/pagination";
import SearchComp from "@/components/searching";
import fetchWithAuth from "@/lib/fetchWithAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import scannerImg from "@/../../public/barcode-scanner.png";
import Link from "next/link";
import Image from "next/image";
import historyImg from "@/../../public/history.png";
import apiBaseUrl from "@/lib/urlEndPoint";

export default function RegistScanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dataRegist, setDataRegist] = useState([]);
  const [success, setSuccess] = useState(null);

  const paramsMessage = searchParams.get("alert");
  const keyword = searchParams.get("keyword") || "";
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 7;

  useEffect(() => {
    const fetchData = async () => {
      const endPoint = `${apiBaseUrl}/registscan?keyword=${encodeURIComponent(
        keyword
      )}&page=${page}&limit=${limit}`;

      try {
        const result = await fetchWithAuth(endPoint);
        setDataRegist(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [keyword, page, limit]);

  // console.log(dataRegist);

  useEffect(() => {
    if (paramsMessage) {
      setSuccess(true);
    }
    const timeout = setTimeout(() => {
      setSuccess(false);
      router.replace("/registscan");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [paramsMessage]);

  const setRegistSession = (id) => {
    sessionStorage.setItem("id_regist", id);
    router.push("/scanprod/history");
  };
  const handleScanlink = (id) => {
    sessionStorage.setItem("id_regist", id);
    router.push("/scanprod");
  };

  if (!dataRegist.data) {
    return (
      <div className="w-full h-full flex justify-center item-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }
  return (
    <div className="w-full h-full px-6 py-4">
      {success && <AlertSuccess text={paramsMessage} />}
      <div className="flex justify-between w-full px-6">
        <SearchComp />
        <BtnCreate url="/registscan/create" />
      </div>

      <table className="table ">
        <thead className="text-center">
          <tr>
            <th>No</th>
            <th>Timestamps</th>
            <th>Model</th>
            <th>PO Number</th>
            <th>Line</th>
            <th>Plan</th>
            <th className="">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {dataRegist?.data?.length >= 1 ? (
            dataRegist.data.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.index}</td>
                  <td>{new Date(item.timestamps).toLocaleString("id-ID")}</td>
                  <td>{item.model}</td>
                  <td>{item.po_number}</td>
                  <td>{item.subline}</td>
                  <td>{item.plan}</td>
                  <td className="flex gap-2 relative justify-center">
                    <BtnDetail url={`/registscan/${item.id}`} />
                    <BtnEdit url={`/registscan/edit/${item.id}`} />
                    <button
                      className="btn bg-gray-300 hover:bg-green-500"
                      onClick={() => handleScanlink(item.id)}
                    >
                      <Image src={scannerImg} alt="scanimg" width={30} />
                    </button>
                    <button
                      onClick={() => setRegistSession(item.id)}
                      className="btn bg-gray-300 hover:bg-blue-600"
                    >
                      <Image src={historyImg} alt="scanimg" width={30} />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                Data tidak tersedia
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        currentPage={dataRegist?.currentPage}
        totalPage={dataRegist?.totalPages}
        onPageChange={(newPage) => {
          router.push(
            `?keyword=${encodeURIComponent(
              keyword
            )}&page=${newPage}&limit=${limit}`
          );
        }}
      />
    </div>
  );
}
