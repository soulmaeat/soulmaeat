import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Detail } from './pages/Detail';
import { Layout } from './components/Layout';
import { IntroPage } from './pages/IntroPage/IntroPage'; // PascalCase로 import
import Profile from './pages/Profile';
import Charge from './pages/Charge';
import ChargeConfirmation from './pages/ChargeConfirmation';
import { WalletProvider } from './contexts/WalletContext';
import { Location } from './pages/Location';
import Main from './pages/Main';
import Onboarding from './pages/Onboarding';

declare global {
  interface Window {
    kakao: any;
  }
}

export const kakao: any = window['kakao'];

const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/main', element: <Main /> },
      { path: '/detail', element: <Detail /> },
      { path: '/intropage', element: <IntroPage /> },
      { path: '/onboard', element: <Onboarding /> },
      { path: '/profile', element: <Profile /> },
      { path: '/Charge', element: <Charge /> },
      { path: '/charge-confirmation', element: <ChargeConfirmation /> },
      { path: '/location', element: <Location /> },
    ],
  },
];

function App() {
  const router = createBrowserRouter(routes);
  return (
    <WalletProvider>
      <RouterProvider router={router} />
    </WalletProvider>
  );
}

export default App;
