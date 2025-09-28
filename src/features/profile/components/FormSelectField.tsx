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
    formState: { errors }
  } = useFormContext<TutorProfileFormValues | StudentProfileFormValues>();

  const error = get(errors, name) as FieldError | undefined;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required ? <span className="text-red-500 ml-1">*</span> : null}
      </label>
      <select
        {...register(name)}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
        defaultValue=""
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
      {error ? <p className="mt-1 text-sm text-red-600">{error.message}</p> : null}
    </div>
  );
};
