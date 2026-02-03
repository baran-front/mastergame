"use client";

import Image from "next/image";
import { CircleStarIcon, MessageSquareTextIcon } from "lucide-react";

import { brand } from "@/brand";
import ProductCounter from "@/components/templates/productCounter";
import ShareButton from "@/components/modules/shareButton";
import BookmarkProductButton from "@/components/templates/bookmarkProductButton";
import { ProductT } from "@/types/api.types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategoryDetail } from "@/lib/fetchs";

function parseSafeJson<T>(str: string | null | undefined, fallback: T): T {
  if (str == null || str === "") return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

function getImageSrc(path: string | null | undefined): string | null {
  const p = path?.trim();
  if (!p || !p.startsWith("/")) return null;
  return `${brand.apiBaseUrl}${p}`;
}

type ProductWithSpecs = ProductT & { specifications?: string };

function ProductDetail({ product }: { product: ProductT }) {
  const [currentProduct, setCurrentProduct] = useState<ProductT>(product);

  const categories = parseSafeJson<{ id: number }[]>(
    currentProduct.categories,
    []
  );
  const categoryId = categories[0]?.id;
  const { data: category } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => getCategoryDetail({ id: categoryId! }),
    enabled: categoryId != null,
  });

  const specifications = parseSafeJson<
    { title?: string; value?: string }[]
  >((currentProduct as ProductWithSpecs).specifications, []);
  const specificationLabels = specifications
    .map((s) => s.title ?? s.value)
    .filter((v): v is string => Boolean(v));

  const productImageSrc = getImageSrc(currentProduct.masterImage);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mt-6">
      <div className="lg:col-span-2">
        <h1 className="heading leading-relaxed lg:hidden">
          {currentProduct.name}
        </h1>
        {productImageSrc ? (
          <Image
            width={960}
            height={540}
            alt={currentProduct.name ?? ""}
            className="w-full aspect-video rounded-lg"
            src={productImageSrc}
          />
        ) : (
          <div className="w-full aspect-video rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            بدون تصویر
          </div>
        )}
      </div>

      <div className="lg:col-span-2 flex flex-col gap-6">
        <h1 className="heading leading-relaxed max-lg:hidden">
          {currentProduct.name}
        </h1>

        <div>
          <div className="flex items-center gap-1.5">
            <CircleStarIcon className="size-5" />
            <span>مناسب برای:</span>
          </div>
          <ul className="flex items-center gap-3 flex-wrap mt-3">
            {specificationLabels.map((item) => (
              <li
                key={item}
                className="rounded-lg bg-foreground/10 px-3 py-1.5 text-sm font-medium"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3 mt-3">
          {parseSafeJson<{ name: string; list: string[] }[]>(
            category?.result?.data?.description,
            []
          ).map((item, index) => (
            <div key={item.name}>
              <label htmlFor={item.name}>
                {item.name} <span className="text-red-500">*</span>
              </label>
              <Select
                dir="rtl"
                value={
                  (currentProduct[`r${index + 1}` as keyof ProductT] as
                    | string
                    | undefined) || undefined
                }
                onValueChange={(value) =>
                  setCurrentProduct({
                    ...currentProduct,
                    [`r${index + 1}` as keyof ProductT]: value,
                  })
                }
              >
                <SelectTrigger id={item.name} className="w-full mt-1.5 px-6">
                  <SelectValue placeholder={"انتخاب کنید"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {item.list.map((listItem) => (
                      <SelectItem key={listItem} value={listItem}>
                        {listItem}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col max-sm:flex-col-reverse gap-6">
        <div className="flex items-center justify-center sm:justify-end gap-3">
          <Link href="#comments">
            <Button variant={"ghost"}>
              <span>{currentProduct.commentsCount} نظر</span>
              <MessageSquareTextIcon />
            </Button>
          </Link>
          <div className="ps-3 border-s-2">
            <BookmarkProductButton product={currentProduct} variant={"ghost"} />
          </div>
          <ShareButton
            variant={"ghost"}
            title={currentProduct.name}
            text={`${currentProduct.name} - ${brand.name}`}
          />
        </div>

        <ProductCounter product={currentProduct} />
      </div>
    </div>
  );
}

export default ProductDetail;
