"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "../ui/button";
import { ArticleCategoryT } from "@/types/api.types";

type ArticlesCategoryTabsPropsT = {
  categories: ArticleCategoryT[];
};

const ArticlesCategoryTabs = ({ categories }: ArticlesCategoryTabsPropsT) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // For 'All Articles', remove the 'category' param
  const handleAllNavigation = () => {
    const sp = new URLSearchParams(searchParams?.toString());
    sp.delete("category");
    router.push(`${pathname}${sp.toString() ? `?${sp.toString()}` : ""}`);
  };

  // For specific category, set 'category' param
  const handleNavigation = (id: number) => {
    const sp = new URLSearchParams(searchParams?.toString());
    sp.set("category", String(id));
    router.push(`${pathname}?${sp.toString()}`);
  };

  // Determine which category is active from current search params
  const activeCategoryId = searchParams?.get("category");

  return (
    <div className="flex items-center gap-3 bg-card p-1.5 rounded-full max-w-full max-lg:overflow-x-auto [&_>_button]:min-w-max">
      <Button
        onClick={handleAllNavigation}
        variant={!activeCategoryId ? "default" : "ghost"}
      >
        همه مقالات
      </Button>
      {categories.map((item) => (
        <Button
          key={item.id}
          variant={activeCategoryId === String(item.id) ? "default" : "ghost"}
          onClick={() => handleNavigation(item.id)}
        >
          {item.title}
        </Button>
      ))}
    </div>
  );
};

export default ArticlesCategoryTabs;
