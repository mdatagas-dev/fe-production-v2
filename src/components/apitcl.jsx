export default async function Apitcl({
  country,
  orgCode,
  batch,
  barcode,
  panelsn,
  coresn,
  powerPanelSn,
  collectDate,
}) {
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
          country,
          orgCode,
          batch,
          barcode,
          panelsn,
          coresn,
          powerPanelSn,
          collectDate,
        }),
      }
    );
    console.log("Response from TCL API:", result);
  } catch (error) {
    console.log(error.message);
  }
}
