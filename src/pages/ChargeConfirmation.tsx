// ChargeConfirmation.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChargeConfirmation: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleConfirm = () => {
      navigate('/profile');
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleConfirm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  const selectedAmount = parseFloat(localStorage.getItem('selectedAmount') || '0');

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-5">
      <div className="flex-1 flex items-center justify-center">
        <div className="p-10 flex flex-col items-center">
          <div className="rounded-full h-14 w-14 mb-10 bg-customOrange flex items-center justify-center animate-checkmark">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold">
              <span className="text-customOrange">{selectedAmount}</span>원을
            </div>
            <div className="text-2xl font-semibold">충전 완료했어요</div>
          </div>
        </div>
      </div>
      <button
        className="w-full py-3 bg-customOrange text-white text-xl rounded-full"
        onClick={() => navigate('/profile', { replace: true })}
      >
        확인
      </button>
    </div>
  );
};

export default ChargeConfirmation;
