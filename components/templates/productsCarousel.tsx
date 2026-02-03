"use client";

import Image from "next/image";
import { SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";

import { brand } from "@/brand";
import Carousel from "../modules/carousel";
import { PageSectionItemT } from "@/types/api.types";

function ProductsCarousel({ slides }: { slides: PageSectionItemT[] }) {
  return (
    <div className="max-lg:wrapper">
      <Carousel
        loop
        className="h-[65vh]"
        initialSlide={1}
        effect="coverflow"
        slidesPerView={1}
        breakpoints={{
          1024: {
            slidesPerView: 3,
          },
        }}
        modules={[EffectCoverflow]}
        coverflowEffect={{
          scale: 0.9,
          rotate: 0,
          stretch: 50,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
      >
        {slides.map((slide) => (
          <SwiperSlide className="py-16" key={slide.id}>
            <Image
              width={1000}
              height={1000}
              alt={slide.name || ""}
              className="size-full rounded-lg object-cover object-center shadow-2xl"
              src={brand.apiBaseUrl + (slide.mediaPath || "")}
            />
          </SwiperSlide>
        ))}
      </Carousel>
    </div>
  );
}

export default ProductsCarousel;
