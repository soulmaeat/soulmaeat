import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <main className="bg-ivory w-full h-full">
      <Outlet />
    </main>
  );
};
