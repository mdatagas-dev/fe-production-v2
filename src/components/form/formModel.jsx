"use client";
import React, { useState } from "react";
import {
  useCategories,
  categoryNames,
  unitTypesFor,
} from "@/lib/categories";

export default function FormModel({ onsubmit }) {
  const { categories, error: catError } = useCategories();
  const names = categoryNames(categories);
  const [product, setProduct] = useState("");
  const [unitType, setUnitType] = useState("");
  const unitOptions = unitTypesFor(categories, product);

  const field = [
    { label: "Brand", name: "brand", placeholder: "Brand", type: "text" },
    {
      label: "Model",
      name: "model",
      placeholder: "Model dasar, tanpa (IDU)/(ODU)",
      type: "text",
    },
    { label: "PK", name: "pk", placeholder: "pk", type: "decimal" },
    {
      label: "Image Link",
      name: "linkimage",
      placeholder: "Image Link",
      type: "text",
    },
  ];

  const handleModal = () => {
    document.getElementById("my_modal_5").close();
  };

  // Kategori menentukan unit_type yang sah, jadi pilihan lama direset
  const handleProduct = (e) => {
    setProduct(e.target.value);
    setUnitType("");
  };

  // Kategori diambil dari backend; form menunggu datanya siap
  if (catError) {
    return (
      <div>
        <button className="btn btn-active btn-success py-2" disabled>
          Add
        </button>
        <p className="text-[12px] text-red-500">{catError}</p>
      </div>
    );
  }

  return (
    <div>
      <button
        className="btn btn-active btn-success py-2"
        onClick={() => document.getElementById("my_modal_5").showModal()}
      >
        Add
      </button>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Tambah Model</h3>
          <form onSubmit={onsubmit}>
            <table className="table w-full">
              <tbody className="flex flex-col gap-4">
                <tr>
                  <td className="pr-4">Product</td>
                  <td className="w-full">
                    <select
                      name="product"
                      value={product}
                      onChange={handleProduct}
                      required
                      disabled={names.length === 0}
                      className="text-center font-semibold border-b-2 border-black w-full p-2"
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
                  </td>
                </tr>
                <tr>
                  <td className="pr-4">Unit Type</td>
                  <td className="w-full">
                    {unitOptions.length > 0 ? (
                      <select
                        name="unit_type"
                        value={unitType}
                        onChange={(e) => setUnitType(e.target.value)}
                        required
                        className="text-center font-semibold border-b-2 border-black w-full p-2"
                      >
                        <option value="">Pilih unit type</option>
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
                          className="text-center font-semibold border-b-2 border-black w-full p-2 bg-gray-100"
                        />
                        <input type="hidden" name="unit_type" value="" />
                      </>
                    )}
                  </td>
                </tr>
                {field.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="pr-4">{item.label}</td>
                      <td className="w-full">
                        <input
                          type={item.type}
                          name={item.name}
                          pattern="^[^,]*$" // tidak boleh mengandung koma
                          className="text-center font-semibold border-b-2 border-black w-full p-2"
                          placeholder={item.placeholder}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-between items-center">
              <button type="button" className="btn" onClick={handleModal}>
                Close
              </button>
              <button type="submit" className="btn btn-primary mt-4 ">
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
