import { useState, type KeyboardEvent } from 'react';
import { IconPlus, IconX } from '@tabler/icons-react';

interface TagInputListProps {
  label: string;
  items: string[];
  placeholder: string;
  onAdd: (value: string) => boolean;
  onRemove: (value: string) => void;
  emptyMessage: string;
  chipClassName?: string;
  inputLabel?: string;
  error?: string;
}

export const TagInputList = ({
  label,
  items,
  placeholder,
  onAdd,
  onRemove,
  emptyMessage,
  chipClassName,
  inputLabel,
  error
}: TagInputListProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const added = onAdd(inputValue.trim());
    if (added) {
      setInputValue('');
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        {label}
      </label>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          aria-label={inputLabel ?? label}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <IconPlus size={16} />
          <span>Add</span>
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm italic p-4 text-center border border-gray-200 rounded-lg">
            {emptyMessage}
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item}
              className={`flex items-center justify-between border rounded-lg px-4 py-2 ${chipClassName ?? 'bg-blue-50 border-blue-200'}`}
            >
              <span className="font-medium text-gray-800">{item}</span>
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="text-red-600 hover:text-red-800 p-1"
                aria-label={`Remove ${item}`}
              >
                <IconX size={16} />
              </button>
            </div>
          ))
        )}
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
};
