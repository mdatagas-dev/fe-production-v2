"use client";
import AlertError from "@/components/alert/error";
import AlertSuccess from "@/components/alert/success";
import FormModel from "@/components/form/formModel";
import Pagination from "@/components/pagination";
import SearchComp from "@/components/searching";
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
  const [dataResult, setDataResult] = useState([]);
  const [alert, setAlert] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  const fetchData = async (page, limit, keyword) => {
    const endPoint = `${apiBaseUrl}/model?keyword=${encodeURIComponent(
      keyword
    )}&page=${page}&limit=${limit}`;
    try {
      const response = await fetchWithAuth(endPoint);
      console.log(response);
      setDataResult(response);
    } catch (error) {
      console.error("Error fetching model TV data:", error);
    }
  };

  useEffect(() => {
    fetchData(page, limit, keyword);
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
        setAlertMsg(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [page, limit, keyword, alert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    const endPoint = `${apiBaseUrl}/model/post`;

    try {
      const response = await fetchWithAuth(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.error) {
        setAlert("error");
        setAlertMsg(response.error);
      } else {
        router.push("/modeltv");
        setAlert("success");
        setAlertMsg("Model TV added successfully");
      }
    } catch (error) {}
  };
  if (!dataResult || dataResult.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  return (
    <div className="flex flex-col w-[100vw] h-[100vh] p-4">
      {alert === "success" ? (
        <AlertSuccess text={alertMsg} />
      ) : (
        <AlertError text={alertMsg} />
      )}
      <h1 className="text-2xl font-bold">Model TV </h1>
      <div className="flex justify-between items-center">
        <SearchComp />
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <FormModel onsubmit={handleSubmit} />
      </div>

      <div>
        <table className="table w-full mt-4">
          <thead>
            <tr>
              <th>No</th>
              <th>Image</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataResult?.data?.map((item) => {
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
                  <td>{item.brand}</td>
                  <td>{item.model}</td>
                  <td>{item.inch}</td>
                  <td>
                    <button className="btn btn-error ml-2">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination
          currentPage={dataResult?.currentPages}
          totalPage={dataResult?.totalPages}
          onPageChange={(newPage) => {
            router.push(
              `/modeltv?page=${newPage}&limit=${limit}&keyword=${keyword}`
            );
          }}
        />
      </div>
    </div>
  );
}
