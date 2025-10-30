import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockApiService } from '../src/services/mockApiService';
import { mockCredentials } from '../src/mocks/datasets';
import { MockApiError } from '../src/services/mockApiTypes';
import type { ShippingAddress } from '../src/types';

const address: ShippingAddress = {
  fullName: 'Test Adept',
  line1: '1 Daoist Way',
  city: 'Wudang',
  region: 'Hubei',
  country: 'China',
  postalCode: '430000'
};

describe('MockApiService', () => {
  let service: MockApiService;

  beforeEach(() => {
    service = new MockApiService({ minLatency: 0, maxLatency: 0, errorRate: 0 });
  });

  it('authenticates a user with valid credentials', async () => {
    const credential = mockCredentials[0];
    const response = await service.login({ email: credential.email, password: credential.password });

    expect(response.token).toBeTruthy();
    expect(response.user.id).toBe(credential.userId);
  });

  it('rejects invalid login attempts', async () => {
    await expect(service.login({ email: 'unknown@example.com', password: 'nope' })).rejects.toBeInstanceOf(
      MockApiError
    );
  });

  it('filters featured articles', async () => {
    const response = await service.fetchArticles({ featured: true, pageSize: 50 });

    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data.every((article) => article.isFeatured)).toBe(true);
  });

  it('creates a new article with a unique slug', async () => {
    const article = await service.createArticle({
      title: 'Celestial Pine Meditation',
      summary: 'Visualising pine branches to calm the spirit.',
      content: 'Detailed instructions on the Celestial Pine method...',
      heroImage: '/images/articles/celestial-pine.jpg',
      tags: ['meditation', 'pine'],
      categoryIds: ['cat-daoist-philosophy'],
      authorId: mockCredentials[0].userId,
      readingTimeMinutes: 6
    });

    expect(article.id).toMatch(/^art-/);
    expect(article.slug).toMatch(/celestial-pine-meditation/);

    const fetched = await service.getArticleBySlug(article.slug);
    expect(fetched.title).toBe(article.title);
  });

  it('creates an order and updates product stock', async () => {
    const productBefore = await service.getProductById('prod-qi-tonic-elixir');
    const quantity = 2;

    const order = await service.createOrder({
      userId: mockCredentials[1].userId,
      items: [{ productId: productBefore.id, quantity }],
      shippingAddress: address
    });

    expect(order.items[0]?.quantity).toBe(quantity);
    expect(order.timeline.length).toBe(1);

    const productAfter = await service.getProductById(productBefore.id);
    expect(productAfter.stock).toBe(productBefore.stock - quantity);
    expect(productAfter.metrics.sold).toBe(productBefore.metrics.sold + quantity);
  });

  it('invokes the error hook when a request fails', async () => {
    const hook = vi.fn();
    service.setErrorHook(hook);

    await expect(service.getArticleById('non-existent')).rejects.toBeInstanceOf(MockApiError);
    expect(hook).toHaveBeenCalledTimes(1);
    expect(hook.mock.calls[0][0]?.endpoint).toBe('articles:getById');
  });

  it('restricts order queries for non-admin tokens to their own orders', async () => {
    const practitioner = mockCredentials.find((credential) => credential.userId === 'user-adept-wei');
    expect(practitioner).toBeDefined();
    const login = await service.login({ email: practitioner!.email, password: practitioner!.password });

    const response = await service.fetchOrders({ pageSize: 20 }, login.token);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data.every((order) => order.userId === practitioner!.userId)).toBe(true);
  });

  it('updates order status and records a timeline event', async () => {
    const existingOrder = (await service.fetchOrders({ pageSize: 1 })).data[0];
    const updated = await service.updateOrderStatus(existingOrder.id, {
      status: 'processing',
      note: 'Preparing altar blessing.'
    });

    expect(updated.status).toBe('processing');
    const lastEvent = updated.timeline[updated.timeline.length - 1];
    expect(lastEvent?.note).toBe('Preparing altar blessing.');
  });
});
