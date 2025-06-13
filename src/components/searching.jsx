"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchComp() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const router = useRouter();
  const [search, setSearch] = useState(keyword);
  const handleSearch = async (e) => {
    e.preventDefault();
    router.push(`?keyword=${encodeURIComponent(search.trim())}`);
  };
  return (
    <div>
      <form action="" onSubmit={handleSearch} className="w-[30%] flex gap-2">
        <input
          type="text"
          placeholder="searching..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-1 p-2 rounded-sm "
        />
        <button type="submit" className="btn btn-accent">
          Search
        </button>
      </form>
    </div>
  );
}
