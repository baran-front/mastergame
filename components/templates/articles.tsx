"use client";

import { ArrowLeftIcon } from "lucide-react";
import { SwiperSlide } from "swiper/react";

import { Button } from "../ui/button";
import { ArticleT } from "@/types/api.types";
import ArticleCard from "../modules/articleCard";
import Carousel from "../modules/carousel";

function Articles({ articles }: { articles: ArticleT[] }) {
  return (
    <div className="wrapper mt-24 lg:mt-40">
      <div className="flex items-center justify-between">
        <h6 className="heading">اخبار و مقالات</h6>
        <Button variant={"outline"}>
          <ArrowLeftIcon />
        </Button>
      </div>

      <Carousel
        className="w-full mt-6"
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 }
        }}
      >
        {articles.map((article) => (
          <SwiperSlide className="pb-16" key={article.id}>
            <ArticleCard article={article} />
          </SwiperSlide>
        ))}
      </Carousel>
    </div>
  );
}

export default Articles;
