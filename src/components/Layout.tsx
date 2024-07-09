import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <body className="bg-ivory w-full h-full ">
      <Outlet />
    </body>
  );
};
