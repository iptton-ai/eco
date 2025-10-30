import { defineStore } from 'pinia';
import type {
  Article,
  ArticleCreatePayload,
  ArticleQuery,
  ArticleUpdatePayload,
  PaginationMeta,
  PaginatedResult
} from '../types';
import { mockApiService } from '../services/mockApiService';
import { getErrorMessage } from '../utils';

interface ArticleState {
  articles: Article[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  lastQuery: ArticleQuery;
}

const defaultQuery: ArticleQuery = {
  page: 1,
  pageSize: 10,
  sortBy: 'recent'
};

const createInitialState = (): ArticleState => ({
  articles: [],
  meta: null,
  loading: false,
  error: null,
  lastQuery: { ...defaultQuery }
});

export const useArticleStore = defineStore('articles', {
  state: createInitialState,
  getters: {
    featuredArticles: (state): Article[] => state.articles.filter((article) => article.isFeatured)
  },
  actions: {
    async fetchArticles(query: ArticleQuery = {}): Promise<PaginatedResult<Article>> {
      this.loading = true;
      this.error = null;

      const mergedQuery: ArticleQuery = {
        ...this.lastQuery,
        ...query
      };

      try {
        const response = await mockApiService.fetchArticles(mergedQuery);
        this.articles = response.data;
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
    async getArticle(id: string): Promise<Article> {
      this.loading = true;
      this.error = null;

      try {
        const article = await mockApiService.getArticleById(id);
        const index = this.articles.findIndex((item) => item.id === id);
        if (index >= 0) {
          this.articles.splice(index, 1, article);
        } else {
          this.articles = [article, ...this.articles];
        }
        return article;
      } catch (error) {
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async createArticle(payload: ArticleCreatePayload): Promise<Article> {
      this.loading = true;
      this.error = null;

      try {
        const article = await mockApiService.createArticle(payload);
        this.articles = [article, ...this.articles];
        return article;
      } catch (error) {
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateArticle(id: string, payload: ArticleUpdatePayload): Promise<Article> {
      this.loading = true;
      this.error = null;

      try {
        const article = await mockApiService.updateArticle(id, payload);
        const index = this.articles.findIndex((item) => item.id === id);
        if (index >= 0) {
          this.articles.splice(index, 1, article);
        }
        return article;
      } catch (error) {
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteArticle(id: string): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        await mockApiService.deleteArticle(id);
        this.articles = this.articles.filter((article) => article.id !== id);
      } catch (error) {
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    reset(): void {
      Object.assign(this, createInitialState());
    }
  }
});
