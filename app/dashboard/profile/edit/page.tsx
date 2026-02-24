"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  ChevronLeftIcon,
  CircleCheckIcon,
  ImagePlusIcon,
  XIcon,
  CalendarDaysIcon,
} from "lucide-react";
import Link from "next/link";
import { getMe, editProfile, fileUploader } from "@/lib/fetchs";
import { brand } from "@/brand";

const profileFormSchema = z.object({
  profileImage: z.instanceof(File).optional(),
  firstName: z.string().min(1, "نام الزامی است"),
  lastName: z.string().min(1, "نام خانوادگی الزامی است"),
  nationalCode: z
    .string()
    .min(10, "کد ملی باید حداقل ۱۰ رقم باشد")
    .max(10, "کد ملی باید ۱۰ رقم باشد"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "انتخاب جنسیت الزامی است" }),
  }),
  birthdate: z.string().min(1, "تاریخ تولد الزامی است"),
  mobile: z.string().min(1, "شماره موبایل الزامی است"),
  phone: z.string().optional(),
  email: z.string().email("ایمیل معتبر نیست").min(1, "ایمیل الزامی است"),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  plate: z.string().optional(),
  unit: z.string().optional(),
  cardNumber: z.string().optional(),
  shabaNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function DashboardEditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Get token only on client side to avoid hydration mismatch
  const token = getCookie("token") || "";

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getMe({ token }),
  });

  const user = userData?.result;

  // Parse address from jsonExt if available
  const addressData = useMemo(() => {
    if (!user?.jsonExt) return {};
    try {
      return JSON.parse(user.jsonExt) as {
        province?: string;
        city?: string;
        postalCode?: string;
        plaque?: string;
        unit?: string;
        address?: string;
      };
    } catch {
      return {};
    }
  }, [user]);

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (
    dateString: string | null | undefined
  ): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  // Map gender from API (number or string) to form value (string)
  const getGenderValue = (
    gender: string | number | null | undefined
  ): "male" | "female" | undefined => {
    if (gender === null || gender === undefined) return undefined;

    // Handle numeric values first (1 = male, 2 = female)
    if (typeof gender === "number") {
      if (gender === 1) return "male";
      if (gender === 2) return "female";
      return undefined;
    }

    // Handle string values
    const genderStr = String(gender);
    const genderLower = genderStr.toLowerCase();

    if (genderStr === "1" || genderLower === "male" || genderLower === "مرد") {
      return "male";
    }
    if (genderStr === "2" || genderLower === "female" || genderLower === "زن") {
      return "female";
    }

    return undefined;
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      nationalCode: "",
      birthdate: "",
      mobile: "",
      phone: "",
      email: "",
      country: "",
      state: "",
      city: "",
      address: "",
      postalCode: "",
      plate: "",
      unit: "",
      cardNumber: "",
      shabaNumber: "",
    },
  });

  // Set default values when user data is loaded
  useEffect(() => {
    if (user) {
      const genderValue = getGenderValue(user.gender);

      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        nationalCode: user.codeMeli || "",
        birthdate: formatDateForInput(user.birthdate),
        mobile: user.phoneNumber || "",
        phone: "",
        email: user.email || "",
        country: addressData.province ? "ir" : "",
        state: addressData.province || "",
        city: addressData.city || "",
        address: addressData.address || "",
        postalCode: addressData.postalCode || "",
        plate: addressData.plaque || "",
        unit: addressData.unit || "",
        cardNumber: "",
        shabaNumber: user.sheba || "",
        ...(genderValue ? { gender: genderValue } : {}),
      });

      // Set preview image - use requestAnimationFrame to avoid cascading renders
      if (user.imageUrl) {
        requestAnimationFrame(() => {
          setPreviewImage(brand.apiBaseUrl + user.imageUrl);
        });
      } else {
        requestAnimationFrame(() => {
          setPreviewImage(null);
        });
      }
      // Reset uploaded image URL when user data changes
      setUploadedImageUrl(null);
    }
  }, [user, reset, addressData]);

  // Handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("حجم فایل باید کمتر از ۲ مگابایت باشد");
        e.target.value = ""; // Reset input
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("لطفا یک فایل تصویری انتخاب کنید");
        e.target.value = ""; // Reset input
        return;
      }

      // Set the file in form state
      setValue("profileImage", file, { shouldValidate: true });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.onerror = () => {
        toast.error("خطا در خواندن فایل");
      };
      reader.readAsDataURL(file);

      // Upload the file
      if (!token) {
        toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
        return;
      }

      setIsUploadingImage(true);
      try {
        const uploadResponse = await fileUploader({
          file,
          token: token as string,
        });

        if (uploadResponse.status === 200 && uploadResponse.result?.data) {
          // Use orginalPath or path from response
          const imagePath =
            uploadResponse.result.data.orginalPath ||
            uploadResponse.result.data.path;
          setUploadedImageUrl(imagePath);
          toast.success("تصویر با موفقیت آپلود شد");
        } else {
          toast.error("خطا در آپلود تصویر");
          e.target.value = ""; // Reset input
          setPreviewImage(null);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("خطا در آپلود تصویر");
        e.target.value = ""; // Reset input
        setPreviewImage(null);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!token) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    try {
      // Prepare jsonExt with address data
      const jsonExt = JSON.stringify({
        province: data.state || "",
        city: data.city || "",
        postalCode: data.postalCode || "",
        plaque: data.plate || "",
        unit: data.unit || "",
        address: data.address || "",
      });

      // Map gender from form (string) to API (number)
      const genderNumber =
        data.gender === "male" ? 1 : data.gender === "female" ? 2 : 0;

      // Format birthdate to ISO string if provided
      let birthdateISO = "";
      if (data.birthdate) {
        const date = new Date(data.birthdate);
        birthdateISO = date.toISOString();
      }

      // Prepare imageUrl (use uploaded image URL if available, otherwise keep existing)
      const imageUrl = uploadedImageUrl || user?.imageUrl || "";

      const response = await editProfile({
        token,
        userName: user?.userName || "",
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.mobile,
        email: data.email,
        imageUrl: imageUrl,
        companyName: user?.companyName || "",
        companyNumber: user?.companyNumber || "",
        middleName: user?.middleName || "",
        gender: genderNumber,
        title: user?.title || "",
        info: user?.info || "",
        code: user?.code || "",
        codeType: user?.codeType || 0,
        userType: user?.userType ? parseInt(user.userType) || 0 : 0,
        jsonExt: jsonExt,
        vatNumber: user?.vatNumber || "",
        sheba: data.shabaNumber || "",
        bankname: user?.bankname || "",
        birthdate: birthdateISO,
        codeMeli: data.nationalCode,
        representativeBy: user?.representativeBy || "",
        rolesRequests: user?.rolesRequests || "",
        language: "fa",
        city: data.city || "",
        country: data.country || "",
        companyId: user?.companyId ? parseInt(user.companyId) || 0 : 0,
        instagram: user?.instagram || "",
        facebook: user?.facebook || "",
        linkedIn: user?.linkedIn || "",
        twitter: user?.twitter || "",
        gitHub: user?.gitHub || "",
        skype: user?.skype || "",
        telegram: user?.telegram || "",
        whatsApp: user?.whatsApp || "",
      });

      if (response.status === 200) {
        toast.success("اطلاعات با موفقیت به‌روزرسانی شد");
        // Invalidate user query to refresh data
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        router.push("/dashboard/profile");
        router.refresh();
      } else {
        toast.error("خطا در به‌روزرسانی اطلاعات");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("خطا در به‌روزرسانی اطلاعات");
    }
  };

  // Show loading state during initial mount or data fetching
  if (isLoading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="card flex items-center space-y-0 justify-between gap-3 mb-6 lg:hidden">
        <h1 className="title">ویرایش حساب کاربری</h1>
        <Link href={"/dashboard/profile"}>
          <Button variant={"outline"} size={"icon"}>
            <ChevronLeftIcon />
          </Button>
        </Link>
      </div>

      <div className="lg:p-6 lg:border-2 lg:rounded-2xl">
        <div className="flex items-center gap-3 my-6">
          <p className="text-xs opacity-50">تصویر پروفایل</p>
          <Separator className="flex-1" />
        </div>
        <div className="w-full">
          <label htmlFor="profileImage">تصویر پروفایل</label>
          <label
            htmlFor="profileImage"
            className="flex flex-col items-center justify-center gap-3 mt-3 rounded-lg border-2 border-dashed border-foreground p-6 bg-card cursor-pointer hover:bg-card transition-colors relative w-full max-sm:aspect-square max-h-52 sm:size-52 overflow-hidden"
          >
            {previewImage ? (
              <>
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <Image
                    fill
                    alt="Preview"
                    src={previewImage}
                    className="object-cover"
                  />
                </div>
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg z-20">
                    <div className="text-center">
                      <p className="text-sm font-medium">در حال آپلود...</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg z-10">
                  <div className="text-center">
                    <ImagePlusIcon className="mx-auto mb-2 size-8" />
                    <p className="text-sm font-medium">تغییر تصویر</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <ImagePlusIcon className="size-12 opacity-50" />
                <p className="text-center">
                  {isUploadingImage
                    ? "در حال آپلود..."
                    : "تصویر خود را آپلود کنید..."}
                </p>
                <p className="text-yellow-100 text-sm text-center">
                  حداکثر ۲ مگابایت، فرمت های رایج
                </p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profileImage"
              onChange={handleFileChange}
              disabled={isUploadingImage}
            />
          </label>
          {errors.profileImage && (
            <p className="text-red-500 text-sm mt-1">
              {errors.profileImage.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 my-6">
          <p className="text-xs opacity-50">اطلاعات شخصی</p>
          <Separator className="flex-1" />
        </div>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="firstName">
              نام <span className="text-red-500">*</span>
            </label>
            <Input
              className="mt-1.5"
              id="firstName"
              placeholder="نام"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="lastName">
              نام خانوادگی <span className="text-red-500">*</span>
            </label>
            <Input
              className="mt-1.5"
              id="lastName"
              placeholder="نام خانوادگی"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="nationalCode">
              کدملی <span className="text-red-500">*</span>
            </label>
            <Input
              className="mt-1.5"
              id="nationalCode"
              placeholder="کدملی"
              {...register("nationalCode")}
            />
            {errors.nationalCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nationalCode.message}
              </p>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="gender">
              جنسیت <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select dir="rtl" value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="gender" className="w-full mt-1.5">
                    <SelectValue placeholder="جنسیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">مرد</SelectItem>
                    <SelectItem value="female">زن</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="birthdate">
              تاریخ تولد <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="birthdate"
              render={({ field }) => {
                const selectedDate = field.value ? new Date(field.value) : undefined;

                const formatDateLabel = (value: string | undefined) => {
                  if (!value) return "تاریخ تولد";
                  try {
                    const date = new Date(value);
                    return date.toLocaleDateString("fa-IR");
                  } catch {
                    return value;
                  }
                };

                return (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-1.5 w-full justify-between"
                      >
                        <span>{formatDateLabel(field.value)}</span>
                        <CalendarDaysIcon className="size-4 opacity-70" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (!date) {
                            field.onChange("");
                            return;
                          }
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, "0");
                          const day = String(date.getDate()).padStart(2, "0");
                          field.onChange(`${year}-${month}-${day}`);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
            {errors.birthdate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.birthdate.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 my-6">
          <p className="text-xs opacity-50">اطلاعات تماس</p>
          <Separator className="flex-1" />
        </div>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="mobile">
              شماره موبایل <span className="text-red-500">*</span>
            </label>
            <Input
              className="mt-1.5"
              id="mobile"
              placeholder="شماره موبایل"
              {...register("mobile")}
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mobile.message}
              </p>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="email">
              آدرس ایمیل <span className="text-red-500">*</span>
            </label>
            <Input
              className="mt-1.5"
              id="email"
              type="email"
              placeholder="آدرس ایمیل"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 my-6">
          <p className="text-xs opacity-50">اطلاعات آدرس</p>
          <Separator className="flex-1" />
        </div>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="country">کشور</label>
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <Select dir="rtl" value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="country" className="w-full mt-1.5">
                    <SelectValue placeholder="کشور" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ir">ایران</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">
                {errors.country.message}
              </p>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="state">استان</label>
            <Controller
              control={control}
              name="state"
              render={({ field }) => (
                <Select dir="rtl" value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="state" className="w-full mt-1.5">
                    <SelectValue placeholder="استان" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tehran">تهران</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">
                {errors.state.message}
              </p>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="city">شهر</label>
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <Select dir="rtl" value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="city" className="w-full mt-1.5">
                    <SelectValue placeholder="شهر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tehran">تهران</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>

          <div className="col-span-12">
            <label htmlFor="address">آدرس</label>
            <Textarea
              className="mt-1.5"
              id="address"
              placeholder="آدرس"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="col-span-12 md:col-span-4">
            <label htmlFor="postalCode">کد پستی</label>
            <Input
              className="mt-1.5"
              id="postalCode"
              placeholder="کد پستی"
              {...register("postalCode")}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.postalCode.message}
              </p>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="plate">پلاک</label>
            <Input
              className="mt-1.5"
              id="plate"
              placeholder="پلاک"
              {...register("plate")}
            />
            {errors.plate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.plate.message}
              </p>
            )}
          </div>
          <div className="col-span-12 md:col-span-4">
            <label htmlFor="unit">واحد</label>
            <Input
              className="mt-1.5"
              id="unit"
              placeholder="واحد"
              {...register("unit")}
            />
            {errors.unit && (
              <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center max-sm:flex-col-reverse justify-end gap-2 mt-5 max-lg:sticky max-lg:bottom-3 bg-background p-3 rounded-2xl">
          <Link className="max-sm:w-full" href={"/dashboard/profile"}>
            <Button className="max-sm:w-full" variant="outline" type="button">
              <XIcon />
              <span>انصراف</span>
            </Button>
          </Link>
          <Button className="max-sm:w-full" type="submit" disabled={isSubmitting}>
            <CircleCheckIcon />
            <span>{isSubmitting ? "در حال ثبت..." : "ثبت تغییرات"}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}

export default DashboardEditProfilePage;
