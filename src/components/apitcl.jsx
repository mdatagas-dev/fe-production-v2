export default async function Apitcl({
  country,
  defectCode,
  defectReason,
  orgCode,
  batch,
  barcode,
  boardBarcode,
  itemCode,
  collectDate,
}) {
  try {
    const result = await fetch(
      "https://api-gw-en-uat.tcl.com/tv-mes/ovs/production-data-upload",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Agp-Appkey": "fb0a0ce5d1b04c5db4fdcc01b7122d1c",
        },
        body: JSON.stringify({
          country,
          defectCode,
          defectReason,
          orgCode,
          batch,
          barcode,
          boardBarcode,
          itemCode,
          collectDate,
        }),
      }
    );
    console.log("Response from TCL API:", result);
  } catch (error) {
    console.log(error.message);
  }
}
