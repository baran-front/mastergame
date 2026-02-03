"use client";

import { getMenuLinksByGroup } from "@/lib/fetchs";
import { useQuery } from "@tanstack/react-query";
import { CSSProperties, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/brand";

function Socials() {
  const { data: socials, isSuccess } = useQuery({
    queryKey: ["links-by-social"],
    queryFn: () => getMenuLinksByGroup({ groupnames: "social" }),
  });

  useEffect(() => {
    if (!isSuccess) return;

    const all = document.querySelectorAll(".glow");

    const handleMouseMove = (ev: MouseEvent) => {
      all?.forEach((itemEv) => {
        const blob = itemEv.querySelector(".glow-blob") as HTMLElement;
        const fakeBlob = itemEv.querySelector(".glow-fake-blob") as HTMLElement;
        const rec = fakeBlob?.getBoundingClientRect();
        if (blob) {
          blob.style.opacity = "1";
          blob.animate(
            [
              {
                transform: `translate(${ev.clientX - (rec?.left || 0) - (rec?.width || 0) / 2
                  }px,${ev.clientY - (rec?.top || 0) - (rec?.height || 0) / 2
                  }px)`,
              },
            ],
            {
              duration: 300,
              fill: "forwards",
            }
          );
        }
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isSuccess]);

  return (
    <div className="wrapper mt-24 lg:mt-40">
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-x-9 gap-y-16">
        {socials?.result?.data?.map((item) => (
          <Link
            href={item.linkUrl || ""}
            target="_blank"
            className="relative"
            key={item.id}
          >
            <Image
              width={64}
              height={64}
              alt={item.name || ""}
              src={brand.apiBaseUrl + (item.imageUrl || "")}
              className="rounded-full ring-2 ring-card absolute z-20 bottom-full translate-1/2 left-1/2 -translate-x-1/2"
            />

            <div className="glow p-0 relative bg-background h-28 overflow-hidden group flex justify-center items-center rounded-2xl">
              <div className="glow-fake-blob bg-card absolute inset-0 size-full"></div>
              <div
                className="glow-blob absolute size-full glow-blob-bg-gradient-radial rounded-full opacity-0 pointer-events-none blur-xl transition-opacity duration-300 group-hover:opacity-20"
                style={{
                  ["--glow-color" as keyof CSSProperties]: item.description,
                }}
              ></div>

              <div className="relative z-10 size-[calc(100%-4px)] rounded-2xl bg-background/90 flex justify-center items-center flex-col">
                <p className="translate-y-1/2 font-yekan-bakh-bold">{item.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Socials;
