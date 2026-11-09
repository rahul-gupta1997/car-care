# Car Care

An Expo + TypeScript mobile foundation for iOS and Android. Includes a working **development-only** demo of authentication, garage management, bookings, and theme preferences. It is not a connected production service.

## Run locally

Use Node **22.13+** (tested with **22.23.4**, pinned in `.nvmrc`), or a compatible newer LTS. The machine's original Node 22.11.0 is too old for React Native 0.88.

```bash
cd car-care
nvm install
nvm use
npm ci
# Optional: defaults already allow the development demo without credentials.
cp .env.example .env
npx expo start
```

If nvm is unavailable, install a compatible Node LTS or use `npx --yes --package=node@22 -c 'npm start'`. Avoid nested `npx` inside that command; for Expo CLI use `node node_modules/expo/bin/cli`.

- iOS: install Xcode and a simulator runtime, open **Device Hub** (called Simulator in older Xcode), then run `npm run ios`. Use an SDK 58-compatible Expo Go simulator client. For a native build, run `npx expo run:ios`.
- Android: install Android Studio, Android SDK/platform tools and a JDK compatible with the installed React Native/Gradle toolchain. Start an emulator or attach a USB-debugging device, verify `adb devices`, then run `npm run android`. For a native build, run `npx expo run:android`.
- Web preview: `npm run web`. Secure sessions are intentionally memory-only on web, so refresh signs out. Native persistence uses SecureStore.
- When adding native packages beyond Expo Go, create a development build with `npx expo run:ios` / `npx expo run:android`.

