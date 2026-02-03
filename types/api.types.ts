// ============================================
// Article Types
// ============================================

export type ArticleCategoryT = {
  id: number;
  title: string;
  locale: string | null;
  image: string | null;
  slug: string | null;
  content: string | null;
};

export type ArticleT = {
  id: number;
  authorId: string;
  authorName: string;
  authorImage: string | null;
  title: string;
  slug: string | null;
  summery: string;
  imageUrl: string | null;
  thumbnail: string | null;
  published: string;
  seoJson: string | null;
  locale: string | null;
  type: number | null;
  tags: string | null;
  categories: string | null;
  content: string;
  commentsCount: number;
  rate: number;
  r1: number | null;
  r2: number | null;
  r3: number | null;
  r4: number | null;
  r5: number | null;
};

// ============================================
// General Types
// ============================================

export type CategoryT = {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  children: CategoryT[];
};

export type FaqT = {
  id: number;
  title: string;
  description: string;
};

export type MenuLinkT = {
  id: number;
  name: string | null;
  linkUrl: string | null;
  imageUrl: string | null;
  thumbnail: string | null;
  locale: string | null;
  parentId: number | null;
  sortId: number | null;
  groupName: string | null;
  description: string | null;
  children: MenuLinkT[];
};

export type ProductT = {
  id: string;
  name: string;
  description: string | null;
  tags: string | null;
  categories: string;
  brandId: string;
  brandName: string | null;
  likesCount: number;
  isActive: boolean;
  masterImage: string;
  thumbnail: string;
  discountPercent: number;
  masterPrice: number;
  discountPrice: number;
  inStock: number;
  city: string | null;
  code: string | null;
  country: string | null;
  state: string | null;
  type: number;
  commentsCount: number;
  rate: number;
  r1: string | null;
  r2: string | null;
  r3: string | null;
  r4: string | null;
  r5: string | null;
  p1: string | null;
  masterId: string | null;
  createdBy: string;
  jsonExt: string | null;
  attachmentCount: number | null;
  attachmentDuration: number | null;
};

export type PageSectionItemT = {
  id: number;
  sectionId: number;
  type: number;
  status: number;
  sortOrder: number | null;
  name: string | null;
  description: string | null;
  thumbnail: string | null;
  mediaAlt: string | null;
  mediaType: string | null;
  mediaPath: string | null;
  startDate: string | null;
  endDate: string | null;
  linkUrl: string | null;
  itemGUID: string | null;
  itemId: number;
  itemType: number;
  pageId: number;
  jsonExt: string | null;
  setting: string | null;
  locale: string | null;
  createdOn: string;
  values: PageSectionItemProductValueT[];
};

export type PageSectionT = {
  id: number;
  parentId: number | null;
  title: string | null;
  status: number;
  keyword: string | null;
  pageId: number;
  startDate: string | null;
  endDate: string | null;
  type: number;
  version: number | null;
  setting: string | null;
  description: string | null;
  sortOrder: number | null;
  locale: string | null;
  createdOn: string;
  items: PageSectionItemT[];
};

export type PageSectionItemProductValueT = {
  Id: string;
  Name: string;
  MasterImage: string;
  MasterPrice: number;
  DiscountPercent: number;
  JsonExt: string;
}

export type PageT = {
  id: number;
  title: string | null;
  masterImage: string | null;
  author: string | null;
  description: string | null;
  metaKeyword: string | null;
  metaDescription: string | null;
  url: string | null;
  userId: number | null;
  examId: number | null;
  productId: number | null;
  isActive: boolean;
  locale: string | null;
  site_name: string | null;
  seotype: string | null;
  seoSetting: string | null;
  jsonExt: string | null;
  jsonLD: string | null;
  itemId: number | null;
  itemType: number | null;
  itemGuid: string | null;
  createdOn: string;
};

export type PageInfoT = {
  pages: PageT[];
  pageSections: PageSectionT[];
};

export type CartItemT = {
  productId: string;
  name: string;
  masterImage: string;
  masterPrice: number;
  discountPrice: number;
  discountPercent: number;
  quantity: number;
  country: string | null;
  city: string | null;
  p1: string | null;
  r1: string | null;
  r2: string | null;
  r3: string | null;
  r4: string | null;
  r5: string | null;
  addedAt: string;
};

