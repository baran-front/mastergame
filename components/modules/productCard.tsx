"use client";

import { ComponentProps } from "react";
import Link, { LinkProps } from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ProductT } from "@/types/api.types";
import Image from "next/image";
import { brand } from "@/brand";
import BookmarkProductButton from "../templates/bookmarkProductButton";

function ProductCard({
  className,
  product,
  isSpecialOffer = false,
  ...p
}: Omit<LinkProps, "href"> &
  Omit<ComponentProps<"a">, "href"> & { product?: ProductT, isSpecialOffer?: boolean }) {
  // const jsonExt = JSON.parse(product?.jsonExt || "{}");

  // const platfroms = jsonExt.platfroms as string[] | undefined;
  // const platfroms = (jsonExt.platfroms as string[] | undefined) || [
  //   "/uploads/learn/9df528de9a5d422ead3f62cbee1e7e1e.webp",
  //   "/uploads/learn/9732c9d9972c4af4ad8a4e03e9333049.webp",
  // ];

  return (
    <Link
      href={`/products/${product?.id}`}
      className={cn("card card-hover block group", isSpecialOffer ? "bg-white text-black" : "hover:bg-transparent", className)}
      {...p}
    >
      <div className="card-thumbnail relative">
        <Image
          width={373}
          height={210}
          className="size-full"
          alt={product?.name || ""}
          src={brand.apiBaseUrl + (product?.masterImage || "")}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="font-yekan-bakh-bold">{product?.name}</p>
        {product && (
          <BookmarkProductButton
            variant={"unstyled"}
            className="hover:bg-foreground/5"
            product={product}
          />
        )}
      </div>
      {product && (
        <div className="flex items-center gap-3">
          {(() => {
            const hasDiscount = (product.discountPercent || 0) > 0;
            const masterPrice = product.masterPrice || 0;
            const discountAmount = hasDiscount
              ? Math.floor((masterPrice * (product.discountPercent || 0)) / 100)
              : 0;
            const displayPrice = Math.max(masterPrice - discountAmount, 0);
            return (
              <>
                <span className="font-yekan-bakh-bold text-secondary">
                  {displayPrice.toLocaleString("fa")} تومان
                </span>
                {hasDiscount && (
                  <>
                    <span className={cn("bg-primary p-1 rounded text-xs not-dark:text-background", isSpecialOffer ? "text-white" : "")}>
                      {product.discountPercent}%
                    </span>
                    <span className={cn("line-through text-xs mr-auto", isSpecialOffer ? "text-black/50" : "text-foreground/60")}>
                      {masterPrice.toLocaleString("fa")} تومان
                    </span>
                  </>
                )}
              </>
            );
          })()}
        </div>
      )}
      <Button
        variant={"unstyled"}
        className={cn("w-full font-yekan-bakh-bold max-lg:in-[.swiper-slide-active]:bg-primary max-lg:in-[.swiper-slide-active]:text-white group-hover:bg-primary group-hover:text-white", isSpecialOffer ? "bg-primary/20 text-primary" : "bg-foreground/10")}
      >
        <span>جزئیات</span>
        <ArrowLeftIcon />
      </Button>
    </Link>
  );
}

export default ProductCard;
