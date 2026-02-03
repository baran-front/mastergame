import { z } from "zod";

// ============================================
// Contact Us Form Schema
// ============================================

export const contactFormSchema = z.object({
  fullname: z
    .string()
    .min(2, "نام و نام خانوادگی باید حداقل ۲ کاراکتر باشد")
    .max(100, "نام و نام خانوادگی نمی‌تواند بیش از ۱۰۰ کاراکتر باشد"),
  contact_channel: z.string().email("لطفا یک ایمیل معتبر وارد کنید"),
  message: z
    .string()
    .min(10, "پیام باید حداقل ۱۰ کاراکتر باشد")
    .max(1000, "پیام نمی‌تواند بیش از ۱۰۰۰ کاراکتر باشد"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// ============================================
// Comment Form Schema
// ============================================

export const commentFormSchema = z.object({
  fullName: z.string().min(3, "حداقل 3 کاراکتر").max(100, "حداکثر 100 کاراکتر"),
  title: z.string().min(3, "حداقل 3 کاراکتر"),
  rating: z.number().min(1, "لطفا امتیاز دهید").max(5),
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;

// ============================================
// Login Form Schemas
// ============================================

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, "شماره موبایل باید ۱۰ رقم باشد")
    .max(10, "شماره موبایل باید ۱۰ رقم باشد")
    .regex(/^\d{10}$/, "فقط اعداد ۰-۹ مجاز است"),
});

export type PhoneFormValues = z.infer<typeof phoneSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "کد تایید باید ۶ رقم باشد")
    .regex(/^\d{6}$/, "کد تایید نامعتبر است"),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

// ============================================
// Representative Form Schema
// ============================================

export const representativeFormSchema = z.object({
  request: z
    .string()
    .min(1, "کد معرف الزامی است")
    .max(50, "کد معرف نمی‌تواند بیش از ۵۰ کاراکتر باشد"),
});

export type RepresentativeFormValues = z.infer<typeof representativeFormSchema>;
