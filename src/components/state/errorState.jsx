"use client";

// Tampilan seragam saat pemuatan data gagal.
//
// fetchWithAuth mengembalikan body JSON apa adanya, termasuk saat backend
// membalas 500 (mis. { error: "Internal Server Error" }). Tanpa pemeriksaan
// itu, banyak halaman tampak "loading" selamanya karena datanya tetap
// undefined, atau tampil kosong seolah tidak ada data.
export default function ErrorState({ text }) {
  return (
    <div className="w-full h-full flex flex-col gap-2 justify-center items-center p-6 text-center">
      <p className="text-error font-semibold">{text}</p>
      <p className="text-gray-500">Periksa koneksi ke API atau hubungi IT.</p>
      <button
        className="btn btn-sm"
        onClick={() => window.location.reload()}
        type="button"
      >
        Coba lagi
      </button>
    </div>
  );
}
