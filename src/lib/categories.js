import { useEffect, useState } from "react";
import apiBaseUrl from "@/lib/urlEndPoint";
import fetchWithAuth from "@/lib/fetchWithAuth";

// Sumber kebenaran daftar kategori ada di backend (lib/input.js), dibuka lewat
// GET /meta/categories. Frontend tidak menyimpan daftarnya sendiri lagi, jadi
// menambah kategori baru cukup di backend.
//
// Fungsi yang tersisa di sini hanyalah utilitas tampilan (displayModel).

let cache = null;

export async function fetchCategories() {
  if (cache) return cache;
  const result = await fetchWithAuth(`${apiBaseUrl}/meta/categories`);
  if (result?.data && typeof result.data === "object") {
    cache = result.data;
    return cache;
  }
  throw new Error(result?.error || "Gagal mengambil daftar kategori");
}

// Ambil daftar kategori sekali dan simpan di memori selama sesi.
// categories === null berarti masih memuat.
export function useCategories() {
  const [categories, setCategories] = useState(cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categories) return;
    let alive = true;
    fetchCategories()
      .then((data) => alive && setCategories(data))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [categories]);

  return { categories, error };
}

export const categoryNames = (categories) => Object.keys(categories ?? {});

export const unitTypesFor = (categories, product) =>
  categories?.[product] ?? [];

// Tampilan gabungan, mis. "AN05CDG (IDU)"; model tanpa unit_type tampil apa adanya
export const displayModel = (model, unitType) =>
  unitType ? `${model} (${unitType})` : model || "";
