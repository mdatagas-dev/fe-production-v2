"use client";
import Image from "next/image";
import Logo from "../../public/logogas.jpeg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import apiBaseUrl from "@/lib/urlEndPoint";

export default function SideBar({ user }) {
  const username = user?.username || null;
  const deptUser = user?.depart || null;
  const roleUser = user?.roleuser?.toLowerCase() || "";
  const pathName = usePathname();

  const logOut = async () => {
    try {
      // Hapus session di backend (Redis) + cookie browser.
      // Pakai apiBaseUrl, bukan NEXT_PUBLIC_API_BASE_URL_DEV langsung: di
      // bundel produksi variabel itu masih menunjuk ke localhost.
      await fetch(`${apiBaseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
  };
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      dept: "all",
    },
    {
      id: "bomlist",
      label: "Bomlist",
      href: "/bomlist",
      dept: "ENG",
    },
    {
      id: "registscan",
      label: "Scanning",
      href: "/registscan",
      dept: "ppc",
    },
    {
      id: "scan",
      label: "Record Scan",
      href: "/registscan",
      dept: "IT",
    },
    {
      id: "account",
      label: "Account",
      href: "/auth/dashboard",
      dept: "IT",
    },
    {
      id: "Auth_Production",
      label: "Auth Production",
      href: "/pin/create",
      dept: "IT",
    },
    {
      id: "model",
      label: "Model",
      href: "/modeltv",
      dept: "ENG",
    },
    {
      id: "line",
      label: "Line",
      href: "/line",
      dept: "ENG",
    },
    {
      id: "uph",
      label: "UPH",
      href: "/uph",
      dept: "all",
      role: "superuser",
    },
    {
      id: "repair TCL",
      label: "Repair",
      href: "/repair",
      dept: "QC",
    },
    {
      id: "datascan",
      label: "Data Scan",
      href: "/dashboard/datascan",
      dept: "IT, QC",
    },
  ];

  return (
    <div
      className={`w-[15%] h-screen relative bg-[#050350] text-white flex flex-col ${
        user === null ? "hidden" : "block"
      }`}
    >
      <div className="flex items-center justify-center py-6">
        <Image
          src={Logo}
          alt="Logo gas"
          width={120}
          height={120}
          className="rounded-md"
          priority
        />
      </div>

      {/* Navigation */}
      <ul className={`flex flex-col gap-1`}>
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`${
              (!item.role || item.role === roleUser) &&
              (item.dept.includes(deptUser) || item.dept === "all")
                ? "block"
                : "hidden"
            }`}
          >
            <Link
              href={item.href}
              className={`block px-2 py-3 hover:bg-blue-600  ${
                pathName === item.href ? "bg-blue-700" : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}

        {/* Logout */}
        <li className="mt-auto pt-4">
          <button
            onClick={logOut}
            className="w-full text-left px-4 py-3 hover:bg-red-600 bg-red-500"
          >
            Logout
          </button>
        </li>
      </ul>
      <div className="font-semibold text-center text-[18px] absolute bottom-0 mb-6">
        <table className="table">
          <tbody>
            <tr className="border-b-4 border-indigo-500">
              <td>Name</td>
              <td>: {username}</td>
            </tr>
            <tr className="border-b-4 border-indigo-500">
              <td>Depart</td>
              <td>: {deptUser}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
