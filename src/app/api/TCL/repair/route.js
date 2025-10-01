const apiRepair = "https://api-gw-en-uat.tcl.com/tv-mes/ovs/repair-data-upload";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  const {
    orgCode,
    batch,
    barCode,
    defectCode,
    itemCode,
    boardCode,
    defectReason,
    changeFlag,
    collectDate,
  } = request.json();

  const fieldInput = {
    orgCode,
    batch,
    barCode,
    defectCode,
    itemCode,
    boardCode,
    defectReason,
    changeFlag,
    collectDate,
  };

  //   const result = await fetch(apiRepair, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "X-Agp-Appkey": "fb0a0ce5d1b04c5db4fdcc01b7122d1c",
  //     },
  //     body: JSON.stringify(fieldInput),
  //   });

  console.log(fieldInput);
}
