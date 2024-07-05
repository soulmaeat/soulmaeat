import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Detail } from './pages/Detail';
import { Layout } from './components/Layout';
import { IntroPage } from './pages/IntroPage/IntroPage'; // PascalCase로 import

const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/detail', element: <Detail /> },
      { path: '/intropage', element: <IntroPage /> },
    ],
  },
];

function App() {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}

export default App;
