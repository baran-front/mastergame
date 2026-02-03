"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import contactUsFormImage from "@/public/images/contact-us.webp";
import { Input } from "./../ui/input";
import { Button } from "./../ui/button";
import { Textarea } from "./../ui/textarea";
import { postContactUs } from "@/lib/fetchs";
import { contactFormSchema, ContactFormValues } from "@/lib/validations";

function ContactUsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ContactFormValues) => {
    const res = await postContactUs({
      email: data.contact_channel,
      firstName: data.fullname,
      lastName: data.fullname,
      message: data.message,
      jsonExt: "",
      type: 0,
      responseStatus: 0,
    });

    if (res?.result?.data) {
      toast.success("درخواست ارسال شد");
      reset();
    } else {
      toast.error("خطای ناشناس سمت سرور");
    }
  };

  return (
    <div className="wrapper mt-3 lg:mt-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card grid grid-cols-1 lg:grid-cols-2 gap-6 p-6"
      >
        <Image
          width={320}
          height={480}
          alt="ارتباط با ما"
          src={contactUsFormImage}
          className="w-full max-w-[320px] mx-auto"
        />
        <div className="flex justify-center flex-col max-lg:items-center">
          <h1 className="heading">ارتباط با ما</h1>
          <p className="leading-relaxed max-lg:text-center mt-6">
            برای هر سوال، پیشنهاد یا نیاز به پشتیبانی، می‌توانید از طریق فرم زیر با ما در ارتباط باشید.
            تیم ما آماده پاسخ‌گویی سریع و راهنمایی شما در زمینه محصولات و خدمات است.
          </p>
          <div className="w-full flex flex-col gap-6 mt-6">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Input
                  {...register("fullname")}
                  placeholder="نام و نام خانوادگی"
                  aria-invalid={!!errors.fullname}
                />
                {errors.fullname && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullname.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  {...register("contact_channel")}
                  type="email"
                  placeholder="آدرس Email"
                  aria-invalid={!!errors.contact_channel}
                />
                {errors.contact_channel && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contact_channel.message}
                  </p>
                )}
              </div>
              <div className="lg:col-span-2">
                <Textarea
                  {...register("message")}
                  className="lg:col-span-2"
                  placeholder="نوشتن نظر..."
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>
            </div>
            <Button
              className="sm:w-max sm:mr-auto max-sm:w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "در حال ارسال..." : "ارسال نظر"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ContactUsForm;
