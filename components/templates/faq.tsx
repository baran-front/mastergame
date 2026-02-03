import Image from "next/image";

import faqImg from "@/public/images/faq.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Link from "next/link";
import { Button } from "../ui/button";
import { getFaqs } from "@/lib/fetchs";

async function Faq() {
  const faqs = await getFaqs({
    pageNumber: 1,
    pageSize: 5,
    keyword: "",
    orderBy: [""],
  });

  return (
    <div className="wrapper grid grid-cols-1 lg:grid-cols-2 gap-6 mt-24 lg:mt-40">
      <div>
        <h6 className="heading max-lg:text-center">
          سوالات متداول راهنمای جامع فعالیت در دنیای گیم و دیجیتال
        </h6>
        <p className="typhography mt-6 max-lg:text-center">
          تو این بخش، رایج‌ترین سوالات شما رو جمع‌آوری کردیم تا سریع جواب‌هاش رو پیدا کنید. هدف ما اینه که خرید و استفاده از اکانت‌ها براتون راحت و بدون دردسر باشه. نکات مهم درباره امنیت، نحوه خرید و فعال‌سازی سرویس‌ها رو هم پوشش دادیم. با خوندن این قسمت، کمتر نیاز به پشتیبانی پیدا می‌کنید. هر سوالی باقی بمونه، تیم ما همیشه آماده پاسخگوییه.
        </p>
        <Image
          src={faqImg}
          alt="faq"
          width={447}
          height={377}
          className="w-full lg:w-3/4 mt-6"
        />
      </div>

      <div>
        <Accordion collapsible type="single" className="space-y-6">
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

        <Link
          href={"/faq"}
          className="w-full flex items-center justify-center mt-6"
        >
          <Button>
            <span>مشاهده همه</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Faq;
