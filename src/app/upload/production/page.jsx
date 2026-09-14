"use client";

import { useEffect, useRef, useState } from "react";
import * as XLSX from "sheetjs-style";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";

const STATUS_STYLE = {
  pending: "bg-gray-100 text-gray-500",
  uploading: "bg-blue-50 text-blue-600",
  success: "bg-green-50 text-green-700",
  error: "bg-red-50 text-red-700",
};

// Kolom yang dikenali backend (POST /rdps/post). Kolom di luar daftar ini
// diabaikan server, jadi lebih baik ketahuan di sini daripada datanya diam-diam
// kosong. Semua scan komponen mengikuti alur recordscan yang sama dan wajib
// membawa kolom "sn".
const SCAN_COLUMNS = [
  "sn",
  "sn_motor",
  "pcb_idu",
  "pcb_odu",
  "pcb_wm",
  "frame_pcb",
  "sn_carton",
  "sn_accessories",
];

// Nama kolom lama -> kolom sekarang. File lama tetap bisa dipakai asal isinya
// diarahkan ke kolom yang benar.
const LEGACY_COLUMNS = { sn_box: "pcb_odu" };

// Dikirim template tapi memang tidak dipakai server
const TOLERATED_COLUMNS = ["pn_carton"];

export default function UploadProduction() {
  const fileRef = useRef(null);
  const stopRef = useRef(false); // flag untuk hentikan loop saat user klik Stop

  const [headersData, setHeadersData] = useState([]);
  const [rows, setRows] = useState([]); // [{ data, status, message }]
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [alert, setAlert] = useState(null); // { type, msg }
  const [columnInfo, setColumnInfo] = useState(null); // { mapped, unknown }

  const handleFile = (e) => {
    const id_regist = sessionStorage.getItem("id_regist");
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "buffer", cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(workSheet, {
        raw: false,
        dateNF: "yyyy-mm-dd",
        defval: null,
      });

      if (!jsonData.length) {
        setAlert({ type: "error", msg: "File kosong atau tidak terbaca" });
        return;
      }

      // Susun tiap baris hanya dari kolom yang dikenal: kolom resmi dulu,
      // lalu kolom lama (sn_box) mengisi kolom baru yang masih kosong.
      const mapped = new Set();
      const unknown = new Set();

      const rowsData = jsonData.map((source) => {
        const data = { id_regist };

        for (const column of SCAN_COLUMNS) {
          if (source[column] !== undefined) data[column] = source[column];
        }

        for (const [key, value] of Object.entries(source)) {
          if (SCAN_COLUMNS.includes(key) || TOLERATED_COLUMNS.includes(key)) {
            continue;
          }

          const target = LEGACY_COLUMNS[key];

          if (!target) {
            unknown.add(key);
            continue;
          }

          mapped.add(key);
          const empty =
            data[target] === undefined ||
            data[target] === null ||
            data[target] === "";
          if (empty) data[target] = value;
        }

        return { data, status: "pending", message: "" };
      });

      if (!SCAN_COLUMNS.some((column) => column in rowsData[0].data)) {
        setAlert({
          type: "error",
          msg: "Tidak ada kolom yang dikenal (sn, sn_motor, pcb_idu, pcb_odu, pcb_wm, frame_pcb, sn_carton, sn_accessories). Cek baris judul file Excel.",
        });
        return;
      }

      const hasSnColumn = rowsData[0].data.sn !== undefined;
      if (!hasSnColumn) {
        setAlert({
          type: "error",
          msg: "Kolom SN wajib ada di file",
        });
        return;
      }

      setColumnInfo({ mapped: [...mapped], unknown: [...unknown] });
      setHeadersData(
        SCAN_COLUMNS.filter((column) => column in rowsData[0].data),
      );
      setRows(rowsData);
      setProgress({ done: 0, total: jsonData.length });
      setAlert(null);
    };
    reader.readAsArrayBuffer(file);
  };

  // kirim satu baris ke endpoint, return true kalau sukses
  const sendRow = async (index, rowData) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], status: "uploading", message: "" };
      return next;
    });

    try {
      const result = await fetchWithAuth(`${apiBaseUrl}/rdps/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rowData),
      });

      if (result.error) {
        setRows((prev) => {
          const next = [...prev];
          next[index] = {
            ...next[index],
            status: "error",
            message: result.error,
          };
          return next;
        });
        return false;
      }

      setRows((prev) => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          status: "success",
          message: result.message || "OK",
        };
        return next;
      });
      return true;
    } catch (err) {
      setRows((prev) => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          status: "error",
          message: "Gagal terhubung ke server",
        };
        return next;
      });
      return false;
    }
  };

  // upload satu per satu mulai dari startIndex, berhenti otomatis kalau ada yang gagal
  const runUpload = async (startIndex) => {
    setLoading(true);
    stopRef.current = false;
    setAlert(null);

    for (let i = startIndex; i < rows.length; i++) {
      if (stopRef.current) break;

      const ok = await sendRow(i, rows[i].data);
      setProgress((p) => ({ ...p, done: i + 1 }));

      if (!ok) {
        setAlert({
          type: "error",
          msg: `Upload berhenti di baris ${i + 1}. Perbaiki data lalu klik "Lanjutkan dari yang gagal".`,
        });
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    if (!stopRef.current) {
      setAlert({ type: "success", msg: "Semua data berhasil diupload" });
    }
  };

  const handleUploadAll = () => runUpload(0);

  const handleResume = () => {
    const idx = rows.findIndex((r) => r.status !== "success");
    if (idx === -1) return;
    runUpload(idx);
  };

  const handleStop = () => {
    stopRef.current = true;
    setLoading(false);
  };

  const handleReset = () => {
    setHeadersData([]);
    setRows([]);
    setProgress({ done: 0, total: 0 });
    setAlert(null);
    setColumnInfo(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const hasFailedRow = rows.some((r) => r.status === "error");
  const allDone = rows.length > 0 && rows.every((r) => r.status === "success");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Upload Production
        </h1>
        <p className="text-[12px] text-gray-400">
          Upload data dari file Excel — data dikirim satu per satu, menunggu
          response sebelum lanjut ke baris berikutnya.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFile}
          disabled={loading}
          className="text-[12px] file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:text-[12px] disabled:opacity-50"
        />
        {rows.length > 0 && (
          <button
            onClick={handleReset}
            disabled={loading}
            className="text-[11px] text-red-500 hover:underline disabled:opacity-40"
          >
            Reset
          </button>
        )}
      </div>

      {alert && (
        <div
          className={`mb-4 px-3 py-2 rounded-lg text-[12px] border ${
            alert.type === "error"
              ? "bg-red-50 text-red-700 border-red-100"
              : "bg-green-50 text-green-700 border-green-100"
          }`}
        >
          {alert.msg}
        </div>
      )}

      {columnInfo &&
        (columnInfo.mapped.length > 0 || columnInfo.unknown.length > 0) && (
          <div className="mb-4 px-3 py-2 rounded-lg text-[12px] border bg-amber-50 text-amber-800 border-amber-100">
            {columnInfo.mapped.length > 0 && (
              <p>
                Kolom lama terdeteksi dan isinya tetap dipakai:{" "}
                {columnInfo.mapped
                  .map((column) => `${column} → ${LEGACY_COLUMNS[column]}`)
                  .join(", ")}
              </p>
            )}
            {columnInfo.unknown.length > 0 && (
              <p>
                Kolom tidak dikenal akan diabaikan:{" "}
                {columnInfo.unknown.join(", ")} — perbaiki judul kolom kalau
                datanya seharusnya ikut terkirim.
              </p>
            )}
          </div>
        )}

      {rows.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <button
              onClick={handleUploadAll}
              disabled={loading || allDone}
              className="h-9 px-4 text-[12px] font-medium bg-blue-600 text-white rounded-lg disabled:opacity-40"
            >
              {loading ? "Mengupload..." : "Upload Semua"}
            </button>

            {hasFailedRow && !loading && (
              <button
                onClick={handleResume}
                className="h-9 px-4 text-[12px] font-medium bg-amber-500 text-white rounded-lg"
              >
                Lanjutkan dari yang gagal
              </button>
            )}

            {loading && (
              <button
                onClick={handleStop}
                className="h-9 px-4 text-[12px] font-medium bg-gray-200 text-gray-700 rounded-lg"
              >
                Stop
              </button>
            )}

            <span className="text-[11px] text-gray-400">
              {progress.done}/{progress.total} baris terkirim
            </span>
          </div>

          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{
                width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%`,
              }}
            />
          </div>

          <div className="border border-gray-200 rounded-xl overflow-auto max-h-[480px]">
            <table className="w-full text-[11px] border-collapse">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left text-gray-400 font-semibold">
                    #
                  </th>
                  <th className="px-2 py-2 text-left text-gray-400 font-semibold">
                    Status
                  </th>
                  {headersData.map((h) => (
                    <th
                      key={h}
                      className="px-2 py-2 text-left text-gray-400 font-semibold whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                  <th className="px-2 py-2 text-left text-gray-400 font-semibold">
                    Pesan
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="px-2 py-1.5 text-gray-400">{i + 1}</td>
                    <td className="px-2 py-1.5">
                      <span
                        className={`px-1.5 py-0.5 rounded-full font-semibold ${STATUS_STYLE[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    {headersData.map((h) => (
                      <td
                        key={h}
                        className="px-2 py-1.5 whitespace-nowrap text-gray-700"
                      >
                        {String(r.data[h] ?? "—")}
                      </td>
                    ))}
                    <td className="px-2 py-1.5 text-gray-400">{r.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
