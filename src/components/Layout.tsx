import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="bg-ivory w-full h-full ">
      <Outlet />
    </div>
  );
};
