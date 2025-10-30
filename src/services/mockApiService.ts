import { createInitialDataset, mockCredentials, mockData } from '../mocks/datasets';
import {
  average,
  clamp,
  createIdentifier,
  filterBySearch,
  filterCollection,
  paginate,
  promiseDelay,
  slugify,
  sum
} from '../utils';
import type {
  ApiErrorContext,
  Article,
  ArticleCreatePayload,
  ArticleQuery,
  ArticleUpdatePayload,
  AuthResponse,
  Category,
  LoginPayload,
  MockApiOptions,
  Order,
  OrderCreatePayload,
  OrderQuery,
  OrderStatus,
  OrderStatusUpdatePayload,
  PaginatedResult,
  Product,
  ProductCreatePayload,
  ProductQuery,
  ProductUpdatePayload,
  SessionToken,
  SiteStats,
  User
} from '../types';
import { MockApiError } from './mockApiTypes';

const clone = <T>(value: T): T => {
  if (typeof globalThis.structuredClone === 'function') {
    return globalThis.structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

const nowIso = (): string => new Date().toISOString();

export type ErrorHook = (context: ApiErrorContext) => void;

type EndpointAction<T> = () => T;

type Dataset = ReturnType<typeof createInitialDataset>;

const DEFAULT_MIN_LATENCY = 120;
const DEFAULT_MAX_LATENCY = 420;

const sessionDurationMs = 60 * 60 * 1000; // 1 hour

const DEFAULT_SORTERS = {
  articles: (sortBy: ArticleQuery['sortBy']) => {
    switch (sortBy) {
      case 'popular':
        return (a: Article, b: Article) => b.metrics.reads - a.metrics.reads;
      case 'readingTime':
        return (a: Article, b: Article) => a.readingTimeMinutes - b.readingTimeMinutes;
      case 'recent':
      default:
        return (a: Article, b: Article) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  },
  products: (sortBy: ProductQuery['sortBy']) => {
    switch (sortBy) {
      case 'priceAsc':
        return (a: Product, b: Product) => a.price - b.price;
      case 'priceDesc':
        return (a: Product, b: Product) => b.price - a.price;
      case 'popular':
        return (a: Product, b: Product) => b.metrics.sold - a.metrics.sold;
      case 'newest':
      default:
        return (a: Product, b: Product) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  }
};

const calculateOrderTotal = (order: Order): number =>
  sum(order.items.map((item) => item.unitPrice * item.quantity));

const updateOrderTotals = (order: Order): Order => ({
  ...order,
  totalAmount: calculateOrderTotal(order)
});

const addTimelineEvent = (order: Order, status: OrderStatus, note?: string): Order => ({
  ...order,
  status,
  timeline: [
    ...order.timeline,
    {
      status,
      note,
      occurredAt: nowIso()
    }
  ],
  updatedAt: nowIso()
});

export class MockApiService {
  private data: Dataset;

  private readonly credentials = mockCredentials;

  private sessions: Map<string, SessionToken> = new Map();

  private errorHook?: ErrorHook;

  private minLatency: number;

  private maxLatency: number;

  private errorRate: number;

  constructor(options: MockApiOptions = {}) {
    this.data = createInitialDataset();
    this.minLatency = options.minLatency ?? DEFAULT_MIN_LATENCY;
    this.maxLatency = options.maxLatency ?? DEFAULT_MAX_LATENCY;
    this.errorRate = clamp(options.errorRate ?? 0, 0, 1);
  }

  public setLatency(min: number, max: number): void {
    this.minLatency = Math.max(0, Math.min(min, max));
    this.maxLatency = Math.max(this.minLatency, max);
  }

  public setErrorRate(rate: number): void {
    this.errorRate = clamp(rate, 0, 1);
  }

  public setErrorHook(hook?: ErrorHook): void {
    this.errorHook = hook;
  }

  public reset(): void {
    this.data = createInitialDataset();
    this.sessions.clear();
  }

  public async fetchCategories(): Promise<Category[]> {
    return this.handleRequest('categories:list', undefined, () =>
      this.data.categories.map((category) => clone(category))
    );
  }

  public async fetchArticles(query: ArticleQuery = {}): Promise<PaginatedResult<Article>> {
    return this.handleRequest('articles:list', query, () => {
      let articles = [...this.data.articles];

      articles = filterBySearch(articles, query.search, [
        (article) => article.title,
        (article) => article.summary,
        (article) => article.tags.join(' ')
      ]);

      articles = filterCollection(articles, [
        query.categoryId
          ? (article) => article.categoryIds.includes(query.categoryId as string)
          : undefined,
        query.tag ? (article) => article.tags.includes(query.tag as string) : undefined,
        typeof query.featured === 'boolean'
          ? (article) => article.isFeatured === query.featured
          : undefined
      ]);

      articles.sort(DEFAULT_SORTERS.articles(query.sortBy));

      const result = paginate(articles, query);
      return {
        data: result.data.map((article) => clone(article)),
        meta: result.meta
      };
    });
  }

  public async getArticleById(id: string): Promise<Article> {
    return this.handleRequest('articles:getById', { id }, () => {
      const article = this.data.articles.find((item) => item.id === id);
      if (!article) {
        throw new MockApiError(404, `Article ${id} not found`, 'ARTICLE_NOT_FOUND');
      }

      return clone(article);
    });
  }

  public async getArticleBySlug(slug: string): Promise<Article> {
    return this.handleRequest('articles:getBySlug', { slug }, () => {
      const article = this.data.articles.find((item) => item.slug === slug);
      if (!article) {
        throw new MockApiError(404, `Article slug ${slug} not found`, 'ARTICLE_NOT_FOUND');
      }

      return clone(article);
    });
  }

  public async createArticle(payload: ArticleCreatePayload): Promise<Article> {
    return this.handleRequest('articles:create', payload, () => {
      const id = createIdentifier('art');
      const slug = this.createUniqueSlug(payload.slug ?? payload.title);
      const timestamp = nowIso();
      const metrics = {
        reads: 0,
        bookmarks: 0,
        shares: 0,
        ...(payload.metrics ?? {})
      };

      const article: Article = {
        id,
        title: payload.title,
        slug,
        summary: payload.summary,
        content: payload.content,
        heroImage: payload.heroImage,
        tags: [...payload.tags],
        categoryIds: [...payload.categoryIds],
        publishedAt: payload.publishedAt ?? timestamp,
        updatedAt: timestamp,
        authorId: payload.authorId,
        readingTimeMinutes: payload.readingTimeMinutes,
        isFeatured: payload.isFeatured ?? false,
        metrics
      };

      this.data.articles.unshift(article);
      return clone(article);
    });
  }

  public async updateArticle(id: string, update: ArticleUpdatePayload): Promise<Article> {
    return this.handleRequest('articles:update', { id, update }, () => {
      const index = this.data.articles.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new MockApiError(404, `Article ${id} not found`, 'ARTICLE_NOT_FOUND');
      }

      const current = this.data.articles[index];
      const slug = update.slug ? this.createUniqueSlug(update.slug, id) : current.slug;

      const updated: Article = {
        ...current,
        ...update,
        slug,
        tags: update.tags ? [...update.tags] : current.tags,
        categoryIds: update.categoryIds ? [...update.categoryIds] : current.categoryIds,
        metrics: update.metrics ? { ...current.metrics, ...update.metrics } : current.metrics,
        updatedAt: nowIso()
      };

      this.data.articles[index] = updated;
      return clone(updated);
    });
  }

  public async deleteArticle(id: string): Promise<void> {
    return this.handleRequest('articles:delete', { id }, () => {
      const index = this.data.articles.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new MockApiError(404, `Article ${id} not found`, 'ARTICLE_NOT_FOUND');
      }

      this.data.articles.splice(index, 1);
    });
  }

  public async fetchProducts(query: ProductQuery = {}): Promise<PaginatedResult<Product>> {
    return this.handleRequest('products:list', query, () => {
      let products = [...this.data.products];

      products = filterBySearch(products, query.search, [
        (product) => product.name,
        (product) => product.summary,
        (product) => product.tags.join(' ')
      ]);

      products = filterCollection(products, [
        query.categoryId
          ? (product) => product.categoryIds.includes(query.categoryId as string)
          : undefined,
        query.featured ? (product) => product.isFeatured === true : undefined,
        query.priceRange
          ? (product) => product.price >= query.priceRange![0] && product.price <= query.priceRange![1]
          : undefined
      ]);

      products.sort(DEFAULT_SORTERS.products(query.sortBy));

      const result = paginate(products, query);

      return {
        data: result.data.map((product) => clone(product)),
        meta: result.meta
      };
    });
  }

  public async getProductById(id: string): Promise<Product> {
    return this.handleRequest('products:getById', { id }, () => {
      const product = this.data.products.find((item) => item.id === id);
      if (!product) {
        throw new MockApiError(404, `Product ${id} not found`, 'PRODUCT_NOT_FOUND');
      }

      return clone(product);
    });
  }

  public async getProductBySlug(slug: string): Promise<Product> {
    return this.handleRequest('products:getBySlug', { slug }, () => {
      const product = this.data.products.find((item) => item.slug === slug);
      if (!product) {
        throw new MockApiError(404, `Product slug ${slug} not found`, 'PRODUCT_NOT_FOUND');
      }

      return clone(product);
    });
  }

  public async createProduct(payload: ProductCreatePayload): Promise<Product> {
    return this.handleRequest('products:create', payload, () => {
      const id = createIdentifier('prod');
      const slug = this.createUniqueSlug(payload.slug ?? payload.name);
      const timestamp = nowIso();
      const metrics = {
        rating: 0,
        reviewCount: 0,
        sold: 0,
        restockExpectedAt: null,
        ...(payload.metrics ?? {})
      };

      const product: Product = {
        id,
        name: payload.name,
        slug,
        summary: payload.summary,
        description: payload.description,
        sku: payload.sku,
        price: payload.price,
        currency: payload.currency,
        stock: payload.stock,
        categoryIds: [...payload.categoryIds],
        images: payload.images ? [...payload.images] : [],
        tags: payload.tags ? [...payload.tags] : [],
        attributes: payload.attributes ? payload.attributes.map((attribute) => ({ ...attribute })) : [],
        isFeatured: payload.isFeatured ?? false,
        createdAt: timestamp,
        updatedAt: timestamp,
        metrics
      };

      this.data.products.unshift(product);
      return clone(product);
    });
  }

  public async updateProduct(id: string, update: ProductUpdatePayload): Promise<Product> {
    return this.handleRequest('products:update', { id, update }, () => {
      const index = this.data.products.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new MockApiError(404, `Product ${id} not found`, 'PRODUCT_NOT_FOUND');
      }

      const current = this.data.products[index];
      const slug = update.slug ? this.createUniqueSlug(update.slug, id) : current.slug;

      const updated: Product = {
        ...current,
        ...update,
        slug,
        categoryIds: update.categoryIds ? [...update.categoryIds] : current.categoryIds,
        images: update.images ? [...update.images] : current.images,
        tags: update.tags ? [...update.tags] : current.tags,
        attributes: update.attributes
          ? update.attributes.map((attribute) => ({ ...attribute }))
          : current.attributes,
        metrics: update.metrics ? { ...current.metrics, ...update.metrics } : current.metrics,
        updatedAt: nowIso()
      };

      this.data.products[index] = updated;
      return clone(updated);
    });
  }

  public async deleteProduct(id: string): Promise<void> {
    return this.handleRequest('products:delete', { id }, () => {
      const index = this.data.products.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new MockApiError(404, `Product ${id} not found`, 'PRODUCT_NOT_FOUND');
      }

      this.data.products.splice(index, 1);
    });
  }

  public async login(payload: LoginPayload): Promise<AuthResponse> {
    return this.handleRequest('auth:login', { email: payload.email }, () => {
      const credential = this.credentials.find((item) => item.email === payload.email);
      if (!credential || credential.password !== payload.password) {
        throw new MockApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
      }

      const user = this.data.users.find((item) => item.id === credential.userId);
      if (!user) {
        throw new MockApiError(404, 'User profile missing for credentials', 'USER_NOT_FOUND');
      }

      const session = this.createSession(user.id);
      this.touchUserLogin(user.id);

      return {
        token: session.token,
        user: clone(user),
        expiresAt: session.expiresAt
      };
    });
  }

  public async logout(token: string): Promise<void> {
    return this.handleRequest('auth:logout', { token }, () => {
      this.sessions.delete(token);
    });
  }

  public async refreshSession(token: string): Promise<AuthResponse> {
    return this.handleRequest('auth:refresh', { token }, () => {
      const session = this.requireSession(token);
      const user = this.getUserById(session.userId);
      const renewed = this.createSession(session.userId);
      this.sessions.delete(token);

      return {
        token: renewed.token,
        user: clone(user),
        expiresAt: renewed.expiresAt
      };
    });
  }

  public async getProfile(token: string): Promise<User> {
    return this.handleRequest('auth:profile', { token }, () => {
      const session = this.requireSession(token);
      const user = this.getUserById(session.userId);

      return clone(user);
    });
  }

  public async fetchOrders(query: OrderQuery = {}, token?: string): Promise<PaginatedResult<Order>> {
    return this.handleRequest('orders:list', { query }, () => {
      let orders = [...this.data.orders];

      if (token) {
        const session = this.requireSession(token);
        const user = this.getUserById(session.userId);
        if (user.role !== 'admin') {
          orders = orders.filter((order) => order.userId === user.id);
        }
      } else if (query.userId) {
        orders = orders.filter((order) => order.userId === query.userId);
      }

      orders = filterCollection(orders, [
        query.status ? (order) => order.status === query.status : undefined
      ]);

      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const result = paginate(orders, query);

      return {
        data: result.data.map((order) => clone(order)),
        meta: result.meta
      };
    });
  }

  public async createOrder(payload: OrderCreatePayload): Promise<Order> {
    return this.handleRequest('orders:create', payload, () => {
      const user = this.getUserById(payload.userId);
      const items = payload.items.map((item) => {
        const product = this.data.products.find((productItem) => productItem.id === item.productId);
        if (!product) {
          throw new MockApiError(404, `Product ${item.productId} not found`, 'PRODUCT_NOT_FOUND');
        }

        if (product.stock < item.quantity) {
          throw new MockApiError(
            409,
            `Insufficient stock for ${product.name}`,
            'INSUFFICIENT_STOCK'
          );
        }

        product.stock -= item.quantity;
        product.metrics.sold += item.quantity;

        return {
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
          currency: product.currency
        };
      });

      const id = createIdentifier('order');
      const timestamp = nowIso();

      const order: Order = {
        id,
        userId: user.id,
        items,
        status: 'pending',
        totalAmount: sum(items.map((item) => item.unitPrice * item.quantity)),
        currency: items[0]?.currency ?? 'USD',
        createdAt: timestamp,
        updatedAt: timestamp,
        shippingAddress: { ...payload.shippingAddress },
        notes: payload.notes,
        timeline: [
          {
            status: 'pending',
            occurredAt: timestamp,
            note: 'Order received and awaiting processing.'
          }
        ]
      };

      this.data.orders.unshift(order);
      return clone(order);
    });
  }

  public async updateOrderStatus(id: string, payload: OrderStatusUpdatePayload): Promise<Order> {
    return this.handleRequest('orders:updateStatus', { id, payload }, () => {
      const index = this.data.orders.findIndex((order) => order.id === id);
      if (index === -1) {
        throw new MockApiError(404, `Order ${id} not found`, 'ORDER_NOT_FOUND');
      }

      const order = this.data.orders[index];
      const updated = addTimelineEvent(order, payload.status, payload.note);
      const totalled = updateOrderTotals(updated);

      this.data.orders[index] = totalled;
      return clone(totalled);
    });
  }

  public async deleteOrder(id: string): Promise<void> {
    return this.handleRequest('orders:delete', { id }, () => {
      const index = this.data.orders.findIndex((order) => order.id === id);
      if (index === -1) {
        throw new MockApiError(404, `Order ${id} not found`, 'ORDER_NOT_FOUND');
      }

      this.data.orders.splice(index, 1);
    });
  }

  public async fetchStats(): Promise<SiteStats> {
    return this.handleRequest('stats:get', undefined, () => this.computeStats());
  }

  public async fetchUsers(token: string): Promise<User[]> {
    return this.handleRequest('users:list', { token }, () => {
      const session = this.requireSession(token);
      const user = this.getUserById(session.userId);
      if (user.role !== 'admin') {
        throw new MockApiError(403, 'Admin privileges required', 'FORBIDDEN');
      }

      return this.data.users.map((item) => clone(item));
    });
  }

  private async handleRequest<T>(endpoint: string, payload: unknown, action: EndpointAction<T>): Promise<T> {
    await this.simulateLatency();
    this.maybeThrowRandomError(endpoint, payload);

    try {
      return action();
    } catch (cause) {
      this.errorHook?.({
        endpoint,
        payload,
        cause
      });
      throw cause;
    }
  }

  private computeStats(): SiteStats {
    const fallback = this.data.stats;
    const revenue = this.data.orders.reduce((total, order) => total + order.totalAmount, 0);
    const uniqueCustomers = new Set(this.data.orders.map((order) => order.userId)).size;

    const productRevenue = new Map<string, number>();
    this.data.orders.forEach((order) => {
      order.items.forEach((item) => {
        const value = productRevenue.get(item.productId) ?? 0;
        productRevenue.set(item.productId, value + item.unitPrice * item.quantity);
      });
    });

    const topProducts = [...productRevenue.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([productId, revenueAmount]) => ({ productId, revenue: revenueAmount }));

    const topArticles = [...this.data.articles]
      .sort((a, b) => b.metrics.reads - a.metrics.reads)
      .slice(0, 3)
      .map((article) => ({ articleId: article.id, reads: article.metrics.reads }));

    const trending = [...this.data.categories]
      .map((category) => {
        const articleReads = this.data.articles
          .filter((article) => article.categoryIds.includes(category.id))
          .reduce((total, article) => total + article.metrics.reads, 0);
        const productSales = this.data.products
          .filter((product) => product.categoryIds.includes(category.id))
          .reduce((total, product) => total + product.metrics.sold, 0);
        const growth = Math.round(average([articleReads / 100, productSales / 20]));
        return {
          categoryId: category.id,
          growthPercentage: clamp(growth, 5, 40)
        };
      })
      .sort((a, b) => b.growthPercentage - a.growthPercentage)
      .slice(0, 3);

    return {
      totalRevenue: revenue,
      totalOrders: this.data.orders.length,
      totalCustomers: uniqueCustomers,
      newsletterSubscribers: fallback.newsletterSubscribers,
      retreatBookings: fallback.retreatBookings,
      meditationSessionsTracked: fallback.meditationSessionsTracked,
      trendingCategories: trending.length ? trending : fallback.trendingCategories,
      topProducts: topProducts.length ? topProducts : fallback.topProducts,
      topArticles: topArticles.length ? topArticles : fallback.topArticles
    };
  }

  private createUniqueSlug(rawValue: string, currentId?: string): string {
    const base = slugify(rawValue);
    let slug = base;
    let counter = 1;

    const isTaken = (value: string) => {
      const article = this.data.articles.find((item) => item.slug === value);
      if (article && article.id !== currentId) {
        return true;
      }

      const product = this.data.products.find((item) => item.slug === value);
      if (product && product.id !== currentId) {
        return true;
      }

      return false;
    };

    while (isTaken(slug)) {
      counter += 1;
      slug = `${base}-${counter}`;
    }

    return slug;
  }

  private async simulateLatency(): Promise<void> {
    if (this.maxLatency <= 0) {
      return;
    }

    const range = this.maxLatency - this.minLatency;
    const latency = Math.round(this.minLatency + Math.random() * range);
    await promiseDelay(latency);
  }

  private maybeThrowRandomError(endpoint: string, payload: unknown): void {
    if (this.errorRate <= 0) {
      return;
    }

    if (Math.random() < this.errorRate) {
      const error = new MockApiError(
        503,
        `Simulated network issue while calling ${endpoint}`,
        'SIMULATED_FAILURE'
      );
      this.errorHook?.({ endpoint, payload, cause: error });
      throw error;
    }
  }

  private createSession(userId: string): SessionToken {
    const token = createIdentifier('token');
    const expiresAt = new Date(Date.now() + sessionDurationMs).toISOString();
    const session: SessionToken = { token, userId, expiresAt };
    this.sessions.set(token, session);
    return session;
  }

  private requireSession(token: string): SessionToken {
    const session = this.sessions.get(token);
    if (!session) {
      throw new MockApiError(401, 'Invalid or expired session token', 'SESSION_INVALID');
    }

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      this.sessions.delete(token);
      throw new MockApiError(401, 'Session token expired', 'SESSION_EXPIRED');
    }

    return session;
  }

  private getUserById(id: string): User {
    const user = this.data.users.find((item) => item.id === id);
    if (!user) {
      throw new MockApiError(404, `User ${id} not found`, 'USER_NOT_FOUND');
    }

    return user;
  }

  private touchUserLogin(id: string): void {
    const user = this.getUserById(id);
    user.lastLoginAt = nowIso();
    user.updatedAt = user.lastLoginAt;
  }
}

export const mockApiService = new MockApiService();

export type MockApiServiceInstance = MockApiService;

export const seedData = mockData;
