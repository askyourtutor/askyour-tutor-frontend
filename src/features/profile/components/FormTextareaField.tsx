import { get, useFormContext } from 'react-hook-form';
import type { FieldError, FieldPath } from 'react-hook-form';

import type { TutorProfileFormValues, StudentProfileFormValues } from '../schemas/profileSchemas';

type FormTextareaFieldProps = {
  name: FieldPath<TutorProfileFormValues | StudentProfileFormValues>;
  label: string;
  placeholder?: string;
  rows?: number;
  helpText?: string;
  required?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
  className?: string;
};

export const FormTextareaField = ({
  name,
  label,
  placeholder,
  rows = 4,
  helpText,
  required,
  showCharCount,
  maxLength,
  className
}: FormTextareaFieldProps) => {
  const {
    register,
    watch,
    formState: { errors }
  } = useFormContext<TutorProfileFormValues | StudentProfileFormValues>();

  const error = get(errors, name) as FieldError | undefined;
  const value = watch(name);
  const charCount = typeof value === 'string' ? value.length : 0;
  const textValue = typeof value === 'string' ? value : '';

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required ? <span className="text-red-500 ml-1">*</span> : null}
      </label>
      <textarea
        {...register(name)}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        value={textValue}
        onChange={(e) => {
          const registered = register(name);
          if (registered.onChange) {
            registered.onChange(e);
          }
        }}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
      />
      {error ? (
        <p className="mt-1 text-sm text-red-600">{error.message as string}</p>
      ) : (
        helpText ? <p className="mt-1 text-xs text-gray-500">{helpText}</p> : null
      )}
      {showCharCount ? (
        <p className="mt-1 text-xs text-gray-500">{charCount}{maxLength ? `/${maxLength}` : null} characters</p>
      ) : null}
    </div>
  );
};
