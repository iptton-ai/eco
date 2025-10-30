import { defineStore } from 'pinia';
import type {
  Category,
  PaginationMeta,
  PaginatedResult,
  Product,
  ProductCreatePayload,
  ProductQuery,
  ProductUpdatePayload
} from '../types';
import { mockApiService } from '../services/mockApiService';
import { getErrorMessage } from '../utils';

interface ProductState {
  products: Product[];
  categories: Category[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  lastQuery: ProductQuery;
}

const baseQuery: ProductQuery = {
  page: 1,
  pageSize: 12,
  sortBy: 'newest'
};

const initialState = (): ProductState => ({
  products: [],
  categories: [],
  meta: null,
  loading: false,
  error: null,
  lastQuery: { ...baseQuery }
});

export const useProductStore = defineStore('products', {
  state: initialState,
  getters: {
    featuredProducts: (state): Product[] => state.products.filter((product) => product.isFeatured)
  },
  actions: {
    async fetchProducts(query: ProductQuery = {}): Promise<PaginatedResult<Product>> {
      this.loading = true;
      this.error = null;

      const mergedQuery: ProductQuery = {
        ...this.lastQuery,
        ...query
      };

      try {
        const response = await mockApiService.fetchProducts(mergedQuery);
        this.products = response.data;
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
    async loadCategories(force = false): Promise<Category[]> {
      if (!force && this.categories.length) {
        return this.categories;
      }

      this.loading = true;
      this.error = null;

      try {
        const categories = await mockApiService.fetchCategories();
        this.categories = categories;
        return categories;
      } catch (error) {
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async createProduct(payload: ProductCreatePayload): Promise<Product> {
      this.loading = true;
      this.error = null;

      try {
        const product = await mockApiService.createProduct(payload);
        this.products = [product, ...this.products];
        return product;
      } catch (error) {
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateProduct(id: string, payload: ProductUpdatePayload): Promise<Product> {
      this.loading = true;
      this.error = null;

      try {
        const product = await mockApiService.updateProduct(id, payload);
        const index = this.products.findIndex((item) => item.id === id);
        if (index >= 0) {
          this.products.splice(index, 1, product);
        }
        return product;
      } catch (error) {
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteProduct(id: string): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        await mockApiService.deleteProduct(id);
        this.products = this.products.filter((product) => product.id !== id);
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
