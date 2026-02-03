"use client";

import Link from "next/link";
import {
  ChevronLeftIcon,
  BookmarkIcon,
  LayoutGridIcon,
  LogOutIcon,
  MessageCircleIcon,
  ShoppingBagIcon,
  UserIcon,
  UserPlusIcon,
  WalletIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { deleteCookie, getCookie } from "cookies-next/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { getMe } from "@/lib/fetchs";
import Image from "next/image";
import { brand } from "@/brand";

const LINKS = [
  { id: 1, name: "میز کاربری", href: "/dashboard/desk", icon: <LayoutGridIcon /> },
  {
    id: 2,
    name: "سفارش ها",
    href: "/dashboard/orders",
    icon: <ShoppingBagIcon />,
  },
  {
    id: 5,
    name: "کیف پول",
    href: "/dashboard/wallet",
    icon: <WalletIcon />,
  },
  {
    id: 6,
    name: "دعوت از دوستان",
    href: "/dashboard/referral",
    icon: <UserPlusIcon />,
  },
  {
    id: 7,
    name: "علاقه مندی ها",
    href: "/dashboard/favorites",
    icon: <BookmarkIcon />,
  },
  {
    id: 8,
    name: "پشتیبانی آنلاین",
    href: "/dashboard/support",
    icon: <MessageCircleIcon />,
  },
];

function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getMe({ token: getCookie("token") || "" }),
  });

  return (
    <aside className={cn("card", className)}>
      <Link
        href={"/dashboard/profile"}
        className={`flex items-center gap-3 p-3 transition-colors rounded-lg ${pathname.includes("/profile")
          ? "lg:bg-primary not-dark:text-background"
          : "lg:hover:bg-background group"
          }`}
      >
        {user?.result?.imageUrl
          ? <Image className="rounded-full" src={brand.apiBaseUrl + user.result.imageUrl} width={40} height={40} alt={user.result.firstName + user.result.lastName || ""} />
          : (
            <UserIcon className="size-5" />
          )}
        <p className="font-yekan-bakh-bold">فرزاد وحدتی</p>
        <ChevronLeftIcon className="size-5 mr-auto" />
      </Link>

      <p className="text-xs mt-6 opacity-50">منوی کاربری</p>
      <ul className="space-y-3 mt-3">
        {LINKS.map((link) => (
          <li className="block" key={link.id}>
            <Link className="block" href={link.href}>
              <Button
                variant={"unstyled"}
                className={cn(
                  "w-full",
                  pathname.endsWith(link.href)
                    ? "bg-primary not-dark:text-background"
                    : "border border-transparent hover:border-primary"
                )}
              >
                <span>
                  {link.icon}
                </span>
                <span>{link.name}</span>
                <ChevronLeftIcon className="mr-auto" />
              </Button>
            </Link>
          </li>
        ))}
      </ul>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant={"unstyled"}
            className="text-red-500 w-full justify-start hover:bg-red-500/10 mt-3"
          >
            <LogOutIcon />
            <span>خروج</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              آیا می خواهید از حساب کاربری خود خارج شوید؟
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteCookie("token");
                queryClient.invalidateQueries({ queryKey: ["user"] });
                router.replace("/");
              }}
            >
              بله
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}

export default DashboardSidebar;