Expo SDK 58 uses React Native 0.88.1 and the New Architecture. No legacy architecture switch is added. The official `create-expo-app@latest car-care --template default@sdk-58 --no-install` template was used. See [Expo SDK 58](https://expo.dev/changelog/sdk-58) and [project setup](https://docs.expo.dev/get-started/create-a-project/).

## Try the demo

1. Sign in with any valid email and an arbitrary password of at least eight characters. **Do not use a real password.** The mock does not verify passwords or create real accounts.
2. Open My Garage and select the example vehicle, or add your own demo vehicle.
3. Explore Car Wash or Deep Cleaning, add optional care notes, and create a demo booking.
4. View the booking in Upcoming; cancel it and see it move to History. A completed example is included in History.
5. Change Appearance in Profile; the setting survives app restarts.
6. Log out. Query data, selected vehicle, booking draft, and secure credentials are cleared.

Forgot Password validates an email and explicitly says that no email was sent. Signup validates name, email, password, and password confirmation. Demo sessions expire after one hour. Added vehicles and bookings live in memory, partitioned by demo account, and reset on a full JS restart. No money is charged and no service is scheduled.

## Structure

```text
car-care/
├── assets/
│   ├── icons/                 # App icon and adaptive foreground
│   └── images/                # Local brand mark; optimized via Expo Image
├── src/
│   ├── app/
│   │   ├── _layout.tsx        # Providers and protected route groups
│   │   ├── index.tsx
│   │   ├── +not-found.tsx
│   │   ├── (auth)/            # login, signup, forgot-password, layout
│   │   ├── (tabs)/            # Explore, Garage, Bookings, Profile, layout
│   │   ├── services/[id].tsx
│   │   └── booking/[id].tsx
│   ├── components/
│   │   ├── ui/                # Button, Input, Text, Card, Modal, Loader,
│   │   │                      # Image, EmptyState, ErrorState, FormInput
│   │   ├── layout/            # ScreenWrapper, AppHeader
│   │   └── ErrorBoundary.tsx
│   ├── features/
│   │   ├── auth/              # Forms, schemas, session, mockAuth, slice
│   │   ├── garage/            # API, hooks, schema, types, slice, screen
│   │   ├── bookings/          # API, hooks, types, draft slice, screens
│   │   ├── services/          # API, hooks, types, cards, screens
│   │   ├── profile/           # Preferences slice and profile screen
│   │   ├── offers/            # Development offer component
│   │   └── subscriptions/     # Promotion; no billing implementation
│   ├── store/                 # Typed store, hooks, selectors
│   ├── services/              # Axios client, errors, endpoint registry
│   ├── providers/             # Query, Redux, theme, lifecycle
│   ├── theme/                 # Colors, spacing, radius, typography
│   ├── hooks/                 # useAppTheme
│   ├── lib/
│   │   ├── mock/              # Central seed data + asynchronous adapter
│   │   ├── queryClient.ts
│   │   ├── secureStorage.ts
│   │   ├── storage.ts
│   │   └── monitoring.ts      # Sanitized monitoring integration seam
│   ├── constants/             # Validated public runtime configuration
│   ├── types/                 # Asset declarations
│   └── utils/                 # Currency and date formatting
├── tests/                     # State, components, schemas, theme, session, API
├── docs/                      # Dependency inventory and verification report
├── .env.example
├── .nvmrc
├── AGENTS.md
├── babel.config.js
├── eslint.config.js
├── jest.config.js
├── app.json
├── tsconfig.json
├── package.json
└── package-lock.json
```

Future daily-care, payments, and notifications modules should be created when they own real behavior; no empty feature scaffolds are included. System fonts provide native rendering, accessibility scaling, and no font-download delay. Ionicons supplies bundled icons. Custom fonts can later be loaded through the installed `expo-font` package.

## State and data ownership

**Redux Toolkit** stores only shared client state: session metadata/status, selected vehicle ID, booking draft, and theme choice. `src/store/hooks.ts` supplies typed hooks; selectors subscribe to individual values. DevTools are development-only. Credentials never enter Redux or AsyncStorage. Local modal visibility, form state, and booking filters stay local.

**TanStack Query** owns service, vehicle, and booking responses. `src/lib/queryClient.ts` defines keys, 60-second stale time, five-minute garbage collection, and at most two retries for eligible read failures. 4xx/configuration/cancellation errors are not retried; mutations are never automatically retried. Garage and booking mutations invalidate account-specific lists. Query functions forward `AbortSignal`. NetInfo drives online status; AppState drives focus and session expiration, with listener cleanup. Errors and loading/empty states are rendered on screens.

Long garage and booking lists use FlashList with stable IDs. Three service cards use a regular scroll view. Expo Image handles local images and supports caching for future remote images. Reanimated/worklets are installed in SDK-compatible versions; no complex animation is needed yet, so no unnecessary worklets or blanket memoization are added.

## Authentication and navigation

`features/auth/session.ts` restores and validates the SecureStore session, rejects malformed/expired data, and projects only metadata to Redux. The root navigator waits for both session and theme initialization before rendering. `Stack.Protected` keeps auth pages public and tabs/detail routes private. An expiration timer and foreground check invalidate expired sessions. The Axios 401 handler delegates to session cleanup.

Mock auth is gated by `__DEV__` (or Jest) **and** `EXPO_PUBLIC_USE_MOCK_API !== 'false'`. Release exports disable mocks even if that variable is true, and display a backend-not-connected state. Development credentials are never attached to real Axios calls. The web preview deliberately has no persistent token fallback.

To integrate real authentication, implement a provider with password/OAuth exchange, server-validated restoration, refresh/revocation policy and logout; replace `mockAuth`, the mock-only restoration gate, and token-provider selection together. Validate backend responses at the boundary. Client-side route protection does not replace backend authorization. Keep long-lived tokens in SecureStore and never expose them to logs or DevTools.

## Backend integration

No production endpoint paths are assumed. `services/endpoints.ts` is intentionally empty. Configure `EXPO_PUBLIC_API_URL` only after the backend contract is defined. All `EXPO_PUBLIC_*` values ship in the app; none may contain secrets.

Replace a feature's adapter methods, preserving the same typed hook interface. For example, once a **contract-provided** path exists:

```ts
import { api } from '@/services/apiClient';
import type { CarService } from '@/features/services/types';

// The caller supplies an approved backend path; this example invents no endpoint.
export function listServicesAt(contractPath: string, signal?: AbortSignal) {
  return api.get<CarService[]>(contractPath, { signal });
}
```

The API layer exposes typed `get`, `post`, `put`, `patch`, and `delete`, a configurable timeout, bearer-token injection, 401 handling and normalized errors. Add runtime Zod parsing for the agreed server schemas. Add idempotency and availability validation for real booking/payment mutations. Never retry a charge automatically.

## Theme and components

`ThemeProvider` resolves light/dark/system mode, loads the saved preference before navigation, and persists changes through AsyncStorage. `useAppTheme()` exposes semantic colors and typography/spacing/radius tokens. StyleSheet handles reusable layout; dynamic theme colors are applied at render time. Components support accessible labels, loading/disabled states and composable styling. FormInput connects React Hook Form to the shared input. Buttons have at least 48-point touch targets; text supports native scaling.

To add a feature:

1. Add types, API functions, query keys/hooks and screens under `src/features/<name>`.
2. Keep fetched responses in Query; add a slice only for shared client state.
3. Use shared components and theme tokens. Keep local state local.
4. Add a thin route export under `src/app` and register protection where appropriate.
5. Add behavior tests; run `npm run check`.

For a Figma implementation, inspect the supplied design with Figma MCP, map design variables to semantic tokens in `src/theme`, reuse or extend shared components, and implement inside the owning feature. Preserve thin routes and state ownership. Compare iOS/Android, light/dark, large text, and accessibility states against the design. This rule is also in `AGENTS.md`.

## Monitoring

`lib/monitoring.ts` is **Sentry-ready, not an active Sentry installation**. It accepts a reporter and sends only sanitized error categories. Query/mutation failures, storage failures and render boundaries call it. To activate Sentry, install the SDK with `npx expo install @sentry/react-native`, follow its matching Expo setup, configure a public DSN, disable default PII, add a `beforeSend` scrubber, and inject a reporter through `configureMonitoring`. Keep upload/auth tokens only in CI secrets. Native crash reporting needs a development/release build and source-map upload. No telemetry is sent by this foundation.

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
npm run format:check
npx expo install --check
npx expo-doctor
npx expo export --platform all
```

Jest uses the SDK-compatible `jest-expo` preset and React Native Testing Library 14's async APIs. CommonJS export conditions avoid resolving Redux's native legacy ESM entry in Jest. Babel uses `babel-preset-expo`; no outdated manual Reanimated plugin is configured.

See [verification](docs/VERIFICATION.md) for actual results and limitations, and [installed dependency versions](docs/DEPENDENCIES.md) for the complete direct-package inventory. `package-lock.json` pins transitive dependencies.

## Still requires integration

- Real identity verification, registration, email reset, token refresh and revocation.
- Persistent garage/bookings database, availability, scheduling and cancellation policies.
- Recurring subscriptions/daily-care operations, cleaner tracking, payments and receipts.
- Push notification registration/delivery, offers eligibility/redemption.
- Sentry initialization, release credentials/signing, app-store metadata and legal documents.
- Device-level end-to-end, screen-reader/large-text, offline and release-performance validation.

The shipped demo does not promise any of these production services.
