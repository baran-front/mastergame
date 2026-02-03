import Link from "next/link";
import Image from "next/image";

import { PageSectionT } from "@/types/api.types";
import { brand } from "@/brand";

function Banners2Section({ banners2 }: { banners2: PageSectionT | undefined }) {
  return (
    <div className="wrapper mt-24 lg:mt-40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {banners2?.items.map((banner, index) => (
        <Link
          key={banner.id}
          href={banner.linkUrl || "/products"}
          className={`block w-full h-full rounded-lg hover:shadow-primary/10 border border-transparent hover:border-primary transition-all shadow-2xl shadow-transparent ${index === 2 ? "sm:col-span-2" : ""}`}
        >
          <Image
            width={index === 2 ? 596 : 286}
            height={275}
            className="w-full h-full rounded-lg object-cover object-center"
            src={brand.apiBaseUrl + (banner.mediaPath || "")}
            alt={banner.mediaAlt || banner.name || ""}
          />
        </Link>
      ))}
    </div>
  );
}

export default Banners2Section;
