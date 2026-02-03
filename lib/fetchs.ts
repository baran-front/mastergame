import { CommonHeaders, safeFetch } from "./api";
import {
  ArticleCategoryT,
  ArticleT,
  BasketT,
  CartItemT,
  CategoryT,
  CommentT,
  FaqT,
  FileUploaderResponseT,
  MenuLinkT,
  OrderT,
  PageInfoT,
  ProductT,
  TicketDetailT,
  TicketT,
  TransactionWalletT,
  UserT,
} from "@/types/api.types";

// ============================================
// Article Fetches
// ============================================

export const getArticleCategories = () =>
  safeFetch<{ data: ArticleCategoryT[] }>(
    `/v1/blogcategories/client/categories/zerocounter/${5}`,
    {}
  );

type GetArticlesParamsT = {
  blogPostCategoryId: number | null;
  keyword: string | null;
  pageNumber: number;
  pageSize: number;
  orderBy: string[];
};
export const getArticles = (params: GetArticlesParamsT) =>
  safeFetch<{
    data: {
      data: ArticleT[];
      currentPage: number;
      totalPages: number;
      totalCount: number;
      pageSize: number;
    };
  }>("/v1/blogposts/client/searchsp", {
    method: "POST",
    headers: {
      ...CommonHeaders.jsonApplicationType,
    },
    body: JSON.stringify(params),
  });

type GetArticleDetailParamsT = {
  slug: string;
};
export const getArticleDetail = (params: GetArticleDetailParamsT) =>
  safeFetch<{ data: ArticleT }>(`/v1/blogposts/client/byslug/${params.slug}`, {});

// ============================================
// Auth Fetches
// ============================================

type SendOtpParamsT = {
  phoneNumber: string;
};
export const sendOtp = (params: SendOtpParamsT) =>
  safeFetch<{
    messages: string[];
  }>(`/identity/send-code?phoneNumber=${params.phoneNumber}`, {
    method: "POST",
    headers: CommonHeaders.jsonApplicationType,
  });

type SendCodeParamsT = {
  phoneNumber: string;
  code: string;
  token: string;
};
export const sendCode = (params: SendCodeParamsT) =>
  safeFetch<{
    data: {
      token: string;
      refreshToken: string;
      refreshTokenExpiryTime: string;
    };
  }>("/tokens/token-by-codev2", {
    method: "POST",
    headers: CommonHeaders.jsonApplicationType,
    body: JSON.stringify(params),
  });

type GetMeParamsT = {
  token: string;
};
export const getMe = (params: GetMeParamsT) =>
  safeFetch<UserT>("/v1/personal/profile", {
    headers: CommonHeaders.bearerToken(params.token),
  });

type EditProfileParamsT = {
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  imageUrl: string;
  companyName: string;
  companyNumber: string;
  middleName: string;
  gender: number;
  title: string;
  info: string;
  code: string;
  codeType: number;
  userType: number;
  jsonExt: string;
  vatNumber: string;
  sheba: string;
  bankname: string;
  birthdate: string;
  codeMeli: string;
  representativeBy: string;
  rolesRequests: string;
  language: string;
  city: string;
  country: string;
  companyId: number;
  instagram: string;
  facebook: string;
  linkedIn: string;
  twitter: string;
  gitHub: string;
  skype: string;
  telegram: string;
  whatsApp: string;
  token: string;
};
export const editProfile = ({ token, ...params }: EditProfileParamsT) =>
  safeFetch("/v1/personal/profile", {
    method: "PUT",
    headers: {
      ...CommonHeaders.jsonApplicationType,
      ...CommonHeaders.bearerToken(token),
    },
    body: JSON.stringify(params),
  });

type SetRepresentativeParamsT = {
  request: string;
  token: string;
};
export const setRepresentative = (params: SetRepresentativeParamsT) =>
  safeFetch<{
    messages: string[];
  }>(`/v1/personal/representative?request=${params.request}`, {
    method: "POST",
    headers: {
      ...CommonHeaders.jsonApplicationType,
      ...CommonHeaders.bearerToken(params.token),
    },
  });

