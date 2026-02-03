import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

import notifyImg from "@/public/images/notify.png";
import SelectSearchParamsFilter from "@/components/modules/selectSearchParamsFilter";
import SpPagination from "@/components/modules/spPagination";
import { Button } from "@/components/ui/button";
import { searchOrders } from "@/lib/fetchs";
import { NextPageProps } from "@/types/app.types";

const FILTER_OPTIONS = [
  { label: "جدید ترین", value: "NEWEST" },
  { label: "قدیمی ترین", value: "OLDEST" },
];

const PAGE_SIZE = 10;

const STATUS_META: Record<
  number,
  {
    label: string;
    dotClass: string;
  }
> = {
  0: { label: "در انتظار پرداخت", dotClass: "bg-yellow-500" },
  1: { label: "در حال پردازش", dotClass: "bg-blue-500" },
  2: { label: "در حال ارسال", dotClass: "bg-sky-500" },
  3: { label: "تکمیل شده", dotClass: "bg-green-500" },
  4: { label: "لغو شده", dotClass: "bg-red-500" },
};

const getStatusMeta = (status: number) =>
  STATUS_META[status] ?? { label: "نامشخص", dotClass: "bg-muted-foreground" };

async function DashboardOrdersPage({ searchParams }: NextPageProps) {
  const sp = await searchParams;

  const pageNumber = +(sp.pageNumber || "1") || 1;
  const sortValue = sp.sort;

  const ordersResponse = await searchOrders({
    pageNumber,
    pageSize: PAGE_SIZE,
    orderBy: [sortValue || ""],
  });

  const orders = ordersResponse?.result?.data;

  const isEmpty = !orders?.length;

  return (
    <>
      <div className="card flex items-center space-y-0 justify-between gap-3 mb-6 lg:hidden">
        <h1 className="title">سفارشات</h1>
        <Link href={"/dashboard"}>
          <Button variant={"outline"} size={"icon"}>
            <ChevronLeftIcon />
          </Button>
        </Link>
      </div>

      <Suspense>
        <SelectSearchParamsFilter
          className="w-full lg:w-max"
          options={FILTER_OPTIONS}
          placeholder="مرتب سازی بر اساس"
          searchParamsKey="sort"
        />
      </Suspense>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <Image
            src={notifyImg}
            alt="سفارشی یافت نشد"
            width={200}
            height={150}
          />
          <p className="title mt-4">سفارشی یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-3 mt-6">
          {orders.map((order) => {
            const statusMeta = getStatusMeta(order.status);

            return (
              <div key={order.id} className="border-2 p-3 rounded-lg space-y-6">
                <div className="flex items-start max-sm:flex-col-reverse justify-between gap-3">
                  <div>
                    <p className="title">سفارش #{order.id}</p>
                    <p className="text-sm opacity-75 mt-1">
                      {order.orderItems
                        .map((item) => item.productName)
                        .join(", ")}
                    </p>
                  </div>
                  <p className="flex items-center gap-3 py-1.5 px-3 border text-xs rounded-md whitespace-nowrap">
                    <span
                      className={`size-1.5 rounded-full ${statusMeta.dotClass}`}
                    />
                    <span>{statusMeta.label}</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p>
                      {new Date(order.createOrderDate).toLocaleDateString(
                        "fa-IR"
                      )}
                    </p>
                    <p className="text-sm opacity-75">
                      {new Date(order.createOrderDate).toLocaleTimeString(
                        "fa-IR"
                      )}
                    </p>
                  </div>
                  <div>
                    <p>شماره سفارش</p>
                    <p className="text-sm opacity-75">{order.id}</p>
                  </div>
                  <div>
                    <p>مبلغ</p>
                    <p className="text-sm opacity-75">
                      {Math.max(order.totalPrice || 0, 0).toLocaleString(
                        "fa-IR"
                      )}{" "}
                      تومان
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {orders?.length || 0 > PAGE_SIZE ? (
        <SpPagination
          className="mt-8"
          totalPages={ordersResponse?.result?.totalPages || 0}
          totalCount={ordersResponse?.result?.totalCount || 0}
          pageSize={PAGE_SIZE}
        />
      ) : null}
    </>
  );
}

export default DashboardOrdersPage;
