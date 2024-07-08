import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Detail } from './pages/Detail';
import { Layout } from './components/Layout';
import { IntroPage } from './pages/IntroPage/IntroPage'; // PascalCase로 import
import { SignUp } from './pages/IntroPage/SignUp';
import Profile from './pages/Profile';
import { Location } from './pages/Location';

const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/detail', element: <Detail /> },
      { path: '/intropage', element: <IntroPage /> },
      { path: '/profile', element: <Profile /> },
      { path: '/location', element: <Location /> },
      { path: '/signup', element: <SignUp /> },
    ]
  },
];

function App() {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}

export default App;
