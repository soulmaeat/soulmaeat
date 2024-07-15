import React, { createContext, useContext, useState, useEffect } from 'react';

interface SoulpayContextType {
  soulpay: number;
  setSoulpay: (soulpay: number) => void;
}

interface SoulpayProviderProps {
  children?: React.ReactNode;
}

const SoulpayContext = createContext<SoulpayContextType>({
  soulpay: 0,
  setSoulpay: () => {},
});

export const useSoulpay = () => useContext(SoulpayContext);

export const SoulpayProvider: React.FC<SoulpayProviderProps> = ({ children }) => {
  const [soulpay, setSoulpay] = useState<number>(0);

  // soulpay 상태가 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('soulpay', soulpay.toString());
  }, [soulpay]);

  return (
    <SoulpayContext.Provider value={{ soulpay, setSoulpay }}>
      {children}
    </SoulpayContext.Provider>
  );
};
