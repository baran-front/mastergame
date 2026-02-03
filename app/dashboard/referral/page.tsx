import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, UsersIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationEllipsis,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import Link from "next/link";
import Image from "next/image";
import notifyImg from "@/public/images/notify.png";
import { getMe, getProfileDateByRepresentativeDate } from "@/lib/fetchs";
import SetRepresentativeButton from "@/components/templates/setRepresentativeButton";
import { cookies } from "next/headers";
import CopyInput from "@/components/modules/copyInput";

function formatDateYYYYMMDD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function DashboardReferralPage() {
  const token = (await cookies()).get("token")?.value || "";
  const user = await getMe({ token });

  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 30);

  const { result: referralResult } = await getProfileDateByRepresentativeDate({
    token,
    fromDate: formatDateYYYYMMDD(fromDate),
    toDate: formatDateYYYYMMDD(toDate),
  });

  const referralList = (Array.isArray(referralResult?.data) ? referralResult.data : []) as Record<
    string,
    unknown
  >[];

  return (
    <>
      <div className="card flex items-center space-y-0 justify-between gap-3 mb-6 lg:hidden">
        <h1 className="title">دعوت از دوستان</h1>
        <Link href={"/dashboard"}>
          <Button variant={"outline"} size={"icon"}>
            <ChevronLeftIcon />
          </Button>
        </Link>
      </div>

      <div className="card flex items-center max-md:flex-col gap-3 p-6 space-y-0">
        <div className="flex items-center gap-3">
          <UsersIcon className="size-10" />
          <div>
            <p className="text-xs opacity-50">کد دعوت از دوستان</p>
            <p className="title mt-1.5">{referralList.length} نفر</p>
          </div>
        </div>
        <div className="flex items-center max-sm:flex-col-reverse gap-3 md:mr-auto max-md:w-full">
          <SetRepresentativeButton />
          <div className="h-9 w-px bg-foreground/10 max-sm:hidden" />
          <CopyInput className="max-md:flex-1 md:w-72" copyValue={user.result?.representative || ""} />
        </div>
      </div>

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead className="bg-card rounded-r-lg">ردیف</TableHead>
            <TableHead className="bg-card">نام و نام خانوادگی</TableHead>
            <TableHead className="bg-card">زمان عضویت</TableHead>
            <TableHead className="bg-card rounded-l-lg">
              امتیاز دریافتی
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referralList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>
                <div className="flex flex-col items-center justify-center py-6">
                  <Image
                    width={150}
                    height={100}
                    src={notifyImg}
                    alt="لیست دعوت از دوستان خالی است"
                  />
                  <p className="title">لیست خالی است</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            referralList.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="title">{index + 1}</TableCell>
                <TableCell>
                  {String(
                    item.fullName ??
                    ([item.firstName, item.lastName].filter(Boolean).join(" ") || "—")
                  )}
                </TableCell>
                <TableCell>
                  {item.createDate || item.registerDate
                    ? new Date(String(item.createDate || item.registerDate)).toLocaleDateString("fa")
                    : "—"}
                </TableCell>
                <TableCell>
                  {typeof item.score === "number"
                    ? item.score
                    : typeof item.point === "number"
                      ? item.point
                      : "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {referralList.length > 0 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

export default DashboardReferralPage;
