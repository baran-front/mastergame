"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { FunnelIcon, XIcon } from "lucide-react";
import SelectSearchParamsFilter from "../modules/selectSearchParamsFilter";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";


function ArticlesMobileDrawer({ categories }: { categories: { label: string; value: string }[] }) {
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
        <Button className="lg:hidden" variant="outline" size={"icon"}><FunnelIcon /></Button>
      </DrawerTrigger>

      <DrawerContent className="min-h-[75vh]">
        <div className="w-full">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <DrawerTitle>فیلتر مقالات</DrawerTitle>
              <DrawerTrigger asChild>
                <Button variant="outline" size={"icon"}><XIcon /></Button>
              </DrawerTrigger>
            </div>
          </DrawerHeader>
          <div className="p-3 space-y-3">
            <SelectSearchParamsFilter
              className="w-full"
              searchParamsKey="category"
              options={categories}
              placeholder="دسته بندی..."
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default ArticlesMobileDrawer