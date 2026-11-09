import { z } from 'zod';
export const loginSchema = z.object({
  email: z.email('Enter a valid email address.').trim(),
  password: z.string().min(8, 'Use at least 8 characters.').max(128, 'Use at most 128 characters.'),
});
export const signupSchema = loginSchema.extend({
  name: z.string().trim().min(2, 'Enter your name.').max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s().-]+$/, 'Enter a valid mobile number.')
    .refine((value) => {
      const digits = value.replace(/\D/g, '');
      return digits.length >= 7 && digits.length <= 15;
    }, 'Enter a valid mobile number.'),
  password: loginSchema.shape.password.regex(/\d/, 'Include at least one number.'),
  acceptedTerms: z
    .boolean()
    .refine((value) => value, 'Please agree to the Terms of Service and Privacy Policy.'),
});
export const forgotPasswordSchema = loginSchema.pick({ email: true });
export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
