"use client";

import { createPortal } from "react-dom";
import {
  SearchIcon,
  XIcon,
  CalendarDaysIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebouncedValue, useMounted } from "@mantine/hooks";
import Link from "next/link";
import Image from "next/image";

import searchNotFoundImg from "@/public/images/search-not-found.png";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getArticles } from "@/lib/fetchs";
import { ArticleT } from "@/types/api.types";
import ProductCard from "@/components/modules/productCard";
import { brand } from "@/brand";
import { ProductT } from "@/types/api.types";
import { usePathname } from "next/navigation";

function HeaderSearchButton() {
  const pathname = usePathname();
  const isMounted = useMounted();
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword] = useDebouncedValue(keyword.trim(), 1_000);

  const { data: products, isLoading: isProductsLoading } = useQuery({
    enabled: Boolean(debouncedKeyword),
    queryKey: ["products", debouncedKeyword],
    queryFn: () =>
      getProducts({
        pageNumber: 1,
        pageSize: 10,
        keyword: keyword,
        orderBy: [""],
      }),
  });

  const { data: articles, isLoading: isArticlesLoading } = useQuery({
    enabled: Boolean(debouncedKeyword),
    queryKey: ["articles", debouncedKeyword],
    queryFn: () =>
      getArticles({
        blogPostCategoryId: null,
        keyword: keyword,
        pageNumber: 1,
        pageSize: 10,
        orderBy: [""],
      }),
  });

  const isTyping = keyword.trim() !== debouncedKeyword;
  const isProductsLoadingState = isTyping || isProductsLoading;
  const isArticlesLoadingState = isTyping || isArticlesLoading;
  const hasProducts = Boolean(products?.result?.data.data.length);
  const articlesData = (
    articles?.result?.data as { data?: ArticleT[] } | undefined
  )?.data;
  const hasArticles = Boolean(articlesData && articlesData.length > 0);

  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 150);
    } else {
      setTimeout(() => {
        setKeyword("");
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    queueMicrotask(() => {
      setIsOpen(false);
    });
  }, [pathname]);

  if (!isMounted) return <div className="mr-auto" />;

  return (
    <>
      <Button
        size={"icon"}
        variant={"outline"}
        className="bg-background ms-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        <SearchIcon />
      </Button>

      {createPortal(
        <>
          <div
            className={`fixed inset-0 overflow-y-auto z-50 bg-background/50 backdrop-blur-md transition-all ${isOpen
              ? ""
              : "opacity-0 invisible pointer-events-none translate-y-3"
              }`}
          >
            <div className="wrapper pt-6 lg:pt-8 sticky top-0 bg-background pb-3 z-10">
              <div className="flex items-center gap-3">
                <Button
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon />
                </Button>
                <InputGroup className="flex-1 pe-2">
                  <InputGroupInput
                    type="text"
                    placeholder="جستجو"
                    ref={searchRef}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <InputGroupButton variant={"ghost"}>
                    <SearchIcon />
                  </InputGroupButton>
                </InputGroup>
              </div>
            </div>
            <div className="wrapper pb-6 lg:pb-8">
              <Tabs dir="rtl" defaultValue="products" className="mt-6">
                <TabsList className="w-full sm:max-w-max">
                  <TabsTrigger value="products" className="flex-1">
                    محصولات
                  </TabsTrigger>
                  <TabsTrigger value="articles" className="flex-1">
                    مقالات
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="products">
                  {!keyword.trim() ? (
                    <p className="heading text-center leading-relaxed mt-3 lg:mt-6">
                      جستجوی محصولات {brand.name}
                    </p>
                  ) : isProductsLoadingState ? (
                    <p className="heading text-center leading-relaxed mt-3 lg:mt-6 animate-pulse">
                      درحال جستجو...
                    </p>
                  ) : !hasProducts ? (
                    <div className="flex justify-center items-center flex-col gap-6">
                      <p className="heading text-center leading-relaxed mt-3 lg:mt-6">
                        محصولی یافت نشد :(
                      </p>
                      <Image
                        width={300}
                        height={300}
                        className="card"
                        src={searchNotFoundImg}
                        alt="محصولی یافت نشد"
                      />
                    </div>
                  ) : (
                    <div className="card-grid-wrapper">
                      {products?.result?.data.data.map((item) => (
                        <ProductCard
                          key={item.id}
                          product={{ id: item.id, name: item.name } as ProductT}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="articles">
                  {!keyword.trim() ? (
                    <p className="heading text-center leading-relaxed mt-3 lg:mt-6">
                      جستجوی مقالات {brand.name}
                    </p>
                  ) : isArticlesLoadingState ? (
                    <p className="heading text-center leading-relaxed mt-3 lg:mt-6 animate-pulse">
                      درحال جستجو...
                    </p>
                  ) : !hasArticles ? (
                    <div className="flex justify-center items-center flex-col gap-6">
                      <p className="heading text-center leading-relaxed mt-3 lg:mt-6">
                        مقاله ای یافت نشد :(
                      </p>
                      <Image
                        width={300}
                        height={300}
                        className="card"
                        src={searchNotFoundImg}
                        alt="مقاله ای یافت نشد"
                      />
                    </div>
                  ) : (
                    <div className="card-grid-wrapper">
                      {articlesData?.map((item: ArticleT) => (
                        <Link
                          href={`/articles/${item.id}`}
                          key={item.id}
                          className="card"
                          onClick={() => setIsOpen(false)}
                        >
                          <Image
                            width={373}
                            height={210}
                            alt={item.title}
                            className="w-full aspect-video rounded-lg"
                            src={brand.apiBaseUrl + (item.imageUrl || "")}
                          />
                          <div className="flex items-center gap-3">
                            <CalendarDaysIcon className="size-5" />
                            <span>
                              {new Date(item.published).toLocaleDateString(
                                "fa"
                              )}
                            </span>
                          </div>
                          <p className="title">{item.title}</p>
                          <Button
                            size={"icon"}
                            variant={"ghost"}
                            className="w-full bg-foreground/5 shadow-lg hover:bg-foreground/10"
                          >
                            <span>مشاهده مطلب</span>
                            <ArrowLeftIcon className="size-5" />
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

export default HeaderSearchButton;
