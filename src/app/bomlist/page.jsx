import { Suspense } from "react";
import BomlistClient from "./bomlistClient";

export default function BomlistPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex justify-center item-center">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      }
    >
      <BomlistClient />
    </Suspense>
  );
}
