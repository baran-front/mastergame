import Link from "next/link";
import { MenuIcon, XIcon } from "lucide-react";

import { Button } from "../../ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
  SheetTitle,
} from "../../ui/sheet";
import { MenuLinkT } from "@/types/api.types";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { brand } from "@/brand";
import { useQuery } from "@tanstack/react-query";
import { getMenuLinksByGroup, getMe } from "@/lib/fetchs";
import { getCookie } from "cookies-next/client";
import HeaderLoginButton from "./headerLoginButton";
import { useTheme } from "next-themes";

function HeaderMobileSheet({
  links,
  handleActiveLink,
}: {
  handleActiveLink: (link: string) => boolean;
  links: MenuLinkT[];
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const { data: socials } = useQuery({
    queryKey: ["links-by-social"],
    queryFn: () => getMenuLinksByGroup({ groupnames: "social" }),
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getMe({ token: getCookie("token") || "" }),
  });

  useEffect(() => {
    queueMicrotask(() => {
      setIsOpen(false);
    })
  }, [pathname]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="lg:hidden" asChild>
        <Button variant="ghost" size={"icon"}>
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-3" side="left">
        <SheetTitle className="sr-only">منوی اصلی</SheetTitle>
        <div className="flex items-center justify-between gap-3 pb-4 mb-3 border-b">
          {currentTheme ? (
            <Image
              width={50}
              height={50}
              alt={brand.name}
              src={
                currentTheme === "light"
                  ? brand.logoImg.light
                  : brand.logoImg.dark
              }
            />
          ) : null}
          <Button
            size={"icon"}
            variant="ghost"
            className="mr-auto"
            onClick={() => setIsOpen(false)}
          >
            <XIcon />
          </Button>
        </div>

        {user?.status !== 200 ? <HeaderLoginButton variant={"unstyled"} className="border hover:text-primary hover:border-primary" /> : null}

        {links.map((item) => (
          <Link className="block" href={item.linkUrl || ""} key={item.name}>
            <Button
              className={`w-full ${handleActiveLink(item.linkUrl || "")
                ? ""
                : "border hover:text-primary hover:border-primary"
                }`}
              variant={
                handleActiveLink(item.linkUrl || "") ? "default" : "unstyled"
              }
            >
              {item.name}
            </Button>
          </Link>
        ))}

        {user?.status === 200 ? (
          <>
            <div className="flex items-center gap-3 my-1.5">
              <span className="text-xs opacity-75">حساب کاربری</span>
              <div className="flex-1 h-px bg-card"></div>
            </div>

            <Link className="block" href={"/dashboard"}>
              <Button
                className={`w-full ${handleActiveLink("/dashboard/")
                  ? ""
                  : "border hover:text-primary hover:border-primary"
                  }`}
                variant={
                  handleActiveLink("/dashboard/") ? "default" : "unstyled"
                }
              >
                <span>داشبورد</span>
              </Button>
            </Link>
            <Link className="block" href={"/dashboard/favorites"}>
              <Button
                className={`w-full ${handleActiveLink("/dashboard/favorites")
                  ? ""
                  : "border hover:text-primary hover:border-primary"
                  }`}
                variant={
                  handleActiveLink("/dashboard/favorites") ? "default" : "unstyled"
                }
              >
                <span>علاقه مندی ها</span>
              </Button>
            </Link>
            <Link className="block" href={"/cart"}>
              <Button
                className={`w-full ${handleActiveLink("/cart")
                  ? ""
                  : "border hover:text-primary hover:border-primary"
                  }`}
                variant={
                  handleActiveLink("/cart") ? "default" : "unstyled"
                }
              >
                <span>سبد خرید</span>
              </Button>
            </Link>
          </>
        ) : null}

        <SheetFooter className="pb-3">
          <div className="flex items-center justify-evenly gap-3">
            {socials?.result?.data?.map((item) => (
              <Link href={item.linkUrl || ""} key={item.id}>
                <Image
                  width={36}
                  height={36}
                  alt={item.name || ""}
                  src={
                    brand.apiBaseUrl +
                    (item.imageUrl || "")
                  }
                />
              </Link>
            ))}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default HeaderMobileSheet;
