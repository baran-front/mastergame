"use client";

import { brand } from "@/brand";
import { ArticleT } from "@/types/api.types";
import { ArrowLeftIcon, CalendarDaysIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

function ArticleCard({ className, article }: { className?: string, article: ArticleT }) {
  return (
    <Link href={`/articles/${article.slug}`} className={cn("card card-hover flex flex-col hover:bg-transparent group", className)}>
      <Image
        width={373}
        height={210}
        alt={article.title}
        className="w-full aspect-video rounded-lg"
        src={brand.apiBaseUrl + (article.imageUrl || "")}
      />
      <div className="flex items-center gap-3">
        <CalendarDaysIcon className="size-5" />
        <span>{new Date(article.published).toLocaleDateString("fa")}</span>
      </div>
      <p className="title line-clamp-1">{article.title}</p>
      <p className="typhography line-clamp-3">{article.summery}</p>
      <Button
        size={"icon"}
        variant={"ghost"}
        className="w-full bg-foreground/5 shadow-lg shadow-background/10 group-hover:shadow-primary/30 group-hover:bg-primary group-hover:text-white mt-auto"
      >
        <span>مشاهده مطلب</span>
        <ArrowLeftIcon className="size-5" />
      </Button>
    </Link>
  )
}

export default ArticleCard