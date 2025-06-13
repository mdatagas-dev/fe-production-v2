"use client";

import BtnBack from "../btn/btnBack";

export default function FormBomlistPage({ onSubmit, initialData = {} }) {
  const field = [
    {
      label: "Order Number",
      name: "order_number",
      placeholder: "order number",
      defaultValue: initialData.order_number,
    },
    {
      label: "Model",
      name: "model",
      placeholder: "model",
      defaultValue: initialData.model,
    },
    {
      label: "Panel 2",
      name: "panel2",
      placeholder: "panel 2",
      defaultValue: initialData.panel2,
    },
    {
      label: "Backplane",
      name: "bplane",
      placeholder: "backplane",
      defaultValue: initialData.bplane,
    },
    {
      label: "Open Cell",
      name: "open_cell",
      placeholder: "open cell",
      defaultValue: initialData.open_cell,
    },
    {
      label: "Front Cover",
      name: "front_cover",
      placeholder: "front cover",
      defaultValue: initialData.front_cover,
    },
    {
      label: "Mainboard",
      name: "mainboard",
      placeholder: "mainboard",
      defaultValue: initialData.mainboard,
    },
    {
      label: "Powerboard",
      name: "powerboard",
      placeholder: "powerboard",
      defaultValue: initialData.powerboard,
    },
    {
      label: "T-Con",
      name: "t_con",
      placeholder: "t-con",
      defaultValue: initialData.t_con,
    },
    {
      label: "Accessories",
      name: "sn_accessories",
      placeholder: "accessories",
      defaultValue: initialData.sn_accessories,
    },
    {
      label: "Remote Control",
      name: "remote_control",
      placeholder: "remote control",
      defaultValue: initialData.remote_control,
    },
    {
      label: "Bracket",
      name: "bracket",
      placeholder: "bracket",
      defaultValue: initialData.bracket,
    },
    {
      label: "Stand",
      name: "stand",
      placeholder: "stand",
      defaultValue: initialData.stand,
    },
    {
      label: "Carton",
      name: "carton",
      placeholder: "carton",
      defaultValue: initialData.carton,
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
              />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}
