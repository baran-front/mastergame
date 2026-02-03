"use client";

import Link, { LinkProps } from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "../ui/button";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { brand } from "@/brand";
import { ProductT } from "@/types/api.types";

function GiftCard({
  className,
  product,
  ...p
}: Omit<LinkProps, "href"> &
  Omit<ComponentProps<"a">, "href"> & { product: ProductT }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className={cn("card card-hover block hover:bg-transparent group", className)}
      {...p}
    >
      <div className="w-full aspect-video">
        <Image
          width={373}
          height={210}
          alt={product.name || ""}
          className="size-full rounded-lg object-cover"
          src={brand.apiBaseUrl + (product.masterImage || "")}
        />
      </div>
      <div className="flex items-center justify-between mt-3">
        <p className="title">{product.name}</p>
        <Button
          size={"icon"}
          variant={"unstyled"}
          className="bg-foreground/5 shadow group-hover:bg-primary group-hover:text-white"
        >
          <ArrowLeftIcon />
        </Button>
      </div>
    </Link>
  );
}

export default GiftCard;
