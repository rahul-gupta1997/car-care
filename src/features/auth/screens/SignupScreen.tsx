import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import check from '@/assets/images/login/check.svg';
import eyeOff from '@/assets/images/login/eyeOff.svg';
import lock from '@/assets/images/login/lock.svg';
import mail from '@/assets/images/login/mail.svg';
import arrowLeft from '@/assets/images/signup/arrowLeft.svg';
import phone from '@/assets/images/signup/phone.svg';
import user from '@/assets/images/signup/user.svg';
import { AppButton } from '@/components/ui/AppButton';
import { AppModal } from '@/components/ui/AppModal';
import { AppText } from '@/components/ui/AppText';
import { ErrorState } from '@/components/ui/ErrorState';
import { FormInput } from '@/components/ui/FormInput';
import { config } from '@/constants/config';
import { loginColors as colors, spacing } from '@/theme';

import { AuthBrand } from '../components/AuthBrand';
import { AuthIcon } from '../components/AuthIcon';
import { AuthSocialProviders } from '../components/AuthSocialProviders';
import { signupSchema, SignupValues } from '../schemas';
import { signIn } from '../session';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', acceptedTerms: false },
  });
  const [error, setError] = useState<unknown>();
  const [legalDocument, setLegalDocument] = useState('');
  const submit = handleSubmit(async (values) => {
    setError(undefined);
    try {
      await signIn(values.email, values.name);
    } catch (err) {
      setError(err);
    }
  });
  const inputProps = { palette: colors, compact: true, editable: !isSubmitting };
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        <View
          style={[
            styles.page,
            { paddingTop: Math.max(insets.top, 50), paddingBottom: Math.max(insets.bottom, 28) },
          ]}
        >
          <View style={styles.navigation}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to login"
              hitSlop={6}
              style={({ pressed }) => [styles.back, { opacity: pressed ? 0.7 : 1 }]}
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/(auth)/login'))}
            >
              <AuthIcon source={arrowLeft} size={20} />
            </Pressable>
            <AuthBrand />
          </View>
          <View style={styles.content}>
            <View style={styles.intro}>
              <AppText style={styles.eyebrow}>GOOD CARE STARTS HERE</AppText>
              <AppText accessibilityRole="header" style={styles.title}>
                Your car’s next chapter.
              </AppText>
              <AppText style={styles.subtitle}>Create an account. Leave the shine to us.</AppText>
            </View>
            <View style={styles.form}>
              <FormInput
                {...inputProps}
                control={control}
                name="name"
                label="Full name"
                placeholder="Alex Morgan"
                autoComplete="name"
                autoCapitalize="words"
                leading={<AuthIcon source={user} />}
              />
              <FormInput
                {...inputProps}
                control={control}
                name="email"
                label="Email address"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                leading={<AuthIcon source={mail} />}
              />
              <FormInput
                {...inputProps}
                control={control}
                name="phone"
                label="Mobile number"
                placeholder="+1  (555) 000-0000"
                keyboardType="phone-pad"
                autoComplete="tel"
                leading={<AuthIcon source={phone} />}
              />
              <View style={styles.password}>
                <FormInput
                  {...inputProps}
                  control={control}
                  name="password"
                  label="Password"
                  placeholder="Create a password"
                  password
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  leading={<AuthIcon source={lock} />}
                  visibilityIcon={<AuthIcon source={eyeOff} />}
                  onSubmitEditing={() => void submit()}
                  returnKeyType="go"
                />
                <AppText style={styles.hint}>
                  Use at least 8 characters, including a number.
                </AppText>
              </View>
            </View>
            <Controller
              control={control}
              name="acceptedTerms"
              render={({ field, fieldState }) => (
                <View style={styles.consentGroup}>
                  <View style={styles.consent}>
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityLabel="I agree to the Terms of Service and Privacy Policy"
                      accessibilityState={{ checked: field.value, disabled: isSubmitting }}
                      disabled={isSubmitting}
                      onPress={() => field.onChange(!field.value)}
                      hitSlop={12}
                      style={[styles.checkbox, field.value && styles.checked]}
                    >
                      {field.value && <AuthIcon source={check} size={12} />}
                    </Pressable>
                    <AppText style={styles.terms}>
                      I agree to the{' '}
                      <AppText
                        accessibilityRole="link"
                        onPress={() => setLegalDocument('Terms of Service')}
                        style={styles.legalLink}
                      >
                        Terms of Service
                      </AppText>{' '}
                      and{' '}
                      <AppText
                        accessibilityRole="link"
                        onPress={() => setLegalDocument('Privacy Policy')}
                        style={styles.legalLink}
                      >
                        Privacy Policy
                      </AppText>
                      .
                    </AppText>
                  </View>
                  {!!fieldState.error && (
                    <AppText accessibilityLiveRegion="polite" style={styles.error}>
                      {fieldState.error.message}
                    </AppText>
                  )}
                </View>
              )}
            />
            {!!error && <ErrorState error={error} />}
            <AppButton
              title="Create account"
              loading={isSubmitting}
              onPress={() => void submit()}
              style={styles.primary}
              labelStyle={styles.primaryLabel}
              icon={<AuthIcon source={arrow} />}
            />
            <AuthSocialProviders />
            <AppText style={styles.footer}>
              Already part of the crew?{' '}
              <Link href="/(auth)/login" style={styles.loginLink}>
                Log in
              </Link>
            </AppText>
            {config.mock && (
              <AppText style={styles.demo}>
                Development demo · No real account is created. Mobile number and consent are not
                saved. Do not use a real password.
              </AppText>
            )}
          </View>
        </View>
      </ScrollView>
      <AppModal
        visible={!!legalDocument}
        title={legalDocument}
        onClose={() => setLegalDocument('')}
      >
        <AppText>
          This document is not available yet. No legal agreement is recorded in this demo.
        </AppText>
      </AppModal>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, alignItems: 'center' },
  page: { width: '100%', maxWidth: 480 },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: 6,
    paddingBottom: 12,
  },
  back: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: spacing.xl, paddingTop: 14, paddingBottom: 20, gap: 20 },
  intro: { gap: spacing.sm },
  eyebrow: { color: colors.link, fontSize: 10, lineHeight: 12, letterSpacing: 1.8 },
  title: { color: colors.text, fontSize: 30, lineHeight: 36, fontWeight: '700', letterSpacing: -1 },
  subtitle: { color: colors.secondary, fontSize: 14, lineHeight: 21 },
  form: { gap: 13 },
  password: { gap: 6 },
  hint: { color: colors.muted, fontSize: 11, lineHeight: 14 },
  consentGroup: { gap: 8 },
  consent: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: { backgroundColor: colors.primary, borderColor: colors.primary },
  terms: { flex: 1, color: colors.secondary, fontSize: 11, lineHeight: 17.6 },
  legalLink: {
    color: colors.text,
    fontSize: 11,
    lineHeight: 17.6,
    textDecorationLine: 'underline',
  },
  error: { color: colors.danger, fontSize: 12, lineHeight: 18 },
  primary: { backgroundColor: colors.primary, height: 54, borderRadius: 12, paddingVertical: 0 },
  primaryLabel: { color: '#ffffff', fontSize: 15, fontWeight: '400' },
  footer: { color: colors.secondary, fontSize: 13, lineHeight: 18, textAlign: 'center' },
  loginLink: { color: colors.link, fontWeight: '600' },
  demo: { color: colors.secondary, fontSize: 11, lineHeight: 16, textAlign: 'center' },
});
