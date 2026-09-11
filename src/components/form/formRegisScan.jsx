"use client";
import { useEffect, useState } from "react";
import BtnBack from "../btn/btnBack";
import apiBaseUrl from "@/lib/urlEndPoint";
import fetchWithAuth from "@/lib/fetchWithAuth";

export default function FormRegist({
  handleModel,

  onSubmit,
  initialData = {},
  load,
}) {
  const [user, setUser] = useState(null);
  const [modals, setModals] = useState([]);
  const [lines, setLines] = useState([]);
  const [showModelList, setShowModelList] = useState(false);
  const [showLineList, setShowLineList] = useState(false);
  const [valModel, setValModel] = useState(initialData.model || "");
  const [valLines, setValLines] = useState(initialData.subline || "");

  const fetchModel = async () => {
    const endPoint = `${apiBaseUrl}/model?limit=999`;
    const endPointLine = `${apiBaseUrl}/line`;
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

      setModals(result.data || []);
      setLines(resultLine.data || []);
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

  // rekomendasi yang difilter sesuai teks yang diketik (case-insensitive)
  const filteredModels = valModel
    ? modals.filter((item) =>
        item.model?.toLowerCase().includes(valModel.toLowerCase()),
      )
    : modals;

  const filteredLines = valLines
    ? lines.filter((item) =>
        item.line?.toLowerCase().includes(valLines.toLowerCase()),
      )
    : lines;

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
                    {filteredModels.slice(0, 20).map((item) => (
                      <li
                        key={item.id}
                        onMouseDown={() => {
                          setValModel(item.model);
                          setShowModelList(false);
                        }}
                        className="px-3 py-2 text-[14px] cursor-pointer hover:bg-indigo-100"
                      >
                        {item.model}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

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
            {[
              {
                name: "order_number",
                label: "BATCH",
                type: "text",
                placeholder: "order number",
                initialData: initialData.order_number,
                require: true,
              },
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
                name: "sn_box",
                label: "BOX",
                type: "text",
                placeholder: "sn box",
                initialData: initialData.sn_box,
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
