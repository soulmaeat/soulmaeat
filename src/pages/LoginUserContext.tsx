import React, { createContext, useContext, useState, ReactNode } from 'react';

// 사용자 정보 인터페이스 정의
interface User {
  userid: string;
  [key: string]: any; // 추가적인 사용자 정보를 위한 확장 가능성
}

// context의 값 타입 정의
interface LoginUserContextType {
  user: User | null;
  loginAuthUser: (userInfo: User) => void;
  logoutUser: () => void;
}

// 기본값을 설정하여 context 생성
const LoginUserContext = createContext<LoginUserContextType | undefined>(undefined);

export const useLoginUser = () => {
  const context = useContext(LoginUserContext);
  if (!context) {
    throw new Error('useLoginUser는 LoginUserProvider내에서 사용해야 해요');
  }
  return context;
};

// Provider 컴포넌트의 props 타입 정의
interface LoginUserProviderProps {
  children: ReactNode;
}

export const LoginUserProvider: React.FC<LoginUserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const loginAuthUser = (userInfo: User) => {
    setUser(userInfo);
  };

  const logoutUser = () => {
    setUser(null);
  };

  return (
    <LoginUserContext.Provider value={{ user, loginAuthUser, logoutUser }}>
      {children}
    </LoginUserContext.Provider>
  );
};
