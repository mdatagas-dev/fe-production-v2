"use client";
import FormLine from "@/components/form/formLine";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useEffect, useState } from "react";

export default function PageLine() {
  const [resultData, setResultData] = useState([]);

  const handleData = async () => {
    const endPoint = `${apiBaseUrl}/line`;
    const result = await fetchWithAuth(endPoint);

    if (result?.data) {
      setResultData(result.data);
    }

    if (result?.error) {
      console.log(result.error);
    }
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
        console.log(result.error);
      }
      e.target.reset();
      handleData();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleData();
  }, []);

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
              <th>Act</th>
            </tr>
          </thead>
          <tbody>
            {resultData.length > 0 ? (
              resultData.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.line}</td>
                  <td>
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
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
