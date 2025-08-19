"use client";

import BtnBack from "@/components/btn/btnBack";
import ModalConfirm from "@/components/modal/modal";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailBomlistPage() {
  const [dataResult, setDataResult] = useState([]);
  const params = useParams();
  const id = params.id;

  const endPoint = `${apiBaseUrl}/bomlist?keyword=${id}`;
  const fetchData = async () => {
    try {
      const result = await fetchWithAuth(endPoint);
      if (result.error) {
        console.log(result.error);
      }
      setDataResult(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (dataResult?.length <= 0) {
    <div className="w-full h-full flex justify-center items-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  var field = {};
  dataResult.map((item) => {
    field = [
      {
        label: "Model",
        value: item.model,
      },
      {
        label: "Order Number",
        value: item.order_number,
      },
      {
        label: "Panel 2",
        value: item.panel2,
      },
      {
        label: "Backplane",
        value: item.bplane,
      },
      {
        label: "Open Cell",
        value: item.open_cell,
      },
      {
        label: "Front Cover",
        value: item.front_cover,
      },
      {
        label: "Mainboard",
        value: item.mainboard,
      },
      {
        label: "Power Board",
        value: item.powerboard,
      },
      {
        label: "T-Con",
        value: item.t_con,
      },
      {
        label: "Accessories",
        value: item.sn_accessories,
      },
      {
        label: "Remote Control",
        value: item.remote_control,
      },
      {
        label: "Bracket",
        value: item.bracket,
      },
      {
        label: "Stand",
        value: item.stand,
      },
      {
        label: "Carton",
        value: item.carton,
      },
    ];
  });
  return (
    <div className="w-full py-2 px-4">
      <div className="w-full flex justify-between p">
        <BtnBack url={`/bomlist`} />
        <ModalConfirm
          endpoint={`${apiBaseUrl}/bomlist/delete/${id}`}
          urlBack={`/bomlist`}
        />
      </div>
      <div className="w-full grid grid-cols-2 gap-4 ">
        {dataResult.length >= 1 ? (
          field.map((item, index) => {
            return (
              <div key={index}>
                <label htmlFor="" className="font-semibold text-[18px]">
                  {item.label}
                </label>
                <p className="text-[16px]">{item.value ? item.value : "-"}</p>
              </div>
            );
          })
        ) : (
          <div>Data Kosong </div>
        )}
      </div>

      <div>Detail Page Bomlist</div>
    </div>
  );
}
