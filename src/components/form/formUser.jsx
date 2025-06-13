"use client";

import BtnBack from "../btn/btnBack";

const FormUser = ({ onSubmit, initialData = {} }) => {
  return (
    <form onSubmit={onSubmit} className="w-full gap-4 h-full flex flex-col">
      <div className="w-full flex justify-between">
        <BtnBack url="/auth/dashboard">Kembali</BtnBack>
        <button type="submit" className="btn btn-info w-fit">
          Submit
        </button>
      </div>
      <input
        className="input"
        type="text"
        placeholder="username"
        name="username"
        defaultValue={initialData.username || ""}
      />
      <input
        className="input"
        type="text"
        placeholder="departement"
        name="departement"
        defaultValue={initialData.departement || ""}
      />
      <input
        className="input"
        type="text"
        placeholder="section"
        name="section"
        defaultValue={initialData.section || ""}
      />
      <input
        className="input"
        type="text"
        placeholder="roleuser"
        name="roleuser"
        defaultValue={initialData.roleuser || ""}
      />
      <input
        className="input"
        type="text"
        placeholder="email"
        name="email"
        defaultValue={initialData.email || ""}
      />
      <input
        className="input"
        type="text"
        placeholder={!initialData.password ? "Password" : "New Password ?"}
        name="password"
        defaultValue={""}
      />
    </form>
  );
};

export default FormUser;
