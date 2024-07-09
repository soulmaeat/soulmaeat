import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { name: 'home', path: '/', src: '/img/flowbite_home-solid.png' },
  { name: 'location', path: '/location', src: '/img/majesticons_map-marker.png' },
  { name: 'mypage', path: '/profile', src: '/img/Vector.png' },
];

const TabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="border-t max-w-3xl fixed -translate-x-[20px] box-border bottom-0 w-full bg-white">
      <ul className="flex justify-between list-none">
        {tabs.map((tab) => (
          <li key={tab.name} className="flex-1 text-center">
            <button
              onClick={() => navigate(tab.path)}
              className="block py-4 w-full focus:outline-none"
            >
              <img src={tab.src} alt={tab.name} className="mx-auto mb-1" />
              <span className={`${location.pathname === tab.path ? 'text-customOrange font-bold text-xs' : 'text-gray-300 text-xs'}`}>
                {tab.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TabBar;
