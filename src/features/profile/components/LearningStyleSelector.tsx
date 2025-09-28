import { IconCheckbox } from '@tabler/icons-react';

import { learningStyleOptions, type LearningStyleValue } from '../schemas/profileSchemas';

interface LearningStyleSelectorProps {
  selected: LearningStyleValue[];
  onToggle: (learningStyle: LearningStyleValue) => void;
  error?: string;
}

export const LearningStyleSelector = ({ selected, onToggle, error }: LearningStyleSelectorProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-4">Learning Style *</label>
    <div className="space-y-3">
      {learningStyleOptions.map((learningStyle) => {
        const isSelected = selected.includes(learningStyle.value);
        return (
          <button
            key={learningStyle.value}
            type="button"
            onClick={() => onToggle(learningStyle.value)}
            className={`w-full text-left border rounded-lg p-4 transition-all flex items-start space-x-3 ${
              isSelected ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <IconCheckbox
              size={22}
              className={`mt-1 ${isSelected ? 'text-green-600' : 'text-gray-400'}`}
            />
            <div>
              <p className="font-medium text-gray-900">{learningStyle.label}</p>
              <p className="text-sm text-gray-500">{learningStyle.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
    {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
  </div>
);
