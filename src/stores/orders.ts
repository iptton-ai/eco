import { defineStore } from 'pinia';
import type {
  Order,
  OrderQuery,
  OrderStatusUpdatePayload,
  PaginationMeta,
  PaginatedResult
} from '../types';
import { mockApiService } from '../services/mockApiService';
import { getErrorMessage } from '../utils';
import { useAuthStore } from './auth';

interface OrderState {
  orders: Order[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  lastQuery: OrderQuery;
}

const initialState = (): OrderState => ({
  orders: [],
  meta: null,
  loading: false,
  error: null,
  lastQuery: {
    page: 1,
    pageSize: 10
  }
});

export const useOrderStore = defineStore('orders', {
  state: initialState,
  getters: {
    completedOrders: (state): Order[] => state.orders.filter((order) => order.status === 'completed'),
    pendingOrders: (state): Order[] => state.orders.filter((order) => order.status !== 'completed')
  },
  actions: {
    async fetchOrders(query: OrderQuery = {}): Promise<PaginatedResult<Order>> {
      this.loading = true;
      this.error = null;

      const mergedQuery: OrderQuery = {
        ...this.lastQuery,
        ...query
      };

      try {
        const auth = useAuthStore();
        const token = auth.token ?? undefined;
        const response = await mockApiService.fetchOrders(mergedQuery, token);
        this.orders = response.data;
        this.meta = response.meta;
        this.lastQuery = mergedQuery;
        return response;
      } catch (error) {
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateOrderStatus(id: string, payload: OrderStatusUpdatePayload): Promise<Order> {
      const auth = useAuthStore();
      if (!auth.user || auth.user.role !== 'admin') {
        throw new Error('Admin privileges required to update order status');
      }

      this.loading = true;
      this.error = null;

      try {
        const order = await mockApiService.updateOrderStatus(id, payload);
        const index = this.orders.findIndex((item) => item.id === id);
        if (index >= 0) {
          this.orders.splice(index, 1, order);
        }
        return order;
      } catch (error) {
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async removeOrder(id: string): Promise<void> {
      const auth = useAuthStore();
      if (!auth.user || auth.user.role !== 'admin') {
        throw new Error('Admin privileges required to delete orders');
      }

      this.loading = true;
      this.error = null;

      try {
        await mockApiService.deleteOrder(id);
        this.orders = this.orders.filter((order) => order.id !== id);
      } catch (error) {
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    reset(): void {
      Object.assign(this, initialState());
    }
  }
});
