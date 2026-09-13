// Base URL API dipilih SAAT BUILD, bukan saat runtime.
//
// `next build` selalu berjalan dengan NODE_ENV=production, sedangkan `next dev`
// memakai development. Next menanam nilai NEXT_PUBLIC_* ke dalam bundel pada
// saat build (di-inline sebagai literal), jadi bundel produksi memakai
// NEXT_PUBLIC_API_BASE_URL_PRODUCTION dan dev memakai ..._DEV.
//
// Sebelumnya file ini selalu membaca ..._DEV, sehingga hasil `next build`
// menunjuk ke URL dev — di server itu berarti browser pengguna memanggil
// localhost mereka sendiri.
//
// Tidak ada dotenv di sini: Next sudah memuat .env sendiri (lihat baris
// "Environments: .env" saat build), dan mengimpornya hanya menambah pustaka
// Node ke bundel browser.
const isProduction = process.env.NODE_ENV === "production";

const apiBaseUrl = isProduction
  ? process.env.NEXT_PUBLIC_API_BASE_URL_PRODUCTION
  : process.env.NEXT_PUBLIC_API_BASE_URL_DEV;

module.exports = apiBaseUrl;
