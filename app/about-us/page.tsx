import Image from "next/image";
import { StarIcon } from "lucide-react";

import aboutUsImg from "@/public/images/about-us.png";
import aboutUsOurValuesImg from "@/public/images/about-us_our-values.png";
import aboutUsOurFutureImg from "@/public/images/about-us_our-future.png";
import aboutUsOurMissionImg from "@/public/images/about-us_our-mission.png";
import aboutUsOurAbilitiesImg from "@/public/images/about-us_our-abilities.png";
import Socials from "@/components/templates/socials";
import Breadcrumbs from "@/components/modules/breadcrumbs";

function AboutUsPage() {
  return (
    <>
      <Breadcrumbs links={[{ name: "درباره ما", href: "/about-us" }]} />

      <div className="wrapper grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3 lg:mt-6">
        <div className="flex flex-col max-lg:items-center justify-center">
          <h1 className="heading">درباره مستر گیم</h1>
          <p className="typhography mt-6">
            مسترگیم جاییه که دنیای بازی و سرگرمی رو براتون ساده کرده‌ایم. ما در فروش اکانت‌های بازی، اسپاتیفای، یوتیوب و سرویس‌های دیجیتال، تجربه‌ای امن و سریع ارائه می‌کنیم. هدف ما راحتی شما در خرید و دسترسی به سرویس‌هاست، بدون دغدغه و پیچیدگی. با تمرکز روی کیفیت و امنیت، همیشه سعی داریم اعتماد شما رو جلب کنیم. ما اینجا هستیم تا سرگرمی شما همیشه در دسترس و لذت‌بخش باشه.
          </p>
        </div>
        <Image
          width={616}
          height={393}
          src={aboutUsImg}
          alt="درباره مستر گیم"
          className="max-lg:row-start-1 max-w-full mx-auto"
        />
      </div>

      <div className="wrapper mt-24 lg:mt-40 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="flex justify-center flex-col max-lg:items-center lg:col-span-2">
          <h1 className="heading">داستان ما</h1>
          <p className="mt-6 typhography opacity-75 text-center lg:text-justify">
            مسترگیم جاییه که دنیای بازی و سرگرمی رو براتون ساده کرده‌ایم. ما در فروش اکانت‌های بازی، اسپاتیفای، یوتیوب و سرویس‌های دیجیتال، تجربه‌ای امن و سریع ارائه می‌کنیم. هدف ما راحتی شما در خرید و دسترسی به سرویس‌هاست، بدون دغدغه و پیچیدگی. با تمرکز روی کیفیت و امنیت، همیشه سعی داریم اعتماد شما رو جلب کنیم. ما اینجا هستیم تا سرگرمی شما همیشه در دسترس و لذت‌بخش باشه.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 font-yekan-bakh-bold">
          <div className="aspect-video card border border-transparent hover:border-primary shadow-2xl shadow-transparent hover:shadow-primary/10 flex items-center justify-center flex-col">
            <span className="text-2xl lg:text-3xl text-primary">+1000</span>
            <span className="text-sm lg:text-base">محصول</span>
          </div>
          <div className="aspect-video card border border-transparent hover:border-primary shadow-2xl shadow-transparent hover:shadow-primary/10 flex items-center justify-center flex-col">
            <span className="text-2xl lg:text-3xl text-primary">100%</span>
            <span className="text-sm lg:text-base">امنیت بیشتر</span>
          </div>
          <div className="aspect-video card border border-transparent hover:border-primary shadow-2xl shadow-transparent hover:shadow-primary/10 flex items-center justify-center flex-col">
            <span className="text-2xl lg:text-3xl text-primary">+10</span>
            <span className="text-sm lg:text-base">دسته بندی مختلف</span>
          </div>
          <div className="aspect-video card border border-transparent hover:border-primary shadow-2xl shadow-transparent hover:shadow-primary/10 flex items-center justify-center flex-col">
            <span className="text-2xl lg:text-3xl text-primary">+5</span>
            <span className="text-sm lg:text-base">سال تجربه</span>
          </div>
        </div>
      </div>

      <div className="wrapper mt-24 lg:mt-40 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Image
          width={616}
          height={393}
          alt="Our mission"
          src={aboutUsOurMissionImg}
          className="rounded-2xl w-full h-auto"
        />
        <div className="flex justify-center flex-col max-lg:items-center">
          <h2 className="heading">ماموریت ما</h2>
          <p className="mt-6 typhography max-lg:text-center text-justify">
            ماموریت مسترگیم اینه که دسترسی به سرویس‌ها و اکانت‌های دیجیتال رو برای همه ساده و امن کنیم. ما می‌خوایم تجربه خرید و استفاده از بازی‌ها و سرویس‌ها بدون دردسر باشه. تمرکز ما روی کیفیت، امنیت و پشتیبانی سریعه تا همیشه رضایت شما حفظ بشه. با هر خرید، هدف ما ایجاد اعتماد و راحتی بیشتر برای شماست. در نهایت، می‌خوایم سرگرمی و دیجیتال لذت‌بخش‌تر و در دسترس‌تر باشه.
          </p>
        </div>
      </div>

      <div className="wrapper mt-24 lg:mt-40 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex justify-center flex-col max-lg:items-center">
          <h2 className="heading">ویژگی‌های منحصربه‌فرد ما</h2>
          <p className="mt-6 typhography max-lg:text-center text-justify">
            در مسترگیم، تجربه‌ای متفاوت از خرید اکانت‌ها ارائه می‌کنیم. امنیت بالا و ضمانت اصالت اکانت‌ها همیشه اولویت ماست. خرید سریع و بدون پیچیدگی، همراه با پشتیبانی ۲۴ ساعته، شما رو بی‌دغدغه نگه می‌داره. تنوع سرویس‌ها و اکانت‌ها باعث می‌شه هر چیزی که می‌خوای راحت پیدا کنی. ما همیشه دنبال راه‌هایی هستیم که تجربه دیجیتال شما ساده‌تر و لذت‌بخش‌تر بشه.
          </p>
        </div>
        <Image
          width={616}
          height={393}
          alt="Our mission"
          src={aboutUsOurAbilitiesImg}
          className="rounded-2xl w-full h-auto max-lg:row-start-1"
        />
      </div>

      <div className="wrapper mt-24 lg:mt-40">
        <h2 className="heading max-lg:text-center">چهارچوب ارزش‌های ویرالرن</h2>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Image
            width={616}
            height={393}
            alt="Our mission"
            src={aboutUsOurValuesImg}
            className="rounded-2xl w-full h-auto lg:sticky lg:top-26"
          />
          <div className="flex justify-center flex-col gap-6 max-lg:items-center">
            <div className="card p-6 group border border-transparent hover:border-primary shadow-2xl shadow-transparent hover:shadow-primary/10">
              <div className="flex items-center gap-3">
                <StarIcon className="text-primary fill-primary size-7" />
                <p className="title">یکپارچگی در خدمات</p>
              </div>
              <p className="mt-6 typhography">
                مسترگیم همه خدماتش رو یکپارچه کرده تا تجربه‌ای روان و بدون دردسر داشته باشی. از خرید تا پشتیبانی، همه چیز هماهنگ و سریع انجام می‌شه. هدف ما راحتی و رضایت کامل شماست.
              </p>
            </div>

            <div className="card p-6 group border border-transparent hover:border-primary shadow-2xl shadow-transparent hover:shadow-primary/10">
              <div className="flex items-center gap-3">
                <StarIcon className="text-primary fill-primary size-7" />
                <p className="title">تمرکز بر امنیت</p>
              </div>
              <p className="mt-6 typhography">
                امنیت اکانت‌ها و اطلاعات شما اولویت اصلی مسترگیمه. همه تراکنش‌ها و سرویس‌ها با بالاترین استانداردهای امنیتی محافظت می‌شن. هدف ما خریدی امن و بدون نگرانی برای شماست.
              </p>
            </div>

            <div className="card p-6 group border border-transparent hover:border-primary shadow-2xl shadow-transparent hover:shadow-primary/10">
              <div className="flex items-center gap-3">
                <StarIcon className="text-primary fill-primary size-7" />
                <p className="title">نوآوری مستمر</p>
              </div>
              <p className="mt-6 typhography">
                مسترگیم همیشه دنبال راه‌های تازه برای بهبود تجربه شماست. با به‌روزرسانی سرویس‌ها و معرفی امکانات جدید، خرید و استفاده از اکانت‌ها ساده‌تر و جذاب‌تر می‌شه. هدف ما ارائه تجربه‌ای نوآورانه و همیشه به‌روز برای کاربرانه.
              </p>
            </div>

            <div className="card p-6 group border border-transparent hover:border-primary shadow-2xl shadow-transparent hover:shadow-primary/10">
              <div className="flex items-center gap-3">
                <StarIcon className="text-primary fill-primary size-7" />
                <p className="title"> ساده‌سازی فرایندهای بازی</p>
              </div>
              <p className="mt-6 typhography">
                مسترگیم فرایند خرید و استفاده از اکانت‌ها و سرویس‌ها رو ساده و سریع کرده. همه چیز طوری طراحی شده که بدون پیچیدگی و نگرانی بازی و سرویس‌ها در دسترس باشه. هدف ما تجربه‌ای راحت و لذت‌بخش برای شماست.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="wrapper mt-24 lg:mt-40 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex justify-center flex-col max-lg:items-center">
          <h2 className="heading">چشم‌انداز آینده</h2>
          <p className="mt-6 typhography max-lg:text-center text-justify">
            چشم‌انداز مسترگیم اینه که تبدیل به مرجع اول خرید امن و راحت اکانت‌ها و سرویس‌های دیجیتال بشه. ما به دنبال توسعه سرویس‌ها و ایجاد تجربه‌ای نوآورانه برای کاربران هستیم. هدف نهایی، دسترسی آسان و لذت‌بخش به دنیای دیجیتال برای همه‌ست.
          </p>
        </div>
        <Image
          width={616}
          height={393}
          alt="Our mission"
          src={aboutUsOurFutureImg}
          className="rounded-2xl w-full h-auto"
        />
      </div>

      <Socials />
    </>
  );
}

export default AboutUsPage;
