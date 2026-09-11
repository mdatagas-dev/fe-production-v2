"use client";
import React from "react";
export default function FormModel({ onsubmit }) {
  const field = [
    { label: "Brand", name: "brand", placeholder: "Brand", type: "text" },
    { label: "Model", name: "model", placeholder: "Model", type: "text" },
    {
      label: "Product",
      name: "product",
      placeholder: "Product",
      type: "text",
    },
    {
      label: "Category",
      name: "category",
      placeholder: "Category",
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
