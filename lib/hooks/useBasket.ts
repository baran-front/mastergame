import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next/client";
import { toast } from "sonner";
import { CartItemT } from "@/types/api.types";
import { getBasket, updateBasket } from "@/lib/fetchs";

/**
 * Parse and group cart items from API response
 * Groups items by productId, p1, r1, r2, r3, r4, r5 and sums quantities
 * Handles both old format (multiple items with quantity=1) and new format (single item with actual quantity)
 */
function parseCartItems(itemsString: string | undefined): CartItemT[] {
  if (!itemsString) return [];

  try {
    const parsedItems = JSON.parse(itemsString) as CartItemT[];

    const grouped = parsedItems.reduce(
      (acc, item) => {
        const key = `${item.productId}-${item.p1 || ""}-${item.r1 || ""}-${item.r2 || ""}-${item.r3 || ""}-${item.r4 || ""}-${item.r5 || ""}`;
        if (acc[key]) {
          acc[key].quantity += item.quantity || 1;
        } else {
          acc[key] = { ...item, quantity: item.quantity || 1 };
        }
        return acc;
      },
      {} as Record<string, CartItemT>
    );

    return Object.values(grouped);
  } catch (error) {
    console.error("Error parsing cart items:", error);
    return [];
  }
}

/**
 * Convert cart items to basket items format for API
 */
function cartItemsToBasketItems(items: CartItemT[]): CartItemT[] {
  return items.map((item) => ({
    productId: item.productId,
    name: item.name,
    masterImage: item.masterImage,
    masterPrice: item.masterPrice,
    discountPrice: item.discountPrice,
    discountPercent: item.discountPercent,
    quantity: item.quantity,
    country: item.country,
    city: item.city,
    p1: item.p1,
    r1: item.r1,
    r2: item.r2,
    r3: item.r3,
    r4: item.r4,
    r5: item.r5,
    addedAt: item.addedAt,
  }));
}

/**
 * Custom hook for managing shopping basket
 * Provides cart items, loading state, and methods to add/update/remove items
 */
