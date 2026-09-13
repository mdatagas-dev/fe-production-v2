// Produksi memakai proxy Next pada origin yang sama agar session HttpOnly
// berlaku untuk akses LAN maupun SSH tunnel. URL backend hanya dipakai oleh
// next.config.mjs di sisi server, bukan dibuka langsung oleh browser.
const isProduction = process.env.NODE_ENV === "production";

const apiBaseUrl = isProduction
  ? "/api"
  : process.env.NEXT_PUBLIC_API_BASE_URL_DEV;

module.exports = apiBaseUrl;
