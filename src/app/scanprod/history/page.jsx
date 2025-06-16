import { Suspense } from "react";
import HistoryScanClient from "./HistoryClient";

export default function HistoryScanPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex justify-center item-center">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      }
    >
      <HistoryScanClient />
    </Suspense>
  );
}
