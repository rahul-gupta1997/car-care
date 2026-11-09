import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { ErrorState } from '@/components/ui/ErrorState';
import { FormInput } from '@/components/ui/FormInput';

import { AuthShell } from '../components/AuthShell';
import { mockAuth } from '../mockAuth';
import { forgotPasswordSchema } from '../schemas';
export default function ForgotPasswordScreen() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ email: string }>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<unknown>();
  const submit = handleSubmit(async (values) => {
    setError(undefined);
    setSent(false);
    try {
      await mockAuth.resetPassword(values.email);
      setSent(true);
    } catch (err) {
      setError(err);
    }
  });
  return (
    <AuthShell title="Let’s get you back in.">
      <FormInput
        control={control}
        name="email"
        label="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      {sent && (
        <AppText accessibilityLiveRegion="polite">
          Demo reset completed. No email has been sent.
        </AppText>
      )}
      {!!error && <ErrorState error={error} />}
      <AppButton
        title="Preview password reset"
        loading={isSubmitting}
        onPress={() => void submit()}
      />
    </AuthShell>
  );
}
