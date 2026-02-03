"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  XIcon,
  MessageSquareTextIcon,
  SendHorizonalIcon,
  ChevronLeftIcon,
} from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { createTicket } from "@/lib/fetchs";
import { toast } from "sonner";

const PRIORITY_OPTIONS = [
  { label: "کم", value: "1" },
  { label: "متوسط", value: "2" },
  { label: "زیاد", value: "3" },
];

const SUBJECT_OPTIONS = [
  { label: "پشتیبانی", value: "support" },
  { label: "مشکل فنی", value: "technical" },
  { label: "حساب کاربری", value: "account" },
  { label: "سفارش", value: "order" },
  { label: "سایر", value: "other" },
];

const ticketFormSchema = z.object({
  subject: z.string().min(1, "موضوع درخواست الزامی است"),
  title: z.string().min(1, "عنوان پیام الزامی است"),
  priority: z.string().min(1, "الویت پیام الزامی است"),
  message: z.string().min(1, "پیام الزامی است"),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

function DashboardNewTicketPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = getCookie("token") || "";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      subject: "",
      title: "",
      priority: "",
      message: "",
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: (response) => {
      if (response.status === 200) {
        toast.success("تیکت با موفقیت ایجاد شد");
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
        router.push(`/dashboard/support/${response.result?.data}`);
      } else {
        toast.error("خطا در ایجاد تیکت");
      }
    },
    onError: () => {
      toast.error("خطا در ایجاد تیکت");
    },
  });

  const onSubmit = (data: TicketFormValues) => {
    if (!token) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    // Calculate expiration date (e.g., 30 days from now)
    const expairDate = new Date();
    expairDate.setDate(expairDate.getDate() + 30);

    createTicketMutation.mutate({
      token,
      subject: data.title,
      priority: +data.priority,
      expairDate: expairDate.toISOString(),
      ticketMessages: [
        {
          message: data.message,
        },
      ],
    });
  };

  return (
    <>
      <div className="card flex items-center space-y-0 justify-between gap-3 mb-6 lg:hidden">
        <h1 className="title">ثبت تیکت جدید</h1>
        <Link href={"/dashboard/support"}>
          <Button variant={"outline"} size={"icon"}>
            <ChevronLeftIcon />
          </Button>
        </Link>
      </div>

      <h1 className="heading max-lg:hidden">ثبت تیکت جدید</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-3 mt-6 gap-6">
          <div>
            <label htmlFor="subject">
              موضوع درخواست <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="subject"
              render={({ field }) => (
                <Select
                  dir="rtl"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="subject" className="mt-3 w-full">
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {SUBJECT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.subject && (
              <p className="text-sm text-red-500 mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="title">
              عنوان پیام <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              className="mt-3 w-full"
              placeholder="عنوان پیام"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="priority">
              اولویت پیام <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select
                  dir="rtl"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="priority" className="mt-3 w-full">
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {PRIORITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && (
              <p className="text-sm text-red-500 mt-1">
                {errors.priority.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6">
          <InputGroup>
            <InputGroupTextarea
              placeholder="بنویسید..."
              {...register("message")}
            />
            <InputGroupAddon>
              <MessageSquareTextIcon />
            </InputGroupAddon>
          </InputGroup>
          {errors.message && (
            <p className="text-sm text-red-500 mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end max-sm:flex-col-reverse gap-3 mt-6">
          <Link className="max-sm:w-full" href={"/dashboard/support"}>
            <Button className="max-sm:w-full" type="button" variant="outline">
              <XIcon />
              <span>انصراف</span>
            </Button>
          </Link>
          <Button
            type="submit"
            className="max-sm:w-full"
            disabled={isSubmitting || createTicketMutation.isPending}
          >
            <span>ارسال</span>
            <SendHorizonalIcon className="-scale-x-100" />
          </Button>
        </div>
      </form>
    </>
  );
}

export default DashboardNewTicketPage;
