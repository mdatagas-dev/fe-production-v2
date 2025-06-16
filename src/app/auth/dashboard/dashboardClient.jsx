"use client";
import BtnCreate from "@/components/btn/btnCreate";
import BtnDetail from "@/components/btn/btnDetail";
import BtnEdit from "@/components/btn/btnEdit";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter, useSearchParams } from "next/navigation";
import apiBaseUrl from "@/lib/urlEndPoint";
import fetchWithAuth from "@/lib/fetchWithAuth";
import SearchComp from "@/components/searching";
import Pagination from "@/components/pagination";

export default function dashboardUserClient() {
  const [user, setUser] = useState([]);
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 7;
  const keyword = searchParams.get("keyword") || "";
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      const decoded = jwtDecode(token);
      const role = decoded.roleuser;
      if (role !== "superuser") {
        return router.push("/registscan");
      }
    }

    const fetchData = async () => {
      try {
        const endPoint = `${apiBaseUrl}/users?keyword=${encodeURIComponent(
          keyword
        )}&page=${page}&limit=${limit}`;

        const result = await fetchWithAuth(endPoint, {
          method: "GET",
          cache: "no-store",
        });

        setUser(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [keyword, page, limit]);

  if (user?.data?.length <= 0 || user.data === undefined) {
    return (
      <div className="w-full h-full flex justify-center item-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }
  return (
    <div className="py-2 px-4 w-full h-full flex flex-col gap-2">
      <div className="flex justify-between">
        <SearchComp />
        <BtnCreate url="/auth/dashboard/create" />
      </div>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Username</th>
              <th>Departement</th>
              <th>Section</th>
              <th>Email</th>
              <th>Role</th>
              <th>Password</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {user?.data?.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.username}</td>
                <td>{item.departement}</td>
                <td>{item.section}</td>
                <td>{item.email}</td>
                <td>{item.roleuser}</td>
                <td>{item.password}</td>
                <td className="flex gap-2">
                  <BtnDetail url={`/auth/dashboard/${item.id}`} />
                  <BtnEdit url={`/auth/dashboard/edit/${item.id}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={user?.currentPages}
          totalPage={user?.totalPages}
          onPageChange={(newPage) => {
            router.push(
              `?keyword=${encodeURIComponent(
                keyword
              )}&page=${newPage}&limit=${limit}`
            );
          }}
        />
      </div>
    </div>
  );
}
