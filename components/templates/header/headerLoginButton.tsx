import { setCookie } from "cookies-next";
import { ComponentProps, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { UserIcon } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getMe, sendCode, sendOtp } from "@/lib/fetchs";
import { phoneSchema, otpSchema, PhoneFormValues, OtpFormValues } from "@/lib/validations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useLoginModal } from "@/components/providers/loginModalProvider";

function HeaderLoginButton({ ...props }: ComponentProps<typeof Button>) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isOpen, closeModal } = useLoginModal();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [submittedPhone, setSubmittedPhone] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors: phoneErrors, isSubmitting: isSubmittingPhone },
    reset: resetPhoneForm,
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
    mode: "onSubmit",
  });

  const {
    control,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors, isSubmitting: isSubmittingOtp },
    reset: resetOtpForm,
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
    mode: "onSubmit",
  });

  const maskedPhone = useMemo(() => {
    if (!submittedPhone) {
      return "+98**********";
    }
    const masked = submittedPhone.replace(/\d(?=\d{4})/g, "*");
    return `+98${masked}`;
  }, [submittedPhone]);

  async function onSubmitPhone(values: PhoneFormValues) {
    const formattedPhone = `0${values.phone}`;
    const response = await sendOtp({ phoneNumber: formattedPhone });

    if (response.status !== 200) {
      toast.error("ارسال کد تایید با خطا مواجه شد");
      return;
    }

    const token = response.result?.messages?.[0];

    if (!token) {
      toast.error("پاسخی معتبر از سرور دریافت نشد");
      return;
    }

    setOtpToken(token);
    setIsOtpMode(true);
    setSubmittedPhone(values.phone);
    resetOtpForm();

    toast.success("کد تایید برای شما ارسال شد");
  }

  async function onSubmitOtp(values: OtpFormValues) {
    if (!otpToken || !submittedPhone) {
      toast.error("خطای ناشناس، لطفا دوباره تلاش کنید.");
      setIsOtpMode(false);
      return;
    }

    const formattedPhone = `0${submittedPhone}`;
    const response = await sendCode({
      phoneNumber: formattedPhone,
      code: values.otp,
      token: otpToken,
    });

    if (response.status !== 200) {
      toast.error("تایید کد با خطا مواجه شد. لطفا دوباره تلاش کنید");
      return;
    }

    const token = response.result?.data?.token;
    if (!token) {
      toast.error("توکن دریافت نشد");
      return;
    }

    setCookie("token", token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });

    toast.success("ورود با موفقیت انجام شد!");

    // Refresh 'user' query so header reflects the authenticated state
    await queryClient.invalidateQueries({ queryKey: ["user"] });
    setIsDialogOpen(false);

    const user = await getMe({ token });
    if (!user.result?.firstName || !user.result.lastName) {
      router.push("/dashboard/profile/edit");
    } else {
      router.push("/dashboard");
    }
  }

  function resetDialogState() {
    setIsOtpMode(false);
    setOtpToken(null);
    setSubmittedPhone("");
    resetPhoneForm();
    resetOtpForm();
  }

  function handleDialogChange(open: boolean) {
    setIsDialogOpen(open);

    if (!open) {
      resetDialogState();
      closeModal();
    }
  }

  return (
    <Dialog open={isOpen || isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsDialogOpen(true)}
          {...props}
        >
          <UserIcon className="max-lg:hidden" />
          <span>ورود / ثبت نام</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ورود به حساب کاربری</DialogTitle>
          <DialogDescription>
            {isOtpMode ? (
              <span>
                کد ارسال شده به شماره <span dir="ltr">{maskedPhone}</span> را
                وارد نمایید
              </span>
            ) : (
              "شماره موبایل خود را وارد کنید و برای تکمیل عملیات وارد حساب کاربری خود شوید."
            )}
          </DialogDescription>
        </DialogHeader>
        {isOtpMode ? (
          <form id="otp-form" onSubmit={handleSubmitOtp(onSubmitOtp)} dir="ltr">
            <Controller
              control={control}
              name="otp"
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup className="w-1/2 [&>div]:flex-1/3">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="w-1/2 [&>div]:flex-1/3">
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            {otpErrors?.otp && (
              <p className="text-red-400 mt-3 text-sm">
                {otpErrors.otp.message}
              </p>
            )}
          </form>
        ) : (
          <form
            id="login-form"
            onSubmit={handleSubmit(onSubmitPhone)}
            action=""
          >
            <InputGroup dir="ltr">
              <InputGroupAddon>+98</InputGroupAddon>
              <InputGroupInput
                type="text"
                placeholder="*** *** ****"
                inputMode="numeric"
                aria-invalid={!!phoneErrors?.phone || undefined}
                {...register("phone")}
              />
            </InputGroup>
            {phoneErrors?.phone && (
              <p className="text-red-400 mt-3 text-sm">
                {phoneErrors.phone.message}
              </p>
            )}
          </form>
        )}
        <DialogFooter>
          {isOtpMode ? (
            <Button
              className="w-1/2"
              variant="outline"
              type="button"
              onClick={() => setIsOtpMode(false)}
            >
              <span>بازگشت</span>
            </Button>
          ) : (
            <DialogClose asChild>
              <Button className="w-1/2" variant="outline">
                <span>انصراف</span>
              </Button>
            </DialogClose>
          )}
          <Button
            type="submit"
            className="w-1/2"
            form={isOtpMode ? "otp-form" : "login-form"}
            disabled={isOtpMode ? isSubmittingOtp : isSubmittingPhone}
          >
            <span>ورود</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default HeaderLoginButton;
