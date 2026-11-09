import { fireEvent, render, screen } from '@testing-library/react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
test('button invokes its action and blocks interaction while loading', async () => {
  const press = jest.fn();
  const view = await render(<AppButton title="Book wash" onPress={press} />);
  await fireEvent.press(screen.getByRole('button', { name: 'Book wash' }));
  expect(press).toHaveBeenCalledTimes(1);
  await view.rerender(<AppButton title="Book wash" onPress={press} loading />);
  expect(screen.getByRole('button', { name: 'Book wash' })).toBeDisabled();
  await fireEvent.press(screen.getByRole('button', { name: 'Book wash' }));
  expect(press).toHaveBeenCalledTimes(1);
});
test('password can be revealed and field error is readable', async () => {
  await render(<AppInput label="Password" password error="Use at least 8 characters." />);
  expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(true);
  await fireEvent.press(screen.getByRole('button', { name: 'Show password' }));
  expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(false);
  expect(screen.getByText('Use at least 8 characters.')).toBeTruthy();
});
