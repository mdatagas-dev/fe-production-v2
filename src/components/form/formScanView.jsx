"use client";
export default function FormScanView({ onSubmit, initialData = {} }) {
  return (
    <form action="" onSubmit={onSubmit} className=" ">
      <div className="grid grid-cols-3 gap-2 w-full">
        <div className="">
          <label htmlFor="">Line</label>
          <input
            name="line"
            type="text"
            className=" border-b-2 border-indigo-500 w-full focus:outline-none"
            placeholder="line 1 lcm"
            defaultValue={initialData.line || ""}
            required
          />
        </div>
        <div className="">
          <label htmlFor="">Model</label>
          <input
            name="model"
            type="text"
            className=" border-b-2 border-indigo-500 w-full focus:outline-none"
            placeholder="model.."
            defaultValue={initialData.model || ""}
            required
          />
        </div>
        <div>
          <label htmlFor="">SN</label>

          <select
            name="sn"
            defaultValue={initialData.sn || "OKE"}
            className="select"
          >
            <option disabled={true}>Select View</option>
            <option value="OKE">OKE</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Panel 2</label>
          <select
            name="panel2"
            defaultValue={initialData.panel2 || "OKE"}
            className="select"
          >
            <option disabled={true}>Select View</option>
            <option value="OKE">OKE</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Back Plane</label>
          <select
            name="bplane"
            defaultValue={initialData.bplane || "OKE"}
            className="select"
          >
            <option disabled={true}>Select View</option>
            <option value="OKE">OKE</option>
            <option value="NO">NO</option>
          </select>
        </div>

        <div>
          <label htmlFor="">Open Cell</label>

          <select
            name="open_cell"
            defaultValue={initialData.open_cell || "OKE"}
            className="select"
          >
            <option disabled={true}>Select View</option>
            <option value="OKE">OKE</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Front Cover</label>

          <select
            name="front_cover"
            defaultValue={initialData.front_cover || "OKE"}
            className="select"
          >
            <option disabled={true}>Select View</option>
            <option value="OKE">OKE</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Mainboard</label>

          <select
            name="mainboard"
            defaultValue={initialData.mainboard || "OKE"}
            className="select"
          >
            <option disabled={true}>Select View</option>
            <option value="OKE">OKE</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Powerboard</label>

          <select
            name="power_board"
            defaultValue={initialData.power_board || "OKE"}
            className="select"
          >
            <option disabled={true}>Select View</option>
            <option value="OKE">OKE</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div>
          <label htmlFor="">T-CON</label>

          <select
            name="t_con"
            defaultValue={initialData.t_con || "OKE"}
            className="select"
          >
            <option disabled={true}>Select View</option>
            <option value="OKE">OKE</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Accessories</label>

          <select
            name="sn_accessories"
            defaultValue={initialData.sn_accessories || "OKE"}
            className="select"
          >
            <option disabled={true}>Select View</option>
            <option value="OKE">OKE</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Remote Control</label>

          <select
            name="remote_control"
            defaultValue={initialData.remote_control || "OKE"}
            className="select"
          >
            <option disabled={true}>Select View</option>
            <option value="OKE">OKE</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Bracket</label>

          <select
            name="bracket"
            defaultValue={initialData.bracket || "OKE"}
            className="select"
          >
            <option disabled={true}>Select View</option>
            <option value="OKE">OKE</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Stand L</label>

          <select
            name="stand_l"
            defaultValue={initialData.srand_l || "OKE"}
            className="select"
          >
            <option disabled={true}>Select View</option>
            <option value="OKE">OKE</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Stand M</label>

          <select
            name="stand_m"
            defaultValue={initialData.stand_m || "OKE"}
            className="select"
          >
            <option disabled={true}>Select View</option>
            <option value="OKE">OKE</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Stand R</label>

          <select
            name="stand_r"
            defaultValue={initialData.stand_r || "OKE"}
            className="select"
          >
            <option disabled={true}>Select View</option>
            <option value="OKE">OKE</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Cartoon</label>

          <select
            name="pn_cartoon"
            defaultValue={initialData.pn_cartoon || "OKE"}
            className="select"
          >
            <option disabled={true}>Select View</option>
            <option value="OKE">OKE</option>
            <option value="NO">NO</option>
          </select>
        </div>
      </div>
      <button className="btn btn-outline btn-info w-full mt-4" type="submit">
        Save
      </button>
    </form>
  );
}
