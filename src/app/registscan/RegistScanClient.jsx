"use client";
import AlertSuccess from "@/components/alert/success";
import ErrorState from "@/components/state/errorState";
import BtnCreate from "@/components/btn/btnCreate";
import BtnDetail from "@/components/btn/btnDetail";
import BtnEdit from "@/components/btn/btnEdit";
import Pagination from "@/components/pagination";
import SearchComp from "@/components/searching";
import fetchWithAuth from "@/lib/fetchWithAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import scannerImg from "@/../../public/barcode-scanner.png";
import Image from "next/image";
import historyImg from "@/../../public/history.png";
import apiBaseUrl from "@/lib/urlEndPoint";
import { displayModel } from "@/lib/categories";
import { formatJakartaDateTime } from "@/lib/dateTime";

export default function RegistScanClient() {
  const router = useRouter();
  const [dataRegist, setDataRegist] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [role, setRole] = useState(null);

  const searchParams = useSearchParams();
  const alert = searchParams.get("alert");
  const keyword = searchParams.get("keyword") || "";
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 7;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setRole(JSON.parse(storedUser).roleuser);
    }
    const fetchData = async () => {
      const endPoint = `${apiBaseUrl}/registscan?keyword=${encodeURIComponent(
        keyword,
      )}&page=${page}&limit=${limit}`;

      try {
        const result = await fetchWithAuth(endPoint);

        // Sebelumnya kegagalan diabaikan: data tetap undefined sehingga spinner
        // berputar selamanya walau backend balas 500.
        if (result?.error || !Array.isArray(result?.data)) {
          setError(result?.error || "Gagal memuat data registrasi");
          return;
        }

        setError(null);
        setDataRegist(result);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data registrasi");
      }
    };

    fetchData();
  }, [keyword, limit, page]);

  useEffect(() => {
    const role = sessionStorage.getItem;
    if (alert) {
      setSuccess(true);
    }
    const timeout = setTimeout(() => {
      setSuccess(false);
      router.replace("/registscan");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [alert]);

  // push to history with id regist
  const setRegistSession = (id) => {
    sessionStorage.setItem("id_regist", id);
    router.push("/scanprod/history");
  };

  // push to scanprod with id regist
  const handleScanlink = (id) => {
    sessionStorage.setItem("id_regist", id);
    router.push("/scanprod");
  };

  if (error) {
    return <ErrorState text={error} />;
  }

  if (!dataRegist?.data || dataRegist?.data === undefined) {
    return (
      <div className="w-full h-full flex justify-center item-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="w-full h-full px-6 py-4">
      {success && <AlertSuccess text={alert} />}
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
            <th>Order Number</th>
            <th>PO Number</th>
            <th>Line</th>
            <th>Plan</th>
            <th>Scan</th>
            <th className="">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {dataRegist?.data?.length >= 1 ? (
            dataRegist.data.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.index}</td>
                  <td>
                    {formatJakartaDateTime(item.timestamps)}
                  </td>
                  <td>
                    {item.model
                      ? displayModel(item.model, item.unit_type)
                      : "Data Kosong"}
                  </td>
                  <td>{item.order_number || "Data Kosong"}</td>
                  <td>{item.po_number || "Data Kosong"}</td>
                  <td>{item.subline || "Data Kosong"}</td>
                  <td>{item.plan || "Data Kosong"}</td>
                  <td>{item.total || "Data Kosong"}</td>
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
              keyword,
            )}&page=${newPage}&limit=${limit}`,
          );
        }}
      />
    </div>
  );
}
