import Link from "next/link";
import { Button } from "../ui/button";
import { Fragment } from "react/jsx-runtime";
import { ChevronLeftIcon, HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Breadcrumbs({ links }: { links: { name: string; href: string }[] }) {
  return (
    <div className="wrapper mt-3 lg:mt-6">
      <div className="flex items-center overflow-x-auto">
        <Link href={"/"}>
          <Button size={"sm"} variant={"unstyled"} className="hover:text-primary px-2">
            <HomeIcon />
            <span>صفحه اصلی</span>
          </Button>
        </Link>
        {links.map((item, index) => (
          <Fragment key={index}>
            <ChevronLeftIcon className="size-3 min-w-3" />
            <Link href={item.href}>
              <Button
                size={"sm"}
                variant={"unstyled"}
                className={cn(
                  index + 1 === links.length ? "font-yekan-bakh-semi-bold" : "",
                  "hover:text-primary px-2"
                )}
              >
                <span>{item.name}</span>
              </Button>
            </Link>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default Breadcrumbs;
