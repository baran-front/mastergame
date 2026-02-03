"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
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
import { chargeWallet } from "@/lib/fetchs";

function DashboardWalletChargeButton() {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("لطفا مبلغ معتبری وارد کنید");
      return;
    }

    const token = getCookie("token");
    if (!token) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    setIsLoading(true);

    try {
      const price = parseFloat(amount); // Amount is already in Rials
      const response = await chargeWallet({
        price,
        description: "",
        type: 1,
        token: token as string,
      });

      if (response.status !== 200) {
        toast.error("خطا در ایجاد درخواست پرداخت");
        setIsLoading(false);
        return;
      }

      const paymentUrl = response.result?.url;
      if (!paymentUrl) {
        toast.error("آدرس پرداخت دریافت نشد");
        setIsLoading(false);
        return;
      }

      toast.success("در حال انتقال به درگاه پرداخت...");
      setIsOpen(false);
      setAmount("");

      // Redirect to payment URL
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Error charging wallet:", error);
      toast.error("خطا در ارتباط با سرور");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="max-sm:w-full max-md:w-1/2">
          <PlusIcon />
          <span>شارژ کیف پول</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>شارژ کیف پول</DialogTitle>
            <DialogDescription>
              لطفا مبلغ مورد نظر برای شارژ کیف پول را وارد نمایید
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <label htmlFor="amount">مبلغ واریزی (ریال)</label>
            <Input
              id="amount"
              dir="ltr"
              className="mt-2"
              type="number"
              placeholder="مبلغ واریزی"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button
                type="button"
                className="w-1/2"
                variant="outline"
                disabled={isLoading}
              >
                <span>انصراف</span>
              </Button>
            </DialogClose>
            <Button type="submit" className="w-1/2" disabled={isLoading}>
              <span>{isLoading ? "در حال پردازش..." : "پرداخت وجه"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DashboardWalletChargeButton;
