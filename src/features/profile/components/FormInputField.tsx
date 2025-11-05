import type { HTMLInputTypeAttribute } from 'react';
import { get, useFormContext } from 'react-hook-form';
import type { FieldError, FieldPath } from 'react-hook-form';

import type { TutorProfileFormValues, StudentProfileFormValues } from '../schemas/profileSchemas';

type FormInputFieldProps = {
  name: FieldPath<TutorProfileFormValues | StudentProfileFormValues>;
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number | 'any';
  autoComplete?: string;
  disabled?: boolean;
};

export const FormInputField = ({
  name,
  label,
  type = 'text',
  placeholder,
  helpText,
  required,
  min,
  max,
  step,
  autoComplete,
  disabled = false
}: FormInputFieldProps) => {
  const {
    register,
    formState: { errors },
    watch
  } = useFormContext<TutorProfileFormValues | StudentProfileFormValues>();

  const error = get(errors, name) as FieldError | undefined;
  const registerOptions = type === 'number' ? { valueAsNumber: true } : undefined;
  
  // Watch the field value to ensure input updates when form resets
  const fieldValue = watch(name);
  
  // Convert field value to appropriate input value
  const inputValue = typeof fieldValue === 'object' 
    ? '' 
    : (fieldValue ?? '');

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required ? <span className="text-red-500 ml-1">*</span> : null}
      </label>
      <input
        {...register(name, registerOptions)}
        type={type}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        autoComplete={autoComplete}
        disabled={disabled}
        value={inputValue}
        onChange={(e) => {
          const registered = register(name, registerOptions);
          if (registered.onChange) {
            registered.onChange(e);
          }
        }}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : helpText ? `${name}-help` : undefined}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
      {error ? (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error.message}
        </p>
      ) : (
        helpText ? (
          <p id={`${name}-help`} className="mt-1 text-xs text-gray-500">
            {helpText}
          </p>
        ) : null
      )}
    </div>
  );
};
