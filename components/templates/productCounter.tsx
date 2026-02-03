"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { ProductT, CartItemT } from "@/types/api.types";
import { useBasket } from "@/lib/hooks/useBasket";
import { getCookie } from "cookies-next/client";
import { useLoginModal } from "@/components/providers/loginModalProvider";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/fetchs";

type ProductCounterProps = {
  product: ProductT;
};

function ProductCounter({ product }: ProductCounterProps) {
  const [count, setCount] = useState(1);
  const { openModal } = useLoginModal();
  // Get token on client side only to avoid hydration mismatch
  // Using lazy initialization to ensure token is read only on client side
  const [token] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return getCookie("token") || "";
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getMe({ token: getCookie("token") || "" }),
  });

  const { addToCart, findItem, isUpdating, isLoading } = useBasket();

  return (
    <div className="ring-4 ring-card dark:ring-black/50 inset-shadow-xs inset-shadow-card rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span>تعداد</span>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            aria-label="افزایش تعداد"
            onClick={() => {
              setCount((prev: number) => prev + 1);
            }}
          >
            +
          </Button>
          <span className="px-3 select-none" suppressHydrationWarning>
            {typeof count !== "undefined" ? count : 1}
          </span>
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            aria-label="کاهش تعداد"
            onClick={() => {
              setCount((prev: number) => Math.max(prev - 1, 1));
            }}
          >
            -
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span>قیمت:</span>
        <div className="flex items-end flex-col gap-1.5">
          {(() => {
            const hasDiscount = (product.discountPercent || 0) > 0;
            const masterPrice = product.masterPrice || 0;
            const discountAmount = hasDiscount
              ? Math.floor((masterPrice * (product.discountPercent || 0)) / 100)
              : 0;
            const displayPrice = Math.max(masterPrice - discountAmount, 0);
            return (
              <>
                <div className="flex items-center gap-1.5">
                  {hasDiscount && (
                    <span className="bg-primary px-2 py-0.5 rounded text-xs text-background">
                      {product.discountPercent}%
                    </span>
                  )}
                  <span className="text-secondary font-yekan-bakh-bold">
                    {displayPrice.toLocaleString("fa")} تومان
                  </span>
                </div>
                {hasDiscount && (
                  <span className="text-foreground/60 line-through text-xs">
                    {masterPrice.toLocaleString("fa")} تومان
                  </span>
                )}
              </>
            );
          })()}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span>وضعیت:</span>
        <span
          className={product.inStock > 0 ? "text-green-200 not-dark:text-green-600" : "text-red-500"}
        >
          {product.inStock > 0 ? "موجود" : "ناموجود"}
        </span>
      </div>

      {(() => {
        if (!token) return null;
        const existingItem = findItem(
          product.id,
          product.p1,
          product.r1,
          product.r2,
          product.r3,
          product.r4,
          product.r5
        );
        if (!existingItem || existingItem.quantity === 0) {
          return null;
        }
        return (
          <div className="flex items-center justify-between">
            <span>تعداد در سبد خرید:</span>
            <span className="text-secondary">
              {existingItem.quantity.toLocaleString("fa")}
            </span>
          </div>
        );
      })()}

      <div className="pt-3 border-t-2 border-dashed">
        <Button
          className="w-full"
          disabled={product.inStock === 0 || isUpdating || isLoading}
          onClick={async () => {
            // Check if user is logged in
            if (!user?.result?.id) {
              openModal();
              return;
            }

            const cartItem: CartItemT = {
              productId: product.id,
              name: product.name,
              masterImage: product.masterImage,
              masterPrice: product.masterPrice,
              discountPrice: product.discountPrice,
              discountPercent: product.discountPercent,
              quantity: count,
              country: product.country,
              city: product.city,
              p1: product.p1,
              r1: product.r1,
              r2: product.r2,
              r3: product.r3,
              r4: product.r4,
              r5: product.r5,
              addedAt: new Date().toISOString(),
            };

            await addToCart(cartItem, count);
          }}
        >
          <span>افزودن به سبد خرید</span>
          <ShoppingCartIcon />
        </Button>
      </div>
    </div>
  );
}

export default ProductCounter;
