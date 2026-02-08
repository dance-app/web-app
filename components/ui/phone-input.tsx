'use client';

import * as React from 'react';
import PhoneInputPrimitive from 'react-phone-number-input';
import type { Country } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }, ref) => (
  <Input
    className={cn('rounded-s-none rounded-e-md', className)}
    ref={ref}
    {...props}
  />
));
InputComponent.displayName = 'PhoneInputComponent';

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  defaultCountry?: Country;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const PhoneInput = React.forwardRef<
  React.ComponentRef<typeof PhoneInputPrimitive>,
  PhoneInputProps
>(
  (
    {
      value,
      onChange,
      defaultCountry = 'US',
      placeholder = 'Phone number',
      disabled,
      className,
    },
    ref
  ) => {
    return (
      <PhoneInputPrimitive
        ref={ref}
        international
        defaultCountry={defaultCountry}
        value={value}
        onChange={onChange}
        inputComponent={InputComponent}
        placeholder={placeholder}
        disabled={disabled}
        className={cn('flex', className)}
      />
    );
  }
);
PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
export { isValidPhoneNumber } from 'react-phone-number-input';
