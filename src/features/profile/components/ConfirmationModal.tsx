import { IconX, IconAlertTriangle } from '@tabler/icons-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-white/10 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-sm max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-sm ${
              type === 'danger' ? 'bg-red-100' :
              type === 'warning' ? 'bg-yellow-100' :
              'bg-blue-100'
            }`}>
              <IconAlertTriangle size={20} className={
                type === 'danger' ? 'text-red-600' :
                type === 'warning' ? 'text-yellow-600' :
                'text-blue-600'
              } />
            </div>
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-sm transition-colors"
          >
            <IconX size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-sm transition-colors ${
              type === 'danger' 
                ? 'bg-red-600 hover:bg-red-700' 
                : type === 'warning'
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
