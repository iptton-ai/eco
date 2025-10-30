import type {
  Article,
  ArticleMetrics,
  Identifier,
  Order,
  OrderStatus,
  Product,
  ProductMetricSnapshot,
  SiteStats,
  User
} from './models';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ArticleQuery extends PaginationParams {
  categoryId?: Identifier;
  tag?: string;
  featured?: boolean;
  search?: string;
  sortBy?: 'recent' | 'popular' | 'readingTime';
}

export interface ProductQuery extends PaginationParams {
  categoryId?: Identifier;
  featured?: boolean;
  search?: string;
  priceRange?: [number, number];
  sortBy?: 'priceAsc' | 'priceDesc' | 'popular' | 'newest';
}

export interface OrderQuery extends PaginationParams {
  status?: OrderStatus;
  userId?: Identifier;
}

export interface ArticleCreatePayload {
  title: string;
  slug?: string;
  summary: string;
  content: string;
  heroImage: string;
  tags: string[];
  categoryIds: Identifier[];
  authorId: Identifier;
  readingTimeMinutes: number;
  isFeatured?: boolean;
  publishedAt?: string;
  metrics?: Partial<ArticleMetrics>;
}

export type ArticleUpdatePayload = Partial<Omit<Article, 'id'>>;

export interface ProductCreatePayload {
  name: string;
  slug?: string;
  summary: string;
  description: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  categoryIds: Identifier[];
  images?: string[];
  tags?: string[];
  attributes?: Product['attributes'];
  isFeatured?: boolean;
  metrics?: Partial<ProductMetricSnapshot>;
}

export type ProductUpdatePayload = Partial<Omit<Product, 'id'>>;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: string;
}

export interface OrderCreatePayload {
  userId: Identifier;
  items: Array<{ productId: Identifier; quantity: number }>;
  shippingAddress: Order['shippingAddress'];
  notes?: string;
}

export interface OrderStatusUpdatePayload {
  status: OrderStatus;
  note?: string;
}

export interface ApiResult<T> {
  data: T;
}

export interface ApiErrorContext {
  endpoint: string;
  payload?: unknown;
  cause: unknown;
}

export interface MockApiOptions {
  minLatency?: number;
  maxLatency?: number;
  errorRate?: number;
}

export interface StatsResponse extends ApiResult<SiteStats> {}
