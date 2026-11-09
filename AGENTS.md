# Car Care engineering rules

- Follow the feature-based architecture in `src/features`. Keep Expo Router route files thin.
- Use TypeScript strict typing; avoid `any` and unsafe assertions.
- Reuse shared components in `src/components` and central theme tokens. Avoid duplicate components and unnecessary dependencies.
- Redux Toolkit is only for shared client state. Never put tokens or server responses in Redux.
- TanStack Query owns server data, caching, cancellation, mutations, and invalidation.
- Use the centralized Axios layer for real services. Do not invent backend endpoints.
- Store native credentials only in SecureStore; AsyncStorage is for preferences.
- Follow Expo Router conventions and protected navigation. Maintain initialization gates.
- Keep mock implementations clearly separated from production integrations. Never enable mock authentication in a release build.
- Maintain performance and accessibility: selective selectors, stable list keys, FlashList for long lists, cleanup listeners, accessible labels and touch targets.
- Use Expo-compatible native dependency versions via `npx expo install`. Do not bypass peer conflicts.
- SDK 58 / React Native 0.88 use the New Architecture. Do not add obsolete opt-out flags.
- Check matching Expo SDK docs before changing native configuration. Keep native projects generated through Expo config plugins.
- Run lint and typecheck after meaningful changes. Run representative tests when behavior changes.
- Never log credentials, tokens, request payloads, or personal data. Monitoring accepts sanitized categories only.
- When implementing screens from Figma, use Figma MCP to inspect the design, reuse existing components and theme tokens, and preserve the application's established architecture.
