"use client";
import FormUPH from "@/components/form/formUph";
import Pagination from "@/components/pagination";
import SearchComp from "@/components/searching";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageUph() {
  const [DataResult, setDataResult] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 6;

  const handleData = async (keyword, page, limit) => {
    const endPoint = `${apiBaseUrl}/uph?keyword=${encodeURIComponent(
      keyword
    )}&page=${page}&limit=${limit}`;
    try {
      console.log(endPoint)
      const result = await fetchWithAuth(endPoint);
      if (result.error) {
        return console.log(error.message);
      }
      setDataResult(result);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    console.log(data)

    const endPoint = `${apiBaseUrl}/uph/post`;
    try {
      const result = await fetchWithAuth(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("hasil result",result)

      if (result.error) {
        return console.log(result.error);
      }

      handleData(keyword,page,limit);
      e.target.reset();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async (id) => {
    const endPoint = `${apiBaseUrl}/uph/delete/${id}`;
    console.log(endPoint);
    try {
      const result = await fetchWithAuth(endPoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "Application/json",
        },
      });
      if (result.error) {
        return console.log(result.error);
      }

      handleData();
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    handleData(keyword, page, limit);
  }, [keyword, page, limit]);

  return (
    <div className="w-full h-full p-2">
      <div className="w-full flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Unit Per Hours</h1>
        <div>
          <SearchComp />
        </div>
        <FormUPH onSubmit={handleSubmit} />
      </div>

      <div>
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Model</th>
              <th>Line</th>
              <th>Uph</th>
              <th>Act</th>
            </tr>
          </thead>
          <tbody>
            {DataResult?.data?.length > 0 ? (
              DataResult.data.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.index}</td>
                    <td>{item.modeltv.model}</td>
                    <td>{item.line_uph_lineToline.line}</td>
                    <td>
                      {item.uph === null || item.uph === undefined
                        ? 0
                        : item.uph}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr key={"0"}>
                <td>Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={DataResult?.currentPages}
        totalPage={DataResult?.totalPages}
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
