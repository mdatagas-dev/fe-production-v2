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
      label: "BOX",
      name: "sn_box",
      placeholder: "sn box",
      defaultValue: initialData.sn_box,
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
