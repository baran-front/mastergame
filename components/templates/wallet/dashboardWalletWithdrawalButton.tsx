"use client";

import { CircleCheckIcon, CircleIcon } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next/client";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
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
import Link from "next/link";
import {
  getMe,
  searchUserCards,
  withdrawWallet,
  getTransactionWalletTotal,
} from "@/lib/fetchs";

type UserCardT = {
  id: string;
  cardNumber: string;
  [key: string]: unknown;
};

function DashboardWalletWithdrawalButton() {
  const [step, setStep] = useState<
    "withdrawal" | "selectCard" | "information" | "success"
  >("withdrawal");
  const [amount, setAmount] = useState("");
  const [selectedCard, setSelectedCard] = useState<UserCardT | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const token = getCookie("token") || "";

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: () => getMe({ token }),
    enabled: !!token && isOpen,
  });

  const userId = userData?.result?.id;

  const { data: cardsData, isLoading: isLoadingCards } = useQuery({
    queryKey: ["user-cards", userId],
    queryFn: () =>
      searchUserCards({
        pageNumber: 1,
        pageSize: 100,
        orderBy: ["id desc"],
        userId: userId || "",
        token,
      }),
    enabled: !!userId && !!token && isOpen && step === "selectCard",
  });

  const cards = (cardsData?.result?.data || []) as UserCardT[];

  const { data: walletTotalData, isLoading: isLoadingWalletTotal } = useQuery({
    queryKey: ["wallet-total"],
    queryFn: () => getTransactionWalletTotal({ token }),
    enabled: !!token && isOpen && step === "withdrawal",
  });

  const walletTotal = walletTotalData?.result?.data?.[0]?.price || 0;

  // Format card number to show only first 4 and last 4 digits
  const formatCardNumber = (cardNum: string) => {
    if (!cardNum || cardNum.length < 8) return cardNum;
    const first4 = cardNum.substring(0, 4);
    const last4 = cardNum.substring(cardNum.length - 4);
    return `${first4}****${last4}`;
  };

  // Reset card number when card selection changes
  const handleCardSelect = (card: UserCardT) => {
    setSelectedCard(card);
    setCardNumber(""); // Reset middle digits
    setStep("information");
  };

  const handleWithdrawSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("لطفا مبلغ معتبری وارد کنید");
      return;
    }

    if (!selectedCard) {
      toast.error("لطفا یک کارت انتخاب کنید");
      return;
    }

    // Validate card number - check if user entered all 8 middle digits
    const middle8 = cardNumber.replace(/\D/g, "");
    if (middle8.length !== 8) {
      toast.error("لطفا تمام 8 رقم میانی کارت را وارد کنید");
      return;
    }

    // Reconstruct full card number
    const first4 = selectedCard.cardNumber.substring(0, 4);
    const last4 = selectedCard.cardNumber.substring(
      selectedCard.cardNumber.length - 4
    );
    const fullCardNumber = `${first4}${middle8}${last4}`;

    // Verify the reconstructed card number matches the selected card
    if (fullCardNumber !== selectedCard.cardNumber) {
      toast.error("شماره کارت وارد شده صحیح نیست");
      return;
    }

    if (!userId || !token) {
      toast.error("خطا در دریافت اطلاعات کاربر");
      return;
    }

    setIsLoading(true);

    try {
      const response = await withdrawWallet({
        userId,
        senderId: userId,
        type: 0,
        price: -parseFloat(amount),
        finished: false,
        status: 0,
        token,
      });

      if (response.status !== 200) {
        toast.error("خطا در ثبت درخواست برداشت");
        setIsLoading(false);
        return;
      }

      toast.success("درخواست برداشت با موفقیت ثبت شد");
      setStep("success");
      setIsLoading(false);
    } catch (error) {
      console.error("Error withdrawing wallet:", error);
      toast.error("خطا در ارتباط با سرور");
      setIsLoading(false);
    }
  };

  const withdrawalStep = () => {
    return (
      <>
        <div className="mt-4">
          <label htmlFor="amount">مبلغ برداشت (ریال)</label>
          <Input
            id="amount"
            dir="ltr"
            className="mt-2"
            type="number"
            placeholder="مبلغ برداشت"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            required
            disabled={isLoading}
          />
        </div>
        <Button
          size={"sm"}
          variant={"unstyled"}
          className="w-max bg-secondary/10 text-secondary"
          onClick={() => {
            if (isLoadingWalletTotal) {
              toast.info("در حال دریافت موجودی...");
              return;
            }
            if (walletTotal <= 0) {
              toast.error("موجودی کیف پول شما صفر است");
              return;
            }
            setAmount(walletTotal.toString());
            toast.success(
              `مبلغ ${walletTotal.toLocaleString("fa")} ریال تنظیم شد`
            );
          }}
          disabled={isLoading || isLoadingWalletTotal}
        >
          <CircleIcon />
          <span>
            {isLoadingWalletTotal
              ? "در حال دریافت موجودی..."
              : `برداشت کل موجودی (${walletTotal.toLocaleString("fa")} ریال)`}
          </span>
        </Button>
      </>
    );
  };

  const selectCardStep = () => {
    if (isLoadingCards) {
      return <p className="text-center py-4">در حال بارگذاری کارت‌ها...</p>;
    }

    if (cards.length === 0) {
      return <p className="text-center my-4">کارتی ثبت نشده است</p>;
    }

    return (
      <div className="space-y-2 mt-4">
        <label>انتخاب کارت</label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardSelect(card)}
              className={`w-full p-3 border rounded-lg text-right transition-colors ${selectedCard?.id === card.id
                  ? "border-primary bg-primary/10"
                  : "hover:bg-card"
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm">
                  {formatCardNumber(card.cardNumber)}
                </span>
                {selectedCard?.id === card.id && (
                  <CircleCheckIcon className="size-5 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const informationStep = () => {
    if (!selectedCard) {
      return null;
    }

    const first4 = selectedCard.cardNumber.substring(0, 4);
    const last4 = selectedCard.cardNumber.substring(
      selectedCard.cardNumber.length - 4
    );
    const middle8 = cardNumber.replace(/\D/g, "").substring(0, 8);

    const handleMiddleDigitsChange = (value: string) => {
      const digits = value.replace(/\D/g, "").substring(0, 8);
      setCardNumber(digits);
    };

    return (
      <>
        <div className="mt-4">
          <label htmlFor="cardNumber">تایید شماره کارت</label>
          <p className="text-xs opacity-50 mb-2">
            لطفا 8 رقم میانی کارت را وارد کنید
          </p>
          <div dir="ltr" className="flex items-center gap-2">
            <div className="flex items-center gap-1 font-mono text-lg">
              <span className="px-2 py-1 bg-muted rounded">{first4}</span>
            </div>
            <Input
              id="cardNumber"
              type="text"
              inputMode="numeric"
              maxLength={8}
              value={middle8}
              onChange={(e) => handleMiddleDigitsChange(e.target.value)}
              placeholder="********"
              className="text-center font-mono text-lg tracking-widest"
              disabled={isLoading}
            />
            <div className="flex items-center gap-1 font-mono text-lg">
              <span className="px-2 py-1 bg-muted rounded">{last4}</span>
            </div>
          </div>
          <p className="text-xs opacity-50 mt-2 text-center">
            {formatCardNumber(selectedCard.cardNumber)}
          </p>
        </div>
      </>
    );
  };

  const successStep = () => {
    return (
      <>
        <CircleCheckIcon className="size-10 text-green-500 mx-auto mt-6" />
        <p className="text-center">عملیات پرداخت با موفقیت انجام شد</p>
        <p className="text-xs opacity-50 text-center">
          جزئیات پرداخت در پنل کاربری قابل مشاهده است.
        </p>
      </>
    );
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    // Reset state when dialog closes
    setTimeout(() => {
      setStep("withdrawal");
      setAmount("");
      setSelectedCard(null);
      setCardNumber("");
    }, 200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="max-sm:w-full max-md:w-1/2 md:mr-auto">
          <span>درخواست برداشت</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-2xl">
        <DialogHeader>
          <DialogTitle>درخواست برداشت</DialogTitle>
          <DialogDescription>
            {step === "withdrawal" &&
              "لطفا مبلغ مورد نظر برای برداشت از کیف‌پول را وارد نمایید"}
            {step === "selectCard" && "لطفا کارت مورد نظر را انتخاب کنید"}
            {step === "information" &&
              "لطفا 8 رقم میانی کارت را برای تایید وارد کنید"}
            {step === "success" && "درخواست شما با موفقیت ثبت شد"}
          </DialogDescription>
        </DialogHeader>

        {step === "withdrawal" && withdrawalStep()}
        {step === "selectCard" && selectCardStep()}
        {step === "information" && informationStep()}
        {step === "success" && successStep()}

        <DialogFooter>
          {step === "withdrawal" && (
            <>
              <DialogClose asChild>
                <Button
                  className="w-1/2"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  <span>انصراف</span>
                </Button>
              </DialogClose>

              <Button
                type="button"
                className="w-1/2"
                onClick={() => {
                  if (!amount || parseFloat(amount) <= 0) {
                    toast.error("لطفا مبلغ معتبری وارد کنید");
                    return;
                  }
                  setStep("selectCard");
                }}
                disabled={isLoading}
              >
                <span>تایید و ادامه</span>
              </Button>
            </>
          )}

          {step === "selectCard" && (
            <>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setStep("withdrawal")}
                disabled={isLoading}
              >
                <span>بازگشت</span>
              </Button>
            </>
          )}

          {step === "information" && (
            <>
              <Button
                className="w-1/2"
                variant="outline"
                onClick={() => setStep("selectCard")}
                disabled={isLoading}
              >
                <span>بازگشت</span>
              </Button>

              <Button
                type="button"
                className="w-1/2"
                onClick={handleWithdrawSubmit}
                disabled={isLoading}
              >
                <span>
                  {isLoading ? "در حال پردازش..." : "تایید و ثبت درخواست"}
                </span>
              </Button>
            </>
          )}

          {step === "success" && (
            <DialogClose asChild>
              <Link
                className="w-full"
                href={"/dashboard/wallet"}
                onClick={handleDialogClose}
              >
                <Button className="w-full">
                  <span>رفتن به داشبورد</span>
                </Button>
              </Link>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DashboardWalletWithdrawalButton;
