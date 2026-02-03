"use client";

import Link from "next/link";
import { SwiperSlide } from "swiper/react";
import { ArrowLeftIcon } from "lucide-react";

import Carousel from "../../modules/carousel";
import { Button } from "@/components/ui/button";
import { PageSectionItemT } from "@/types/api.types";
import { mapSectionItemToProduct } from "@/lib/data";
import ProductCard from "@/components/modules/productCard";

function PremiumAccountsSection({ premiumAccounts }: { premiumAccounts: PageSectionItemT[] }) {
  return (
    <div className="wrapper mt-24 lg:mt-40">
      <div className="flex items-center justify-between">
        <h5 className="heading">اکانت های پرمیوم</h5>
        <Link href={"/products"}>
          <Button variant={"outline"}>
            <ArrowLeftIcon />
          </Button>
        </Link>
      </div>
      <Carousel
        className="w-full mt-6"
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 }
        }}
      >
        {premiumAccounts.map((premiumAccount) => {
          const value = premiumAccount.values[0];
          if (!value) return null;
          return (
            <SwiperSlide className="pb-16" key={premiumAccount.id}>
              <ProductCard product={mapSectionItemToProduct(value)} />
            </SwiperSlide>
          );
        })}
      </Carousel>
    </div>
  )
}

export default PremiumAccountsSection;

