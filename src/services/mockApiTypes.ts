export class MockApiError extends Error {
  public readonly status: number;

  public readonly code: string;

  constructor(status: number, message: string, code = 'MOCK_API_ERROR') {
    super(message);
    this.name = 'MockApiError';
    this.status = status;
    this.code = code;
  }
}

export const isMockApiError = (error: unknown): error is MockApiError => error instanceof MockApiError;
