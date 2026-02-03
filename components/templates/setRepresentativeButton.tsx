"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next/client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { setRepresentative } from "@/lib/fetchs";
import { representativeFormSchema, RepresentativeFormValues } from "@/lib/validations";

function SetRepresentativeButton() {
  const [open, setOpen] = useState(false);
  const token = getCookie("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RepresentativeFormValues>({
    resolver: zodResolver(representativeFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RepresentativeFormValues) => {
    if (!token) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    try {
      const response = await setRepresentative({
        request: data.request.trim(),
        token,
      });

      if (response.status === 200) {
        toast.success(
          response.result?.messages?.[0] || "کد معرف با موفقیت ثبت شد"
        );
        reset();
        setOpen(false);
      } else {
        toast.error(response.result?.messages?.[0] || "خطا در ثبت کد معرف");
      }
    } catch (error) {
      console.error("Error setting representative:", error);
      toast.error("خطا در ثبت کد معرف");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="max-sm:w-full">کد معرفتان را وارد کنید</Button>
      </DialogTrigger>
      <DialogContent className="w-xl">
        <DialogHeader>
          <DialogTitle>ثبت کد معرف</DialogTitle>
          <DialogDescription>شما با ثبت کد معرف شخص دیگر، وارد زیر مجموعه های آن می‌شوید.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Input
                {...register("request")}
                placeholder="کد معرف"
                aria-invalid={!!errors.request}
              />
              {errors.request && (
                <p className="text-red-500 text-sm">{errors.request.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "در حال ثبت..." : "ثبت"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SetRepresentativeButton;
