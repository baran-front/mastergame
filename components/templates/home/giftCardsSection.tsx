"use client";

import Link from "next/link";
import { SwiperSlide } from "swiper/react";
import { ArrowLeftIcon } from "lucide-react";

import Carousel from "../../modules/carousel";
import { Button } from "@/components/ui/button";
import { PageSectionT } from "@/types/api.types";
import { mapSectionItemToProduct } from "@/lib/data";
import GiftCard from "@/components/modules/giftCard";

function GiftCardsSection({ giftCards }: { giftCards: PageSectionT | undefined }) {
  return (
    <div className="wrapper mt-24 lg:mt-40">
      <div className="flex items-center justify-between">
        <h3 className="heading">{giftCards?.title}</h3>
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
        {giftCards?.items.map((giftCard) => (
          <SwiperSlide className="pb-16" key={giftCard.id}>
            <GiftCard product={mapSectionItemToProduct(giftCard.values[0])} />
          </SwiperSlide>
        ))}
      </Carousel>
    </div>
  )
}

export default GiftCardsSection;

