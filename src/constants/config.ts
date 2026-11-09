const timeout = Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? 15000);
export const config = {
  mock:
    (__DEV__ || process.env.NODE_ENV === 'test') &&
    process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false',
  apiUrl: process.env.EXPO_PUBLIC_API_URL || undefined,
  timeout: Number.isFinite(timeout) && timeout > 0 ? timeout : 15000,
};
