import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import apple from '@/assets/images/login/apple.svg';
import { AppText } from '@/components/ui/AppText';
import { loginColors as colors } from '@/theme';

import { AuthIcon } from './AuthIcon';

export function AuthSocialProviders() {
  const [message, setMessage] = useState('');
  return (
    <View style={styles.social}>
      <View style={styles.divider}>
        <View style={styles.rule} />
        <AppText style={styles.dividerText}>or continue with</AppText>
        <View style={styles.rule} />
      </View>
      <View style={styles.providers}>
        {(['Apple', 'Google'] as const).map((provider) => (
          <Pressable
            key={provider}
            accessibilityRole="button"
            accessibilityLabel={`Continue with ${provider}`}
            style={({ pressed }) => [styles.provider, { opacity: pressed ? 0.7 : 1 }]}
            onPress={() =>
              setMessage(`${provider} sign-in is not connected yet. Please use the email form.`)
            }
          >
            {provider === 'Apple' ? (
              <AuthIcon source={apple} height={21} />
            ) : (
              <AppText style={styles.google}>G</AppText>
            )}
            <AppText style={styles.providerLabel}>{provider}</AppText>
          </Pressable>
        ))}
      </View>
      {!!message && (
        <AppText accessibilityLiveRegion="polite" style={styles.message}>
          {message}
        </AppText>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  social: { gap: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rule: { height: 1, backgroundColor: colors.border, flex: 1 },
  dividerText: { color: colors.muted, fontSize: 12, lineHeight: 15 },
  providers: { flexDirection: 'row', gap: 12 },
  provider: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  providerLabel: { color: colors.text, fontSize: 14 },
  google: { color: colors.text, fontSize: 20, fontWeight: '700' },
  message: { color: colors.secondary, fontSize: 12, lineHeight: 17 },
});
