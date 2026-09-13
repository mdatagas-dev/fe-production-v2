/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig;
