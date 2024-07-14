// WalletContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  userSoulpay: number;
  setUserSoulpay: React.Dispatch<React.SetStateAction<number>>;
}

interface WalletProviderProps {
  children: ReactNode;
}

const WalletContext = createContext<WalletContextType>({
  userSoulpay: 0,
  setUserSoulpay: () => {},
});

export const useWallet = () => {
  return useContext(WalletContext);
};

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [userSoulpay, setUserSoulpay] = useState<number>(0);

  useEffect(() => {
    // 페이지 로드 시 localStorage에서 userSoulpay 정보를 가져오기
    const storedUserSoulpay = localStorage.getItem('userSoulpay');
    if (storedUserSoulpay) {
      setUserSoulpay(parseFloat(storedUserSoulpay)); // 문자열을 숫자로 변환
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('userSoulpay', userSoulpay.toString());
  }, [userSoulpay]);

  return (
    <WalletContext.Provider value={{ userSoulpay, setUserSoulpay }}>
      {children}
    </WalletContext.Provider>
  );
};
