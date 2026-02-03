"use client";

import Link from "next/link";
import { SwiperSlide } from "swiper/react";

import Carousel from "../../modules/carousel";
import { Button } from "@/components/ui/button";
import { PageSectionT } from "@/types/api.types";
import { mapSectionItemToProduct } from "@/lib/data";
import ProductCard from "@/components/modules/productCard";

function BestSellersSection({
  bestSellers,
  categories
}: {
  bestSellers: PageSectionT | undefined,
  categories: { label: string, value: string }[]
}) {
  return (
    <div className="wrapper mt-24 lg:mt-40">
      <div className="flex items-center max-lg:flex-col gap-6">
        <h6 className="heading lg:pe-6 lg:border-e-2">{bestSellers?.title}</h6>
        <div className="flex items-center gap-3 bg-card p-1.5 rounded-full max-w-full max-lg:overflow-x-auto">
          <Button className="min-w-max">همه</Button>
          {categories.map((category) => (
            <Link
              key={category.value}
              href={`/products?category=${category.value}`}
            >
              <Button className="min-w-max" variant={"ghostPrimary"}>
                {category.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
      <Carousel
        className="w-full mt-6"
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 }
        }}
      >
        {bestSellers?.items.map((bestSeller) => (
          <SwiperSlide className="pb-16" key={bestSeller.id}>
            <ProductCard product={mapSectionItemToProduct(bestSeller.values[0])} />
          </SwiperSlide>
        ))}
      </Carousel>
    </div>
  )
}

export default BestSellersSection;

