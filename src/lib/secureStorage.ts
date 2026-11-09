import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
// Web preview is intentionally memory-only. Native sessions use the OS keychain/keystore.
let webSession: string | null = null;
const key = 'car-care.session.v1';
export const secureStorage = {
  get: () => (Platform.OS === 'web' ? Promise.resolve(webSession) : SecureStore.getItemAsync(key)),
  set: async (value: string) => {
    if (Platform.OS === 'web') {
      webSession = value;
      return;
    }
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  },
  clear: async () => {
    if (Platform.OS === 'web') {
      webSession = null;
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
