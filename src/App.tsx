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
  userId?: string | null;
  token?: string | null;
  userSoulpay: number[]; // 추가
}

export interface User {
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
  userSoulpay: number[];
}

export interface UserData {
  user: User;
}

export interface PostData {
  title?: string;
  addressName?: string;
  age?: string;
  author?: string;
  categoryName?: string;
  createAt?: Date;
  description?: string;
  gender?: string;
  joinedPeople?: number | null;
  phone?: string | undefined;
  placeName?: string;
  placeUrl?: string;
  postId?: string;
  roadAddressName?: string;
  selectPlace?: string;
  selectedKeyword: [
    {
      likeList: string[];
      _id: string;
    }
  ];
  selectedPayment?: string;
  x?: string;
  y?: string;
  _id?: string;
  joinCount: number;
  joinUser: string[];
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
  const [postData, setPostData] = useState<PostData[]>([]);

  const url = import.meta.env.VITE_API_URL;
  const storedUserInfo = sessionStorage.getItem('userInfo');
  const token: UserInfo = storedUserInfo
    ? JSON.parse(storedUserInfo).token
    : {};

  // 유저 및 게시글 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`${url}/api/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${url}/api/posts`),
        ]);

        setUserData(userRes.data);
        setPostData(postsRes.data.posts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token]);

  const routes = [
    {
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <IntroPage setUserData={setUserData} />,
        },
        {
          path: '/main',
          element: <MainPage addrInfo={addrInfo} postData={postData} />,
        },
        {
          path: '/detail/:id',
          element: (
            <Detail
              userData={userData}
              postData={postData}
              storedUserInfo={storedUserInfo}
            />
          ),
        },
        { path: '/onboard', element: <Onboarding /> },
        { path: '/profile', element: <Profile userData={userData} postData={postData} /> },
        { path: '/charge', element: <Charge /> },
        { path: '/chargeconfirm', element: <ChargeConfirmation userData={userData} /> },
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
