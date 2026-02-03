import { PropsWithChildren } from "react";
import DashboardSidebar from "@/components/templates/dashboardSidebar";

function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="wrapper grid grid-cols-1 lg:grid-cols-12 my-6 lg:mt-14 gap-6">
      <div className="col-span-3 h-max sticky top-26 max-lg:hidden">
        <DashboardSidebar />
      </div>
      <main className="lg:col-span-9">{children}</main>
    </div>
  );
}

export default DashboardLayout;
