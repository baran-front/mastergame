import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import failedImg from "@/public/images/cart-result-failed.png";
import successImg from "@/public/images/cart-result-success.png";
import { NextPageProps } from "@/types/app.types";

const isSuccess = true;

async function CartResultPage({ searchParams }: NextPageProps) {
  const sp = await searchParams;
  const { status } = sp;
  const isSuccess = status === "success";

  return (
    <>
      <div className="wrapper mt-3 lg:mt-6">
        <div className="max-w-2xl flex flex-col justify-center items-center card space-y-6 mx-auto">
          <Image
            width={200}
            height={200}
            className="my-12"
            src={isSuccess ? successImg : failedImg}
            alt={isSuccess ? "پرداخت موفقیت آمیز" : "پرداخت ناموفق"}
          />
          <h1 className="title">
            {isSuccess ? "پرداخت موفقیت آمیز" : "پرداخت ناموفق"}
          </h1>
          <p className="text-center">
            {isSuccess
              ? "محصولا ت در پنل کاربری قابل مشاهده است"
              : "پرداخت به دلایل فنی با خطا مواجه شد \n لطفا دوباره تلاش کنید"}
          </p>
          <Link href={isSuccess ? "/dashboard/orders" : "/cart"}>
            <Button>
              {isSuccess ? "مشاهده سفارشات" : "بازگشت به سبد خرید"}
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default CartResultPage;
