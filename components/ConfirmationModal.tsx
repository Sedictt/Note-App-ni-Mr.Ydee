import React from 'react';
import { XIcon, TrashIcon, CheckCircleIcon } from './Icons';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  variant?: 'danger' | 'primary';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel, confirmText, variant = 'danger' }) => {
  const buttonConfig = {
    danger: {
      className: "bg-red-600 hover:bg-red-700",
      icon: <TrashIcon className="w-4 h-4 mr-2" />,
      text: "Delete"
    },
    primary: {
      className: "bg-green-600 hover:bg-green-700",
      icon: <CheckCircleIcon className="w-4 h-4 mr-2" />,
      text: "Confirm"
    }
  };
  
  const config = buttonConfig[variant];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-gray-800">Confirm Action</h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <XIcon />
            </button>
          </div>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-xl">
          <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`${config.className} text-white font-semibold px-4 py-2 rounded-md transition-colors flex items-center`}
          >
            {config.icon}
            {confirmText || config.text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;