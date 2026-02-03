import { brand } from "@/brand";

export async function safeFetch<T>(endPoint: string, init: RequestInit) {
  let response: Response | null = null;
  // let result: { data?: T; messages?: string[] } | null = null;
  let result: T | null = null;

  try {
    response = await fetch(brand.apiUrl + endPoint, {
      ...init,
      headers: {
        Tenant: brand.apiTenant || "",
        "Accept-Language": "fa",
        ...CommonHeaders.bearerToken(brand.apiToken),
        ...init.headers,
      },
    });

    result = await response.json();
  } catch (error) {
    console.error(`Unknown error on fetch ${endPoint}:`, error);
  }

  return {
    status: response?.status,
    result,
  };
}

export const CommonHeaders = {
  jsonApplicationType: { "Content-Type": "application/json" },
  bearerToken: (token: string) => ({ Authorization: `Bearer ${token}` }),
};
