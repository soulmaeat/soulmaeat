import './App.css';
import { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Detail } from './pages/Detail';
import { Layout } from './components/Layout';
import { IntroPage } from './pages/IntroPage/IntroPage'; // PascalCase로 import
import { SignUp } from './pages/IntroPage/SignUp';
import Profile from './pages/Profile';
import Charge from './pages/Charge';
import ChargeConfirmation from './pages/ChargeConfirmation';
import { WalletProvider } from './contexts/WalletContext';
import { Location } from './pages/Location';
import Onboarding from './pages/Onboarding';
import Write from './pages/Write';
import ActivityList from './pages/ActivityList';
import WriteTwo from './pages/WriteTwo';
import MainPage from './pages/MainPage';
import axios from 'axios';

export interface UserInfo {
  age?: number;
  email?: string;
  gender?: string;
  token?: string | null;
}

interface User {
  age?: number;
  email?: string;
  gender?: string;
  joindedAt?: Date;
  password?: string;
  userId?: string;
  introduce: string;
  userPreference: {
    PreferenceList: string[];
    _id: string;
  }[];
  userSoulpay?: string[];
}

export interface UserData {
  user: User;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export const kakao: any = window['kakao'];

function App() {
  const [addrInfo, setAddrInfo] = useState(() => {
    const storedLocationInfo = localStorage.getItem('locationInfo');
    return storedLocationInfo ? JSON.parse(storedLocationInfo) : {};
  });
  const [latLngInfo, setLatLngInfo] = useState(() => {
    const storedLatLng = localStorage.getItem('latLng');
    return storedLatLng
      ? JSON.parse(storedLatLng)
      : { lat: 37.56100278, lng: 126.9996417 };
  });

  const [userData, setUserData] = useState<UserData | null>(null);

  // 디버깅을 위해 useEffect로 localStorage 값 확인
  // useEffect(() => {
  //   console.log('Stored Location Info:', localStorage.getItem('locationInfo'));
  //   console.log('Stored LatLng:', localStorage.getItem('latLng'));
  // }, []);

  useEffect(() => {
    getUser();
  }, []);

  const url = import.meta.env.VITE_API_URL;
  const storedUserInfo = sessionStorage.getItem('userInfo');
  const token: UserInfo = storedUserInfo
    ? JSON.parse(storedUserInfo).token
    : {};

  // 유저 데이터 가져오기
  const getUser = async () => {
    try {
      const res = await axios.get(`${url}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = res.data;
      setUserData(userData);
    } catch (err) {
      console.log(err);
    }
  };

  const routes = [
    {
      element: <Layout />,
      children: [
        { path: '/', element: <MainPage addrInfo={addrInfo} /> },
        { path: '/detail', element: <Detail userData={userData} /> },
        { path: '/intropage', element: <IntroPage /> },
        { path: '/onboard', element: <Onboarding /> },
        { path: '/profile', element: <Profile userData={userData}/> },
        { path: '/charge', element: <Charge /> },
        { path: '/chargeconfirm', element: <ChargeConfirmation /> },
        { path: '/activity', element: <ActivityList /> },
        { path: '/location', element: <Location /> },
        { path: '/signup', element: <SignUp /> },
        { path: '/write', element: <Write latLngInfo={latLngInfo} /> },
        { path: '/writetwo', element: <WriteTwo userData={userData} /> },
      ],
    },
  ];

  const router = createBrowserRouter(routes);
  return (
    <WalletProvider>
      <RouterProvider router={router} />
    </WalletProvider>
  );
}

export default App;
