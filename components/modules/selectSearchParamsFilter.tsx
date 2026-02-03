"use client";

import * as SelectPrimitive from "@radix-ui/react-select";

import {
  Select,
  SelectGroup,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import { ComponentProps } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function SelectSearchParamsFilter({
  placeholder,
  searchParamsKey,
  options,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger> & {
  placeholder: string;
  searchParamsKey: string;
  options: { label: string; value: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentValue = searchParams?.get(searchParamsKey);

  const handleChange = (value: string) => {
    const sp = new URLSearchParams(searchParams?.toString());
    sp.set(searchParamsKey, value);
    router.push(`${pathname}?${sp.toString()}`, {
      scroll: false
    });
  };

  return (
    <Select
      dir="rtl"
      defaultValue={currentValue || undefined}
      onValueChange={handleChange}
    >
      <SelectTrigger {...props}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectSearchParamsFilter;
