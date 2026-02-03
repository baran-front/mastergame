"use client";

import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { FunnelIcon, XIcon } from "lucide-react";
import SelectSearchParamsFilter from "../modules/selectSearchParamsFilter";
import ProductsRegionSelect from "./productsRegionSelect";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import RemoveFiltersButton from "../modules/removeFiltersButton";


function ProductsMobileDrawer({ categories, priceRangeOptions, sortOptions }: { sortOptions: { label: string; value: string }[]; priceRangeOptions: { label: string; value: string }[]; categories: { label: string; value: string }[] }) {
  const pathname = usePathname();
  const sp = useSearchParams();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setOpen(false);
    })
  }, [pathname, sp, setOpen])

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="flex items-center justify-center col-span-2 sm:hidden">
          <Button variant="outline" size={"icon"}><FunnelIcon /></Button>
        </div>
      </DrawerTrigger>

      <DrawerContent className="min-h-[75vh]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <DrawerTitle>فیلتر محصولات</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="outline" size={"icon-sm"}><XIcon /></Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="p-3 space-y-3">
            <RemoveFiltersButton
              className="w-full"
            />

            <SelectSearchParamsFilter
              className="w-full"
              searchParamsKey="sort"
              options={sortOptions}
              placeholder="مرتب سازی بر اساس..."
            />

            <SelectSearchParamsFilter
              className="w-full"
              searchParamsKey="priceRange"
              options={priceRangeOptions}
              placeholder="محدوده قیمت..."
            />

            <SelectSearchParamsFilter
              className="w-full"
              searchParamsKey="category"
              options={categories}
              placeholder="دسته بندی..."
            />

            <ProductsRegionSelect />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default ProductsMobileDrawer