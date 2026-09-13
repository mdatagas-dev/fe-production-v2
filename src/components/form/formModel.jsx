"use client";

import BtnBack from "../btn/btnBack";
import { useCategories, categoryNames, unitTypesFor } from "@/lib/categories";
import { useEffect, useState } from "react";

// model disimpan sebagai model dasar, tanpa akhiran (IDU)/(ODU) — tipe unit
// ada di kolom unit_type sendiri.
const FIELDS = [
  { label: "Brand", name: "brand", placeholder: "Brand", type: "text" },
  {
    label: "Model",
    name: "model",
    placeholder: "Model dasar, tanpa (IDU)/(ODU)",
    type: "text",
  },
  { label: "PK", name: "pk", placeholder: "pk", type: "number", step: "any" },
  {
    label: "Image Link",
    name: "linkimage",
    placeholder: "Image Link",
    type: "text",
  },
];

export default function FormModel({ onSubmit, initialData = {} }) {
  const { categories, error: catError } = useCategories();
  const names = categoryNames(categories);
  const [product, setProduct] = useState(initialData.product ?? "");
  const [unitType, setUnitType] = useState(initialData.unit_type ?? "");
  const unitOptions = unitTypesFor(categories, product);
  // Kategori menentukan unit_type yang sah, jadi form belum boleh disimpan
  // sebelum daftarnya siap.
  const notReady = Boolean(catError) || !categories;

  // Halaman edit memuat datanya async; form terisi begitu datanya tiba.
  useEffect(() => {
    setProduct(initialData.product ?? "");
    setUnitType(initialData.unit_type ?? "");
  }, [initialData.product, initialData.unit_type]);

  // Kategori berganti -> unit_type lama bisa jadi tidak sah, jadi direset
  const handleProduct = (e) => {
    setProduct(e.target.value);
    setUnitType("");
  };

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between w-full">
        <BtnBack url="/modeltv" />
        <button className="btn btn-info" disabled={notReady}>
          Save
        </button>
      </div>

      {catError && <p className="text-[12px] text-red-500">{catError}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="" className="font-medium text-[18px]">
            Product
          </label>
          <select
            name="product"
            value={product}
            onChange={handleProduct}
            required
            disabled={notReady}
            className="input w-full"
          >
            <option value="" disabled>
              Pilih product
            </option>
            {names.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="" className="font-medium text-[18px]">
            Unit Type
          </label>
          {unitOptions.length > 0 ? (
            <select
              name="unit_type"
              value={unitType}
              onChange={(e) => setUnitType(e.target.value)}
              required
              className="input w-full"
            >
              <option value="" disabled>
                Pilih unit type
              </option>
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          ) : (
            <>
              {/* Kategori tanpa pembagian unit (mis. Washing Machine) */}
              <input
                type="text"
                value="(tidak ada)"
                readOnly
                className="input w-full bg-gray-100"
              />
              <input type="hidden" name="unit_type" value="" />
            </>
          )}
        </div>

        {FIELDS.map((field) => (
          <div key={field.name}>
            <label htmlFor="" className="font-medium text-[18px]">
              {field.label}
            </label>
            <input
              className="border-b-2 border-indigo-500 w-full text-[14px] focus:outline-none"
              type={field.type}
              step={field.step}
              name={field.name}
              placeholder={field.placeholder}
              defaultValue={initialData[field.name] ?? ""}
            />
          </div>
        ))}
      </div>
    </form>
  );
}
