"use client";
import SearchComp from "@/components/searching";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RepairPage() {
  const [modals, setModals] = useState([]);
  const [handleData, setHandleData] = useState([]);
  const fetchModel = async () => {
    const endPoint = `${apiBaseUrl}/model?limit=99999`;
    try {
      const result = await fetchWithAuth(endPoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setModals(result.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchData = async () => {
    const endPoint = `${apiBaseUrl}/repair/dashboard`;
    try {
      const result = await fetchWithAuth(endPoint);
      if (result.error) {
        console.log(result.error);
      }
      setHandleData(result.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    const endPoint = `${apiBaseUrl}/repair/post`;

    try {
      const result = await fetchWithAuth(endPoint, {
        method: "POST",
        headers: {
          "Conent-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (result.error) {
        console.log(result.error);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchModel();
    fetchData();
  }, []);

  console.log(handleData);
  return (
    <div className="w-full h-full flex flex-col gap-2 p-2">
      <div className="h-[10%]">
        <h3 className="font-semibold text-2xl">REPAIR</h3>
        <div className="flex justify-between w-full">
          <SearchComp />
          <div className="flex gap-2">
            {/* <label htmlFor="my_modal_6" className="btn btn-primary">
              Create
            </label> */}
            <Link
              href={"/repair/create/import"}
              className="btn bg-green-500 text-white"
            >
              Import
            </Link>
          </div>
        </div>
      </div>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Model</th>
              <th>ODF</th>
              <th>PO Number</th>
              <th>Repair</th>
              <th>Act</th>
            </tr>
          </thead>
          <tbody>
            {handleData?.length > 0 ? (
              handleData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.model}</td>
                    <td>{item.batch}</td>
                    <td>{item.po_number}</td>
                    <td>{item.total_repair}</td>
                    <td className="flex gap-2">
                      <Link
                        href={`/repair/detail/?model=${item.model}&po_number=${item.po_number}&batch=${item.batch}`}
                      >
                        <button className="btn">Data</button>
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Create Repair</h3>
          <div>
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4"
            >
              <div>
                <label htmlFor="" className="font-medium text-[16px]">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  className="input w-full"
                  list="browsers"
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
                <label htmlFor="" className="font-medium text-[16px]">
                  ODF
                </label>
                <input type="text" name="batch" className="input w-full" />
              </div>
              <div>
                <label htmlFor="" className="font-medium text-[16px]">
                  PO
                </label>
                <input type="text" name="po" className="input w-full" />
              </div>
              <div className="modal-action">
                <button className="btn" type="submit">
                  Submit
                </button>
                <label htmlFor="my_modal_6" className="btn">
                  Close
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
