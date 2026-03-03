"use client";

export default function FormRecordScanPage({
  snRef,
  validation,
  lastScan,
  onSubmit,
  register = {},
  initialData = {},
  loading,
}) {
  return (
    <div className="flex flex-col h-[90%] justify-center items-center">
      <form
        className="space-y-5 max-w-xl mx-auto"
        id="form-scan"
        onSubmit={onSubmit}
      >
        <input type="hidden" value={validation?.id ?? ""} name="id_regist" />
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
            autofocus: true,
          },
          {
            name: "pcb_idu",
            label: "PCB INDOOR",
            type: "text",
            defaultValue: initialData?.pcb_idu,
            lenValid: validation?.pcb_idu,
            autofocus: true,
          },
          {
            name: "sn_motor",
            label: "MOTOR",
            type: "text",
            defaultValue: initialData?.sn_motor,
            lenValid: validation?.sn_motor,
            autofocus: true,
          },
          {
            name: "sn_accessories",
            label: "ACCESSORIES",
            type: "text",
            defaultValue: initialData?.sn_accessories,
            lenValid: validation?.sn_accessories,
            autofocus: true,
          },
          {
            name: "sn_box",
            label: "BOX",
            type: "text",
            defaultValue: initialData?.sn_box,
            lenValid: validation?.sn_box,
            autofocus: true,
          },

          {
            name: "pn_carton",
            label: "PN Carton",
            type: "text",
            defaultValue: initialData?.pn_carton,
            lenValid: validation?.pn_carton,
            autofocus: true,
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
                  minLength={field?.lenValid ?? 0}
                  maxLength={field?.lenValid ?? 0}
                  className="input input-bordered w-full"
                  required={!!field?.lenValid}
                  autoFocus={field?.autofocus || false}
                />
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button
            type={`${loading ? "button" : "submit"} `}
            className={`btn ${loading ? "btn-disabled" : "btn-primary"} `}
            onFocus={() => {
              document.getElementById("form-scan").requestSubmit();
            }}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
