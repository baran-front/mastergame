"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Image from "next/image";
import { brand } from "@/brand";
import Link from "next/link";
import { PageSectionT } from "@/types/api.types";

function HeroCarouselNavigation() {
  const swiper = useSwiper();
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesLength, setSlidesLength] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    if (!swiper) return;

    // Listen to slide change events
    const handleSlideChange = () => {
      setActiveIndex(swiper.activeIndex);
    };

    swiper.on("slideChange", handleSlideChange);

    // Defer initial state updates to avoid cascading renders
    queueMicrotask(() => {
      if (!swiper || !swiper.slides) return;
      setActiveIndex(swiper.activeIndex);
      setSlidesLength(swiper.slides.length);
      // Get slidesPerView - use slidesPerViewDynamic() for responsive breakpoints
      const currentSlidesPerView =
        swiper.params && typeof swiper.params.slidesPerView === "number"
          ? swiper.params.slidesPerView
          : (swiper.slidesPerViewDynamic && swiper.slidesPerViewDynamic()) || 1;
      setSlidesPerView(currentSlidesPerView);
    });

    // Listen to breakpoint changes for responsive slidesPerView
    const handleBreakpoint = () => {
      if (!swiper || !swiper.params) return;
      const currentSlidesPerView =
        typeof swiper.params.slidesPerView === "number"
          ? swiper.params.slidesPerView
          : (swiper.slidesPerViewDynamic && swiper.slidesPerViewDynamic()) || 1;
      setSlidesPerView(currentSlidesPerView);
    };

    swiper.on("breakpoint", handleBreakpoint);

    // Cleanup
    return () => {
      swiper.off("slideChange", handleSlideChange);
      swiper.off("breakpoint", handleBreakpoint);
    };
  }, [swiper]);

  // Calculate number of navigation buttons: slidesLength - slidesPerView + 1
  const navigationButtonsCount = Math.max(1, slidesLength - slidesPerView + 1);
  // Clamp activeIndex to valid button range
  const activeButtonIndex = Math.min(activeIndex, navigationButtonsCount - 1);

  return (
    <div className="flex items-center gap-3 z-10 absolute bottom-0 left-0 right-0 p-3 pt-6 bg-linear-to-t from-background/75 to-transparent">
      <div className="p-px rounded-full transition-all bg-linear-to-l from-foreground/25 to-90% to-transparent hover:from-secondary/50 hover:shadow-[5px_0_10px_0_color-mix(in_oklab,var(--secondary)10%,transparent)]">
        <Button
          className="hover:bg-card"
          variant={"soft"}
          size={"icon"}
          onClick={() => swiper.slidePrev()}
        >
          <ArrowRightIcon />
        </Button>
      </div>
      <div className="p-px rounded-full transition-all bg-linear-to-r from-foreground/25 to-90% to-transparent hover:from-secondary/50 hover:shadow-[-5px_0_10px_0_color-mix(in_oklab,var(--secondary)10%,transparent)]">
        <Button
          className="hover:bg-card"
          variant={"soft"}
          size={"icon"}
          onClick={() => swiper.slideNext()}
        >
          <ArrowLeftIcon />
        </Button>
      </div>

      <div className="flex items-center flex-1 gap-1.5 sm:gap-3 justify-end">
        {Array.from({ length: navigationButtonsCount }).map((_, idx) => (
          <div
            key={idx}
            onClick={() => swiper.slideTo(idx)}
            className="w-16 h-1 cursor-pointer rounded-full group"
            style={{ maxWidth: `${100 / navigationButtonsCount}%` }}
          >
            <div
              className={cn(
                idx === activeButtonIndex
                  ? "bg-secondary"
                  : "bg-card not-dark:bg-foreground/10",
                "h-full rounded-full transition-all group-hover:scale-y-200"
              )}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroCarousel({ carousel }: { carousel: PageSectionT | undefined }) {
  if (!carousel?.items || carousel.items.length === 0) {
    return null;
  }

  return (
    <div className="max-md:h-96 max-md:mb-12 md:col-span-2 md:row-span-2 select-none">
      <Swiper className="h-full" spaceBetween={12} slidesPerView={"auto"} loop>
        {carousel.items.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="size-full relative ">
              <Image
                width={590}
                height={383}
                alt={item.name || ""}
                className="size-full rounded-2xl"
                src={brand.apiBaseUrl + (item.mediaPath || "")}
              />

              <div className="flex items-center justify-between absolute bottom-16 left-3 right-3">
                <p className="heading text-white">
                  {item.name}
                </p>

                <Link className="shadow-lg" href={item.linkUrl || "/"}>
                  <Button>خرید</Button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <HeroCarouselNavigation />
      </Swiper>
    </div>
  );
}

export default HeroCarousel;
