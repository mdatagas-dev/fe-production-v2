import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./auth/clientlayout/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Scanning Produksi",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="corporate">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
