import Faq from "@/components/templates/faq";
import Socials from "@/components/templates/socials";
import HeroCarousel from "@/components/templates/heroCarousel";
import { getCategory, getPageInfo } from "@/lib/fetchs";
import { getArticles } from "@/lib/fetchs";
import Articles from "@/components/templates/articles";
import GamesSection from "@/components/templates/home/gamesSection";
import SpecialOffersSection from "@/components/templates/home/specialOffersSection";
import GiftCardsSection from "@/components/templates/home/giftCardsSection";
import AccountsSection from "@/components/templates/home/accountsSection";
import LeftBannersSection from "@/components/templates/home/leftBannersSection";
import Banners2Section from "@/components/templates/home/banners2Section";
import BestSellersSection from "@/components/templates/home/bestSellersSection";

async function Page() {
  const pageInfo = await getPageInfo({ pageId: "2" });

  const rightBanners = pageInfo.result?.data?.pageSections.find((section) => section.title === "بنر راست");
  const leftBanners = pageInfo.result?.data?.pageSections.find((section) => section.title === "بنر چپ");
  const games = pageInfo.result?.data?.pageSections.find((section) => section.title === "بازی ها");
  const specialOffers = pageInfo.result?.data?.pageSections.find((section) => section.title === "پیشنهادات ویژه");
  const giftCards = pageInfo.result?.data?.pageSections.find((section) => section.title === "گیفت کارت ها");
  const banners2 = pageInfo.result?.data?.pageSections.find((section) => section.title === "بنر های 2");
  const accounts = pageInfo.result?.data?.pageSections.find((section) => section.title === "اکانت ها");
  const bestSellers = pageInfo.result?.data?.pageSections.find((section) => section.title === "پرفروش ترین ها");

  const categories = ((await getCategory({ type: 1 })).result?.data || []).map(
    (category) => ({
      label: category.name,
      value: category.id.toString(),
    })
  );

  const articles = await getArticles({
    blogPostCategoryId: null,
    keyword: null,
    pageNumber: 1,
    pageSize: 4,
    orderBy: ["NEWEST"],
  });

  return (
    <>
      <div className="wrapper mt-12 lg:mt-24">
        <div className="md:h-96 grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 lg:gap-9">
          <HeroCarousel carousel={rightBanners} />
          <LeftBannersSection leftBanners={leftBanners} />
        </div>
      </div>

      <GamesSection games={games} />

      <SpecialOffersSection specialOffers={specialOffers} />

      <GiftCardsSection giftCards={giftCards} />

      <Banners2Section banners2={banners2} />

      <AccountsSection accounts={accounts} />

      {/* <PremiumAccountsSection premiumAccounts={premiumAccounts} /> */}

      <BestSellersSection bestSellers={bestSellers} categories={categories} />

      <Faq />
      <Articles articles={articles.result?.data?.data || []} />
      <Socials />
    </>
  );
}

export default Page;
