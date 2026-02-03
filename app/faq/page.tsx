import Image from "next/image";

import faqPageImage from "@/public/images/faq-page.png";
import { getFaqs } from "@/lib/fetchs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Breadcrumbs from "@/components/modules/breadcrumbs";

async function FAQPage() {
  const faqs = await getFaqs({
    pageNumber: 1,
    pageSize: 999,
    keyword: "",
    orderBy: [""],
  });

  return (
    <>
      <Breadcrumbs links={[{ name: "سوالات متداول", href: "/faq" }]} />

      <div className="wrapper grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3 lg:mt-6">
        <div className="flex flex-col justify-center max-lg:items-center">
          <h1 className="heading">سوالات متداول</h1>
          <p className="mt-3 typhography max-lg:text-center">
            تو این بخش، رایج‌ترین سوالات شما رو جمع‌آوری کردیم تا سریع جواب‌هاش رو پیدا کنید. هدف ما اینه که خرید و استفاده از اکانت‌ها براتون راحت و بدون دردسر باشه. نکات مهم درباره امنیت، نحوه خرید و فعال‌سازی سرویس‌ها رو هم پوشش دادیم. با خوندن این قسمت، کمتر نیاز به پشتیبانی پیدا می‌کنید. هر سوالی باقی بمونه، تیم ما همیشه آماده پاسخگوییه.
          </p>
        </div>
        <Image
          width={616}
          height={393}
          src={faqPageImage}
          alt="سوالات متداول"
          className="max-lg:row-start-1 mx-auto"
        />
      </div>

      <div className="wrapper mt-24 lg:mt-40">
        <Accordion
          type="single"
          collapsible
          defaultValue="item-1"
          className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3"
        >
          {faqs.result?.data?.map((item) => (
            <AccordionItem
              key={item.id}
              className="w-full"
              value={`item-${item.id}`}
            >
              <AccordionTrigger className="w-full">
                {item.title}
              </AccordionTrigger>
              <AccordionContent>
                <p>{item.description}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}

export default FAQPage;
