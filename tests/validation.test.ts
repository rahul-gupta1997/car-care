import { forgotPasswordSchema, loginSchema, signupSchema } from '@/features/auth/schemas';
import { vehicleSchema } from '@/features/garage/schemas';
test('login rejects invalid email and short password', () => {
  expect(loginSchema.safeParse({ email: 'invalid', password: 'abc' }).success).toBe(false);
  expect(loginSchema.safeParse({ email: 'driver@example.com', password: 'demo1234' }).success).toBe(
    true,
  );
});
const validSignup = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
  phone: '+1 (555) 000-0000',
  password: 'testpass1',
  acceptedTerms: true,
};
test('signup accepts the Figma form without password confirmation', () => {
  expect(signupSchema.safeParse(validSignup).success).toBe(true);
});
test.each([
  ['phone', '123'],
  ['phone', 'call-me-now'],
  ['phone', '+1234567890123456'],
  ['password', 'lettersOnly'],
  ['password', 'short1'],
  ['acceptedTerms', false],
])('signup rejects invalid %s', (field, value) => {
  const result = signupSchema.safeParse({ ...validSignup, [field]: value });
  expect(result.success).toBe(false);
  if (!result.success)
    expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(true);
});
test('reset requires email and vehicle registrations normalize', () => {
  expect(forgotPasswordSchema.safeParse({ email: '' }).success).toBe(false);
  expect(vehicleSchema.parse({ name: 'Creta', plate: 'ka 01 ab 1234' }).plate).toBe(
    'KA 01 AB 1234',
  );
});
