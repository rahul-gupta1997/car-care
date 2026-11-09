import { z } from 'zod';

import { config } from '@/constants/config';
import { clearDraft } from '@/features/bookings/bookingSlice';
import { selectVehicle } from '@/features/garage/garageSlice';
import { reportError } from '@/lib/monitoring';
import { queryClient } from '@/lib/queryClient';
import { secureStorage } from '@/lib/secureStorage';
import { configureApiSession } from '@/services/apiClient';
import { ApiError } from '@/services/errors';
import { store } from '@/store';

import { sessionReady } from './authSlice';
import { mockAuth } from './mockAuth';
import { Session } from './types';
const sessionSchema = z.object({
  accessToken: z.string().min(1),
  expiresAt: z.number(),
  user: z.object({ id: z.string(), name: z.string(), email: z.email() }),
});
let current: Session | null = null;
let generation = 0;
function publish(session: Session | null) {
  current = session;
  // Explicit projection prevents accidentally putting a token in Redux/DevTools.
  store.dispatch(
    sessionReady(session ? { user: session.user, expiresAt: session.expiresAt } : null),
  );
}
export async function restoreSession() {
  const run = ++generation;
  try {
    const raw = await secureStorage.get();
    const parsed = raw ? sessionSchema.safeParse(JSON.parse(raw)) : null;
    if (run !== generation) return;
    if (!config.mock || !parsed?.success || parsed.data.expiresAt <= Date.now()) {
      await secureStorage.clear();
      if (run === generation) publish(null);
      return;
    }
    publish(parsed.data);
  } catch (error) {
    reportError(error, 'session-restore');
    try {
      await secureStorage.clear();
    } catch (cleanupError) {
      reportError(cleanupError, 'session-clear');
    }
    if (run === generation) publish(null);
  }
}
export async function signIn(email: string, name?: string, remember = true) {
  const run = ++generation;
  const session = await mockAuth.signIn(email, name);
  if (run !== generation) return;
  if (remember) await secureStorage.set(JSON.stringify(session));
  else await secureStorage.clear();
  if (run === generation) publish(session);
}
export async function signOut(force = false) {
  ++generation;
  try {
    await secureStorage.clear();
  } catch (error) {
    reportError(error, 'session-clear');
    if (!force && current && current.expiresAt > Date.now())
      throw new ApiError('Could not clear the saved session. Please try logging out again.');
  }
  publish(null);
  store.dispatch(selectVehicle(null));
  store.dispatch(clearDraft());
  await queryClient.cancelQueries();
  queryClient.clear();
}
configureApiSession(
  async () => {
    if (current && current.expiresAt <= Date.now()) {
      await signOut(true);
      return null;
    }
    // Mock credentials must never be sent to a real backend.
    return config.mock ? null : (current?.accessToken ?? null);
  },
  () => signOut(true),
);
