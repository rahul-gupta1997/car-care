// Sentry-ready boundary: inject a configured, redacting Sentry capture function at startup.
// Only safe categories are reported; never forward credentials, Axios configs, or request bodies.
type Reporter = (event: { category: string; name: string }) => void;
let reporter: Reporter | undefined;
export const configureMonitoring = (next: Reporter) => {
  reporter = next;
};
export const reportError = (_error: unknown, category: string) => {
  reporter?.({ category, name: 'ApplicationError' });
};
