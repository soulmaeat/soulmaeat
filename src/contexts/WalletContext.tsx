import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  userSoulpay: number;
  setUserSoulpay: (value: number) => void;
}

interface WalletProviderProps {
  children: ReactNode;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [userSoulpay, setUserSoulpay] = useState<number>(0);

  useEffect(() => {
    const storedBalance = localStorage.getItem('userSoulpay');
    if (storedBalance) {
      setUserSoulpay(JSON.parse(storedBalance));
    }
  }, []);

  const updateUserSoulpay = (amount: number) => {
    setUserSoulpay((prevBalance) => {
      const updatedBalance = prevBalance + amount;
      localStorage.setItem('userSoulpay', JSON.stringify(updatedBalance));
      return updatedBalance;
    });
  };

  return (
    <WalletContext.Provider value={{ userSoulpay, setUserSoulpay }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
