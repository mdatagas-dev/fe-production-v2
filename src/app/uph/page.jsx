"use client";
import FormUPH from "@/components/form/formUph";
import ErrorState from "@/components/state/errorState";
import Pagination from "@/components/pagination";
import SearchComp from "@/components/searching";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageUph() {
  const [DataResult, setDataResult] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 6;

  const handleData = async (keyword, page, limit) => {
    const endPoint = `${apiBaseUrl}/uph?keyword=${encodeURIComponent(
      keyword,
    )}&page=${page}&limit=${limit}`;
    try {
      const result = await fetchWithAuth(endPoint);

      // `error` di sini sebelumnya tidak terdefinisi (ReferenceError di dalam
      // catch), jadi kegagalan tidak pernah tampil di layar.
      if (result?.error || !Array.isArray(result?.data)) {
        setError(result?.error || "Gagal memuat data UPH");
        return;
      }

      setError(null);
      setDataResult(result);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data UPH");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    const endPoint = `${apiBaseUrl}/uph/post`;
    try {
      const result = await fetchWithAuth(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      setError(null);
      await handleData(keyword, page, limit);
      e.target.reset();
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan data UPH");
    }
  };

  const handleDelete = async (id) => {
    const endPoint = `${apiBaseUrl}/uph/delete/${id}`;
    try {
      const result = await fetchWithAuth(endPoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      setError(null);
      await handleData(keyword, page, limit);
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus data UPH");
    }
  };

  useEffect(() => {
    handleData(keyword, page, limit);
  }, [keyword, page, limit]);

  if (error) {
    return <ErrorState text={error} />;
  }

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
                    <td>
                      {[item.model?.name, item.model?.unitType]
                        .filter(Boolean)
                        .join(" (")}
                      {item.model?.unitType ? ")" : ""}
                    </td>
                    <td>{item.line?.name}</td>
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
              keyword,
            )}&page=${newPage}&limit=${limit}`,
          );
        }}
      />
    </div>
  );
}