type GetProfileDateByRepresentativeDateParamsT = {
  fromDate: string;
  toDate: string;
  token: string;
};
export const getProfileDateByRepresentativeDate = ({
  token,
  fromDate,
  toDate,
}: GetProfileDateByRepresentativeDateParamsT) =>
  safeFetch<{
    data?: unknown[];
  }>(
    `/v1/personal/profiledatebyrepresentativedate?fromDate=${encodeURIComponent(fromDate)}&Todate=${encodeURIComponent(toDate)}`,
    {
      method: "POST",
      headers: {
        ...CommonHeaders.bearerToken(token),
        ...CommonHeaders.jsonApplicationType
      },
    }
  );

type SearchUserCardsParamsT = {
  pageNumber: number;
  pageSize: number;
  orderBy: string[];
  userId: string;
  token: string;
};
export const searchUserCards = ({ token, ...params }: SearchUserCardsParamsT) =>
  safeFetch<{
    data: unknown[];
    totalCount?: number;
    pageNumber?: number;
    pageSize?: number;
  }>("/v1/usercards/search", {
    method: "POST",
    headers: {
      ...CommonHeaders.jsonApplicationType,
      ...CommonHeaders.bearerToken(token),
    },
    body: JSON.stringify(params),
  });

type ChargeWalletParamsT = {
  price: number;
  description: string;
  type: number;
  token: string;
};
export const chargeWallet = ({ token, ...params }: ChargeWalletParamsT) =>
  safeFetch<{
    url: string;
  }>("/v1/payments/paymentwallet", {
    method: "POST",
    headers: {
      ...CommonHeaders.jsonApplicationType,
      ...CommonHeaders.bearerToken(token),
    },
    body: JSON.stringify(params),
  });

type GetTransactionWalletHistoryParamsT = {
  orderBy?: string[];
  token: string;
};
export const getTransactionWalletHistory = ({
  token,
  orderBy,
}: GetTransactionWalletHistoryParamsT) => {
  const orderByParam = orderBy?.length
    ? `?orderBy=${orderBy.map((o) => encodeURIComponent(o)).join("&orderBy=")}`
    : "";
  return safeFetch<{
    data?: TransactionWalletT[];
    totalCount?: number;
  }>(`/v1/transactionwallet/mytransactionwallethistory${orderByParam}`, {
    headers: CommonHeaders.bearerToken(token),
  });
};

type WithdrawWalletParamsT = {
  userId: string;
  senderId: string;
  type: number;
  price: number;
  finished: boolean;
  status: number;
  token: string;
};
export const withdrawWallet = ({ token, ...params }: WithdrawWalletParamsT) =>
  safeFetch("/v1/transactionwallet", {
    method: "POST",
    headers: {
      ...CommonHeaders.jsonApplicationType,
      ...CommonHeaders.bearerToken(token),
    },
    body: JSON.stringify(params),
  });

type GetTransactionWalletTotalParamsT = {
  token: string;
};
export const getTransactionWalletTotal = (
  params: GetTransactionWalletTotalParamsT
) =>
  safeFetch<{
    data?: { price: number }[];
  }>("/v1/transactionwallet/mytransactionwallettotal", {
    headers: CommonHeaders.bearerToken(params.token),
  });

// ============================================
// General Fetches
// ============================================

type GetCategoryParamsT = {
  type: number;
};
export const getCategory = (params: GetCategoryParamsT) =>
  safeFetch<{ data: CategoryT[] }>(
    `/v1/categories/client/by-type/${params.type}`,
    {}
  );

type GetCategoryDetailParamsT = {
  id: number;
};
export const getCategoryDetail = (params: GetCategoryDetailParamsT) =>
  safeFetch<{ data: CategoryT }>(`/v1/categories/client/by-id/${params.id}`, {});

type GetFaqsParamsT = {
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
  orderBy?: string[];
};
export const getFaqs = (params: GetFaqsParamsT) =>
  safeFetch<{ data: FaqT[] }>("/v1/faqs/client/searchex", {
    method: "POST",
    headers: CommonHeaders.jsonApplicationType,
    body: JSON.stringify(params),
  });

type PostContactUsParamsT = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  jsonExt: string;
  type: number;
  responseStatus: number;
};
export const postContactUs = (params: PostContactUsParamsT) =>
  safeFetch<{ data: number }>("/v1/contactusmessages/anonymous-client", {
    method: "POST",
    headers: {
      ...CommonHeaders.jsonApplicationType,
    },
    body: JSON.stringify(params),
  });

