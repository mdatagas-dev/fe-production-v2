"use client";

import { useEffect, useState } from "react";
import BtnBack from "../btn/btnBack";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";

export default function FormBomlistPage({ onSubmit, initialData = {} }) {
  const [valModel, setValModel] = useState("");
  const [modals, setModals] = useState([]);

  // BOM dikunci oleh model dasar, sedangkan /model punya satu baris per tipe
  // unit (IDU/ODU/CASSETTE) — jadi pilihannya di-dedupe ke model dasar.
  const uniqueModels = [
    ...new Set(modals.map((item) => item.model).filter(Boolean)),
  ];

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValModel(newValue);

    // cek apakah value ada di option
    const valid = modals.some((item) => item.model === newValue);
    if (!valid) {
      console.warn("Input tidak sesuai option!");
    }
  };

  useEffect(() => {
    if (initialData?.model) {
      setValModel(initialData.model);
    }
    const endPointModel = `${apiBaseUrl}/model?limit=999`;
    const fetchModel = async () => {
      try {
        const result = await fetchWithAuth(endPointModel);
        if (result.error) {
          console.log(result.error);
        }
        setModals(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchModel();
  }, [initialData]);

  const field = [
    {
      label: "Order Number",
      name: "order_number",
      placeholder: "order number",
      defaultValue: initialData.order_number,
    },
    {
      label: "PO Number",
      name: "po_number",
      placeholder: "po number",
      defaultValue: initialData.po_number,
      required: true,
    },

    {
      label: "SN",
      name: "sn",
      placeholder: "Serial Number Unit",
      defaultValue: initialData.sn,
    },
    {
      label: "PCB IDU",
      name: "pcb_idu",
      placeholder: "sn pcb idu",
      defaultValue: initialData.pcb_idu,
    },
    {
      label: "PCB ODU",
      name: "pcb_odu",
      placeholder: "sn pcb odu",
      defaultValue: initialData.pcb_odu,
    },
    {
      label: "PCB WM",
      name: "pcb_wm",
      placeholder: "sn pcb wm",
      defaultValue: initialData.pcb_wm,
    },
    {
      label: "FRAME PCB",
      name: "frame_pcb",
      placeholder: "sn frame pcb",
      defaultValue: initialData.frame_pcb,
    },
    {
      label: "MOTOR",
      name: "sn_motor",
      placeholder: "sn motor",
      defaultValue: initialData.sn_motor,
    },
    {
      label: "ACCESSORIES",
      name: "sn_accessories",
      placeholder: "sn accessories",
      defaultValue: initialData.sn_accessories,
    },
    {
      label: "CARTON",
      name: "sn_carton",
      placeholder: "sn carton",
      defaultValue: initialData.sn_carton,
    },
  ];

  return (
    <div className="w-full h-full">
      <form
        action=""
        onSubmit={onSubmit}
        className="w-full flex flex-col gap-4"
      >
        <div className="flex justify-between w-full">
          <BtnBack url={`/bomlist`} />
          <button className="btn btn-info">Save</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="" className="font-medium text-[18px]">
              Model
            </label>
            <input
              type="text"
              name="model"
              className="input w-full"
              list="browsers"
              value={valModel}
              onChange={handleChange}
            />
            <datalist id="browsers">
              {uniqueModels.map((model) => (
                <option key={model} value={model} />
              ))}
            </datalist>
          </div>
          {field.map((field, index) => (
            <div key={index}>
              <label htmlFor="" className="font-medium text-[18px]">
                {field.label}
              </label>

              <input
                className="border-b-2 border-indigo-500 w-full text-[14px] focus:outline-none"
                type="text"
                name={field.name}
                placeholder={field.placeholder}
                defaultValue={field.defaultValue}
                required={field.required}
              />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}
