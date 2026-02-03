import ProductCard from "@/components/modules/productCard";
import { Button } from "@/components/ui/button";
import notifyImg from "@/public/images/notify.png";
import { ProductT } from "@/types/api.types";
import { ChevronLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { getBookmarks, getCategory } from "@/lib/fetchs";
import { NextPageProps } from "@/types/app.types";
import DashboardFavoritesTabs from "@/components/templates/dashboardFavoritesTabs";

async function DashboardFavoritesPage({ searchParams }: NextPageProps) {
  const sp = await searchParams;
  const categoryId = sp.category ? +sp.category : undefined;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  let bookmarks: ProductT[] = [];
  let isEmpty = true;

  const response = await getBookmarks({ token });
  if (response.status === 200 && response.result?.data?.content) {
    try {
      const content = response.result.data.content;
      bookmarks = JSON.parse(content) as ProductT[];

      if (categoryId) {
        bookmarks = bookmarks.filter((product: ProductT) =>
          product.categories.includes(categoryId.toString())
        );
      }

      isEmpty = bookmarks.length === 0;
    } catch {
      // If parsing fails, keep empty array
      isEmpty = true;
    }
  }

  const categories = ((await getCategory({ type: 1 })).result?.data || []).map(
    (category) => ({
      label: category.name,
      value: category.id.toString(),
    })
  );

  return (
    <>
      <div className="card flex items-center space-y-0 justify-between gap-3 mb-6 lg:hidden">
        <h1 className="title">علاقه مندی ها</h1>
        <Link href={"/dashboard"}>
          <Button variant={"outline"} size={"icon"}>
            <ChevronLeftIcon />
          </Button>
        </Link>
      </div>

      <DashboardFavoritesTabs categories={categories} />

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center mt-6">
          <Image
            width={250}
            height={200}
            src={notifyImg}
            alt="علاقه مندی ها خالی است"
          />
          <p className="title -translate-y-6">علاقه مندی ها خالی است</p>
        </div>
      ) : (
        <div className="card-grid-wrapper mt-6">
          {bookmarks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}

export default DashboardFavoritesPage;
