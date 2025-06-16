import { Suspense } from "react";
import RegistScanClient from "./RegistScanClient";

export default function RegistScanPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex justify-center item-center">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      }
    >
      <RegistScanClient />
    </Suspense>
  );
}
