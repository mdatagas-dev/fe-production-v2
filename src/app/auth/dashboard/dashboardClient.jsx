"use client";
import BtnCreate from "@/components/btn/btnCreate";
import BtnDetail from "@/components/btn/btnDetail";
import BtnEdit from "@/components/btn/btnEdit";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiBaseUrl from "@/lib/urlEndPoint";
import fetchWithAuth from "@/lib/fetchWithAuth";
import SearchComp from "@/components/searching";
import Pagination from "@/components/pagination";
import AlertSuccess from "@/components/alert/success";
import ErrorState from "@/components/state/errorState";

export default function dashboardUserClient() {
  const [user, setUser] = useState([]);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 7;
  const keyword = searchParams.get("keyword") || "";
  const alertMsg = useState(() => searchParams.get("alert") || null);
  const [alert, setAlert] = useState(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const endPoint = `${apiBaseUrl}/users?keyword=${encodeURIComponent(
        keyword,
      )}&page=${page}&limit=${limit}`;

      const result = await fetchWithAuth(endPoint, {
        method: "GET",
        cache: "no-store",
      });

      // Sebelumnya kegagalan diabaikan: data tetap undefined sehingga spinner
      // berputar selamanya walau backend balas 500.
      if (result?.error || !Array.isArray(result?.data)) {
        setError(result?.error || "Gagal memuat data user");
        return;
      }

      setError(null);
      setUser(result);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data user");
    }
  };

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => {
        setAlert(null);
        router.replace("/auth/dashboard");
      }, 3000);
      return () => clearTimeout(timeout);
    }
    fetchData();
  }, [alert, keyword, limit, page]);

  if (error) {
    return <ErrorState text={error} />;
  }

  if (user?.data === undefined) {
    return (
      <div className="w-full h-full flex justify-center item-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }
  return (
    <div className="py-2 px-4 w-full h-full flex flex-col gap-2">
      {alert && <AlertSuccess text={alertMsg} />}
      <div className="flex justify-between">
        <SearchComp />
        <BtnCreate url="/auth/dashboard/create" />
      </div>

      <div className="">
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Username</th>
              <th>Departement</th>
              <th>Section</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {user.data.length >= 1 ? (
              user?.data?.map((item) => (
                <tr key={item.id}>
                  <td>{item.index}</td>
                  <td>{item.username}</td>
                  <td>{item.departement}</td>
                  <td>{item.section}</td>
                  <td>{item.email}</td>
                  <td>{item.roleuser}</td>
                  <td className="flex gap-2">
                    <BtnDetail url={`/auth/dashboard/${item.id}`} />
                    <BtnEdit url={`/auth/dashboard/edit/${item.id}`} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>Data Kosong</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={user?.currentPages}
          totalPage={user?.totalPages}
          onPageChange={(newPage) => {
            router.push(
              `?keyword=${encodeURIComponent(
                keyword,
              )}&page=${newPage}&limit=${limit}`,
            );
          }}
        />
      </div>
    </div>
  );
}