export type CommentT = {
  id: number;
  parentId: number | null;
  children: CommentT[];
  productId: string | null;
  productName: string | null;
  productImage: string | null;
  userId: string;
  userFullName: string | null;
  userThumbnail: string | null;
  examId: number | null;
  jobId: number | null;
  blogId: number | null;
  files: string | null;
  helpFul: number | null;
  reported: number | null;
  title: string | null;
  type: number | null;
  rate: number | null;
  text: string | null;
  isAccepted: boolean;
  createdOn: string;
};

// ============================================
// Order Types
// ============================================

export type OrderItemT = {
  id: number;
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  unitDiscountPrice: number;
  itemCount: number;
  status: number;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  addressid: number | null;
  city: string | null;
  country: string | null;
  rate: number | null;
  storeId: number | null;
  ressellerId: number | null;
  itemId: number | null;
  itemType: number | null;
};

export type OrderT = {
  id: number;
  totalPrice: number;
  address1: string;
  address2: string;
  phone1: string;
  phone2: string;
  createOrderDate: string;
  submitPriceDate: string;
  sendToPostDate: string | null;
  postStateNumber: string;
  paymentTrackingCode: string;
  status: number;
  coupon: string | null;
  userId: string;
  userPhoneNumber: string;
  userFullname: string;
  description: string | null;
  orderItems: OrderItemT[];
};

// ============================================
// User Types
// ============================================

export type UserT = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string | null;
  isActive: boolean;
  createDate: string;
  middleName: string | null;
  gender: string | null;
  title: string | null;
  info: string | null;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  phoneNumber: string;
  imageUrl: string;
  thumbnail: string | null;
  companyName: string | null;
  companyNumber: string | null;
  code: string;
  userType: string | null;
  codeType: number;
  companyId: string | null;
  jsonExt: string | null;
  vatNumber: string | null;
  representative: string;
  sheba: string | null;
  bankname: string | null;
  birthdate: string | null;
  codeMeli: string | null;
  representativeBy: string;
  representativeDate: string;
  blueUser: string | null;
  blueUSerActiveDate: string | null;
  issue: string | null;
  rolesRequests: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedIn: string | null;
  twitter: string | null;
  gitHub: string | null;
  skype: string | null;
  telegram: string | null;
  whatsApp: string | null;
  follower: number;
  following: number;
};

// ============================================
// Ticket Types
// ============================================

export type TicketMessageDocumentT = {
  id: number;
  ticketMessageId: number;
  fileUrl: string;
};

export type TicketMessageT = {
  id: number;
  message: string;
  userId: string;
  fullName: string;
  isAdmin: boolean;
  type: number;
  reaction: unknown | null;
  createdOn: string;
  responseMessageId: number | null;
  ticketMessageDocuments: TicketMessageDocumentT[];
};

export type TicketT = {
  id: number;
  subject: string;
  status: number;
  priority: number;
  type: number;
  ownerUserId: string;
  itemID: number | null;
  itemType: number | null;
  ownerUserFullName: string;
  isAdmin: boolean | null;
  expairDate: string;
  lastMessage: string | null;
  lastMessageDate: string;
  lastMessageType: number | null;
  unreadCount: number | null;
  category: number | null;
  createdOn: string;
};

export type TicketDetailT = {
  id: number;
  subject: string;
  status: number;
  priority: number;
  type: number;
  ownerUserId: string;
  ownerUserFullName: string;
  category: number | null;
  createdOn: string;
  ticketMessages: TicketMessageT[];
  ticketReplayMessages: unknown[];
};

// ============================================
// Transaction Types
// ============================================

export type TransactionWalletT = {
  userId: string;
  senderId: string;
  type: number;
  price: number;
  coin: string | null;
  exchangeRate: number | null;
  finished: boolean;
  cartId: string | null;
  userCartId: string | null;
  createdOn: string;
  status: number;
  title: string | null;
  description: string | null;
  files: unknown | null;
};

// ============================================
// Basket Types
// ============================================

export type BasketT = {
  id: number;
  userId: string;
  items: string;
  isEmpty: boolean;
  totalItems: number;
  totalUniqueItems: number;
  cartTotal: number;
};

// ============================================
// File Uploader Types
// ============================================

export type FileUploaderResponseT = {
  path: string;
  id: string;
  thumbPath: string;
  orginalPath: string;
};
