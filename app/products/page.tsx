import Faq from "@/components/templates/faq";
import Socials from "@/components/templates/socials";
import ProductCard from "@/components/modules/productCard";
import { getProducts, getProductsPriceRange } from "@/lib/fetchs";
import ProductsCarousel from "@/components/templates/productsCarousel";
import { getCategory, getPageInfo } from "@/lib/fetchs";
import SelectSearchParamsFilter from "@/components/modules/selectSearchParamsFilter";
import { NextPageProps } from "@/types/app.types";
import SearchParamsSearch from "@/components/modules/searchParamsSearch";
import ProductsRegionSelect from "@/components/templates/productsRegionSelect";
import SpPagination from "@/components/modules/spPagination";
import ProductsMobileDrawer from "@/components/templates/productsMobileDrawer";
import Breadcrumbs from "@/components/modules/breadcrumbs";
import RemoveFiltersButton from "@/components/modules/removeFiltersButton";

const SORT_OPTIONS = [
  { label: "جدیدترین", value: "NEWEST" },
  { label: "قدیمی‌ترین", value: "OLDEST" },
  { label: "ارزان‌ترین", value: "CHEAPEST" },
  { label: "گران‌ترین", value: "EXPENSIVE" },
];

const PRICE_RANGE_LAYERS = 7;

/** گرد کردن به نزدیک‌ترین عدد خوانا (مثلاً ۱٬۰۰۰؛ ۵٬۰۰۰؛ ۱۰٬۰۰۰؛ ۵۰٬۰۰۰؛ ۱۰۰٬۰۰۰) */
function roundToReadable(n: number): number {
  if (n <= 0) return 0;
  const magnitude = Math.pow(10, Math.floor(Math.log10(n)));
  const normalized = n / magnitude;
  const nice = normalized <= 1.5 ? 1 : normalized <= 3.5 ? 2 : normalized <= 7.5 ? 5 : 10;
  return Math.round((magnitude * nice) / 1000) * 1000;
}

function buildPriceRangeOptions(min: number, max: number) {
  if (min >= max) return [];
  const step = (max - min) / PRICE_RANGE_LAYERS;
  const roundUnit = Math.max(1000, roundToReadable(step));
  const options: { label: string; value: string }[] = [];
  for (let i = 0; i < PRICE_RANGE_LAYERS; i++) {
    const rawMin = min + i * step;
    const rawMax = min + (i + 1) * step;
    const rangeMin = Math.round(rawMin / roundUnit) * roundUnit;
    const rangeMax = Math.round(rawMax / roundUnit) * roundUnit;
    if (rangeMin >= rangeMax) continue;
    options.push({
      label: `${rangeMin.toLocaleString("fa-IR")} تا ${rangeMax.toLocaleString("fa-IR")}`,
      value: `${rangeMin}-${rangeMax}`,
    });
  }
  return options;
}

async function ProductsPage({ searchParams }: NextPageProps) {
  const pageInfo = await getPageInfo({ pageId: "3" });
  const slides =
    pageInfo.result?.data?.pageSections.find(
      (section) => section.title === "carousel"
    )?.items || [];

  const sp = await searchParams;
  const sort = sp.sort;
  const search = sp.search;
  const pageNumber = +(sp.pageNumber || "NaN") || 1;
  const priceRange = sp.priceRange;
  const minPrice = priceRange ? +priceRange.split("-")[0] : undefined;
  const maxPrice = priceRange ? +priceRange.split("-")[1] : undefined;
  const categoryId = sp.category ? +sp.category : undefined;
  const products = await getProducts({
    keyword: search || "",
    orderBy: [sort || "NEWEST"],
    pageNumber: pageNumber,
    pageSize: 10,
    minPrice,
    maxPrice,
    categoryId,
  });

  const categories = ((await getCategory({ type: 1 })).result?.data || []).map(
    (category) => ({
      label: category.name,
      value: category.id.toString(),
    })
  );

  const productsPriceRange = await getProductsPriceRange();
  const rangeData = productsPriceRange.result?.[0];
  const priceRangeOptions =
    rangeData && typeof rangeData.min === "number" && typeof rangeData.max === "number"
      ? buildPriceRangeOptions(rangeData.min, rangeData.max)
      : [];

  return (
    <>
      <Breadcrumbs links={[{ name: "محصولات", href: "/products" }]} />

      <ProductsCarousel slides={slides} />

      <div className="wrapper mt-24 lg:mt-40">
        <div className="grid grid-cols-12 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
          <SearchParamsSearch
            className="w-full max-sm:col-span-10 max-lg:col-span-2"
            placeholder="جستجو..."
          />

          <ProductsMobileDrawer
            categories={categories}
            priceRangeOptions={priceRangeOptions}
            sortOptions={SORT_OPTIONS}
          />

          <SelectSearchParamsFilter
            className="w-full max-sm:hidden"
            searchParamsKey="sort"
            options={SORT_OPTIONS}
            placeholder="مرتب سازی بر اساس..."
          />

          <SelectSearchParamsFilter
            className="w-full max-sm:hidden"
            searchParamsKey="priceRange"
            options={priceRangeOptions}
            placeholder="محدوده قیمت..."
          />

          <SelectSearchParamsFilter
            className="w-full max-sm:hidden"
            searchParamsKey="category"
            options={categories}
            placeholder="دسته بندی..."
          />

          <ProductsRegionSelect className="max-sm:hidden" />

          <RemoveFiltersButton
            className="w-full max-sm:hidden"
          />
        </div>

        <div className="card-grid-wrapper mt-6">
          {products.result?.data?.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <SpPagination
          pageSize={10}
          className="mt-6"
          pageParamName="pageNumber"
          totalPages={products.result?.data?.totalPages}
          totalCount={products.result?.data?.totalCount}
        />
      </div>

      <Faq />
      <Socials />
    </>
  );
}

export default ProductsPage;
