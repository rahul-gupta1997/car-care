import { Redirect } from 'expo-router';

import { selectAuthStatus } from '@/store';
import { useAppSelector } from '@/store/hooks';
export default function Index() {
  const status = useAppSelector(selectAuthStatus);
  return <Redirect href={status === 'authenticated' ? '/(tabs)/home' : '/(auth)/login'} />;
}
