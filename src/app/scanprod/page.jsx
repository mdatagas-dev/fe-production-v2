"use client";

import ScanFeedback from "@/components/alert/scanFeedback";
import FormRecordScanPage from "@/components/form/formRecord";
import ErrorState from "@/components/state/errorState";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";



export default function ScanProdPage() {
  const snRef = useRef(null);

  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [lastscan, setLastscan] = useState(null);
  const [dataResult, setDataResult] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const feedbackIdRef = useRef(0);
  const audioRef = useRef(null);

  const [bomlist, setBomlist] = useState([]);

  const playSound = (audioFile, loop = true) => {
    if (typeof window === "undefined") return; // Audio only exists in the browser
    audioRef.current?.pause();
    const audio = new Audio(audioFile);
    audio.loop = loop;
    audioRef.current = audio;
    audio.addEventListener("ended", () => {
      if (audioRef.current === audio) audioRef.current = null;
    });
    audio.play().catch((err) => {
      if (audioRef.current === audio) audioRef.current = null;
      console.log("Autoplay blocked:", err);
    });
  };

  const stopSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Let the current playback finish once so a fast next scan still hears it.
    audio.loop = false;
  };

  const playSuccessSound = () => {
    const currentAudio = audioRef.current;
    const isErrorAudio =
      currentAudio?.src.endsWith("/audio/carton.mp3") ||
      currentAudio?.src.endsWith("/audio/failed.mp3");

    if (isErrorAudio) {
      currentAudio.loop = false;
      currentAudio.addEventListener(
        "ended",
        () => playSound("/audio/success.mp3", false),
        { once: true },
      );
      return;
    }

    playSound("/audio/success.mp3", false);
  };

  const showFeedback = (type, message, soundFile) => {
    if (type === "success") playSuccessSound();
    else if (soundFile) playSound(soundFile);
    setFeedback({ id: ++feedbackIdRef.current, type, message });
  };

  const dismissFeedback = () => {
    stopSound();
    setFeedback(null);

    // Fokus dikembalikan setelah dialog dilepas dari DOM.
    window.requestAnimationFrame(() => snRef.current?.focus());
  };

  const fetchData = async () => {
    const idRegist = sessionStorage.getItem("id_regist");
    const endPoint = `${apiBaseUrl}/rdps/scan`;
    try {
      // Tanpa id_regist di session, permintaan tidak pernah dikirim sehingga
      // halaman berputar selamanya tanpa penjelasan.
      if (!idRegist) {
        setError("Pilih registrasi dulu dari halaman Scanning");
        return;
      }

      const result = await fetchWithAuth(endPoint, {
        headers: {
          "Content-Type": "application/json",
          idregist: idRegist,
        },
      });

      if (result?.error || !result?.validation) {
        setError(result?.error || "Gagal memuat data registrasi");
        return;
      }

      setError(null);
      setDataResult(result.validation);
      setTotal(result.total);
      setLastscan(result.last);
      setBomlist(result.bomlist);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data registrasi");
    }
  };

  useEffect(() => {
    fetchData();
    snRef.current?.focus();

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // prevent multiple submissions

    setLoading(true);
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    if (data.sn_carton && data.sn_carton !== data.sn) {
      showFeedback(
        "error",
        "SN CARTON tidak sama dengan SN UNIT",
        "/audio/carton.mp3",
      );
      setLoading(false);
      return;
    }

    // cek bomlist
    // console.log("bomlist:", bomlist);
    for (const item of bomlist) {
      for (const key in item) {
        const valueOfBomlist = item[key];
        const valueOfData = data[key];

        // console.log(
        //   `key: ${key}, valueOfBomlist: ${valueOfBomlist}, valueOfData: ${valueOfData}`,
        // );
        if (valueOfData && !valueOfData.includes(valueOfBomlist)) {
          // console.log(
          //    `tidak sesuai bomlist ${key} : ${valueOfBomlist}, valueOfData: ${valueOfData}`,
          // );
          showFeedback(
            "error",
            `tidak sesuai bomlist ${key} : ${valueOfBomlist}`,
            "/audio/failed.mp3",
          );
          setLoading(false);
          return;
        }
      }
    }

    try {
      const endPoint = `${apiBaseUrl}/rdps/post`;
      const result = await fetchWithAuth(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (result.error) {
        showFeedback("error", result.error, "/audio/failed.mp3");
        setLoading(false);
      } else {
        showFeedback("success", result.message);
        e.target.reset();
        snRef.current.focus();
        fetchData();
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      console.log("error submit:", error);
      showFeedback(
        "error",
        error?.message || "Gagal menyimpan data scan",
        "/audio/failed.mp3",
      );
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorState text={error} />;
  }

  // agar tidak terjadi data changing
  if (!dataResult || Object.keys(dataResult).length <= 0) {
    return (
      <div className="w-full h-full flex justify-center item-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <ScanFeedback
        key={feedback?.id}
        message={feedback?.message}
        onDismiss={dismissFeedback}
        type={feedback?.type}
      />

      <div className="bg-[#050350] flex text-white w-full h-[10%] px-4 py-2 justify-between">
        <div>
          <p className="font-bold text-[22px]">{dataResult?.model}</p>
          <p>PO NUMBER: {dataResult?.po_number}</p>
        </div>
        <div>
          <p className="text-[16px] font-semibold">{dataResult?.subline}</p>
          <p>Plan: {dataResult?.plan}</p>
          <p>Count: {total}</p>
        </div>
      </div>

      <div className="w-full flex flex-col flex-row-reverse gap-2 items-center absolute p-2">
        <Link href={"upload/production"} className="btn btn-primary">
          upload data
        </Link>
      </div>

      <FormRecordScanPage
        snRef={snRef}
        validation={dataResult}
        lastScan={lastscan}
        register={dataResult}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
