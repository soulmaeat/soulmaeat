import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosHappy } from "react-icons/io";

const tabs = [
  { name: 'Home', path: '/main', icon: <FaHome size="1.5em" /> },
  { name: 'Location', path: '/location', icon: <FaLocationDot size="1.5em" /> },
  { name: 'My Page', path: '/profile', icon: <IoIosHappy size="1.5em" /> },
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
              <div className={`flex flex-col items-center ${location.pathname === tab.path ? 'text-customOrange' : 'text-gray-300'}`}>
                {tab.icon}
                <span className={`${location.pathname === tab.path ? 'text-customOrange font-bold text-xs' : 'text-gray-300 text-xs'}`}>
                  {tab.name}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TabBar;
