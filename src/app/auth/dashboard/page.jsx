import { Suspense } from "react";
import DashboardUserClient from "./dashboardClient";
export default function dashboardUserPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex justify-center item-center">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      }
    >
      <DashboardUserClient />
    </Suspense>
  );
}
