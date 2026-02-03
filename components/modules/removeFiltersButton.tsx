"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function RemoveFiltersButton({ className, ...props }: ComponentProps<typeof Button>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Check if there are any search params
  const hasSearchParams = searchParams && searchParams.toString().length > 0;

  const handleRemoveFilters = () => {
    // Navigate to pathname without any query params
    router.push(pathname, {
      scroll: false
    });
  };

  return (
    <Button
      variant={"destructive"}
      disabled={!hasSearchParams}
      onClick={handleRemoveFilters}
      className={cn("justify-between", className)}
      {...props}
    >
      <span>حذف فیلترها</span>
      <TrashIcon />
    </Button>
  );
}

export default RemoveFiltersButton;
