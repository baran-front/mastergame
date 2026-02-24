"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

function ErrorPage({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    console.error("Next.js error --->", error);
  }, [error])

  return (
    <div className="w-screen h-[calc(100vh-5rem)] flex flex-col justify-center items-center gap-6">
      <h1 className="heading">مشکلی رخ داده است!</h1>
      <p className="title">لطفا بعدا دوباره امتحان کنید</p>
      <Link href={"/"}>
        <Button>
          بازشگت به صفحه اصلی
        </Button>
      </Link>
    </div>
  )
}

export default ErrorPage