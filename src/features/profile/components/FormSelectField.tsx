import { get, useFormContext } from 'react-hook-form';
import type { FieldError, FieldPath } from 'react-hook-form';

import type { TutorProfileFormValues, StudentProfileFormValues } from '../schemas/profileSchemas';

type Option = {
  value: string;
  label: string;
};

type FormSelectFieldProps = {
  name: FieldPath<TutorProfileFormValues | StudentProfileFormValues>;
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
};

export const FormSelectField = ({ name, label, options, placeholder, required }: FormSelectFieldProps) => {
  const {
    register,
    watch,
    formState: { errors }
  } = useFormContext<TutorProfileFormValues | StudentProfileFormValues>();

  const error = get(errors, name) as FieldError | undefined;
  const fieldValue = watch(name);
  const selectValue = typeof fieldValue === 'string' ? fieldValue : '';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required ? <span className="text-red-500 ml-1">*</span> : null}
      </label>
      <select
        {...register(name)}
        value={selectValue}
        onChange={(e) => {
          const registered = register(name);
          if (registered.onChange) {
            registered.onChange(e);
          }
        }}
        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          error ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
        }`}
      >
        <option value="" disabled>
          {placeholder ?? 'Select an option'}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error.message}
        </p>
      ) : null}
    </div>
  );
};
