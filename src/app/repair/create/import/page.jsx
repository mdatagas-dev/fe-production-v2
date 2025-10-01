"use client";

import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function ImportPage() {
  const router = useRouter();
  const [excelData, setExcelData] = useState([]);
  const [headersData, setHeadersData] = useState([]);

  const handleFile = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(workSheet);
      setExcelData(jsonData);
      const headers = Object.keys(jsonData[0]);
      setHeadersData(headers);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endPoint = `${apiBaseUrl}/repair/import`;
    try {
      const result = await fetchWithAuth(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(excelData),
      });
      if (result.error) {
        console.log(result.error);
      }
      router.push("/repair");
    } catch (error) {
      console.log(error.message);
    }

    console.log(excelData);
  };

  return (
    <div className="w-full p-2">
      <div className="flex flex-col h-[10%] py-2 gap-2">
        <h3 className="text-2xl font-semibold">EXPORT PAGE</h3>
        <form
          className="flex w-full justify-between"
          action=""
          onSubmit={handleSubmit}
        >
          <div>
            <input
              className="file-input"
              name="file"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFile}
            />
          </div>
          <button className="btn" type="submit">
            Upload
          </button>
        </form>
      </div>

      <div>
        {excelData.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                {headersData.length > 0 ? (
                  headersData.map((item, index) => <th key={index}>{item}</th>)
                ) : (
                  <th>no data</th>
                )}
              </tr>
            </thead>
            <tbody>
              {excelData.length > 0 ? (
                excelData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {headersData.map((header, colIndex) => (
                      <td key={colIndex}>{row[header]}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headersData.length}>Data Kosong</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
