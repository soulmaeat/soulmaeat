import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Detail } from './pages/Detail';
import { Location } from './pages/Location';
import { Layout } from './components/Layout';

const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/detail', element: <Detail /> },
      { path: '/location', element: <Location /> }
    ],
  },
];

function App() {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}

export default App;
