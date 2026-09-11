"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/sidebar";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const pathName = usePathname();

  const isLoginPage = pathName === "/auth/login";

  useEffect(() => {
    const storedUser =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (!storedUser) {
      if (!isLoginPage) {
        router.push("/auth/login");
      }
    } else {
      if (isLoginPage) {
        router.push("/dashboard");
      } else {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [pathName]);

  // Halaman login: tanpa sidebar, konten full width
  if (isLoginPage) {
    return <div className="w-[100vw] h-[100vh] text-[12px]">{children}</div>;
  }

  return (
    <div className="flex w-[100vw] h-[100vh] text-[12px]">
      <SideBar user={user} />
      <div
        className={`flex justify-center ${
          !user ? "w-[100%]" : "w-[85%] overflow-x-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
