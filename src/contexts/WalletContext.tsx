// src/contexts/WalletContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextProps {
  soulBalance: number;
  updateSoulBalance: (amount: number) => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [soulBalance, setSoulBalance] = useState(0);

  const updateSoulBalance = (amount: number) => {
    setSoulBalance(prevBalance => prevBalance + amount);
  };

  return (
    <WalletContext.Provider value={{ soulBalance, updateSoulBalance }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextProps => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};