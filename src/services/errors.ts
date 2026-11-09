import { isAxiosError, isCancel } from 'axios';
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code: 'network' | 'unauthorized' | 'server' | 'cancelled' | 'configuration' = 'server',
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (isCancel(error)) return new ApiError('Request cancelled.', undefined, 'cancelled');
  if (isAxiosError(error)) {
    if (error.response?.status === 401)
      return new ApiError('Your session expired. Please sign in again.', 401, 'unauthorized');
    if (!error.response)
      return new ApiError(
        'Unable to connect. Check your connection and try again.',
        undefined,
        'network',
      );
    return new ApiError(
      'The request could not be completed. Please try again.',
      error.response.status,
    );
  }
  return new ApiError('Something went wrong. Please try again.');
}
