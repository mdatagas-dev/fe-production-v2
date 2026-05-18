// ✅ Ubah import dari "xlsx" menjadi "sheetjs-style"
import * as XLSX from "sheetjs-style";

export default function ExportToExcel(data, fileName = "data.xlsx") {
  // Validasi jika data kosong agar tidak crash
  if (!data || data.length === 0) {
    console.error("Data kosong, gagal mengekspor ke Excel.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "sheet1");

  // Mengeksekusi download file di browser
  XLSX.writeFile(workbook, fileName);
}
