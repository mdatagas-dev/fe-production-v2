"use client";

import { useEffect, useRef } from "react";

function SuccessIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-8 w-8 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-12 w-12 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function SuccessToast({ message }) {
  return (
    <div className="toast toast-top toast-center z-50 w-full max-w-xl p-4 motion-safe:animate-[scan-toast-in_180ms_ease-out]">
      <div
        aria-atomic="true"
        aria-live="polite"
        className="alert alert-success alert-soft gap-4 px-6 py-5 shadow-xl"
        role="status"
      >
        <SuccessIcon />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold">Scan berhasil</h2>
          <p className="break-words text-base">{message}</p>
        </div>
      </div>
    </div>
  );
}

function ErrorDialog({ message, onDismiss }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();

    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      aria-describedby="scan-error-description"
      aria-labelledby="scan-error-title"
      className="modal backdrop:bg-black/55"
      onCancel={(event) => event.preventDefault()}
      ref={dialogRef}
      role="alertdialog"
    >
      <div className="modal-box max-w-2xl bg-transparent p-0 shadow-none">
        <div className="alert alert-error alert-soft alert-vertical w-full gap-6 px-8 py-8 shadow-2xl motion-safe:animate-[scan-dialog-in_180ms_ease-out] sm:alert-horizontal">
          <ErrorIcon />
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold" id="scan-error-title">
              Scan gagal
            </h2>
            <p
              className="mt-1 break-words text-lg"
              id="scan-error-description"
            >
              {message}
            </p>
          </div>
          <button
            autoFocus
            className="btn btn-error btn-lg min-w-32"
            onClick={onDismiss}
            type="button"
          >
            OK
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default function ScanFeedback({ type, message, onDismiss }) {
  if (!type || !message) return null;

  return type === "error" ? (
    <ErrorDialog message={message} onDismiss={onDismiss} />
  ) : (
    <SuccessToast message={message} />
  );
}
