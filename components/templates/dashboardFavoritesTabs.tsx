"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type SwiperType from "swiper";

import "swiper/css";
import "swiper/css/navigation";

function DashboardFavoritesTabs({
  categories,
}: {
  categories: { label: string; value: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const swiperRef = useRef<SwiperType | null>(null);

  const handleChange = (value: string) => {
    const sp = new URLSearchParams(searchParams?.toString());
    sp.set("category", value);
    router.push(`${pathname}?${sp.toString()}`, {
      scroll: false
    });
  };

  const activeCategory = searchParams?.get("category") || "all";

  // Find the index of the active category
  const allItems = [{ value: "all", label: "همه" }, ...categories];
  const activeIndex = allItems.findIndex(item => item.value === activeCategory);

  // Sync swiper slide when activeCategory changes
  useEffect(() => {
    if (swiperRef.current && activeIndex >= 0) {
      swiperRef.current.slideTo(activeIndex);
    }
  }, [activeCategory, activeIndex]);

  return (
    <div className="relative w-full">
      <div className="bg-card py-1.5 px-12 rounded-md rtl:flex-row-reverse">
        <Swiper
          modules={[Navigation]}
          breakpoints={{
            0: {
              slidesPerView: 1
            },
            640: {
              slidesPerView: 2
            },
            1024: {
              slidesPerView: 3
            }
          }}
          spaceBetween={6}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            // Set initial slide
            if (activeIndex >= 0) {
              swiper.slideTo(activeIndex);
            }
          }}
          className="w-full"
        >
          <SwiperSlide>
            <Button
              className="w-full"
              onClick={() => handleChange("all")}
              variant={activeCategory === "all" ? "default" : "ghostPrimary"}
            >
              همه
            </Button>
          </SwiperSlide>
          {categories.map((category) => (
            <SwiperSlide key={category.value}>
              <Button
                className="w-full"
                onClick={() => handleChange(category.value)}
                variant={activeCategory === category.value ? "default" : "ghostPrimary"}
              >
                {category.label}
              </Button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Navigation Buttons */}
      <Button
        size="icon"
        variant="outline"
        aria-label="قبلی"
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10"
      >
        <ChevronRight />
      </Button>
      <Button
        size="icon"
        variant="outline"
        aria-label="بعدی"
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10"
      >
        <ChevronLeft />
      </Button>
    </div>
  );
}

export default DashboardFavoritesTabs;
