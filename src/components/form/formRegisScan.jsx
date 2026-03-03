"use client";
import { useEffect, useState } from "react";
import BtnBack from "../btn/btnBack";
import { jwtDecode } from "jwt-decode";
import apiBaseUrl from "@/lib/urlEndPoint";
import fetchWithAuth from "@/lib/fetchWithAuth";

export default function FormRegist({
  handleModel,
  handleLine,
  onSubmit,
  initialData = {},
  load,
}) {
  const [user, setUser] = useState(null);
  const [modals, setModals] = useState([]);
  const [lines, setLines] = useState([]);
  const [valModel, setValModel] = useState(initialData.model || "");
  const [valLines, setValLines] = useState(initialData.subline || "");

  const fetchModel = async () => {
    const endPoint = `${apiBaseUrl}/model?limit=999`;
    const endPointLine = `${apiBaseUrl}/line`;
    try {
      const result = await fetchWithAuth(endPoint);
      if (result.error) {
        console.log(result.error);
      }

      const resultLine = await fetchWithAuth(endPointLine);
      if (resultLine.error) {
        console.log(resultLine.error);
      }

      setModals(result.data);
      setLines(resultLine.data);
      handleModel(result.data);
      handleLine(resultLine.data);
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    if (load) {
      fetchModel();
    }
    const token = sessionStorage.getItem("accessToken");
    const decode = jwtDecode(token);
    setUser(decode.id);
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
              <input
                type="text"
                name="model"
                className="input w-full"
                list="browsers"
                value={valModel}
                onChange={handleChange}
              />
              <datalist id="browsers">
                {modals.map((item) => {
                  return (
                    <option key={item.id} value={item.model}>
                      {item.model}
                    </option>
                  );
                })}
              </datalist>
            </div>

            <div>
              <label htmlFor="" className="font-medium text-[18px]">
                Line
              </label>
              <input
                type="text"
                name="subline"
                className="input w-full"
                list="lines"
                value={valLines}
                onChange={handleChangeLines}
              />
              <datalist id="lines">
                {lines.map((item) => {
                  return (
                    <option key={item.id} value={item.line}>
                      {item.line}
                    </option>
                  );
                })}
              </datalist>
            </div>
            {[
              {
                name: "order_number",
                label: "ORDER NUMBER",
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
