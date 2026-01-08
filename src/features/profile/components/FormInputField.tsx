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
        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          error ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
      {error ? (
        <p id={`${name}-error`} className="mt-2 text-sm font-medium text-red-600 flex items-center" role="alert">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
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
