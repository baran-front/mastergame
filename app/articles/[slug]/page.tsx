import Image from "next/image";
import { ArrowLeftIcon, StarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NextPageProps } from "@/types/app.types";
import CommentForm from "@/components/templates/commentForm";
import ArticleDetailContent from "@/components/templates/articleDetailContent";
import { getArticleDetail, getArticles, getComments } from "@/lib/fetchs";
import { brand } from "@/brand";
import ArticleCard from "@/components/modules/articleCard";

async function ArticleDetailPage({ params }: NextPageProps) {
  const slug = (await params).slug as string;

  const article = await getArticleDetail({ slug });

  if (!article.result?.data) {
    return (
      <div className="wrapper mt-24 lg:mt-40">
        <p className="card text-center">مقاله مورد نظر یافت نشد</p>
      </div>
    );
  }

  const [articles, comments] = await Promise.all([
    getArticles({
      blogPostCategoryId: article.result.data.id,
      keyword: "",
      pageNumber: 1,
      pageSize: 6,
      orderBy: [""],
    }),
    getComments({
      blogId: article.result.data.id,
      pageNumber: 1,
      pageSize: 999,
      orderBy: [""],
    }),
  ]);

  return (
    <>
      <ArticleDetailContent article={article.result?.data} />

      <div className="wrapper grid grid-cols-1 lg:grid-cols-5 gap-6 mt-24 lg:mt-40">
        <CommentForm type="article" typeId={article.result.data.id.toString()} />

        <div className="lg:col-span-3">
          {comments.result?.data.length ? comments.result?.data?.map((item) => (
            <div key={item.id} className="card not-first:mt-6">
              <div className="flex items-center gap-3">
                <Image
                  width={48}
                  height={48}
                  className="rounded-full"
                  alt={item.userFullName || ""}
                  src={brand.apiBaseUrl + (item.userThumbnail || "")}
                />
                <div>
                  <p className="font-yekan-bakh-bold">{item.userFullName}</p>
                  <p className="text-sm opacity-50">
                    {new Date(item.createdOn).toLocaleDateString("fa")}
                  </p>
                </div>

                <div className="flex items-center mr-auto gap-1.5" dir="ltr">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`size-4 ${item.rate && item.rate >= star
                        ? "text-yellow-500 fill-yellow-500"
                        : ""
                        }`}
                    />
                  ))}
                </div>
              </div>
              <p className="leading-relaxed mt-3">
                {item.title} {item.text}
              </p>

              {item.children.length
                ? item.children.map((childItem) => (
                  <div
                    key={childItem.id}
                    className="pr-6 mr-6 mt-6 border-r-2 separator-border"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        width={48}
                        height={48}
                        className="rounded-full"
                        alt={childItem.userFullName || ""}
                        src={
                          brand.apiBaseUrl + (childItem.userThumbnail || "")
                        }
                      />
                      <div>
                        <p className="font-yekan-bakh-bold">
                          {childItem.userFullName}
                        </p>
                        <p className="text-sm opacity-50">
                          {new Date(childItem.createdOn).toLocaleDateString(
                            "fa"
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="leading-relaxed mt-3">
                      {childItem.title} {childItem.text}
                    </p>
                  </div>
                ))
                : null}
            </div>
          )) : <p className="card">هیچ نظری ثبت نشده است</p >}
        </div>
      </div>

      {articles.result?.data?.data?.length ? (
        <div className="wrapper mt-24 lg:mt-40">
          <div className="flex items-center justify-between">
            <h6 className="heading">مقالات مشابه</h6>
            <Button variant={"soft"}>
              <span>مشاهده همه</span>
              <ArrowLeftIcon className="size-5" />
            </Button>
          </div>

          <div className="card-flex-wrapper mt-6">
            {articles.result.data.data.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ArticleDetailPage;
