"use client";
import { useEffect, useState } from "react";
import BtnBack from "../btn/btnBack";
import apiBaseUrl from "@/lib/urlEndPoint";
import fetchWithAuth from "@/lib/fetchWithAuth";
import { useCategories, unitTypesFor } from "@/lib/categories";

export default function FormRegist({
  handleModel,

  onSubmit,
  initialData = {},
  load,
}) {
  const [user, setUser] = useState(null);
  const [modals, setModals] = useState([]);
  const [lines, setLines] = useState([]);
  const [bomlist, setBomlist] = useState([]);
  const [showModelList, setShowModelList] = useState(false);
  const [showLineList, setShowLineList] = useState(false);
  const [showBatchList, setShowBatchList] = useState(false);
  const [valModel, setValModel] = useState(initialData.model || "");
  const [valUnitType, setValUnitType] = useState(initialData.unit_type || "");
  const [valLines, setValLines] = useState(initialData.subline || "");
  const [valBatch, setValBatch] = useState(initialData.order_number || "");
  const { categories } = useCategories();

  const fetchModel = async () => {
    const endPoint = `${apiBaseUrl}/model?limit=999`;
    const endPointLine = `${apiBaseUrl}/line`;
    const endPointBomlist = `${apiBaseUrl}/bomlist?limit=999`;
    try {
      const result = await fetchWithAuth(endPoint);

      // console.log("endpoint model", result);
      if (result.error) {
        console.log(result.error);
      }

      const resultLine = await fetchWithAuth(endPointLine);
      // console.log("endpoint line", resultLine);
      if (resultLine.error) {
        console.log(resultLine.error);
      }

      // Batch (order_number) ditawarkan dari bomlist, bukan diketik bebas:
      // POST /registscan/post mencocokkan model + order_number ke bomlist,
      // jadi nilai di luar daftar ini akan ditolak "Batch tidak ada di bomlist".
      const resultBomlist = await fetchWithAuth(endPointBomlist);
      if (resultBomlist.error) {
        console.log(resultBomlist.error);
      }

      setModals(result.data || []);
      setLines(resultLine.data || []);
      setBomlist(Array.isArray(resultBomlist.data) ? resultBomlist.data : []);
      handleModel(result.data || []);
      // handleLine(resultLine.data || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValModel(newValue);

    // cek apakah value ada di option
    const valid = modals.some((item) => item.model === newValue);
    if (!valid) {
      console.warn("Input tidak sesuai option!");
    }
  };

  const handleChangeLines = (e) => {
    const newValue = e.target.value;
    setValLines(newValue);

    // cek apakah value ada di option
    const valid = lines.some((item) => item.line === newValue);
    if (!valid) {
      console.warn("Input tidak sesuai option!");
    }
  };

  const handleChangeBatch = (e) => {
    const newValue = e.target.value;
    setValBatch(newValue);

    // cek apakah value ada di option
    const valid = bomlist.some((item) => item.order_number === newValue);
    if (!valid) {
      console.warn("Input tidak sesuai option!");
    }
  };

  // Satu model dasar bisa punya beberapa baris master (IDU/ODU/CASSETTE),
  // jadi daftar rekomendasi di-dedupe ke model dasar saja.
  const uniqueModels = [
    ...new Set(modals.map((item) => item.model).filter(Boolean)),
  ];

  // unit_type yang tersedia untuk model terpilih (kosong = tanpa pembagian unit)
  const unitOptions = [
    ...new Set(
      modals
        .filter((item) => item.model === valModel)
        .map((item) => item.unit_type)
        .filter(Boolean),
    ),
  ];

  // rekomendasi yang difilter sesuai teks yang diketik (case-insensitive)
  const filteredModels = valModel
    ? uniqueModels.filter((model) =>
        model.toLowerCase().includes(valModel.toLowerCase()),
      )
    : uniqueModels;

  const filteredLines = valLines
    ? lines.filter((item) =>
        item.line?.toLowerCase().includes(valLines.toLowerCase()),
      )
    : lines;

  // Batch dari bomlist. Satu batch bisa punya beberapa baris BOM (IDU/ODU),
  // jadi di-dedupe. Kalau model sudah dipilih, daftar dibatasi ke batch model
  // itu — sama dengan pasangan model + order_number yang dicek backend.
  const uniqueBatches = [
    ...new Set(
      bomlist
        .filter(
          (item) =>
            !valModel ||
            item.model?.trim().toUpperCase() === valModel.trim().toUpperCase(),
        )
        .map((item) => item.order_number)
        .filter(Boolean),
    ),
  ];

  const filteredBatches = valBatch
    ? uniqueBatches.filter((batch) =>
        batch.toLowerCase().includes(valBatch.toLowerCase()),
      )
    : uniqueBatches;

  // Tipe unit mengikuti model terpilih: kalau modelnya hanya punya satu tipe,
  // langsung dipakai; kalau tidak punya tipe (mis. Washing Machine),
  // dikosongkan supaya tidak ikut terkirim.
  //
  // Dijaga sampai master model termuat: kalau tidak, pada halaman edit nilai
  // unit_type dari initialData sempat terhapus sebelum data datang.
  // Tipe unit untuk model terpilih = irisan antara unit_type yang ada di baris
  // master model dan yang sah menurut kategorinya (dari /meta/categories).
  //
  // Dijaga sampai master model termuat: kalau tidak, pada halaman edit nilai
  // unit_type dari initialData sempat terhapus sebelum data datang.
  useEffect(() => {
    if (modals.length === 0) return;
    const rows = modals.filter((item) => item.model === valModel);
    if (rows.length === 0) return;

    const allowed = new Set(rows.map((item) => item.unit_type).filter(Boolean));
    for (const cat of Object.keys(categories ?? {})) {
      if (rows.some((item) => item.product === cat)) {
        const catUnits = unitTypesFor(categories, cat);
        if (catUnits.length === 0) {
          // kategori tanpa pembagian unit: unit_type dikosongkan
          setValUnitType("");
          return;
        }
        for (const unit of catUnits) allowed.add(unit);
      }
    }

    const options = [...allowed];
    if (options.length === 1) setValUnitType(options[0]);
    else if (options.length === 0) setValUnitType("");
    // lebih dari satu pilihan -> biarkan pilihan user / initialData
  }, [valModel, modals, categories]);

  useEffect(() => {
    if (load) {
      fetchModel();
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser).id);
    }
  }, []);
  return (
    <div className="w-full py-2">
      <div className="flex w-full">
        <form
          action=""
          onSubmit={onSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          className=""
        >
          <div className="flex justify-between gap-2">
            <BtnBack url="/registscan" />
            <button type="submit" className="btn btn-outline btn-info">
              Save
            </button>
          </div>
          <hr className="my-4" />
          <div className="grid gap-6 w-full grid-cols-3">
            <div className="hidden">
              <label htmlFor="" className="font-medium text-[18px]">
                PIC
              </label>
              <input
                className="border-b-2 border-indigo-500 w-full text-[14px] focus:outline-none"
                defaultValue={user || ""}
                type="text"
                name="userid"
                required
              />
            </div>

            <div>
              <label htmlFor="" className="font-medium text-[18px]">
                Model
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="model"
                  className="input w-full"
                  placeholder="ketik model..."
                  value={valModel}
                  onChange={handleChange}
                  onFocus={() => setShowModelList(true)}
                  onBlur={() => setTimeout(() => setShowModelList(false), 150)}
                  autoComplete="off"
                />
                {showModelList && filteredModels.length > 0 && (
                  <ul className="absolute z-30 w-full max-h-52 overflow-y-auto bg-white border border-indigo-200 rounded-md shadow-lg mt-1">
                    {filteredModels.slice(0, 20).map((model) => (
                      <li
                        key={model}
                        onMouseDown={() => {
                          setValModel(model);
                          setShowModelList(false);
                        }}
                        className="px-3 py-2 text-[14px] cursor-pointer hover:bg-indigo-100"
                      >
                        {model}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {unitOptions.length > 0 && (
              <div>
                <label htmlFor="" className="font-medium text-[18px]">
                  Unit Type
                </label>
                <select
                  name="unit_type"
                  className="select select-bordered w-full"
                  value={valUnitType}
                  onChange={(e) => setValUnitType(e.target.value)}
                  required
                >
                  <option value="">Pilih unit type</option>
                  {unitOptions.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="" className="font-medium text-[18px]">
                Line
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="subline"
                  className="input w-full"
                  placeholder="ketik line..."
                  value={valLines}
                  onChange={handleChangeLines}
                  onFocus={() => setShowLineList(true)}
                  onBlur={() => setTimeout(() => setShowLineList(false), 150)}
                  autoComplete="off"
                />
                {showLineList && filteredLines.length > 0 && (
                  <ul className="absolute z-30 w-full max-h-52 overflow-y-auto bg-white border border-indigo-200 rounded-md shadow-lg mt-1">
                    {filteredLines.slice(0, 20).map((item) => (
                      <li
                        key={item.id}
                        onMouseDown={() => {
                          setValLines(item.line);
                          setShowLineList(false);
                        }}
                        className="px-3 py-2 text-[14px] cursor-pointer hover:bg-indigo-100"
                      >
                        {item.line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="" className="font-medium text-[18px]">
                Batch
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="order_number"
                  className="input w-full"
                  placeholder="ketik batch..."
                  value={valBatch}
                  onChange={handleChangeBatch}
                  onFocus={() => setShowBatchList(true)}
                  onBlur={() => setTimeout(() => setShowBatchList(false), 150)}
                  autoComplete="off"
                  required
                />
                {showBatchList && filteredBatches.length > 0 && (
                  <ul className="absolute z-30 w-full max-h-52 overflow-y-auto bg-white border border-indigo-200 rounded-md shadow-lg mt-1">
                    {filteredBatches.slice(0, 20).map((batch) => (
                      <li
                        key={batch}
                        onMouseDown={() => {
                          setValBatch(batch);
                          setShowBatchList(false);
                        }}
                        className="px-3 py-2 text-[14px] cursor-pointer hover:bg-indigo-100"
                      >
                        {batch}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {[
              {
                name: "po_number",
                label: "PO NUMBER",
                type: "text",
                placeholder: "po number",
                initialData: initialData.po_number,
                require: true,
              },
              {
                name: "plan",
                label: "PLAN",
                type: "number",
                placeholder: "plan",
                initialData: initialData.plan,
                require: true,
              },
              {
                name: "shift",
                label: "SHIFT",
                type: "number",
                placeholder: "shift",
                initialData: initialData.shift,
                require: true,
              },
              {
                name: "sn",
                label: "Serial Number",
                type: "text",
                placeholder: "serial number",
                initialData: initialData.sn,
                require: false,
              },
              {
                name: "pcb_odu",
                label: "PCB ODU",
                type: "text",
                placeholder: "sn pcb odu",
                initialData: initialData.pcb_odu,
                require: false,
              },
              {
                name: "pcb_wm",
                label: "PCB WM",
                type: "text",
                placeholder: "sn pcb wm",
                initialData: initialData.pcb_wm,
                require: false,
              },
              {
                name: "frame_pcb",
                label: "FRAME PCB",
                type: "text",
                placeholder: "sn frame pcb",
                initialData: initialData.frame_pcb,
                require: false,
              },
              {
                name: "sn_motor",
                label: "MOTOR",
                type: "text",
                placeholder: "sn motor",
                initialData: initialData.sn_motor,
                require: false,
              },
              {
                name: "pcb_idu",
                label: "PCB IDU",
                type: "text",
                placeholder: "sn pcb indoor",
                initialData: initialData.pcb_idu,
                require: false,
              },
              {
                name: "sn_carton",
                label: "CARTON",
                type: "text",
                placeholder: "sn carton",
                initialData: initialData.sn_carton,
                require: false,
              },
              {
                name: "sn_accessories",
                label: "ACCESSORIES",
                type: "text",
                placeholder: "accessories",
                initialData: initialData.sn_accessories,
                require: false,
              },
            ].map((item) => {
              return (
                <div key={item.name}>
                  <label htmlFor="" className="font-medium text-[18px]">
                    {item.label}
                  </label>
                  <input
                    className="border-b-2 border-indigo-500 w-full text-[14px] focus:outline-none"
                    type={item.type}
                    placeholder={item.placeholder}
                    name={item.name}
                    defaultValue={item.initialData}
                    required={item.require}
                  />
                </div>
              );
            })}
          </div>
        </form>
      </div>
    </div>
  );
}
