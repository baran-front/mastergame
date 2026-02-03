"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMenuLinksByGroup } from "@/lib/fetchs";
import { brand } from "@/brand";
import { useTheme } from "next-themes";

function Footer() {
  const pathname = usePathname();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  const { data: links } = useQuery({
    queryKey: ["links-by-footer"],
    queryFn: () => getMenuLinksByGroup({ groupnames: "footer" }),
  });

  const { data: socials } = useQuery({
    queryKey: ["links-by-social"],
    queryFn: () => getMenuLinksByGroup({ groupnames: "social" }),
  });

  if (pathname.includes("/dashboard")) {
    return null;
  }

  return (
    <footer className="wrapper mt-24 lg:mt-40 mb-6 lg:mb-8">
      <div className="bg-linear-to-bl from-secondary to-primary p-0.5 rounded-2xl">
        <div className="bg-card rounded-2xl p-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b">
            {links?.result?.data?.map((item) => (
              <div
                key={item.id}
                className="space-y-3 max-lg:flex max-lg:flex-col max-lg:items-center max-lg:justify-center"
              >
                <p className="title max-lg:text-center">{item.name}</p>
                {item.children.length ? (
                  <ul className="space-y-3">
                    {item.children.map((childItem) => (
                      <li className="max-lg:text-center" key={childItem.id}>
                        <Link href={childItem.linkUrl || ""}>
                          <Button variant={"ghostPrimary"}>
                            {childItem.name}
                          </Button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
            <div className="space-y-6 max-lg:flex max-lg:flex-col max-lg:items-center max-lg:justify-center">
              <div className="w-full flex items-center max-lg:justify-center gap-3">
                <div className="max-sm:w-full max-sm:aspect-square sm:size-16 rounded-lg bg-background"></div>
                <div className="max-sm:w-full max-sm:aspect-square sm:size-16 rounded-lg bg-background"></div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center flex-col gap-6 mt-12">
            {mounted && currentTheme ? (
              <Image
                width={58}
                height={56}
                alt={brand.name}
                src={
                  currentTheme === "light"
                    ? brand.logoImg.light
                    : brand.logoImg.dark
                }
              />
            ) : (
              <div className="h-14 w-[58px]" aria-hidden="true" />
            )}
            <p dir="ltr">@{new Date().getFullYear()} Master gamer website</p>
            <div className="flex items-center gap-6">
              {socials?.result?.data?.map((item) => (
                <Link
                  key={item.id}
                  href={item.linkUrl || ""}
                  className="outline-2 outline-offset-2 outline-transparent rounded-full transition-colors p-px hover:outline-primary"
                >
                  <Image
                    width={32}
                    height={32}
                    alt={item.name || ""}
                    className="rounded-full"
                    src={brand.apiBaseUrl + (item.imageUrl || "")}
                  />
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-center flex-wrap gap-3">
              {links?.result?.data
                ?.find((item) => item.name === "ارتباط با ما")
                ?.children.map((item) => (
                  <Link href={item.linkUrl || ""} key={item.id}>
                    <Button variant={"ghostPrimary"}>
                      {item.name}
                    </Button>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
