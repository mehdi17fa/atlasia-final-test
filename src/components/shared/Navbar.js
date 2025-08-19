import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  {
    name: 'Découvrir',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.75L12 4l9 5.75V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z" />
      </svg>
    ),
    path: '/',
  },
  {
    name: 'Ma liste',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    path: '/favorites',
  },
  {
    name: 'Plan',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V4.618a1 1 0 01.553-.894L9 2m0 18v-18m0 18l6-2m0 0v-18m0 18l5.447-2.724A1 1 0 0021 16.382V4.618a1 1 0 00-.553-.894L15 2" />
      </svg>
    ),
    path: '/map',
  },
  {
    name: 'Inbox',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13V5a2 2 0 00-2-2H6a2 2 0 00-2 2v8m16 0l-8 5-8-5m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
      </svg>
    ),
    path: '/inbox',
  },
  {
    name: 'Profile',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 10-6 0 3 3 0 006 0z" />
      </svg>
    ),
    path: '/profile',
  },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Hide navbar on all routes like /chat/anything
  const isChatPage = /^\/chat\/[^/]+$/.test(location.pathname);
  if (isChatPage) return null;

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center justify-center text-xs
                transition-colors duration-200
                focus:outline-none
                ${isActive ? 'text-green-700' : 'text-gray-500 hover:text-green-600'}
              `}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.name}
              type="button"
            >
              {React.cloneElement(item.icon, {
                className: isActive
                  ? 'w-5 h-5 mb-1 stroke-green-700'
                  : 'w-5 h-5 mb-1 stroke-gray-500',
              })}
              {item.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
