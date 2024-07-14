import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useWallet } from '../contexts/WalletContext';
import { UserData } from '../App';

interface ChargeProps {
  userData: UserData | null;
}

const ChargeConfirmation: React.FC<ChargeProps> = ({ userData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const amount = state?.amount;
  const { setUserSoulpay, userSoulpay } = useWallet();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = async () => {
    if (amount) {
      try {
        const storedUserInfo = sessionStorage.getItem('userInfo');
        const token = storedUserInfo ? JSON.parse(storedUserInfo).token : {};

        if (!token) {
          console.error('세션 스토리지에서 토큰을 찾을 수 없습니다.');
          return;
        }

        // 서버에 충전 요청 보내기
        const response = await axios.put(
          'http://localhost:3000/api/charge',
          { email: userData?.user?.email, soulpay: amount },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { soulpay } = response.data;
        const updatedBalance = userSoulpay + soulpay; // 현재 소울페이에 충전된 금액을 합산
        setUserSoulpay(updatedBalance); // WalletContext에서 제공하는 setUserSoulpay 함수를 사용하여 소울페이 업데이트
        localStorage.setItem('userSoulpay', updatedBalance.toString()); // localStorage에 저장

        // 세션 스토리지에도 토큰 정보와 함께 저장
        if (storedUserInfo) {
          const userInfo = JSON.parse(storedUserInfo);
          sessionStorage.setItem('userInfo', JSON.stringify({
            ...userInfo,
            userSoulpay: updatedBalance,
          }));
        }

        navigate('/profile');
      } catch (error) {
        console.error('소울페이 충전 중 오류 발생:', error);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleConfirm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [amount, handleConfirm]);

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
            {amount && (
              <div className="text-2xl font-semibold">
                <span className="text-customOrange">{amount.toLocaleString()}</span> 원을
              </div>
            )}
            <div className="text-2xl font-semibold">충전 완료했어요</div>
          </div>
        </div>
      </div>
      <button
        ref={buttonRef}
        className="w-full py-3 bg-customOrange text-white text-xl rounded-full"
        onClick={handleConfirm}
      >
        확인
      </button>
    </div>
  );
};

export default ChargeConfirmation;
