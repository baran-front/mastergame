"use client";

import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import { ComponentProps, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function SearchParamsSearch({
  placeholder,
  ...props
}: ComponentProps<typeof InputGroup> & { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams?.get("search") || "");

  const handleClick = (value: string) => {
    const sp = new URLSearchParams(searchParams?.toString());
    sp.set("search", value);
    router.push(`${pathname}?${sp.toString()}`, {
      scroll: false,
    });
  };

  return (
    <InputGroup {...props}>
      <InputGroupInput
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleClick(value);
          }
        }}
      />
      <InputGroupButton onClick={() => handleClick(value)}>
        <SearchIcon />
      </InputGroupButton>
    </InputGroup>
  );
}

export default SearchParamsSearch;
