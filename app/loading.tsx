import Image from "next/image";
import { brand } from "@/brand";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background/60 backdrop-blur-md transition-all duration-300">
      <div className="relative flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
        <div className="relative w-32 h-32 md:w-40 md:h-40">
          <Image
            src={brand.logoImg.light}
            alt={brand.name}
            fill
            className="object-contain dark:hidden"
            priority
          />
          <Image
            src={brand.logoImg.dark}
            alt={brand.name}
            fill
            className="object-contain hidden dark:block"
            priority
          />
        </div>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-lg font-bold text-foreground animate-pulse">
            {brand.name}
          </p>
        </div>
      </div>
    </div>
  );
}

