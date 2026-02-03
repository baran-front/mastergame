"use client";

import { useSearchParams } from "next/navigation";
import SelectSearchParamsFilter from "../modules/selectSearchParamsFilter";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import * as SelectPrimitive from "@radix-ui/react-select";

const REGION_OPTIONS = [
  { label: "ایران", value: "IRAN" },
  { label: "آمریکا", value: "USA" },
  { label: "آلمان", value: "GERMANY" },
  { label: "فرانسه", value: "FRANCE" },
];

function ProductsRegionSelect({ className, ...props }: ComponentProps<typeof SelectPrimitive.Trigger>) {
  const searchParams = useSearchParams();
  const hasGiftCardCategory = searchParams.get("category") === "80360";

  return hasGiftCardCategory ? (
    <SelectSearchParamsFilter
      searchParamsKey="region"
      options={REGION_OPTIONS}
      placeholder="ریجن کشور..."
      className={cn("w-full", className)}
      {...props}
    />
  ) : null;
}

export default ProductsRegionSelect;
