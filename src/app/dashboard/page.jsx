"use client";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import Image from "next/image";
import { useEffect, useState } from "react";
import maintenancepng from "@/../public/maintenance.png";

export default function DashboardPage() {
  const [dataResult, setDataResult] = useState([]);
  const [selectedSubline, setSelectedSubline] = useState(null);
  const [subline, setSubline] = useState("line 1 assy input");
  const timeUPH = [
    "1 (07:00 - 08:00)",
    "2 (08:00 - 09:00)",
    "3 (09:00 - 10:00)",
    "4 (10:00 - 11:00)",
    "5 (11:00 - 12:00)",
    "6 (12:00 - 13:00)",
    "7 (13:00 - 14:00)",
    "8 (14:00 - 15:00)",
    "9 (15:00 - 16:00)",
    "10 (16:00 - 17:00)",
    "11 (17:00 - 18:00)",
    "12 (18:00 - 19:00)",
    "13 (19:00 - 20:00)",
    "14 (20:00 - 21:00)",
    "15 (21:00 - 22:00)",
    "16 (22:00 - 23:00)",
    "17 (23:00 - 00:00)",
    "18 (00:00 - 01:00)",
    "19 (01:00 - 02:00)",
    "20 (02:00 - 03:00)",
    "21 (03:00 - 04:00)",
    "22 (04:00 - 05:00)",
    "23 (05:00 - 06:00)",
    "24 (06:00 - 07:00)",
  ];

  const resultData = async (subline) => {
    try {
      const endPoint = `${apiBaseUrl}/rdps/dashboard?keyword=${subline}`;
      const result = await fetchWithAuth(endPoint);
      if (result.error) {
        return <div>Terjadi kesalahan di server</div>;
      } else {
        setDataResult(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    resultData(subline);
  }, [subline]);

  return (
    <div className="w-full h-full px-4 py-2 gap-2">
      <div className="w-full h-full flex justify-center items-center">
        <Image src={maintenancepng} alt="" className="w-[30%]" />
        <p className="font-bold text-[18px]">THIS PAGE UNDER MAINTENANCE</p>
      </div>
    </div>
  );
}
