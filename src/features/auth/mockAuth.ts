import { delay } from '@/lib/mock/adapter';

import { Session } from './types';
// Development simulation only. No password verification, account registration, or email is performed.
export const mockAuth = {
  signIn: async (email: string, name = 'Car enthusiast'): Promise<Session> => {
    await delay();
    const normalized = email.toLowerCase().trim();
    return {
      accessToken: 'development-only-not-a-real-token',
      user: { id: normalized, email: normalized, name },
      expiresAt: Date.now() + 3600000,
    };
  },
  resetPassword: async (_email: string) => {
    await delay();
  },
};
