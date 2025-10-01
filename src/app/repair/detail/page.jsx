import { Suspense } from "react";
import DetailRepair from "./DetailRepair";

export default function HistoryScanPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex justify-center item-center">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      }
    >
      <DetailRepair />
    </Suspense>
  );
}
