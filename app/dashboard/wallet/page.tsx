import { Suspense } from "react";
import DashboardWalletContent from "./DashboardWalletContent";

function DashboardWalletPage() {
  return (
    <Suspense fallback={<div className="opacity-50">در حال بارگذاری...</div>}>
      <DashboardWalletContent />
    </Suspense>
  );
}

export default DashboardWalletPage;
