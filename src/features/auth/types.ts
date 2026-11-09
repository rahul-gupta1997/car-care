export type User = { id: string; name: string; email: string };
export type SessionMetadata = { user: User; expiresAt: number };
export type Session = SessionMetadata & { accessToken: string };
export type AuthStatus = 'initializing' | 'authenticated' | 'anonymous';
