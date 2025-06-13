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
      const res = await fetch(`${apiBaseUrl}/users/loging/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Internal Server Error");
        setTimeout(() => {
          setError("");
        }, 3000);
      } else {
        sessionStorage.setItem("accessToken", result.accessToken);
        sessionStorage.setItem("refreshToken", result.refreshToken);
        window.location.href = "/auth/dashboard";
      }
    } catch (error) {
      setError(error.message || "Internal Server Error");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="h-[100%] w-[100%] relative flex flex-col justify-center items-center">
      {error && <AlertError text={error} />}
      <Image src={LogoGas} alt="..." width={100}></Image>
      <h3 className=" font-semibold text-[40px]">GAS PRODUCTION</h3>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[30%] h-[20%] px-12 rounded-md gap-4 justify-center items-center"
      >
        <input
          type="text"
          name="username"
          placeholder="username"
          className=" text-[22px] border-b-2 border-indigo-500 w-full focus:outline-none"
        />
        <div className="flex w-full">
          <input
            type={`${showPassword ? "text" : "password"}`}
            name="password"
            placeholder="password"
            className=" text-[22px] border-b-2 border-indigo-500 w-full focus:outline-none"
          />
          <button onClick={() => SetShowPassword(!showPassword)}>
            <Image
              src={showPassword ? EyeImg : HiddenEye}
              alt="..."
              width={30}
              className="filter"
            ></Image>
          </button>
        </div>
        <button type="submit" className="btn btn-primary px-12 text-[18px]">
          Login
        </button>
      </form>
    </div>
  );
}
