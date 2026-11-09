import { AxiosRequestConfig, create } from 'axios';

import { config } from '@/constants/config';

import { ApiError, normalizeError } from './errors';
let tokenProvider: () => Promise<string | null> = async () => null;
let unauthorizedHandler: () => Promise<void> = async () => {};
export function configureApiSession(
  getToken: typeof tokenProvider,
  onUnauthorized: typeof unauthorizedHandler,
) {
  tokenProvider = getToken;
  unauthorizedHandler = onUnauthorized;
}
const client = create({
  baseURL: config.apiUrl,
  timeout: config.timeout,
  headers: { Accept: 'application/json' },
});
client.interceptors.request.use(async (request) => {
  if (!config.apiUrl)
    throw new ApiError(
      'Configure the backend URL before using real API services.',
      undefined,
      'configuration',
    );
  const token = await tokenProvider();
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});
client.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const normalized = normalizeError(error);
    if (normalized.status === 401) await unauthorizedHandler();
    throw normalized;
  },
);
// AxiosRequestConfig includes AbortSignal; Query hooks pass their signal through here.
export const api = {
  get: async <T>(url: string, options?: AxiosRequestConfig) =>
    (await client.get<T>(url, options)).data,
  post: async <T>(url: string, data?: unknown, options?: AxiosRequestConfig) =>
    (await client.post<T>(url, data, options)).data,
  put: async <T>(url: string, data?: unknown, options?: AxiosRequestConfig) =>
    (await client.put<T>(url, data, options)).data,
  patch: async <T>(url: string, data?: unknown, options?: AxiosRequestConfig) =>
    (await client.patch<T>(url, data, options)).data,
  delete: async <T>(url: string, options?: AxiosRequestConfig) =>
    (await client.delete<T>(url, options)).data,
};
