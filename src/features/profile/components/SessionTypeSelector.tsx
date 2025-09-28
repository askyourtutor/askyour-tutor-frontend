import { IconCheckbox } from '@tabler/icons-react';

import { sessionTypeOptions, type SessionTypeValue } from '../schemas/profileSchemas';

interface SessionTypeSelectorProps {
  selected: SessionTypeValue[];
  onToggle: (sessionType: SessionTypeValue) => void;
  error?: string;
}

export const SessionTypeSelector = ({ selected, onToggle, error }: SessionTypeSelectorProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-4">Session Types *</label>
    <div className="space-y-3">
      {sessionTypeOptions.map((sessionType) => {
        const isSelected = selected.includes(sessionType.value);
        return (
          <button
            key={sessionType.value}
            type="button"
            onClick={() => onToggle(sessionType.value)}
            className={`w-full text-left border rounded-lg p-4 transition-all flex items-start space-x-3 ${
              isSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <IconCheckbox
              size={22}
              className={`mt-1 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}
            />
            <div>
              <p className="font-medium text-gray-900">{sessionType.label}</p>
              <p className="text-sm text-gray-500">{sessionType.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
    {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
  </div>
);
