import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Detail } from './pages/Detail';
import { Layout } from './components/Layout';
import Profile from './pages/Profile';

const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/detail', element: <Detail /> },
      { path: '/profile', element: <Profile /> },
    ]
  },
];

function App() {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}

export default App;
