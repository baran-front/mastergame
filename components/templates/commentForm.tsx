"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { StarIcon, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { postComment } from "@/lib/fetchs";
import { commentFormSchema, CommentFormValues } from "@/lib/validations";
import { useState } from "react";
import { getCookie } from "cookies-next/client";

type Props = { type: "article" | "product"; typeId: string };

function CommentForm({ type, typeId }: Props) {
  const [token] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return getCookie("token") || "";
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      fullName: "",
      title: "",
      rating: 5,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const rating = watch("rating");

  async function onSubmit(values: CommentFormValues) {
    const res = await postComment({
      blogId: type === "article" ? +typeId : undefined,
      productId: type === "product" ? typeId : undefined,
      title: values.title.trim(),
      rate: +values.rating,
      token
    });

    if (res.status === 200) {
      toast.success("نظر شما ثبت شد");
      reset();
    } else {
      if (res.status === 401) {
        toast.error("لطفا ابتدا وارد شوید");
      } else {
        toast.error("مشکلی در ثبت نظر رخ داد. لطفا دوباره تلاش کنید");
      }
    }
  }

  const handleStarClick = (starValue: number) => {
    setValue("rating", starValue, { shouldValidate: true });
  };

  return (
    <form
      id="comment"
      onSubmit={handleSubmit(onSubmit)}
      className="card lg:h-max lg:sticky lg:top-26 lg:max-h-[calc(100vh-5rem)] lg:col-span-2 lg:overflow-y-auto space-y-3 max-lg:row-start-1"
    >
      <p className="title">ثبت دیدگاه</p>

      <div className="flex items-start max-sm:flex-col gap-3">
        <div className="w-full sm:w-1/2">
          <label className="text-xs">
            نام و نام خانوادگی <span className="text-red-500">*</span>
          </label>
          <InputGroup className="mt-1.5">
            <InputGroupInput
              dir="rtl"
              placeholder="نام و نام خانوادگی"
              aria-invalid={!!errors.fullName}
              {...register("fullName")}
            />
            <InputGroupAddon>
              <UserIcon />
            </InputGroupAddon>
          </InputGroup>
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-2">
              {errors.fullName.message}
            </p>
          )}
        </div>
        <div className="w-full sm:w-1/2">
          <label className="text-xs">
            به مقاله چه امتیازی می دهید؟ <span className="text-red-500">*</span>
          </label>
          <div className="mt-1.5 border-input dark:bg-input/30 flex w-full items-center justify-between rounded-full border shadow-xs transition-all outline-none h-9 min-w-0 px-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`امتیاز ${star} از 5`}
                  onClick={() => handleStarClick(star)}
                  className="transition-transform not-active:hover:scale-125"
                >
                  <StarIcon
                    className={`size-5 transition-colors ${star <= rating ? "text-yellow-500 fill-yellow-500" : ""
                      }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm font-medium">{rating}/5</span>
          </div>
          {errors.rating && (
            <p className="text-red-500 text-xs pr-2 mt-1">
              {errors.rating.message}
            </p>
          )}
        </div>
      </div>

      <label className="text-xs">
        متن دیدگاه <span className="text-red-500">*</span>
      </label>
      <InputGroup className="mt-1.5">
        <InputGroupTextarea
          dir="rtl"
          placeholder="متن دیدگاه..."
          aria-invalid={!!errors.title}
          {...register("title")}
        />
      </InputGroup>
      {errors.title && (
        <p className="text-red-500 text-xs pr-2">{errors.title.message}</p>
      )}

      <div className="flex justify-end w-full">
        <Button type="submit" className="mr-auto" disabled={isSubmitting}>
          {isSubmitting ? "در حال ارسال..." : "ارسال نظر"}
        </Button>
      </div>
    </form>
  );
}

export default CommentForm;
