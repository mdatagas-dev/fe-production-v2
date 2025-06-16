"use client";

import BtnBack from "../btn/btnBack";

const FormUser = ({ onSubmit, initialData = {} }) => {
  const field = [
    {
      type: "text",
      label: "USERNAME",
      name: "username",
      placeholder: "username",
      defaultValue: initialData.username || "",
    },
    {
      type: "text",
      label: "DEPARTEMENT",
      name: "departement",
      placeholder: "departement",
      defaultValue: initialData.departement || "",
    },
    {
      type: "text",
      label: "SECTION",
      name: "section",
      placeholder: "section",
      defaultValue: initialData.section || "",
    },
    {
      type: "text",
      label: "ROLEUSER",
      name: "roleuser",
      placeholder: "roleuser",
      defaultValue: initialData.roleuser || "",
    },
    {
      type: "text",
      label: "EMAIL",
      name: "email",
      placeholder: "email",
      defaultValue: initialData.email || "",
    },
    {
      type: "text",
      label: "PASSWORD",
      name: "password",
      placeholder: !initialData.password ? "Password" : "New Password ?",
      defaultValue: initialData.password,
    },
  ];
  return (
    <form onSubmit={onSubmit} className="w-full gap-4 h-full flex flex-col">
      <div className="w-full flex justify-between">
        <BtnBack url="/auth/dashboard">Kembali</BtnBack>
        <button type="submit" className="btn btn-info w-fit">
          Submit
        </button>
      </div>
      {field.map((item, index) => (
        <div key={index}>
          <label htmlFor="" className="font-medium text-[18px]">
            {item.label}
          </label>
          <input
            className="border-b-2 border-indigo-500 w-full text-[14px] focus:outline-none"
            type={item.type}
            placeholder={item.placeholder}
            name={item.name}
            defaultValue={item.defaultValue}
          />
        </div>
      ))}
    </form>
  );
};

export default FormUser;
