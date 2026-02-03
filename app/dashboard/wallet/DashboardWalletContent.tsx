"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next/client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, TextAlignCenterIcon, WalletIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardWalletChargeButton from "@/components/templates/wallet/dashboardWalletChargeButton";
import DashboardWalletWithdrawalButton from "@/components/templates/wallet/dashboardWalletWithdrawalButton";
import {
  getTransactionWalletTotal,
  getTransactionWalletHistory,
} from "@/lib/fetchs";
import SpPagination from "@/components/modules/spPagination";
import Link from "next/link";

function DashboardWalletContent() {
  const token = getCookie("token") || "";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = +(searchParams?.get("pageNumber") || "1") || 1;
  const sortBy = searchParams?.get("sortBy") || "newest";
  const [filter, setFilter] = useState<"all" | "increase" | "decrease">("all");
  const pageSize = 10;

  // Convert sortBy to orderBy format for API
  const orderBy = sortBy === "newest" ? ["createdOn desc"] : ["createdOn asc"];

  // Handle sort change
  const handleSortChange = (value: string) => {
    const sp = new URLSearchParams(searchParams?.toString());
    sp.set("sortBy", value);
    router.push(`${pathname}?${sp.toString()}`);
  };

  const { data: walletTotalData, isLoading: isLoadingWalletTotal } = useQuery({
    queryKey: ["wallet-total"],
    queryFn: () => getTransactionWalletTotal({ token }),
    enabled: !!token,
  });

  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["wallet-history", orderBy],
    queryFn: () => getTransactionWalletHistory({ token, orderBy }),
    enabled: !!token,
  });

  const walletTotal = walletTotalData?.result?.data?.[0]?.price || 0;
  const transactions = historyData?.result?.data || [];

  // Filter transactions based on selected filter
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "increase") return transaction.price > 0;
    if (filter === "decrease") return transaction.price < 0;
    return true;
  });

  // Paginate transactions
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fa-IR");
    } catch {
      return dateString;
    }
  };

  // Format transaction type
  const getTransactionType = (price: number) => {
    return price > 0 ? "افزایشی" : "کاهشی";
  };

  // Get transaction type color
  const getTransactionTypeColor = (price: number) => {
    return price > 0 ? "bg-green-500" : "bg-red-500";
  };
  return (
    <>
      <div className="card flex items-center space-y-0 justify-between gap-3 mb-6 lg:hidden">
        <h1 className="title">کیف پول</h1>
        <Link href={"/dashboard"}>
          <Button variant={"outline"} size={"icon"}>
            <ChevronLeftIcon />
          </Button>
        </Link>
      </div>

      <div className="card flex items-center max-md:flex-col gap-3 space-y-0">
        <div className="flex items-center gap-3">
          <WalletIcon className="size-10" />
          <div>
            <p className="text-xs opacity-50">دارایی کیف پول</p>
            <p className="title mt-1.5">
              {isLoadingWalletTotal ? (
                <span className="opacity-50">در حال بارگذاری...</span>
              ) : (
                `${walletTotal.toLocaleString("fa")} ریال`
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center max-sm:flex-col gap-3 md:mr-auto max-md:w-full">
          <DashboardWalletWithdrawalButton />
          <DashboardWalletChargeButton />
        </div>
      </div>

      <div className="flex items-center md:justify-between max-md:flex-col gap-3 mt-6">
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(value) => {
            if (value) {
              setFilter(value as "all" | "increase" | "decrease");
            }
          }}
          className="max-md:w-full max-md:[&_button]:flex-1/3"
        >
          <ToggleGroupItem value="all">همه</ToggleGroupItem>
          <ToggleGroupItem value="decrease">کاهشی</ToggleGroupItem>
          <ToggleGroupItem value="increase">افزایشی</ToggleGroupItem>
        </ToggleGroup>

        <Select dir="rtl" value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="max-md:w-full">
            <TextAlignCenterIcon />
            <SelectValue placeholder="مرتب سازی بر اساس" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="newest">جدیدترین</SelectItem>
              <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead className="bg-card rounded-r-lg">ردیف</TableHead>
            <TableHead className="bg-card">جزئیات</TableHead>
            <TableHead className="bg-card">شناسه پرداخت</TableHead>
            <TableHead className="bg-card">زمان پرداخت</TableHead>
            <TableHead className="bg-card">مبلغ</TableHead>
            <TableHead className="bg-card rounded-l-lg">نوع تراکنش</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoadingHistory ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <span className="opacity-50">در حال بارگذاری...</span>
              </TableCell>
            </TableRow>
          ) : paginatedTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <span className="opacity-50">تراکنشی یافت نشد</span>
              </TableCell>
            </TableRow>
          ) : (
            paginatedTransactions.map((transaction, index) => (
              <TableRow key={transaction.userCartId || index}>
                <TableCell className="title">
                  {(page - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell>
                  {transaction.title || transaction.description || "-"}
                </TableCell>
                <TableCell>
                  {transaction.cartId || transaction.userCartId || "-"}
                </TableCell>
                <TableCell>{formatDate(transaction.createdOn)}</TableCell>
                <TableCell>
                  {transaction.price.toLocaleString("fa")} ریال
                </TableCell>
                <TableCell>
                  <p className="flex items-center gap-3 py-1.5 px-3 border rounded-md w-max">
                    <span
                      className={`size-2 rounded-full ${getTransactionTypeColor(
                        transaction.price
                      )}`}
                    />
                    <span>{getTransactionType(transaction.price)}</span>
                  </p>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <SpPagination
        className="mt-6"
        totalPages={totalPages}
        pageSize={pageSize}
        pageParamName="pageNumber"
      />
    </>
  );
}

export default DashboardWalletContent;

