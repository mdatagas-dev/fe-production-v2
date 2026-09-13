"use client";
import AlertError from "@/components/alert/error";
import AlertSuccess from "@/components/alert/success";
import BtnCreate from "@/components/btn/btnCreate";
import BtnDetail from "@/components/btn/btnDetail";
import BtnEdit from "@/components/btn/btnEdit";
import Pagination from "@/components/pagination";
import SearchComp from "@/components/searching";
import ErrorState from "@/components/state/errorState";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ModelTVClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;
  const keyword = searchParams.get("keyword") || "";
  const limit = searchParams.get("limit") || 7;
  // dibawa dari halaman create/edit/detail, mis. /modeltv?alert=...
  const alert = searchParams.get("alert");
  const [dataResult, setDataResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const endPoint = `${apiBaseUrl}/model?keyword=${encodeURIComponent(
        keyword,
      )}&page=${page}&limit=${limit}`;
      try {
        const response = await fetchWithAuth(endPoint);

        if (response?.error || !Array.isArray(response?.data)) {
          setError(response?.error || "Gagal memuat data model");
          return;
        }

        setError(null);
        setDataResult(response);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [page, limit, keyword]);

  // pesan alert dari halaman lain hilang sendiri setelah 3 detik
  useEffect(() => {
    if (!alert) return;
    const timeout = setTimeout(() => router.replace("/modeltv"), 3000);
    return () => clearTimeout(timeout);
  }, [alert, router]);

  // Cek error lebih dulu: sebelumnya spinner menang atas error, sehingga
  // kegagalan muat tampak seperti loading tanpa akhir.
  if (error) {
    return <ErrorState text={error} />;
  }

  if (!dataResult) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[100vw] h-[100vh] p-4">
      {alert ? <AlertSuccess text={alert} /> : <AlertError text={error} />}

      <h1 className="text-2xl font-bold">Model Produk</h1>
      <div className="flex justify-between items-center">
        <SearchComp />
        <BtnCreate url="/modeltv/create" />
      </div>

      <div>
        <table className="table w-full mt-4">
          <thead>
            <tr>
              <th>No</th>
              <th>Image</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Product</th>
              <th>Unit Type</th>
              <th>PK</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataResult?.data?.length >= 1 ? (
              dataResult.data.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.index}</td>
                    <td>
                      {item.linkimage === null || item.linkimage === "" ? (
                        <span className="text-gray-500">No Image</span>
                      ) : (
                        <img
                          src={item.linkimage}
                          alt={item.model}
                          className="w-30 h-20 object-cover"
                        />
                      )}
                    </td>
                    <td>{item.brand || "-"}</td>
                    <td>{item.model || "-"}</td>
                    <td>{item.product || "-"}</td>
                    <td>{item.unit_type || "-"}</td>
                    <td>{item.pk ?? "-"}</td>
                    <td className="flex gap-2">
                      <BtnDetail url={`/modeltv/${item.id}`} />
                      <BtnEdit url={`/modeltv/edit/${item.id}`} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={dataResult?.currentPages}
          totalPage={dataResult?.totalPages}
          onPageChange={(newPage) => {
            router.push(
              `/modeltv?page=${newPage}&limit=${limit}&keyword=${keyword}`,
            );
          }}
        />
      </div>
    </div>
  );
}
