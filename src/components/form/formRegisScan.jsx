"use client";
import { useEffect, useRef, useState } from "react";
import BtnBack from "../btn/btnBack";
import { jwtDecode } from "jwt-decode";

export default function FormRegist({ onSubmit, initialData = {} }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
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
            {[
              {
                name: "model",
                label: "Model",
                type: "text",
                placeholder: "model",
                initialData: initialData.model,
                require: true,
              },
              {
                name: "order_number",
                label: "ORDER NUMBER",
                type: "text",
                placeholder: "order number",
                initialData: initialData.order_number,
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
                name: "subline",
                label: "SUBLINE",
                placeholder: "example: line 1 assy input",
                type: "text",
                initialData: initialData.subline,
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
                name: "panel2",
                label: "PANEL 2",
                type: "text",
                placeholder: "panel 2",
                initialData: initialData.panel2,
                require: false,
              },
              {
                name: "bplane",
                label: "BACKPLANE",
                type: "text",
                placeholder: "backplane",
                initialData: initialData.bplane,
                require: false,
              },
              {
                name: "open_cell",
                label: "OPEN CELL",
                type: "text",
                placeholder: "open cell",
                initialData: initialData.open_cell,
                require: false,
              },
              {
                name: "front_cover",
                label: "FRONT COVER",
                type: "text",
                placeholder: "front cover",
                initialData: initialData.front_cover,
                require: false,
              },
              {
                name: "mainboard",
                label: "MAINBOARD",
                type: "text",
                placeholder: "mainboard",
                initialData: initialData.mainboard,
                require: false,
              },
              {
                name: "powerboard",
                label: "POWERBOARD",
                type: "text",
                placeholder: "powerboard",
                initialData: initialData.powerboard,
                require: false,
              },
              {
                name: "t_con",
                label: "T-CON",
                type: "text",
                placeholder: "t-con",
                initialData: initialData.t_con,
                require: false,
              },
              {
                name: "pn_carton",
                label: "PN CARTON",
                type: "text",
                placeholder: "pn carton",
                initialData: initialData.pn_carton,
                require: false,
              },
              {
                name: "remote_control",
                label: "REMOTE CONTROL",
                type: "text",
                placeholder: "remote control",
                initialData: initialData.remote_control,
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
              {
                name: "bracket",
                label: "BRACKET",
                type: "text",
                placeholder: "bracket",
                initialData: initialData.bracket,
                require: false,
              },
              {
                name: "stand_l",
                label: "STAND L",
                type: "text",
                placeholder: "stand L",
                initialData: initialData.stand_l,
                require: false,
              },
              {
                name: "stand_m",
                label: "STAND M",
                type: "text",
                placeholder: "stand M",
                initialData: initialData.stand_m,
                require: false,
              },
              {
                name: "stand_r",
                label: "STAND R",
                type: "text",
                placeholder: "stand R",
                initialData: initialData.stand_r,
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
