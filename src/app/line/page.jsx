"use client";
import FormLine from "@/components/form/formLine";
import ErrorState from "@/components/state/errorState";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useEffect, useState } from "react";

export default function PageLine() {
  const [resultData, setResultData] = useState([]);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    const endPoint = `${apiBaseUrl}/line/${id}`;
    try {
      const result = await fetchWithAuth(endPoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (result?.error) {
        setError(result.error);
        return;
      }

      await handleData();
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus line");
    }
  };

  const handleData = async () => {
    const endPoint = `${apiBaseUrl}/line`;
    const result = await fetchWithAuth(endPoint);

    // Sebelumnya kegagalan hanya masuk console, sehingga tabel tampil
    // "No data available" seolah datanya memang kosong.
    if (result?.error || !Array.isArray(result?.data)) {
      setError(result?.error || "Gagal memuat data line");
      return;
    }

    setError(null);
    setResultData(result.data);
  };
  const handleDisplay = async (id, display) => {
    const result = await fetchWithAuth(`${apiBaseUrl}/line/${id}/display`, {
      method: "PATCH",
      body: JSON.stringify({ display }),
    });
    if (result?.error) return setError(result.error);
    await handleData();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    const endPoint = `${apiBaseUrl}/line/post`;
    try {
      const result = await fetchWithAuth(endPoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (result?.error) {
        setError(result.error);
        return;
      }

      setError(null);
      e.target.reset();
      await handleData();
    } catch (err) {
      console.error(err);
      setError("Gagal menambah line");
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  if (error) {
    return <ErrorState text={error} />;
  }

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">LINE PRODUCTION</h1>
        <FormLine onSubmit={handleSubmit} />
      </div>

      <div className="w-full h-[90%] overflow-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Line</th>
              <th>Display</th>
              <th>Act</th>
            </tr>
          </thead>
          <tbody>
            {resultData.length > 0 ? (
              resultData.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.line}</td>
                  <td><input aria-label={`Tampilkan ${item.line} di display`} checked={item.display !== false} className="checkbox" onChange={(event) => handleDisplay(item.id, event.target.checked)} type="checkbox" /></td>
                  <td>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
