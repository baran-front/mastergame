import Faq from "@/components/templates/faq";
import Socials from "@/components/templates/socials";
import { NextPageProps } from "@/types/app.types";
import {
  getArticleCategories,
  getArticles,
} from "@/lib/fetchs";
import SelectSearchParamsFilter from "@/components/modules/selectSearchParamsFilter";
import SearchParamsSearch from "@/components/modules/searchParamsSearch";
import SpPagination from "@/components/modules/spPagination";
import ArticleCard from "@/components/modules/articleCard";
import Breadcrumbs from "@/components/modules/breadcrumbs";
import ArticlesMobileDrawer from "@/components/templates/articlesMobileDrawer";

async function ArticlesPage({ searchParams }: NextPageProps) {
  const sp = await searchParams;

  const pageNumber = +(sp.pageNumber || "NaN") || 1;
  const search = sp.search;
  const category = sp.category;

  const [categories, articles] = await Promise.all([
    getArticleCategories(),
    getArticles({
      blogPostCategoryId: category && category !== "all" ? +category : null,
      keyword: search || "",
      pageNumber: pageNumber,
      pageSize: 10,
      orderBy: [""],
    }),
  ]);

  const categoryOptions = [
    { label: "همه مقالات", value: "all" },
    ...(categories.result?.data || []).map((cat) => ({
      label: cat.title,
      value: cat.id.toString(),
    })),
  ];

  return (
    <>
      <Breadcrumbs links={[{ name: "اخبار و مقالات", href: "/articles" }]} />

      <div className="wrapper mt-3 lg:mt-6">
        <div className="flex items-center max-lg:flex-col gap-3 mt-6">
          <h6 className="heading lg:pe-6 lg:border-e-2">دسته بندی مقالات</h6>

          <div className="max-lg:w-full flex items-center justify-center gap-3">
            <SearchParamsSearch
              className="w-full lg:w-96"
              placeholder="جستجو مقالات..."
            />
            <SelectSearchParamsFilter
              className="w-52 max-w-full max-lg:hidden"
              searchParamsKey="category"
              options={categoryOptions}
              placeholder="دسته بندی..."
            />
            <ArticlesMobileDrawer categories={categoryOptions} />
          </div>
        </div>

        <div className="card-grid-wrapper mt-6">
          {articles.result?.data?.data?.map((item) => (
            <ArticleCard key={item.id} article={item} />
          ))}
        </div>

        <SpPagination
          pageSize={10}
          className="mt-6"
          pageParamName="pageNumber"
          totalPages={articles.result?.data?.totalPages}
          totalCount={articles.result?.data?.totalCount}
        />
      </div>

      <Faq />
      <Socials />
    </>
  );
}

export default ArticlesPage;
