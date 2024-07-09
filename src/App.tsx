import './App.css';
import { useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Detail } from './pages/Detail';
import { Layout } from './components/Layout';
import { IntroPage } from './pages/IntroPage/IntroPage'; // PascalCase로 import
import { SignUp } from './pages/IntroPage/SignUp';
import { WalletProvider } from './contexts/WalletContext';
import { Location } from './pages/Location';
import Profile from './pages/Profile';
import Charge from './pages/Charge';
import ChargeConfirmation from './pages/ChargeConfirmation';
import Main from './pages/Main';
import Onboarding from './pages/Onboarding';
import Write from './pages/Write';

declare global {
  interface Window {
    kakao: any;
  }
}
export const kakao = window['kakao'];
function App() {
  const [addrInfo, setAddrInfo] = useState(() => {
    const storedLocationInfo = localStorage.getItem('locationInfo');
    return storedLocationInfo ? JSON.parse(storedLocationInfo) : {};
  });
  
  const [latLngInfo, setLatLngInfo] = useState(() => {
    const storedLatLng = localStorage.getItem('latLng');
    return storedLatLng ? JSON.parse(storedLatLng) : { lat: 37.56100278, lng: 126.9996417 };
  });
  
  // 디버깅을 위해 useEffect로 localStorage 값 확인
  // useEffect(() => {
  //   console.log('Stored Location Info:', localStorage.getItem('locationInfo'));
  //   console.log('Stored LatLng:', localStorage.getItem('latLng'));
  // }, []);

  const routes = [
    {
      element: <Layout />,
      children: [
        { path: '/main', element: <Main addrInfo={addrInfo} /> },
        { path: '/detail', element: <Detail /> },
        { path: '/intropage', element: <IntroPage /> },
        { path: '/onboard', element: <Onboarding /> },
        { path: '/profile', element: <Profile /> },
        { path: '/Charge', element: <Charge /> },
        { path: '/charge-confirmation', element: <ChargeConfirmation /> },
        { path: '/location', element: <Location /> },
        { path: '/signup', element: <SignUp /> },
        { path: '/write', element: <Write latLngInfo={latLngInfo} /> },
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
