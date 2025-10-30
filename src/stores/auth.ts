import { defineStore } from 'pinia';
import type { AuthResponse, LoginPayload, User } from '../types';
import { mockApiService } from '../services/mockApiService';
import { getErrorMessage } from '../utils';

interface AuthState {
  user: User | null;
  token: string | null;
  expiresAt: string | null;
  loading: boolean;
  error: string | null;
}

const initialState = (): AuthState => ({
  user: null,
  token: null,
  expiresAt: null,
  loading: false,
  error: null
});

export const useAuthStore = defineStore('auth', {
  state: initialState,
  getters: {
    isAuthenticated: (state): boolean => Boolean(state.user && state.token),
    sessionExpiresAt: (state): string | null => state.expiresAt
  },
  actions: {
    async login(credentials: LoginPayload): Promise<AuthResponse> {
      this.loading = true;
      this.error = null;

      try {
        const response = await mockApiService.login(credentials);
        this.user = response.user;
        this.token = response.token;
        this.expiresAt = response.expiresAt;
        return response;
      } catch (error) {
        this.error = getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async refresh(): Promise<AuthResponse | null> {
      if (!this.token) {
        return null;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await mockApiService.refreshSession(this.token);
        this.user = response.user;
        this.token = response.token;
        this.expiresAt = response.expiresAt;
        return response;
      } catch (error) {
        this.error = getErrorMessage(error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    async loadProfile(): Promise<User | null> {
      if (!this.token) {
        return null;
      }

      this.loading = true;
      this.error = null;

      try {
        const profile = await mockApiService.getProfile(this.token);
        this.user = profile;
        return profile;
      } catch (error) {
        this.error = getErrorMessage(error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    async logout(): Promise<void> {
      if (!this.token) {
        this.resetState();
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        await mockApiService.logout(this.token);
      } catch (error) {
        this.error = getErrorMessage(error);
      } finally {
        this.resetState();
      }
    },
    resetState(): void {
      Object.assign(this, initialState());
    }
  }
});
