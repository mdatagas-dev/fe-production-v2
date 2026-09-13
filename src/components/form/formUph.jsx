"use client";

import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useEffect, useState } from "react";

export default function FormUPH({ onSubmit }) {
  const [models, setModels] = useState([]);
  const [lines, setLines] = useState([]);
  // "Loading ..." sebelumnya digantung pada lines.length: kalau master line
  // masih kosong (belum ada data, bukan gagal) form tidak pernah muncul.
  const [loaded, setLoaded] = useState(false);

  const handleData = async () => {
    const endPointModel = `${apiBaseUrl}/model?limit=9999`;
    const endPointLine = `${apiBaseUrl}/line`;

    try {
      const resultModel = await fetchWithAuth(endPointModel, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resultLine = await fetchWithAuth(endPointLine);
      if (resultLine?.error || resultModel?.error) {
        console.error(resultLine?.error, resultModel?.error);
        return;
      }

      setModels(Array.isArray(resultModel?.data) ? resultModel.data : []);
      setLines(Array.isArray(resultLine?.data) ? resultLine.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      // selalu berhenti memuat, berhasil maupun gagal
      setLoaded(true);
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  if (!loaded) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="w-full h-full">
      <form
        action=""
        onSubmit={onSubmit}
        className="w-[90%] gap-2 flex gap-2 relative"
      >
        <div className="flex gap-2 flex-col w-[30%]">
          <label htmlFor="">Model</label>
          <select defaultValue="Pick a color" className="select" name="model">
            <option disabled={true}>Model</option>
            {models?.length > 0 ? (
              models.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.model}
                </option>
              ))
            ) : (
              <option disabled={true}>Tidak ada Data</option>
            )}
          </select>
        </div>
        <div className="flex gap-2 flex-col w-[30%]">
          <label htmlFor="">Line</label>
          <select defaultValue="Pick a color" className="select" name="line">
            <option disabled={true}>Line</option>
            {lines?.length > 0 ? (
              lines.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.line}
                </option>
              ))
            ) : (
              <option disabled={true}>Tidak ada Data</option>
            )}
          </select>
        </div>
        <div className="flex gap-2 flex-col w-[30%] ">
          <label htmlFor="">UPH</label>
          <input type="number" name="uph" className="input" />
        </div>

        <button
          type="submit"
          className="btn btn-primary absolute bottom-0 right-0"
        >
          Add
        </button>
      </form>
    </div>
  );
}
