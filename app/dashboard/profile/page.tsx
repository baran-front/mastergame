import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { getMe } from "@/lib/fetchs";
import { brand } from "@/brand";

function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "-";
  // Remove leading 0 if present and format
  const cleaned = phone.startsWith("0") ? phone.slice(1) : phone;
  return `+98${cleaned}`;
}

async function DashboardProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  const user = (await getMe({ token })).result;

  // Parse address from jsonExt if available
  let addressData: {
    province?: string;
    city?: string;
    postalCode?: string;
    plaque?: string;
    unit?: string;
    address?: string;
  } = {};

  if (user?.jsonExt) {
    try {
      addressData = JSON.parse(user.jsonExt);
    } catch {
      // If parsing fails, keep empty object
    }
  }

  const fullName = user
    ? `${user.firstName || "کاربر"} ${user.lastName || "ناشناس"}`.trim() || "-"
    : "کاربر ناشناس";

  return (
    <>
      <div className="card flex items-center space-y-0 justify-between gap-3 mb-6 lg:hidden">
        <h1 className="title">حساب کاربری</h1>
        <Link href={"/dashboard"}>
          <Button variant={"outline"} size={"icon"}>
            <ChevronLeftIcon />
          </Button>
        </Link>
      </div>

      <div className="lg:p-6 lg:border-2 lg:rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="size-16 rounded-full bg-card flex items-center justify-center overflow-hidden">
            {user?.imageUrl ? (
              <Image
                src={brand.apiBaseUrl + user.imageUrl}
                alt={fullName}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-card" />
            )}
          </div>
          <div>
            <p className="title">{fullName}</p>
            <p className="text-xs opacity-50 mt-1.5 text-right" dir="ltr">
              {formatPhoneNumber(user?.phoneNumber)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 my-12">
          <p className="text-xs opacity-50">اطلاعات شخصی</p>
          <div className="flex-1 border-y"></div>
        </div>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-3 opacity-50">شماره ملی</div>
          <div className="col-span-12 md:col-span-3">
            {user?.codeMeli || "-"}
          </div>
          <div className="col-span-12 md:col-span-3 opacity-50">تاریخ تولد</div>
          <div className="col-span-12 md:col-span-3">
            {new Date(user?.birthdate || "").toLocaleDateString("fa")}
          </div>
        </div>

        <div className="flex items-center gap-3 my-12">
          <p className="text-xs opacity-50">اطلاعات تماس</p>
          <div className="flex-1 border-y"></div>
        </div>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-3 opacity-50">
            شماره همراه
          </div>
          <div className="col-span-12 md:col-span-3">
            {user?.phoneNumber || "-"}
          </div>
          <div className="col-span-12 md:col-span-3 opacity-50">آدرس ایمیل</div>
          <div className="col-span-12 md:col-span-3">{user?.email || "-"}</div>
        </div>

        <div className="flex items-center gap-3 my-12">
          <p className="text-xs opacity-50">آدرس و محل سکونت</p>
          <div className="flex-1 border-y"></div>
        </div>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-3 opacity-50">استان</div>
          <div className="col-span-12 md:col-span-3">
            {addressData.province || "-"}
          </div>
          <div className="col-span-12 md:col-span-3 opacity-50">شهر</div>
          <div className="col-span-12 md:col-span-3">
            {addressData.city || "-"}
          </div>
          <div className="col-span-12 md:col-span-3 opacity-50">کد پستی</div>
          <div className="col-span-12 md:col-span-3">
            {addressData.postalCode || "-"}
          </div>
          <div className="col-span-12 md:col-span-3 opacity-50">پلاک</div>
          <div className="col-span-12 md:col-span-3">
            {addressData.plaque || "-"}
          </div>
          <div className="col-span-12 md:col-span-3 opacity-50">واحد</div>
          <div className="col-span-12 md:col-span-3">
            {addressData.unit || "-"}
          </div>
          <div className="col-span-12 md:col-span-3 opacity-50">آدرس</div>
          <div className="col-span-12 md:col-span-3">
            {addressData.address || "-"}
          </div>
        </div>

        <div className="flex items-center justify-end mt-12 max-lg:sticky max-lg:bottom-3">
          <Link className="max-sm:w-full" href={"/dashboard/profile/edit"}>
            <Button className="max-sm:w-full">تغییر اطلاعات</Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default DashboardProfilePage;
