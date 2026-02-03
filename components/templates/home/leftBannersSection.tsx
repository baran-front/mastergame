import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageSectionT } from "@/types/api.types";
import { brand } from "@/brand";

function LeftBannersSection({ leftBanners }: { leftBanners: PageSectionT | undefined }) {
  return (
    <>
      {leftBanners?.items.map((item) => (
        <div
          key={item.id}
          className="relative flex items-center justify-center"
        >
          <Image
            width={277}
            height={174}
            alt={"خرید اکانت"}
            className="size-full"
            src={brand.apiBaseUrl + (item.mediaPath || "")}
          />
          <Link
            className="block w-3/7 absolute bottom-0 translate-y-1/3"
            href={item.linkUrl || "/"}
          >
            <Button className="w-full" variant={"outline"}>
              <span>خرید</span>
              <ArrowLeftIcon />
            </Button>
          </Link>
        </div>
      ))}
    </>
  );
}

export default LeftBannersSection;
