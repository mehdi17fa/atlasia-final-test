import React from 'react';
import { useNavigate } from 'react-router-dom';
import SectionTitle from '../../components/shared/SectionTitle';

export default function Favorites() {
  const navigate = useNavigate();

  const sections = [
    { label: 'Logement', path: '/favorites-properties' },
    { label: 'Restaurants', path: '/favorites-restaurants' },
    { label: 'Activités', path: '/favorites-activities' },
    { label: 'Packs et Services', path: '/favorites-packs' },
    { label: 'Professionnel préféré', path: '/favorites-professionals' },
  ];

  const handleSectionClick = (path, label) => {
    if (path === '/favorites-properties') {
      navigate(path);
    } else {
      console.log(`Navigating to ${label} (placeholder)`);
    }
  };

  return (
    <div className="pb-20 px-4 mt-24">
      <SectionTitle title="Ma Liste" />
      <ul className="space-y-4 text-lg mt-8">
        {sections.map(({ label, path }) => (
          <li key={label} className="flex justify-between items-center py-2 border-b">
            <button
              onClick={() => handleSectionClick(path, label)}
              className="w-full flex justify-between items-center text-left text-gray-800 hover:text-blue-600 transition-colors"
            >
              <span>{label}</span>
              <span>&gt;</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}