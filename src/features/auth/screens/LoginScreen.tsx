import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import arrow from '@/assets/images/login/arrow.svg';
import car from '@/assets/images/login/car.png';
import check from '@/assets/images/login/check.svg';
import eyeOff from '@/assets/images/login/eyeOff.svg';
import lock from '@/assets/images/login/lock.svg';
import mail from '@/assets/images/login/mail.svg';
import sparkles from '@/assets/images/login/sparkles.svg';
import { AppButton } from '@/components/ui/AppButton';
import { AppImage } from '@/components/ui/AppImage';
import { AppText } from '@/components/ui/AppText';
import { ErrorState } from '@/components/ui/ErrorState';
import { FormInput } from '@/components/ui/FormInput';
import { config } from '@/constants/config';
import { loginColors as colors, spacing } from '@/theme';

import { AuthBrand } from '../components/AuthBrand';
import { AuthIcon as Icon } from '../components/AuthIcon';
import { AuthSocialProviders } from '../components/AuthSocialProviders';
import { loginSchema, LoginValues } from '../schemas';
import { signIn } from '../session';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const [error, setError] = useState<unknown>();
  const [remember, setRemember] = useState(true);
  const submit = handleSubmit(async (values) => {
    setError(undefined);
    try {
      await signIn(values.email, undefined, remember);
    } catch (err) {
      setError(err);
    }
  });
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        <View style={styles.page}>
          <View style={styles.hero}>
            <AppImage
              source={car}
              style={StyleSheet.absoluteFill}
              contentPosition="center"
              transition={0}
            />
            <View style={[StyleSheet.absoluteFill, styles.shading]} />
            <View style={[styles.brand, { top: Math.max(insets.top, 50) + 12 }]}>
              <AuthBrand />
            </View>
            <View style={styles.promise}>
              <Icon source={sparkles} size={13} />
              <AppText style={styles.promiseText}>A FRESH START. EVERY DRIVE.</AppText>
            </View>
          </View>
          <View style={styles.content}>
            <View style={styles.intro}>
              <AppText accessibilityRole="header" style={styles.title}>
                Welcome back.
              </AppText>
              <AppText style={styles.subtitle}>
                A cleaner car. A better day. Let’s get you in.
              </AppText>
            </View>
            <View style={styles.form}>
              <FormInput
                control={control}
                name="email"
                label="Email address"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                palette={colors}
                leading={<Icon source={mail} />}
                editable={!isSubmitting}
              />
              <FormInput
                control={control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                password
                autoComplete="current-password"
                palette={colors}
                leading={<Icon source={lock} />}
                visibilityIcon={<Icon source={eyeOff} />}
                editable={!isSubmitting}
                onSubmitEditing={() => void submit()}
                returnKeyType="go"
              />
              <View style={styles.preferences}>
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityLabel="Remember me"
                  accessibilityState={{ checked: remember }}
                  onPress={() => setRemember(!remember)}
                  hitSlop={12}
                  style={styles.remember}
                >
                  <View style={[styles.checkbox, !remember && styles.unchecked]}>
                    {remember && <Icon source={check} size={12} />}
                  </View>
                  <AppText style={styles.small}>Remember me</AppText>
                </Pressable>
                <Link href="/(auth)/forgot-password" style={styles.linkSmall}>
                  Forgot password?
                </Link>
              </View>
              {!!error && <ErrorState error={error} />}
              <AppButton
                title="Log in"
                loading={isSubmitting}
                onPress={() => void submit()}
                style={styles.login}
                labelStyle={styles.loginLabel}
                icon={<Icon source={arrow} />}
              />
            </View>
            <AuthSocialProviders />
            <AppText style={styles.signup}>
              New to AutoCare?{' '}
              <Link href="/(auth)/signup" style={styles.link}>
                Create an account
              </Link>
            </AppText>
            {config.mock && (
              <AppText style={styles.demo}>
                Development demo · Use a test email and a password of 8+ characters. Credentials are
                not verified; do not use a real password.
              </AppText>
            )}
          </View>
          <View style={{ height: Math.max(insets.bottom, 28) }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, alignItems: 'center' },
  page: { width: '100%', maxWidth: 480 },
  hero: { height: 292, overflow: 'hidden' },
  shading: {
    experimental_backgroundImage:
      'linear-gradient(to bottom, rgba(14,16,19,0.27) 0%, rgba(14,16,19,0) 55%, #0e1013 100%)',
  },
  brand: {
    position: 'absolute',
    left: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  promise: {
    position: 'absolute',
    top: 259,
    left: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  promiseText: {
    color: colors.text,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.6,
  },
  content: { paddingHorizontal: spacing.xl, paddingTop: 14, paddingBottom: 20, gap: spacing.xl },
  intro: { gap: spacing.sm },
  title: { color: colors.text, fontSize: 32, lineHeight: 39, fontWeight: '700', letterSpacing: -1 },
  subtitle: { color: colors.secondary, fontSize: 14, lineHeight: 21 },
  form: { gap: 18 },
  preferences: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  remember: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 17,
    height: 17,
    borderRadius: 5,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unchecked: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.muted },
  small: { color: colors.secondary, fontSize: 12, lineHeight: 17 },
  linkSmall: { color: colors.link, fontSize: 12, fontWeight: '600' },
  login: { backgroundColor: colors.primary, height: 54, borderRadius: 12, paddingVertical: 0 },
  loginLabel: { color: '#ffffff', fontSize: 15, fontWeight: '400' },
  signup: { color: colors.secondary, fontSize: 13, lineHeight: 18, textAlign: 'center' },
  link: { color: colors.link, fontWeight: '600' },
  demo: { color: colors.secondary, fontSize: 11, lineHeight: 16, textAlign: 'center' },
});
