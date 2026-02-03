"use client";

import { Share2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ComponentProps } from "react";

type ShareButtonProps = ComponentProps<typeof Button> & {
  title?: string;
  text?: string;
  url?: string;
};

function ShareButton({
  title = "",
  text = "",
  url,
  children,
  size = "icon",
  className,
  ...props
}: ShareButtonProps) {
  const handleShare = async () => {
    const currentUrl =
      url || (typeof window !== "undefined" ? window.location.href : "");
    const shareData: ShareData = {
      title: title || (typeof document !== "undefined" ? document.title : ""),
      text: text || "",
      url: currentUrl,
    };

    try {
      // Check if the Web Share API is supported
      if (navigator.share) {
        if (
          typeof navigator.canShare === "function" &&
          navigator.canShare(shareData)
        ) {
          await navigator.share(shareData);
        } else {
          await navigator.share(shareData);
        }
      } else {
        const urlToShare = shareData.url || "";
        if (urlToShare) {
          await navigator.clipboard.writeText(urlToShare);
          toast.success("لینک در کلیپ‌بورد کپی شد");
        }
      }
    } catch (error: unknown) {
      // User cancelled the share or an error occurred
      const shareError = error as { name?: string };
      if (shareError.name !== "AbortError") {
        // If clipboard API fails, try fallback method
        const urlToShare = shareData.url || "";
        if (urlToShare) {
          try {
            const textArea = document.createElement("textarea");
            textArea.value = urlToShare;
            textArea.style.position = "fixed";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            toast.success("لینک در کلیپ‌بورد کپی شد");
          } catch {
            toast.error("خطا در به اشتراک گذاری لینک");
          }
        } else {
          toast.error("خطا در به اشتراک گذاری لینک");
        }
      }
    }
  };

  return (
    <Button
      size={size}
      className={className}
      onClick={handleShare}
      aria-label="اشتراک‌گذاری"
      {...props}
    >
      {children || <Share2Icon />}
    </Button>
  );
}

export default ShareButton;
