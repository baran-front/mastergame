import DashboardDesk from "@/components/templates/dashboardDesk"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"

function DashboardDeskPage() {
  return (
    <>
      <div className="card flex items-center space-y-0 justify-between gap-3 mb-6 lg:hidden">
        <h1 className="title">میز کاربری</h1>
        <Link href={"/dashboard"}>
          <Button variant={"outline"} size={"icon"}>
            <ChevronLeftIcon />
          </Button>
        </Link>
      </div>

      <DashboardDesk />
    </>
  )
}

export default DashboardDeskPage