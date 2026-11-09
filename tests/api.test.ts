import { AxiosError, AxiosHeaders } from 'axios';

import { api, configureApiSession } from '@/services/apiClient';

jest.mock('@/constants/config', () => ({
  config: { apiUrl: 'https://contract.example.test', timeout: 1000, mock: false },
}));

test('typed requests attach bearer tokens and forward cancellation signals', async () => {
  configureApiSession(
    async () => 'test-token',
    async () => {},
  );
  const controller = new AbortController();
  const result = await api.get<{ ok: boolean }>('/test-only', {
    signal: controller.signal,
    adapter: async (config) => {
      expect(config.headers.Authorization).toBe('Bearer test-token');
      expect(config.signal).toBe(controller.signal);
      return {
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config,
      };
    },
  });
  expect(result.ok).toBe(true);
});

test('401 invokes session expiration and returns a safe error', async () => {
  const expire = jest.fn(async () => {});
  configureApiSession(async () => null, expire);
  await expect(
    api.get('/test-only', {
      adapter: async (config) => {
        throw new AxiosError('sensitive backend detail', 'ERR_BAD_REQUEST', config, undefined, {
          status: 401,
          statusText: 'Unauthorized',
          data: { secret: 'private' },
          headers: new AxiosHeaders(),
          config,
        });
      },
    }),
  ).rejects.toMatchObject({
    status: 401,
    code: 'unauthorized',
    message: 'Your session expired. Please sign in again.',
  });
  expect(expire).toHaveBeenCalledTimes(1);
});

test('network failures are normalized without leaking backend details', async () => {
  await expect(
    api.get('/test-only', {
      adapter: async () => {
        throw new AxiosError('private host', 'ERR_NETWORK');
      },
    }),
  ).rejects.toMatchObject({
    code: 'network',
    message: 'Unable to connect. Check your connection and try again.',
  });
});
