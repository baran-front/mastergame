"use client";

import Link from "next/link";
import { getMe, searchOrders, getBookmarks } from "@/lib/fetchs";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next/client";
import { ChevronLeftIcon } from "lucide-react";
import ProductCard from "@/components/modules/productCard";
import { ProductT } from "@/types/api.types";

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

function DashboardDesk({ className }: { className?: string }) {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getMe({ token: getCookie("token") || "" }),
  });

  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      searchOrders({
        pageNumber: 1,
        pageSize: 3,
        orderBy: [""],
      }),
  });

  const { data: bookmarksData } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks({ token: getCookie("token") || "" }),
  });

  const orders = ordersData?.result?.data || [];

  // Parse bookmarks from JSON string and get last 3
  const bookmarks: ProductT[] = (() => {
    try {
      const content = bookmarksData?.result?.data?.content;
      if (content) {
        const parsed = JSON.parse(content) as ProductT[];
        return parsed.slice(0, 3);
      }
    } catch {
      // If parsing fails, return empty array
    }
    return [];
  })();

  const now = new Date();
  const faPersian = "fa-IR-u-ca-persian";
  const day = new Intl.DateTimeFormat(faPersian, { day: "numeric" }).format(
    now
  );
  const weekday = new Intl.DateTimeFormat(faPersian, {
    weekday: "long",
  }).format(now);
  const month = new Intl.DateTimeFormat(faPersian, { month: "long" }).format(
    now
  );

  return (
    <div className={cn("space-y-12", className)}>
      {/* Welcome Section */}
      <div className="flex items-center max-sm:flex-col gap-3 sm:gap-6">
        <div className="size-20 rounded-full border-2 flex items-center justify-center heading">
          {day}
        </div>
        <p className="sm:leading-relaxed">
          {weekday}، <br className="max-sm:hidden" /> {month} ماه
        </p>
        <p className="font-yekan-bakh-bold sm:title sm:ps-6 sm:border-s-2 sm:leading-relaxed max-sm:text-center">
          {user?.result?.firstName || "کاربر"}{" "}
          {user?.result?.lastName || "ناشناس"} عزیز{" "}
          <br className="max-sm:hidden" /> به گیم مستر خوش آمدید!
        </p>
      </div>

      {/* Last Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="title">آخرین سفارشات</h2>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1 text-sm opacity-75 hover:opacity-100 transition-opacity"
          >
            مشاهده همه
            <ChevronLeftIcon className="size-4" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-sm opacity-75 text-center py-6">سفارشی یافت نشد</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const statusMeta = getStatusMeta(order.status);

              return (
                <div
                  key={order.id}
                  className="border-2 p-3 rounded-lg space-y-4"
                >
                  <div className="flex items-start max-sm:flex-col-reverse justify-between gap-3">
                    <div>
                      <p className="font-semibold">سفارش #{order.id}</p>
                      <p className="text-sm opacity-75 mt-1">
                        {order.orderItems
                          .map((item) => item.productName)
                          .join(", ")}
                      </p>
                    </div>
                    <p className="flex items-center gap-2 py-1.5 px-3 border text-xs rounded-md whitespace-nowrap">
                      <span
                        className={`size-1.5 rounded-full ${statusMeta.dotClass}`}
                      />
                      <span>{statusMeta.label}</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="opacity-75">تاریخ</p>
                      <p>
                        {new Date(order.createOrderDate).toLocaleDateString(
                          "fa-IR"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="opacity-75">شماره سفارش</p>
                      <p>{order.id}</p>
                    </div>
                    <div>
                      <p className="opacity-75">مبلغ</p>
                      <p>
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
      </div>

      {/* Last Favorites Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="title">آخرین علاقه مندی ها</h2>
          <Link
            href="/dashboard/favorites"
            className="flex items-center gap-1 text-sm opacity-75 hover:opacity-100 transition-opacity"
          >
            مشاهده همه
            <ChevronLeftIcon className="size-4" />
          </Link>
        </div>

        {bookmarks.length === 0 ? (
          <p className="text-sm opacity-75 text-center py-6">
            علاقه مندی ها خالی است
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardDesk;