type GetMenuLinksByGroupParamsT = {
  groupnames: string;
};
export const getMenuLinksByGroup = (params: GetMenuLinksByGroupParamsT) =>
  safeFetch<{ data: MenuLinkT[] }>("/v1/menulinks/client/groupnames", {
    method: "POST",
    headers: CommonHeaders.jsonApplicationType,
    body: JSON.stringify(params),
  });

type GetPageInfoParamsT = {
  pageId: string;
};
export const getPageInfo = (params: GetPageInfoParamsT) =>
  safeFetch<{ data?: PageInfoT }>("/v1/pages/client/pageinfo", {
    method: "POST",
    headers: CommonHeaders.jsonApplicationType,
    body: JSON.stringify(params),
  });

type PostBookmarkParamsT = {
  userId: string;
  content: string;
  token: string;
};
export const postBookmark = ({ token, ...params }: PostBookmarkParamsT) =>
  safeFetch("/v1/bookmarks/client", {
    method: "POST",
    headers: {
      ...CommonHeaders.jsonApplicationType,
      ...CommonHeaders.bearerToken(token)
    },
    body: JSON.stringify(params),
  });

type GetBookmarksParamsT = {
  token: string;
};
export const getBookmarks = (params: GetBookmarksParamsT) =>
  safeFetch<{ data: { content: string } }>("/v1/bookmarks/client", {
    headers: CommonHeaders.bearerToken(params.token),
  });

type GetCommentsParamsT = {
  productId?: string;
  blogId?: number;
  pageNumber: number;
  pageSize: number;
  orderBy: string[];
};
export const getComments = (params: GetCommentsParamsT) =>
  safeFetch<{ data: CommentT[] }>("/v1/comments/client/search", {
    method: "POST",
    headers: {
      ...CommonHeaders.jsonApplicationType,
    },
    body: JSON.stringify(params),
  });

type PostCommentParamsT = {
  blogId?: number;
  productId?: string;
  title: string;
  rate: number;
  token: string;
};
export const postComment = ({ token, ...params }: PostCommentParamsT) =>
  safeFetch<{ data: number }>("/v1/comments", {
    method: "POST",
    headers: {
      ...CommonHeaders.jsonApplicationType,
      ...CommonHeaders.bearerToken(token)
    },
    body: JSON.stringify(params),
  });

type FileUploaderParamsT = {
  file: File;
  token: string;
};
export const fileUploader = (params: FileUploaderParamsT) => {
  const formData = new FormData();
  formData.append("file", params.file);

  return safeFetch<{
    data: FileUploaderResponseT;
  }>("/v1/fileuploader?folder=learn", {
    method: "POST",
    headers: CommonHeaders.bearerToken(params.token),
    body: formData,
  });
};

type GetCmsContentByNameParamsT = {
  name: string;
};
export const getCmsContentByName = (params: GetCmsContentByNameParamsT) =>
  safeFetch<{
    data: {
      id: number;
      version: number;
      name: string;
      content: string;
      groupName: string;
      locale: string;
    };
  }>(`/cms/client/by-name/${params.name}`, {});

// ============================================
// Product Fetches
// ============================================

type GetProductsParamsT = {
  pageNumber: number;
  pageSize: number;
  keyword: string;
  orderBy: string[];
  minPrice?: number;
  maxPrice?: number;
  categoryId?: number;
};
export const getProducts = (params: GetProductsParamsT) =>
  safeFetch<{
    data: {
      data: ProductT[];
      currentPage: number;
      totalPages: number;
      totalCount: number;
      pageSize: number;
    };
  }>("/v1/products/client/search", {
    method: "POST",
    headers: CommonHeaders.jsonApplicationType,
    body: JSON.stringify(params),
  });

export const getProductsPriceRange = () =>
  safeFetch<[{ max: number, min: number }]>("/v1/products/client/prefilter/1", {});

type GetProductByIdParamsT = {
  id: string;
};
export const getProductById = (params: GetProductByIdParamsT) =>
  safeFetch<{ data: ProductT }>(`/v1/products/client/${params.id}`, {});

