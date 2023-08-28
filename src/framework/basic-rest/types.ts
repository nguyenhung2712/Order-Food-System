import { QueryKey } from 'react-query';

export type CollectionsQueryOptionsType = {
  text?: string;
  collection?: string;
  status?: string;
  limit?: number;
};

export type CategoriesQueryOptionsType = {
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
};
export type ProductsQueryOptionsType = {
  type: string;
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
};
export type QueryOptionsType = {
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
  type?: string;
};

export type QueryParamsType = {
  queryKey: QueryKey;
  pageParam?: string;
};
export type Attachment = {
  id: string | number;
  thumbnail: string;
  original: string;
};
export type Category = {
  id: number | string;
  typeName: string;
  slug: string;
  slugEn: string;
  /* details?: string;
      image?: Attachment; */
  unit: string;
  unitEn: string;
  icon?: string;
  /* children?: [Category];
      products?: Product[];
      productCount?: number;
      [key: string]: unknown; */
};
export type Collection = {
  id: number | string;
  name: string;
  slug: string;
  details?: string;
  image?: Attachment;
  icon?: string;
  products?: Product[];
  productCount?: number;
};
export type Brand = {
  id: number | string;
  name: string;
  slug: string;
  image?: Attachment;
  [key: string]: unknown;
};
export type Dietary = {
  id: number | string;
  name: string;
  slug: string;
  [key: string]: unknown;
};
export type Tag = {
  id: string | number;
  name: string;
  slug: string;
};
export type Product = {
  id: number | string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  sold: number;
  unit: string;
  sale_price?: number;
  min_price?: number;
  max_price?: number;
  image: Attachment;
  sku?: string;
  gallery?: Attachment[];
  category?: Category;
  tag?: Tag[];
  meta?: any[];
  brand?: Brand;
  description?: string;
  variations?: object;
  [key: string]: unknown;
};
export type Product1 = {
  id: number | string;
  dishName: string;
  slug: string;
  price: number;
  status: number;
  image: string;
  type?: Category;
  ingredients?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  DishHasSizes?: any;
  [key: string]: unknown;
};
export type OrderItem = {
  id: number | string;
  dish: Product1;
  order: Order;
  price: number;
  quantity: number;
};
export type Order = {
  id: string | number;
  OrderDetails: OrderItem[];
  address: any;
  predictDate: string;
  number: string;
  user: Customer;
  /* shipping_fee?: number; */
  payment: any;
  note?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type ShopsQueryOptionsType = {
  text?: string;
  shop?: Shop;
  status?: string;
  limit?: number;
};

export type BlogsQueryOptionsType = {
  text?: string;
  shop?: Shop;
  status?: string;
  limit?: number;
  id?: string;
  sort_by?: string;
};

export type Shop = {
  id: string | number;
  owner_id: string | number;
  owner_name: string;
  address: string;
  phone: string;
  website: string;
  ratings: string;
  name: string;
  slug: string;
  description: string;
  cover_image: Attachment;
  logo: Attachment;
  socialShare: any;
  created_at: string;
  updated_at: string;
};

export type Blog = {
  id: string | number;
  header: string;
  content: string;
  deletedAt?: string;
  status: null;
  createdAt: string;
  updatedAt: string;
  user: Customer;
  slug: string;
  Interacts?: any;
};

export type Customer = {
  avatar: string;
  createdAt: string;
  deletedAt?: string;
  disabledAt: string;
  email: string;
  firstName: string;
  gender: number;
  id: string;
  is2FA?: number;
  isActived: number;
  lastLogin: string;
  isShared?: number;
  lastName: string;
  password: string;
  phoneNum: string;
  status: number;
  updatedAt: string;
  username: string;
};

export type Cart = {
  id: string;
  status: number;
  deletedAt?: string;
  updatedAt: string;
  createdAt: string;
  userId: string;
  user: Customer;
  items: CartItem[];
};

export type CartItem = {
  id: string | number;
  status?: number;
  deletedAt?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  quantity?: number;
  cart: Cart;
  product: Product1;
};

export type Comment = {
  id: string | number;
  message?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  status: number;
  user: Customer;
  blog: Blog;
  CommentReps?: CommentRep[];
  Interacts?: any;
};

export type CommentRep = {
  id: string | number;
  message?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  status: number;
  user: Customer;
  comment: Comment;
  Interacts: any;
  /* rep: CommentRep; */
};

export type CommentsQueryOptionsType = {
  text?: string;
  shop?: Shop;
  status?: string;
  limit?: number;
};
