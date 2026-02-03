import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeftIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import notifyImg from "@/public/images/notify.png";
import Image from "next/image";
import { cookies } from "next/headers";
import { searchTickets } from "@/lib/fetchs";
import SpPagination from "@/components/modules/spPagination";
import { NextPageProps } from "@/types/app.types";

async function DashboardSupportPage({ searchParams }: NextPageProps) {
  const sp = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  const pageNumber = +(sp.pageNumber || "NaN") || 1;

  const ticketsData = token
    ? await searchTickets({
      token,
      pageNumber,
      pageSize: 10,
      orderBy: [""],
    })
    : null;

  const tickets = ticketsData?.result?.data?.data || [];
  const isEmpty = tickets.length === 0;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("fa");
    } catch {
      return dateString;
    }
  };

  const getStatusText = (status: number) => {
    // Assuming status 1 or similar means open, 0 or other means closed
    return status === 1 ? "باز" : "بسته شده";
  };

  const getStatusClass = (status: number) => {
    return status === 1 ? "text-green-500" : "opacity-50";
  };

  return (
    <>
      <div className="card flex items-center space-y-0 justify-between gap-3 mb-6 lg:hidden">
        <h1 className="title">پشتیبانی آنلاین</h1>
        <Link href={"/dashboard"}>
          <Button variant={"outline"} size={"icon"}>
            <ChevronLeftIcon />
          </Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-card rounded-r-lg">ردیف</TableHead>
            <TableHead className="bg-card">موضوع</TableHead>
            <TableHead className="bg-card">زمان ثبت</TableHead>
            <TableHead className="bg-card">پیام شما</TableHead>
            <TableHead className="bg-card rounded-l-lg">وضعیت</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex flex-col items-center justify-center py-6">
                  <Image
                    width={150}
                    height={100}
                    src={notifyImg}
                    alt="تیکت ثبت نشده است"
                  />
                  <p className="title">هنوز تیکت ثبت نشده است</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket, index) => (
              <TableRow key={ticket.id}>
                <TableCell className="title">
                  {(pageNumber - 1) * 10 + index + 1}
                </TableCell>
                <TableCell>
                  <Link className="underline" href={`/dashboard/support/${ticket.id}`}>
                    {ticket.subject}
                  </Link>
                </TableCell>
                <TableCell>{formatDate(ticket.createdOn)}</TableCell>
                <TableCell>
                  {ticket.lastMessage
                    ? ticket.lastMessage.slice(0, 32) + "..."
                    : "-"}
                </TableCell>
                <TableCell>
                  <span className={getStatusClass(ticket.status)}>
                    {getStatusText(ticket.status)}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center sm:justify-between max-sm:flex-col-reverse gap-3 mt-6">
        <Link className="max-sm:w-full" href={"/dashboard/support/new"}>
          <Button className="max-sm:w-full">
            <PlusIcon />
            <span>تیکت جدید</span>
          </Button>
        </Link>

        {ticketsData?.result?.data && (
          <SpPagination
            totalPages={ticketsData.result.data.totalPages}
            totalCount={ticketsData.result.data.totalCount}
            pageSize={ticketsData.result.data.pageSize}
            pageParamName="pageNumber"
          />
        )}
      </div>
    </>
  );
}

export default DashboardSupportPage;