type GetProductWithRelatedByCategoryParamsT = {
  id: string;
};
export const getProductWithRelatedByCategory = (
  params: GetProductWithRelatedByCategoryParamsT
) =>
  safeFetch<{
    data: { currentProduct: ProductT; relatedProduct?: ProductT[] };
  }>(`/v1/products/client/withrelatedbycategory/${params.id}`, {});

type GetBasketParamsT = {
  token: string;
};
export const getBasket = (params: GetBasketParamsT) =>
  safeFetch<{
    data: BasketT;
  }>("/v1/baskets/client", {
    headers: CommonHeaders.bearerToken(params.token),
  });

type UpdateBasketParamsT = {
  items: CartItemT[];
  token: string;
};
export const updateBasket = ({ token, ...params }: UpdateBasketParamsT) =>
  safeFetch<{
    data: BasketT;
  }>("/v1/baskets/client", {
    method: "POST",
    headers: {
      ...CommonHeaders.jsonApplicationType,
      ...CommonHeaders.bearerToken(token),
    },
    body: JSON.stringify({
      items: JSON.stringify(params.items),
    }),
  });

type SearchOrdersParamsT = {
  pageNumber: number;
  pageSize: number;
  orderBy: string[];
  token?: string;
  keyword?: string;
};
export const searchOrders = ({ token, ...params }: SearchOrdersParamsT) =>
  safeFetch<{
    data: OrderT[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  }>("/v1/orders/client/search", {
    method: "POST",
    headers: {
      ...CommonHeaders.jsonApplicationType,
      ...(token ? CommonHeaders.bearerToken(token) : {}),
    },
    body: JSON.stringify(params),
  });

type CreateOrderParamsT = {
  token: string;
  userId: string;
  status: number;
  totalPrice: number;
  orderItems: CartItemT[];
};
export const createOrderWithWallet = ({
  token,
  ...params
}: CreateOrderParamsT) =>
  safeFetch("/v1/orders/orderwithwallet", {
    method: "POST",
    headers: {
      ...CommonHeaders.jsonApplicationType,
      ...CommonHeaders.bearerToken(token),
    },
    body: JSON.stringify({
      totalPrice: params.totalPrice,
      status: params.status,
      userId: params.userId,
      orderItems: params.orderItems,
    }),
  });

// ============================================
// Ticket Fetches
// ============================================

type CreateTicketParamsT = {
  subject: string;
  priority: number;
  expairDate: string;
  ticketMessages: { message: string }[];
  token: string;
};
export const createTicket = ({ token, ...params }: CreateTicketParamsT) =>
  safeFetch<{ data: number }>("/v1/tickets/client", {
    method: "POST",
    headers: {
      ...CommonHeaders.jsonApplicationType,
      ...CommonHeaders.bearerToken(token),
    },
    body: JSON.stringify({ status: 1, ...params }),
  });

type SearchTicketsParamsT = {
  pageNumber: number;
  pageSize: number;
  orderBy: string[];
  token: string;
};
export const searchTickets = ({ token, ...params }: SearchTicketsParamsT) =>
  safeFetch<{
    data: {
      data: TicketT[];
      currentPage: number;
      totalPages: number;
      totalCount: number;
      pageSize: number;
    };
  }>("/v1/tickets/client/search", {
    method: "POST",
    headers: {
      ...CommonHeaders.jsonApplicationType,
      ...CommonHeaders.bearerToken(token),
    },
    body: JSON.stringify(params),
  });

type GetTicketDetailParamsT = {
  id: number;
  token: string;
};
export const getTicketDetail = ({ token, id }: GetTicketDetailParamsT) =>
  safeFetch<{
    data: TicketDetailT;
  }>(`/v1/tickets/client/${id}`, {
    headers: CommonHeaders.bearerToken(token),
  });

type SendTicketMessageParamsT = {
  token: string;
  ticketId: number;
  message: string;
  ticketMessageDocuments?: { fileUrl: string }[];
};
export const sendTicketMessage = ({
  token,
  ...params
}: SendTicketMessageParamsT) =>
  safeFetch("/v1/tickets/client/message", {
    method: "POST",
    headers: {
      ...CommonHeaders.jsonApplicationType,
      ...CommonHeaders.bearerToken(token),
    },
    body: JSON.stringify(params),
  });
