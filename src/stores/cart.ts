import { defineStore } from 'pinia';
import type { Order, Product, ShippingAddress } from '../types';
import { mockApiService } from '../services/mockApiService';
import { getErrorMessage, sum } from '../utils';
import { useAuthStore } from './auth';

interface CartLine {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartLine[];
  loading: boolean;
  error: string | null;
  lastOrderId: string | null;
}

const initialState = (): CartState => ({
  items: [],
  loading: false,
  error: null,
  lastOrderId: null
});

export const useCartStore = defineStore('cart', {
  state: initialState,
  getters: {
    isEmpty: (state): boolean => state.items.length === 0,
    totalItems: (state): number => sum(state.items.map((line) => line.quantity)),
    subtotal: (state): number =>
      state.items.reduce((total, line) => total + line.product.price * line.quantity, 0),
    currency: (state): string => state.items[0]?.product.currency ?? 'USD'
  },
  actions: {
    async addItem(productId: string, quantity = 1): Promise<void> {
      this.error = null;
      try {
        const existing = this.items.find((line) => line.product.id === productId);
        if (existing) {
          existing.quantity = Math.min(existing.product.stock, existing.quantity + quantity);
          return;
        }

        const product = await mockApiService.getProductById(productId);
        this.items.push({ product, quantity: Math.min(product.stock, quantity) });
      } catch (error) {
        this.error = getErrorMessage(error);
        throw error;
      }
    },
    async updateQuantity(productId: string, quantity: number): Promise<void> {
      if (quantity <= 0) {
        this.removeItem(productId);
        return;
      }

      const line = this.items.find((item) => item.product.id === productId);
      if (!line) {
        await this.addItem(productId, quantity);
        return;
      }

      line.quantity = Math.min(line.product.stock, quantity);
    },
    removeItem(productId: string): void {
      this.items = this.items.filter((item) => item.product.id !== productId);
    },
    clear(): void {
      Object.assign(this, initialState());
    },
    async checkout(shippingAddress: ShippingAddress, notes?: string): Promise<Order> {
      if (this.isEmpty) {
        throw new Error('Your cart is empty. Add items before checkout.');
      }

      const auth = useAuthStore();
      if (!auth.user) {
        throw new Error('You must be logged in to place an order.');
      }

      this.loading = true;
      this.error = null;

      try {
        const order = await mockApiService.createOrder({
          userId: auth.user.id,
          items: this.items.map((line) => ({
            productId: line.product.id,
            quantity: line.quantity
          })),
          shippingAddress,
          notes
        });
        this.lastOrderId = order.id;
        this.items = [];
        return order;
      } catch (error) {
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
