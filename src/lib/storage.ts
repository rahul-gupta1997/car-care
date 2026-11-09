import AsyncStorage from '@react-native-async-storage/async-storage';
export const storage = {
  get: (key: string) => AsyncStorage.getItem(`car-care:${key}`),
  set: (key: string, value: string) => AsyncStorage.setItem(`car-care:${key}`, value),
};
