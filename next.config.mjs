// Path-nya harus pakai .js: tanpa itu Node gagal me-resolve "next/constants"
// dan next.config.mjs tidak bisa dimuat sama sekali.
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/constants.js";

// NEXT_PUBLIC_* ditanam ke bundel saat build, jadi nilai kosong tidak bisa
// diperbaiki setelah build: bundelnya berisi "undefined/..." dan halamannya
// baru gagal di browser pengguna. Karena .env tidak ikut di-commit, salah isi
// jadi mudah terjadi di server baru — jadi dicek di sini supaya berhenti jelas
// di build, bukan di browser.
//
// Hanya build dan dev yang dicek. `next start` tidak perlu: nilainya sudah
// tertanam di bundel, jadi server tidak lagi membaca variabel ini.
const REQUIRED_VAR = {
  [PHASE_PRODUCTION_BUILD]: "NEXT_PUBLIC_API_BASE_URL_PRODUCTION",
  [PHASE_DEVELOPMENT_SERVER]: "NEXT_PUBLIC_API_BASE_URL_DEV",
};

/** @type {(phase: string) => import("next").NextConfig} */
export default (phase) => {
  const requiredVar = REQUIRED_VAR[phase];
  if (requiredVar && !process.env[requiredVar]) {
    throw new Error(
      `${requiredVar} belum diisi. Salin .env.example menjadi .env lalu isi nilainya, kemudian ulangi perintahnya.`,
    );
  }

  return {
    // Halaman depan tidak punya konten sendiri, jadi dialihkan ke dashboard.
    // Redirect di level server, bukan lewat redirect() di page: halaman "/"
    // tanpa data di-prerender, sehingga redirect() hanya jadi meta refresh
    // ~1 detik dengan halaman kosong lebih dulu.
    // Kalau belum login, ClientLayout (root layout) yang mengalihkan ke /auth/login.
    async redirects() {
      return [
        {
          source: "/",
          destination: "/dashboard",
          permanent: false,
        },
      ];
    },
  };
};
