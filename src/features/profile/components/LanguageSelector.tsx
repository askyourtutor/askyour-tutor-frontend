import { IconCheck } from '@tabler/icons-react';

interface LanguageSelectorProps {
  selected: string[];
  onToggle: (language: string) => void;
  error?: string;
}

const LANGUAGES = [
  { value: 'English', label: 'English', flag: '🇬🇧' },
  { value: 'Spanish', label: 'Spanish', flag: '🇪🇸' },
  { value: 'French', label: 'French', flag: '🇫🇷' },
  { value: 'German', label: 'German', flag: '🇩🇪' },
  { value: 'Italian', label: 'Italian', flag: '🇮🇹' },
  { value: 'Portuguese', label: 'Portuguese', flag: '🇵🇹' },
  { value: 'Russian', label: 'Russian', flag: '🇷🇺' },
  { value: 'Japanese', label: 'Japanese', flag: '🇯🇵' },
  { value: 'Korean', label: 'Korean', flag: '🇰🇷' },
  { value: 'Chinese', label: 'Chinese (Mandarin)', flag: '🇨🇳' },
  { value: 'Arabic', label: 'Arabic', flag: '🇸🇦' },
  { value: 'Hindi', label: 'Hindi', flag: '🇮🇳' },
  { value: 'Bengali', label: 'Bengali', flag: '🇧🇩' },
  { value: 'Tamil', label: 'Tamil', flag: '🇱🇰' },
  { value: 'Sinhala', label: 'Sinhala', flag: '🇱🇰' },
  { value: 'Dutch', label: 'Dutch', flag: '🇳🇱' },
  { value: 'Turkish', label: 'Turkish', flag: '🇹🇷' },
  { value: 'Polish', label: 'Polish', flag: '🇵🇱' },
  { value: 'Swedish', label: 'Swedish', flag: '🇸🇪' },
  { value: 'Vietnamese', label: 'Vietnamese', flag: '🇻🇳' },
  { value: 'Thai', label: 'Thai', flag: '🇹🇭' },
  { value: 'Indonesian', label: 'Indonesian', flag: '🇮🇩' },
  { value: 'Malay', label: 'Malay', flag: '🇲🇾' },
];

export const LanguageSelector = ({ selected, onToggle, error }: LanguageSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Languages You Speak <span className="text-red-500">*</span>
      </label>
      <p className="text-xs sm:text-sm text-gray-500 mb-3">Select all languages you can teach or communicate in</p>
      
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 border-2 rounded-lg ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
      }`}>
        {LANGUAGES.map((language) => {
          const isSelected = selected.includes(language.value);
          return (
            <button
              key={language.value}
              type="button"
              onClick={() => onToggle(language.value)}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <span className="text-base">{language.flag}</span>
              <span className="flex-1 text-left truncate">{language.label}</span>
              {isSelected && (
                <IconCheck size={16} className="flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-2 text-sm font-medium text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-600">Selected ({selected.length}):</span>
          {selected.map((lang) => {
            const language = LANGUAGES.find(l => l.value === lang);
            return (
              <span
                key={lang}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs sm:text-sm font-medium"
              >
                {language?.flag} {language?.label || lang}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
