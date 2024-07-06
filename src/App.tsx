import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Detail } from './pages/Detail';
import { Layout } from './components/Layout';
import { IntroPage } from './pages/IntroPage/IntroPage'; // PascalCase로 import
import Profile from './pages/Profile';
import { Location } from './pages/Location';
import Main from './pages/Main';

const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/main', element: <Main /> },
      { path: '/detail', element: <Detail /> },
      { path: '/intropage', element: <IntroPage /> },
      { path: '/profile', element: <Profile /> },
      { path: '/location', element: <Location /> },
    ]
  },
];

function App() {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}

export default App;
