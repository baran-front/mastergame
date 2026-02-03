import { PageSectionItemProductValueT, ProductT } from "@/types/api.types";

export const mapSectionItemToProduct = (value: PageSectionItemProductValueT) => {
  const jsonExt = value.JsonExt ? JSON.parse(value.JsonExt) : {};

  return {
    id: value.Id,
    name: value.Name,
    masterImage: value.MasterImage,
    masterPrice: value.MasterPrice,
    discountPercent: value.DiscountPercent,
    jsonExt,
  } as ProductT;
};