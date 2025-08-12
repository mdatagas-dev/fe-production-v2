import { Suspense } from "react";
import ModelTVClient from "./ModelTVClient";

export default function ModelTVPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex justify-center item-center">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      }
    >
      <ModelTVClient />
    </Suspense>
  );
}
