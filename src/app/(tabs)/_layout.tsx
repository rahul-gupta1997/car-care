import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppImage } from '@/components/ui/AppImage';
import * as assets from '@/features/home/assets';
import { loginColors as colors } from '@/theme';

export const unstable_settings = { initialRouteName: 'home' };

const tabs = [
  { name: 'home', title: 'Home', icon: assets.home },
  { name: 'explore', title: 'Explore', icon: assets.search },
  { name: 'garage', title: 'My Garage', icon: assets.garage },
  { name: 'profile', title: 'Profile', icon: assets.profile },
] as const;
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.link,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: { fontSize: 10, marginTop: 6 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 51 + Math.max(insets.bottom, 28),
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 28),
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <AppImage
                source={tab.icon}
                contentFit="contain"
                transition={0}
                tintColor={focused ? colors.link : colors.muted}
                style={{ width: 21, height: 21 }}
              />
            ),
          }}
        />
      ))}
      <Tabs.Screen name="bookings" options={{ href: null }} />
    </Tabs>
  );
}
