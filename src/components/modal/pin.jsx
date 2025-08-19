"use client";

import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const ModalPin = forwardRef((props, ref) => {
  const formRef = useRef(null);
  const dialogRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [resolver, setResolver] = useState(null);

  const openModal = () => {
    if (isOpen) return;
    formRef.current?.reset();
    return new Promise((resolve) => {
      setResolver(() => resolve);
      dialogRef.current?.showModal();
      setIsOpen(true);
    });
  };

  const closeModal = () => {
    dialogRef.current?.close();
    formRef.current?.reset();
    setResolver(null);
    setIsOpen(false);
  };

  // fungsi validasi pin
  const validatePin = async (e) => {
    e.preventDefault();
    const form = new FormData(formRef.current);
    const data = Object.fromEntries(form.entries());
    const endPoint = `${apiBaseUrl}/pin/compare`;

    try {
      const result = await fetchWithAuth(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (result.error) {
        resolver?.(false);
        closeModal();
        return false;
      }
      resolver?.(true); // reset setelah selesai
      closeModal();
      return true;
    } catch (error) {
      return false;
    }
  };

  // expose ke parent
  useImperativeHandle(ref, () => ({
    openModal,
    validatePin,
  }));

  const handleCancel = () => {
    resolver?.(false);
    closeModal();
  };

  return (
    <dialog
      ref={dialogRef}
      id="my_modal_6"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center">INSERT PIN</h3>
        <div className="modal-action flex flex-col">
          <form
            id="pinForm"
            onSubmit={validatePin}
            ref={formRef}
            method="dialog"
            className="flex flex-col gap-4 w-full"
          >
            <input
              autoFocus
              name="pin"
              type="password"
              className="input w-full"
            />
          </form>
          <div className="modal-action flex justify-between">
            <button type="button" className="btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" form="pinForm" className="btn">
              Submit
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
});

export default ModalPin;
