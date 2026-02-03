"use client";

import { ComponentProps, MouseEvent, useState } from "react";
import { BookmarkIcon, Loader, TrashIcon } from "lucide-react";

import { Button } from "../ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, getBookmarks } from "@/lib/fetchs";
import { getCookie } from "cookies-next/client";
import { ProductT } from "@/types/api.types";
import { toast } from "sonner";
import { useTransition } from "react";
import { postBookmark } from "@/lib/fetchs";
import { useLoginModal } from "@/components/providers/loginModalProvider";
import { usePathname, useRouter } from "next/navigation";

function BookmarkProductButton({
  product,
  ...props
}: ComponentProps<typeof Button> & { product: ProductT }) {
  const pathname = usePathname();
  const router = useRouter();

  const isDashboard = pathname.includes("dashboard");

  const [token] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return getCookie("token") || "";
  });

  const queryClient = useQueryClient();
  const { openModal } = useLoginModal();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getMe({ token }),
  });

  const { data: bookmarks } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks({ token }),
    select: (data) => {
      try {
        const content = data?.result?.data?.content || "[]";
        return JSON.parse(content) as ProductT[];
      } catch {
        return [] as ProductT[];
      }
    },
  });

  const hasProduct =
    bookmarks?.some((bookmark: ProductT) => bookmark.id === product.id) ??
    false;

  const [isPending, startTransition] = useTransition();

  const handleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    ev.stopPropagation();

    // Check if user is logged in
    if (!user?.result?.id) {
      openModal();
      return;
    }

    startTransition(async () => {
      if (!product || !user?.result?.id) return;

      const res = await postBookmark({
        token,
        userId: user.result.id,
        content: JSON.stringify(
          hasProduct
            ? bookmarks?.filter(
              (bookmark: ProductT) => bookmark.id !== product.id
            ) || []
            : [...(bookmarks || []), product]
        ),
      });

      if (res.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
        if (hasProduct) {
          router.refresh();
          toast.info("محصول از علاقه مندی ها حذف شد");
        } else {
          toast.success("محصول به علاقه مندی ها اضافه شد");
        }
      } else {
        toast.error("خطایی رخ داده است");
      }
    });
  };

  return (
    <Button
      size={"icon"}
      type="button"
      onClick={handleClick}
      disabled={isPending}
      {...props}
    >
      {isPending ? (
        <Loader className="animate-spin" />
      ) : isDashboard ? (
        <TrashIcon />
      ) : (
        <BookmarkIcon className={hasProduct ? "fill-foreground" : ""} />
      )}
    </Button>
  );
}

export default BookmarkProductButton;
