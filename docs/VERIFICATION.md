# Verification — 9 November 2026

Checked using Node 22.23.4 on macOS. The system default Node 22.11.0 is below React Native 0.88's minimum; use `.nvmrc` before running commands.

| Check                                              | Result                                                                                                                                 |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`                                | Passed, TypeScript strict mode                                                                                                         |
| `npm run lint`                                     | Passed, zero warnings                                                                                                                  |
| `npm test`                                         | Passed: 7 suites, 22 tests                                                                                                             |
| `npm run format:check`                             | Passed                                                                                                                                 |
| `npx expo install --check`                         | Passed: dependencies up to date                                                                                                        |
| `npx expo-doctor`                                  | Passed: 18/18 checks                                                                                                                   |
| `npx expo export --platform all`                   | Passed: iOS and Android Hermes bundles, web export                                                                                     |
| Metro startup                                      | Passed on localhost:8082                                                                                                               |
| HTTP app entry point                               | Passed: HTTP 200 from localhost:8082                                                                                                   |
| iOS simulator startup                              | Partial: Expo Go 58.0.7 installed, iOS development bundle generated; CLI then failed with `SIMULATOR_TIMEOUT` while opening Device Hub |
| Visual / interactive device QA                     | Not completed: browser access host unavailable; native app inspection timed out                                                        |
| Android device/emulator run                        | Not completed: `adb` unavailable on PATH; Android Studio not installed in the inspected Applications list                              |
| Release performance / accessibility device testing | Not completed; requires working device or simulator interaction                                                                        |

Tests cover Redux state transitions/reset, Zod forms, accessible button loading behavior, password visibility, theme hydration/persistence, session restoration (missing/valid/malformed/expired/storage failure), logout cleanup/failure behavior, account-scoped mock mutations/cancellation, request AbortSignal propagation, bearer headers, 401 cleanup, and safe network errors.

Production export intentionally disables development authentication and data adapters. A successful production bundle is not evidence that a production backend exists.

## Dependency advisories

`npm audit` reports **31 affected dependency entries: 1 low and 30 moderate**, including transitive `deepmerge`, `glob`, and `minimatch` advisories. A non-forced `npm audit fix` did not clear these findings. The advertised forced fix includes downgrading Expo to SDK 52 and changing the Jest toolchain, so it was not applied. No `--force` or `--legacy-peer-deps` was used.

Re-evaluate the advisories and compatible upstream patches before production release. Expo compatibility validation passes, but does not certify the absence of security advisories.

## Manual acceptance checklist

When Device Hub or an Android emulator is available:

- Sign in, sign up, validate invalid fields and preview password reset.
- Open a private deep link while signed out; verify it cannot expose account screens.
- Add/select a vehicle; create, inspect and cancel a booking.
- Switch light/dark/system, restart and verify saved appearance.
- Restart with a valid/expired session; verify no auth/navigation flicker.
- Log out and verify no account data or booking draft remains visible.
- Check large text, VoiceOver/TalkBack, keyboard avoidance, modal focus and device rotation/tablet widths.
- Test offline/reconnection, slow requests and foregrounding after expiry.
- Profile long lists and screen transitions in a native release build after real backend integration.
