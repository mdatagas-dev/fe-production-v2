import * as XLSX from "sheetjs-style";

export default function ExportToExcel(data, fileName = "data.xlsx") {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Tidak ada data untuk diekspor");
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "sheet1");

  // Download manual lebih konsisten di browser/in-app browser daripada
  // mengandalkan implementasi writeFile dari library.
  const content = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([content], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
