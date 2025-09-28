import type { ChangeEvent } from 'react';
import { IconUpload, IconX } from '@tabler/icons-react';

interface FileUploadCardProps {
  label: string;
  description: string;
  accept: string;
  file: File | null;
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  helperText?: string;
  error?: string | null;
  maxSize?: number; // in bytes
  disabled?: boolean;
}

const validateFile = (file: File, accept: string, maxSize?: number): string | null => {
  // Check file type
  const acceptedTypes = accept.split(',').map(type => type.trim());
  const isValidType = acceptedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type.match(type.replace('*', '.*'));
  });
  
  if (!isValidType) {
    return `File type not allowed. Accepted types: ${accept}`;
  }
  
  // Check file size
  if (maxSize && file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return `File size exceeds ${maxSizeMB}MB limit`;
  }
  
  // Check for suspicious file names
  if (/[<>:"/\\|?*]/.test(file.name)) {
    return 'Invalid characters in file name';
  }
  
  return null;
};

export const FileUploadCard = ({
  label,
  description,
  accept,
  file,
  onFileSelect,
  onRemove,
  helperText,
  error,
  maxSize,
  disabled = false
}: FileUploadCardProps) => {
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    const validationError = validateFile(selectedFile, accept, maxSize);
    if (validationError) {
      // Reset the input
      event.target.value = '';
      // You could show an error here or let parent handle it
      return;
    }
    
    onFileSelect(event);
  };

  return (
    <div className="w-full">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className={`border-2 border-dashed rounded-lg p-3 sm:p-4 md:p-6 transition-colors ${
        disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-blue-400'
      } ${error ? 'border-red-300 bg-red-50' : ''}`}>
      <div className="text-center space-y-2 sm:space-y-3">
        <IconUpload size={32} className="sm:w-12 sm:h-12 mx-auto text-gray-400" />
        {file ? (
          <div className="space-y-1 sm:space-y-2">
            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate px-2" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <button
              type="button"
              onClick={onRemove}
              className="text-red-600 hover:text-red-800 text-xs sm:text-sm inline-flex items-center space-x-1 mt-2"
            >
              <IconX size={12} className="sm:w-4 sm:h-4" />
              <span>Remove file</span>
            </button>
          </div>
        ) : (
          <div className="space-y-1 px-2">
            <p className="text-xs sm:text-sm text-gray-600">{description}</p>
            {helperText ? <p className="text-xs text-gray-500">{helperText}</p> : null}
          </div>
        )}
        <label className={`mt-3 sm:mt-4 inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md transition-colors ${
          disabled 
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
        }`}>
          <span className="hidden xs:inline">Choose File</span>
          <span className="xs:hidden">Choose</span>
          <input 
            type="file" 
            accept={accept} 
            onChange={handleFileSelect} 
            disabled={disabled}
            className="hidden" 
          />
        </label>
      </div>
    </div>
    {error ? (
      <p className="mt-2 text-xs sm:text-sm text-red-600 px-1" role="alert">
        {error}
      </p>
    ) : null}
  </div>
  );
};
