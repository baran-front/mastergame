"use client";

import Link from "next/link";
import { SwiperSlide } from "swiper/react";
import { ArrowLeftIcon } from "lucide-react";

import Carousel from "../../modules/carousel";
import { Button } from "@/components/ui/button";
import { PageSectionT } from "@/types/api.types";
import { mapSectionItemToProduct } from "@/lib/data";
import ProductCard from "@/components/modules/productCard";

function SpecialOffersSection({ specialOffers }: { specialOffers: PageSectionT | undefined }) {
  return (
    <div className="wrapper mt-24 lg:mt-40">
      <div className="bg-linear-to-tr from-primary to-secondary p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <h1 className="heading text-white">{specialOffers?.title}</h1>
          <Link href={"/products"}>
            <Button variant={"outline"} className="text-white border-white hover:bg-white hover:text-primary hover:border-white">
              <ArrowLeftIcon />
            </Button>
          </Link>
        </div>
        <Carousel
          slidesPerView={1}
          className="w-full mt-6"
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 }
          }}
        >
          {specialOffers?.items.map((game) => (
            <SwiperSlide className="pb-16" key={game.id}>
              <ProductCard product={mapSectionItemToProduct(game.values[0])} isSpecialOffer />
            </SwiperSlide>
          ))}
        </Carousel>
      </div>
    </div>
  )
}

export default SpecialOffersSection