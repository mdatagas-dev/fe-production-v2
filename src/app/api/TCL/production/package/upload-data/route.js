import { NextResponse } from "next/server";
export async function POST(req, res) {
  const package_upload = await req.json();

  try {
    const result = await fetch(
      "https://api-gw-en-uat.tcl.com/tv-mes/ovs/package-data-upload",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Agp-Appkey": "fb0a0ce5d1b04c5db4fdcc01b7122d1c",
        },
        body: JSON.stringify({
          data: package_upload,
        }),
      },
    );
    const responseData = await result.json();

    if (responseData.msg !== "success") {
      return NextResponse.json(
        { error: "Failed to send data to TCL API", details: responseData },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Data successfully sent to TCL API",
        response: responseData,
        // response: { msg: "failed", success: false },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({
      error: "An error occurred while processing your request",
      details: error.message,
    });
  }
}
