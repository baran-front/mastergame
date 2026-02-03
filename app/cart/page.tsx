"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CopyIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  CircleCheckIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import secondEmptyCartImg from "@/public/images/empty-cart.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { brand } from "@/brand";
import { useBasket } from "@/lib/hooks/useBasket";
import {
  getTransactionWalletTotal,
  getMe,
  createOrderWithWallet,
} from "@/lib/fetchs";
import Breadcrumbs from "@/components/modules/breadcrumbs";
import { useLoginModal } from "@/components/providers/loginModalProvider";

function CartPage() {
  const router = useRouter();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const {
    cartItems,
    isUpdating,
    isCartEmpty,
    token,
    totalItems,
    totalPrice,
    totalOriginalPrice,
    totalDiscount,
    updateQuantity,
    removeItem,
    refetch: refetchBasket,
  } = useBasket();

  const { data: walletTotalData, isLoading: isLoadingWalletTotal } = useQuery({
    queryKey: ["wallet-total"],
    queryFn: () => getTransactionWalletTotal({ token: token || "" }),
    enabled: !!token,
  });

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: () => getMe({ token: token || "" }),
    enabled: !!token,
  });

  const { openModal } = useLoginModal();

  const walletTotal = walletTotalData?.result?.data?.[0]?.price || 0;
  const userId = userData?.result?.id;

  const handleCreateOrder = async () => {
    if (!token || !userId) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("سبد خرید شما خالی است");
      return;
    }

    setIsCreatingOrder(true);

    try {
      const response = await createOrderWithWallet({
        token,
        userId,
        status: 0,
        totalPrice,
        orderItems: cartItems,
      });

      if (response.status === 200) {
        await refetchBasket();
        toast.success("سفارش با موفقیت ثبت شد");
        router.push("/cart/result?status=success");
      } else {
        toast.error("خطا در ثبت سفارش. لطفا دوباره تلاش کنید");
        router.push("/cart/result?status=error");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("خطا در ثبت سفارش. لطفا دوباره تلاش کنید");
    } finally {
      setIsCreatingOrder(false);
    }
  };
  return (
    <>
      <Breadcrumbs links={[{ name: "سبد خرید", href: "/cart" }]} />

      <div className="wrapper mt-3 lg:mt-6">
        <h1 className="heading mt-6">سبد خرید</h1>

        {userData?.status !== 200 ? (
          <div className="text-center py-12">
            <p className="text-lg mb-4">لطفا ابتدا وارد حساب کاربری خود شوید</p>
            <Button onClick={openModal}>ورود</Button>
          </div>
        ) : isCartEmpty ? (
          <Image
            width={327}
            height={286}
            className="mx-auto"
            alt="سبد خرید خالی"
            src={secondEmptyCartImg}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6 lg:h-max">
              {cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.p1 || ""}-${item.r1 || ""}-${item.r2 || ""
                    }-${item.r3 || ""}-${item.r4 || ""}-${item.r5 || ""}`}
                  className="card sm:h-52 flex items-center max-sm:flex-col gap-3 space-y-0"
                >
                  <div className="sm:h-full max-sm:w-full aspect-video bg-background rounded-lg relative overflow-hidden">
                    <Image
                      fill
                      alt={item.name}
                      className="object-cover"
                      src={brand.apiBaseUrl + item.masterImage}
                    />
                  </div>
                  <div className="sm:flex-1 sm:h-full flex flex-col sm:justify-evenly gap-3">
                    <p className="title">{item.name}</p>
                    <span>{item.masterPrice.toLocaleString("fa")} تومان</span>
                    <div className="w-full flex items-center gap-3">
                      <ButtonGroup>
                        <Button
                          variant={"outline"}
                          size={"icon"}
                          disabled={isUpdating}
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.p1,
                              item.r1,
                              item.r2,
                              item.r3,
                              item.r4,
                              item.r5,
                              item.quantity + 1
                            )
                          }
                        >
                          <PlusIcon />
                        </Button>
                        <ButtonGroupText>
                          <span>{item.quantity}</span>
                        </ButtonGroupText>
                        <Button
                          variant={"outline"}
                          size={"icon"}
                          disabled={isUpdating}
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.p1,
                              item.r1,
                              item.r2,
                              item.r3,
                              item.r4,
                              item.r5,
                              item.quantity - 1
                            )
                          }
                        >
                          <MinusIcon />
                        </Button>
                      </ButtonGroup>
                      <Button
                        variant={"destructive"}
                        size={"icon"}
                        disabled={isUpdating}
                        onClick={() =>
                          removeItem(
                            item.productId,
                            item.p1,
                            item.r1,
                            item.r2,
                            item.r3,
                            item.r4,
                            item.r5
                          )
                        }
                      >
                        <TrashIcon />
                      </Button>

                      {(() => {
                        const hasDiscount = (item.discountPercent || 0) > 0;
                        const masterPrice = item.masterPrice || 0;
                        const discountAmount = hasDiscount
                          ? Math.floor(
                            (masterPrice * (item.discountPercent || 0)) / 100
                          )
                          : 0;
                        const displayPrice = Math.max(
                          masterPrice - discountAmount,
                          0
                        );
                        return (
                          <div className="mr-auto flex flex-col items-end gap-1.5">
                            <span className="font-yekan-bakh-bold text-secondary">
                              {(displayPrice * item.quantity).toLocaleString(
                                "fa"
                              )}{" "}
                              تومان
                            </span>
                            {hasDiscount && (
                              <div className="flex items-center gap-1.5">
                                <span className="bg-primary p-1 rounded text-xs not-dark:text-background">
                                  {item.discountPercent}%
                                </span>
                                <span className="text-foreground/60 line-through text-xs">
                                  {(masterPrice * item.quantity).toLocaleString(
                                    "fa"
                                  )}{" "}
                                  تومان
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card lg:h-max lg:sticky lg:top-26">
              <label htmlFor="discount-code">کد تخفیف</label>
              <div className="flex items-center gap-3 mt-1.5">
                <InputGroup>
                  <InputGroupInput type="text" placeholder="کد تخفیف" />
                  <InputGroupButton>
                    <CopyIcon className="text-primary" />
                  </InputGroupButton>
                </InputGroup>
                <Button size={"icon"}>
                  <CircleCheckIcon />
                </Button>
              </div>

              <p className="mt-6">صورتحساب</p>
              <ul className="mt-3 space-y-3">
                <li className="flex items-center justify-between">
                  <span className="opacity-75">تعداد آیتم</span>
                  <span>{totalItems}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="opacity-75">قیمت کل</span>
                  <span>{totalOriginalPrice.toLocaleString("fa")} تومان</span>
                </li>
                {totalDiscount > 0 && (
                  <li className="flex items-center justify-between">
                    <span className="opacity-75">تخفیف</span>
                    <span>{totalDiscount.toLocaleString("fa")} تومان</span>
                  </li>
                )}
                <li className="flex items-center justify-between">
                  <span className="opacity-75">قیمت با تخفیف</span>
                  <span>{totalPrice.toLocaleString("fa")} تومان</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="opacity-75">کارمزد</span>
                  <span>0 تومان</span>
                </li>
              </ul>

              <div className="py-3 my-6 border-y-2 flex items-center justify-between gap-3">
                <p>موجودی کیف پول:</p>
                <p className="font-yekan-bakh-bold text-green-400">
                  {isLoadingWalletTotal
                    ? "در حال بارگذاری..."
                    : `${walletTotal.toLocaleString("fa")} تومان`}
                </p>
              </div>

              <p className="flex items-center justify-between">
                <span className="opacity-75">مبلغ نهایی</span>
                <span>{totalPrice.toLocaleString("fa")} تومان</span>
              </p>

              <Button
                className="w-full mt-6"
                onClick={handleCreateOrder}
                disabled={isCreatingOrder || !userId}
              >
                <span>
                  {isCreatingOrder ? "در حال ثبت سفارش..." : "تایید و پرداخت"}
                </span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CartPage;
