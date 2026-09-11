"use client";
import Image from "next/image";
import LogoGas from "../../../../public/logogas.jpeg";
import { useState } from "react";
import EyeImg from "../../../../public/eye.png";
import HiddenEye from "../../../../public/hiddenEye.png";
import AlertError from "@/components/alert/error";
import apiBaseUrl from "@/lib/urlEndPoint";

export default function loginPage() {
  const [showPassword, SetShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    try {
      const res = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 1. WAJIB: Agar browser mau menerima dan menyimpan Set-Cookie dari Express
        credentials: "include",
        body: JSON.stringify(data),
      });

      // 2. Ambil teks mentah terlebih dahulu untuk mencegah crash JSON.parse jika server ngirim HTML
      const rawText = await res.text();
      let result;

      try {
        result = JSON.parse(rawText);
      } catch (parseErr) {
        // Jika balasan berupa HTML (Error 500/404/CORS), tangkap teksnya
        console.error("Server mengirim respons non-JSON:", rawText);
        throw new Error(`Server Error (${res.status}): Cek konsol backend.`);
      }

      if (!res.ok) {
        setError(result.message || result.error || "Gagal Login");
        setTimeout(() => setError(""), 3000);
        return;
      }

      // 3. Login Sukses:
      // Karena menggunakan Redis Session & HttpOnly Cookie, simpan data user (jika perlu) ke localStorage/state
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      // Redirect penuh agar cookie session dikirim saat memuat /dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login catch error:", error);
      setError(error.message || "Internal Server Error");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="h-[100%] w-[100%] relative flex flex-col justify-center items-center">
      {error && <AlertError text={error} />}
      <Image src={LogoGas} alt="..." width={100}></Image>
      <h3 className=" font-semibold text-[40px]">GAS PRODUCTION (AC)</h3>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[30%] h-[20%] px-12 rounded-md gap-4 justify-center items-center"
      >
        <input
          type="text"
          name="username"
          placeholder="username"
          className=" text-[22px] border-b-2 border-black w-full focus:outline-none"
        />
        <div className="flex w-full">
          <input
            type={`${showPassword ? "text" : "password"}`}
            name="password"
            placeholder="password"
            className=" text-[22px] border-b-2 border-black w-full focus:outline-none"
            autoComplete="off"
          />

          <Image
            onClick={() => SetShowPassword(!showPassword)}
            src={showPassword ? EyeImg : HiddenEye}
            alt="..."
            width={30}
            className="filter object-contain"
          ></Image>
        </div>
        <button type="submit" className="btn btn-primary px-12 text-[18px]">
          Login
        </button>
      </form>
    </div>
  );
}
