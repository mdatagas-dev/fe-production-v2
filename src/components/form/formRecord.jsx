"use client";

export default function FormRecordScanPage({
  snRef,
  validation,
  lastScan,
  onSumbit,
  bomlist,
  initialData = {},
}) {
  return (
    <div className="flex flex-col h-[90%] justify-center items-center">
      <form
        className="space-y-5 max-w-xl mx-auto"
        id="form-scan"
        onSubmit={onSumbit}
      >
        <input type="hidden" value={validation?.id} name="id_regist" />
        <div className="flex items-center gap-4">
          <label htmlFor="" className="w-40 font-medium">
            Last Scan
          </label>
          <input
            type="text"
            className="input w-full"
            disabled
            value={lastScan?.sn ?? ""}
          />
        </div>
        {[
          {
            name: "sn",
            label: "Serial Number",
            type: "text",
            lenValid: validation?.sn,
            defaultValue: initialData?.sn,
            ref: snRef,
          },
          {
            name: "panel2",
            label: "Panel 2",
            type: "text",
            defaultValue: initialData?.panel2,
            lenValid: validation?.panel2,
          },
          {
            name: "bplane",
            label: "Backplane",
            type: "text",
            defaultValue: initialData?.bplane,
            lenValid: validation?.bplane,
          },
          {
            name: "open_cell",
            label: "Open Cell",
            type: "text",
            defaultValue: initialData?.open_cell,
            lenValid: validation?.open_cell,
          },
          {
            name: "front_cover",
            label: "Front Cover",
            type: "text",
            defaultValue: initialData?.front_cover,
            lenValid: validation?.front_cover,
          },
          {
            name: "mainboard",
            label: "Mainboard",
            type: "text",
            defaultValue: initialData?.mainboard,
            lenValid: validation?.mainboard,
          },
          {
            name: "powerboard",
            label: "Powerboard",
            type: "text",
            defaultValue: initialData?.powerboard,
            lenValid: validation?.powerboard,
          },
          {
            name: "t_con",
            label: "T-Con",
            type: "text",
            defaultValue: initialData?.t_con,
            lenValid: validation?.t_con,
          },
          {
            name: "pn_carton",
            label: "PN Carton",
            type: "text",
            defaultValue: initialData?.pn_carton,
            lenValid: validation?.pn_carton,
          },
          {
            name: "sn_accessories",
            label: "Accessories",
            type: "text",
            defaultValue: initialData?.sn_accessories,
            lenValid: validation?.sn_accessories,
          },
          {
            name: "remote_control",
            label: "Remote Control",
            type: "text",
            defaultValue: initialData?.remote_control,
            lenValid: validation?.remote_control,
          },
          {
            name: "bracket",
            label: "Bracket",
            type: "text",
            defaultValue: initialData?.bracket,
            lenValid: validation?.bracket,
          },
          {
            name: "stand_l",
            label: "Stand L",
            type: "text",
            defaultValue: initialData?.stand_l,
            lenValid: validation?.stand_l,
          },
          {
            name: "stand_m",
            label: "Stand M",
            type: "text",
            defaultValue: initialData?.stand_m,
            lenValid: validation?.stand_m,
          },
          {
            name: "stand_r",
            label: "Stand R",
            type: "text",
            defaultValue: initialData?.stand_r,
            lenValid: validation?.stand_l,
          },
        ].map((field) => (
          <div key={field.name}>
            <div
              className={`flex items-center gap-4 ${
                field.lenValid ? "" : "hidden"
              }`}
            >
              <label htmlFor={field.name} className="w-40 font-medium">
                {field.label}
              </label>
              <div className="w-full">
                <input
                  ref={field?.ref ?? null}
                  type={field?.type ?? "text"}
                  name={field?.name ?? ""}
                  id={field?.name ?? ""}
                  defaultValue={field?.defaultValue ?? ""}
                  minLength={field?.lenValid.length ?? 0}
                  className="input input-bordered w-full"
                  required={!!field?.lenValid}
                  autoFocus={!!field?.autofocus}
                />
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            onFocus={() => {
              document.getElementById("form-scan").requestSubmit();
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
