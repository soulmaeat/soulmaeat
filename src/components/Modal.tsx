import React, { useEffect, useRef } from 'react';

interface ModalProps {
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onConfirm, onClose }) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onConfirm();
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onConfirm, onClose]);

  useEffect(() => {
    confirmButtonRef.current?.focus();
  }, []);

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-md w-full py-10 px-8">
          <div className="mb-4">
            <h3 className="text-center font-semibold">{message}</h3>
          </div>
          <div className="flex justify-end">
            <button
              ref={confirmButtonRef}
              onClick={onConfirm}
              className="py-3 bg-customOrange text-white w-full rounded-lg focus:outline-none"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
