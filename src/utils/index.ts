import { randomUUID } from 'node:crypto';
import type { PaginatedResult, PaginationMeta, PaginationParams } from '../types';

export const DEFAULT_PAGE_SIZE = 10;

export const coercePage = (page?: number): number => {
  if (!page || Number.isNaN(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
};

export const coercePageSize = (pageSize?: number): number => {
  if (!pageSize || Number.isNaN(pageSize) || pageSize < 1) {
    return DEFAULT_PAGE_SIZE;
  }

  return Math.min(100, Math.floor(pageSize));
};

export function paginate<T>(items: T[], params: PaginationParams = {}): PaginatedResult<T> {
  const page = coercePage(params.page);
  const pageSize = coercePageSize(params.pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const slice = items.slice(start, end);
  const totalItems = items.length;

  const meta: PaginationMeta = {
    page,
    pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize))
  };

  return {
    data: slice,
    meta
  };
}

export function filterCollection<T>(items: T[], predicates: Array<(item: T) => boolean | null | undefined>): T[] {
  if (!predicates.length) {
    return items;
  }

  return items.filter((item) => predicates.every((predicate) => predicate ? predicate(item) : true));
}

export function filterBySearch<T>(items: T[], term: string | undefined, selectors: Array<(item: T) => string>): T[] {
  if (!term) {
    return items;
  }

  const normalizedTerm = normalize(term);
  return items.filter((item) => selectors.some((selector) => normalize(selector(item)).includes(normalizedTerm)));
}

export function formatCurrency(value: number, currency: string, locale = 'en-US', minimumFractionDigits = 2): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits
  }).format(value);
}

export function formatDate(input: string | number | Date, locale = 'en-US', options?: Intl.DateTimeFormatOptions): string {
  const date = input instanceof Date ? input : new Date(input);

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    ...(options ?? {})
  }).format(date);
}

export const normalize = (value: string): string => value.normalize('NFKD').toLowerCase();

export const slugify = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const createIdentifier = (prefix: string): string => `${prefix}-${randomUUID()}`;

export const promiseDelay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const sum = (values: number[]): number => values.reduce((acc, value) => acc + value, 0);

export const average = (values: number[]): number => {
  if (!values.length) {
    return 0;
  }

  return sum(values) / values.length;
};

export const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const possibleMessage = (error as { message?: unknown }).message;
    if (typeof possibleMessage === 'string') {
      return possibleMessage;
    }
  }

  return 'An unexpected error occurred';
};
