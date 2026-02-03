import Link from "next/link";
import { getMe } from "@/lib/fetchs";
import { getCookie } from "cookies-next/client";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { BookmarkIcon, ChevronDownIcon, LayoutGridIcon, UserCircleIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function HeaderProfileButton() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getMe({ token: getCookie("token") || "" }),
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="hidden lg:flex lg:items-center lg:gap-3 lg:hover:bg-card p-3 rounded-full bg-background">
          <UserCircleIcon className="size-5" />
          <p className="text-sm lg:transition-colors hidden lg:flex lg:items-center gap-1.5">
            <span>
              {user?.result?.firstName || "کاربر"}{" "}
              {user?.result?.lastName || "ناشناس"}
            </span>
            <ChevronDownIcon className="lg:size-5" />
          </p>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-3 [&_a]:block [&_button]:w-full [&_button]:justify-start [&_button]:gap-3" align="end">
        <Link className="max-lg:hidden!" href={"/dashboard/desk"}>
          <Button variant={"ghostPrimary"}>
            <LayoutGridIcon />
            <span>داشبورد</span>
          </Button>
        </Link>
        <Link className="lg:hidden!" href={"/dashboard"}>
          <Button variant={"ghostPrimary"}>
            <LayoutGridIcon />
            <span>داشبورد</span>
          </Button>
        </Link>
        <Link href={"/dashboard/favorites"}>
          <Button variant={"ghostPrimary"}>
            <BookmarkIcon />
            <span>علاقه مندی ها</span>
          </Button>
        </Link>
      </PopoverContent>
    </Popover>
  );
}

export default HeaderProfileButton;
