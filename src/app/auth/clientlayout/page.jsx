"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/sidebar";

export default function ClientLayout({ children }) {
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken =
      typeof window !== "undefined"
        ? sessionStorage.getItem("accessToken")
        : null;
    if (!storedToken) {
      router.push("/auth/login");
    } else {
      setToken(storedToken);
    }
  }, []);

  return (
    <div className="flex w-[100vw] h-[100vh] text-[12px]">
      <SideBar token={token} />
      <div
        className={`flex justify-center ${
          !token ? "w-[100%]" : "w-[85%] overflow-x-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
