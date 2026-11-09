import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

import { AppInput, AppInputProps } from './AppInput';
export function FormInput<T extends FieldValues>({
  control,
  name,
  ...props
}: Omit<AppInputProps, 'value' | 'onChangeText' | 'error'> & {
  control: Control<T>;
  name: FieldPath<T>;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <AppInput
          {...props}
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
