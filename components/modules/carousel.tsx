"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperProps, useSwiper } from "swiper/react";

function CarouselNavigation({
  slidesCount,
  loop,
}: {
  slidesCount: number;
  loop?: boolean;
}) {
  const swiper = useSwiper();
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    if (!swiper) return;

    // Listen to slide change events
    const handleSlideChange = () => {
      setActiveIndex(swiper.realIndex);
    };

    swiper.on("slideChange", handleSlideChange);

    // Defer initial state updates to avoid cascading renders
    queueMicrotask(() => {
      if (!swiper || !swiper.params) return;
      setActiveIndex(swiper.realIndex);
      // Get slidesPerView - use slidesPerViewDynamic() for responsive breakpoints
      const currentSlidesPerView =
        typeof swiper.params.slidesPerView === "number"
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

  // Calculate number of navigation buttons
  const navigationButtonsCount = loop
    ? slidesCount
    : Math.max(1, slidesCount - Math.floor(slidesPerView) + 1);

  // Clamp activeIndex to valid button range
  const activeButtonIndex = loop
    ? activeIndex
    : Math.min(activeIndex, navigationButtonsCount - 1);

  return (
    <div className="flex items-center justify-center flex-1 gap-1.5 sm:gap-3 z-10 absolute bottom-3 left-1/2 -translate-x-1/2  max-sm:w-full sm:w-max p-3 rounded-full">
      {Array.from({ length: navigationButtonsCount }).map((_, idx) => (
        <div
          key={idx}
          onClick={() => (loop ? swiper.slideToLoop(idx) : swiper.slideTo(idx))}
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
  );
}

function Carousel({ className, children, ...props }: SwiperProps) {
  const slidesCount = React.Children.count(children);

  return (
    <Swiper
      grabCursor
      spaceBetween={12}
      className={cn("select-none", className)}
      {...props}
    >
      {children}
      <CarouselNavigation slidesCount={slidesCount} loop={props.loop} />
    </Swiper>
  );
}
export default Carousel;
