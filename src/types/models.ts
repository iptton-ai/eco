export type Identifier = string;

export type CurrencyCode =
  | 'USD'
  | 'CNY'
  | 'EUR'
  | 'GBP'
  | 'HKD'
  | 'JPY'
  | string;

export type UserRole = 'guest' | 'member' | 'practitioner' | 'admin';

export interface Category {
  id: Identifier;
  name: string;
  slug: string;
  description: string;
  featured?: boolean;
  parentId?: Identifier | null;
  image?: string;
}

export interface ArticleMetrics {
  reads: number;
  bookmarks: number;
  shares: number;
}

export interface Article {
  id: Identifier;
  title: string;
  slug: string;
  summary: string;
  content: string;
  heroImage: string;
  tags: string[];
  categoryIds: Identifier[];
  publishedAt: string;
  updatedAt: string;
  authorId: Identifier;
  readingTimeMinutes: number;
  isFeatured: boolean;
  metrics: ArticleMetrics;
}

export interface ProductMetricSnapshot {
  rating: number;
  reviewCount: number;
  sold: number;
  restockExpectedAt?: string | null;
}

export interface ProductAttribute {
  key: string;
  label: string;
  value: string;
}

export interface Product {
  id: Identifier;
  name: string;
  slug: string;
  summary: string;
  description: string;
  sku: string;
  price: number;
  currency: CurrencyCode;
  stock: number;
  categoryIds: Identifier[];
  images: string[];
  tags: string[];
  attributes: ProductAttribute[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  metrics: ProductMetricSnapshot;
}

export interface UserPreferences {
  locale: string;
  currency: CurrencyCode;
  marketingOptIn: boolean;
  interests: string[];
}

export interface User {
  id: Identifier;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type OrderStatus =
  | 'draft'
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  country: string;
  postalCode: string;
  phone?: string;
}

export interface OrderItem {
  productId: Identifier;
  quantity: number;
  unitPrice: number;
  currency: CurrencyCode;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  note?: string;
  occurredAt: string;
}

export interface Order {
  id: Identifier;
  userId: Identifier;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  currency: CurrencyCode;
  createdAt: string;
  updatedAt: string;
  shippingAddress: ShippingAddress;
  notes?: string;
  timeline: OrderTimelineEvent[];
}

export interface CartItem {
  productId: Identifier;
  quantity: number;
}

export interface SiteStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  newsletterSubscribers: number;
  retreatBookings: number;
  meditationSessionsTracked: number;
  trendingCategories: Array<{ categoryId: Identifier; growthPercentage: number }>;
  topProducts: Array<{ productId: Identifier; revenue: number }>;
  topArticles: Array<{ articleId: Identifier; reads: number }>;
}

export interface MockCredential {
  email: string;
  password: string;
  userId: Identifier;
}

export interface SessionToken {
  token: string;
  userId: Identifier;
  expiresAt: string;
}
