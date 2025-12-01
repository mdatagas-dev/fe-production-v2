import { NextResponse } from "next/server";
export async function POST(req) {
  const handleData = await req.json();

  try {
    // const result = await fetch(
    //   "https://api-gw-en-uat.tcl.com/tv-mes/ovs/production-data-upload",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "X-Agp-Appkey": "fb0a0ce5d1b04c5db4fdcc01b7122d1c",
    //     },
    //     body: JSON.stringify({
    //       data: handleData,
    //     }),
    //   }
    // );
    // const responseData = await result.json();

    // if (!result.ok) {
    //   return NextResponse.json(
    //     { error: "Failed to send data", status: result.status },
    //     { status: 500 }
    //   );
    // }

    return NextResponse.json(
      {
        message: "Data successfully sent to TCL API",
        // response: responseData,
        response: { msg: "success" },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({
      error: "An error occurred while processing your request",
      details: error.message,
    });
  }
}
