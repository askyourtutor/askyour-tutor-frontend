import { useState } from 'react';
import { get, useFormContext } from 'react-hook-form';
import type { FieldError, FieldPath } from 'react-hook-form';
import type { TutorProfileFormValues, StudentProfileFormValues } from '../schemas/profileSchemas';

type PhoneInputFieldProps = {
  name: FieldPath<TutorProfileFormValues | StudentProfileFormValues>;
  label: string;
  required?: boolean;
};

const countryCodes = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+82', country: 'S. Korea', flag: '🇰🇷' },
];

export const PhoneInputField = ({ name, label, required }: PhoneInputFieldProps) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors }
  } = useFormContext<TutorProfileFormValues | StudentProfileFormValues>();

  const error = get(errors, name) as FieldError | undefined;
  const fullPhone = watch(name) as string || '';
  
  // Extract country code and number from full phone
  const extractPhoneParts = (phone: string) => {
    if (!phone) return { countryCode: '+1', number: '' };
    
    const match = phone.match(/^(\+\d{1,4})(.*)$/);
    if (match) {
      return { countryCode: match[1], number: match[2].trim() };
    }
    return { countryCode: '+1', number: phone };
  };

  const { countryCode: initialCode, number: initialNumber } = extractPhoneParts(fullPhone);
  const [selectedCode, setSelectedCode] = useState(initialCode);
  const [phoneNumber, setPhoneNumber] = useState(initialNumber);

  const handleCountryCodeChange = (code: string) => {
    setSelectedCode(code);
    setValue(name, `${code}${phoneNumber}`, { shouldValidate: true });
  };

  const handlePhoneNumberChange = (num: string) => {
    // Remove all non-numeric characters
    const cleaned = num.replace(/\D/g, '');
    setPhoneNumber(cleaned);
    setValue(name, `${selectedCode}${cleaned}`, { shouldValidate: true });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex gap-2">
        {/* Country Code Dropdown */}
        <select
          value={selectedCode}
          onChange={(e) => handleCountryCodeChange(e.target.value)}
          className={`px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[120px] ${
            error ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
          }`}
        >
          {countryCodes.map((item) => (
            <option key={item.code} value={item.code}>
              {item.flag} {item.code}
            </option>
          ))}
        </select>

        {/* Phone Number Input */}
        <input
          {...register(name)}
          type="tel"
          value={phoneNumber}
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
          placeholder="1234567890"
          className={`flex-1 px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            error ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
          }`}
        />
      </div>
      
      {/* Preview */}
      {(selectedCode && phoneNumber) && (
        <p className="mt-1 text-xs text-gray-500">
          Preview: <span className="font-medium">{selectedCode}{phoneNumber}</span>
        </p>
      )}
      
      {error && (
        <p className="mt-2 text-sm font-medium text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error.message}
        </p>
      )}
    </div>
  );
};