export function useBasket() {
  const queryClient = useQueryClient();
  const token = getCookie("token") || "";

  // Fetch basket from API
  const {
    data: basketData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["basket", token],
    queryFn: () => getBasket({ token }),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Parse cart items from API response
  const cartItems = useMemo(() => {
    return parseCartItems(basketData?.result?.data?.items);
  }, [basketData]);

  // Mutation for updating basket
  const updateBasketMutation = useMutation({
    mutationFn: updateBasket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["basket", token] });
    },
    onError: (error) => {
      console.error("Error updating basket:", error);
      toast.error("خطا در به‌روزرسانی سبد خرید");
    },
  });

  /**
   * Add item to cart or update quantity if already exists
   */
  const addToCart = async (item: CartItemT, quantity: number = 1) => {
    if (!token) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
      return { success: false };
    }

    const existingItemIndex = cartItems.findIndex(
      (cartItem) =>
        cartItem.productId === item.productId &&
        cartItem.p1 === item.p1 &&
        cartItem.r1 === item.r1 &&
        cartItem.r2 === item.r2 &&
        cartItem.r3 === item.r3 &&
        cartItem.r4 === item.r4 &&
        cartItem.r5 === item.r5
    );

    let updatedItems: CartItemT[];
    let isUpdate = false;

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      updatedItems = [...cartItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
      };
      isUpdate = true;
    } else {
      // Add new item to cart
      updatedItems = [
        ...cartItems,
        {
          ...item,
          quantity,
          addedAt: new Date().toISOString(),
        },
      ];
    }

    const basketItems = cartItemsToBasketItems(updatedItems);

    try {
      const response = await updateBasketMutation.mutateAsync({
        items: basketItems,
        token,
      });

      if (response.status === 200) {
        toast.success(
          isUpdate
            ? "تعداد محصول در سبد خرید به‌روزرسانی شد"
            : "محصول به سبد خرید اضافه شد"
        );
        return { success: true };
      } else {
        toast.error("خطا در به‌روزرسانی سبد خرید");
        return { success: false };
      }
    } catch {
      return { success: false };
    }
  };

  /**
   * Update item quantity in cart
   */
  const updateQuantity = async (
    productId: string,
    p1: string | null,
    r1: string | null,
    r2: string | null = null,
    r3: string | null = null,
    r4: string | null = null,
    r5: string | null = null,
    newQuantity: number
  ) => {
    if (!token) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
      return { success: false };
    }

    if (newQuantity <= 0) {
      return removeItem(productId, p1, r1, r2, r3, r4, r5);
    }

    const updatedItems = cartItems.map((item) =>
      item.productId === productId &&
      item.p1 === p1 &&
      item.r1 === r1 &&
      item.r2 === r2 &&
      item.r3 === r3 &&
      item.r4 === r4 &&
      item.r5 === r5
        ? { ...item, quantity: newQuantity }
        : item
    );

    const basketItems = cartItemsToBasketItems(updatedItems);

    try {
      const response = await updateBasketMutation.mutateAsync({
        items: basketItems,
        token,
      });

      if (response.status === 200) {
        toast.success("تعداد محصول به‌روزرسانی شد");
        return { success: true };
      } else {
        toast.error("خطا در به‌روزرسانی سبد خرید");
        return { success: false };
      }
    } catch {
      return { success: false };
    }
  };

  /**
   * Remove item from cart
   */
  const removeItem = async (
    productId: string,
    p1: string | null,
    r1: string | null,
    r2: string | null = null,
    r3: string | null = null,
    r4: string | null = null,
    r5: string | null = null
  ) => {
    if (!token) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
      return { success: false };
    }

    const updatedItems = cartItems.filter(
      (item) =>
        !(
          item.productId === productId &&
          item.p1 === p1 &&
          item.r1 === r1 &&
          item.r2 === r2 &&
          item.r3 === r3 &&
          item.r4 === r4 &&
          item.r5 === r5
        )
    );

    const basketItems = cartItemsToBasketItems(updatedItems);

    try {
      const response = await updateBasketMutation.mutateAsync({
        items: basketItems,
        token,
      });

      if (response.status === 200) {
        toast.success("محصول از سبد خرید حذف شد");
        return { success: true };
      } else {
        toast.error("خطا در حذف محصول از سبد خرید");
        return { success: false };
      }
    } catch {
      return { success: false };
    }
  };

  /**
   * Clear entire cart
   */
  const clearCart = async () => {
    if (!token) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
      return { success: false };
    }

    try {
      const response = await updateBasketMutation.mutateAsync({
        items: [],
        token,
      });

      if (response.status === 200) {
        toast.success("سبد خرید خالی شد");
        return { success: true };
      } else {
        toast.error("خطا در خالی کردن سبد خرید");
        return { success: false };
      }
    } catch {
      return { success: false };
    }
  };

  /**
   * Find item in cart
   */
  const findItem = (
    productId: string,
    p1: string | null = null,
    r1: string | null = null,
    r2: string | null = null,
    r3: string | null = null,
    r4: string | null = null,
    r5: string | null = null
  ) => {
    return cartItems.find(
      (item) =>
        item.productId === productId &&
        item.p1 === p1 &&
        item.r1 === r1 &&
        item.r2 === r2 &&
        item.r3 === r3 &&
        item.r4 === r4 &&
        item.r5 === r5
    );
  };

  // Calculate totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalOriginalPrice = cartItems.reduce(
    (sum, item) => sum + item.masterPrice * item.quantity,
    0
  );
  const totalPrice = cartItems.reduce((sum, item) => {
    const hasDiscount = (item.discountPercent || 0) > 0;
    const masterPrice = item.masterPrice || 0;
    const discountAmount = hasDiscount
      ? Math.floor((masterPrice * (item.discountPercent || 0)) / 100)
      : 0;
    const displayPrice = Math.max(masterPrice - discountAmount, 0);
    return sum + displayPrice * item.quantity;
  }, 0);
  const totalDiscount = totalOriginalPrice - totalPrice;

  return {
    // State
    cartItems,
    isLoading,
    error,
    isUpdating: updateBasketMutation.isPending,
    isCartEmpty: cartItems.length === 0,
    token,

    // Totals
    totalItems,
    totalPrice,
    totalOriginalPrice,
    totalDiscount,

    // Methods
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    findItem,
    refetch,
  };
}

