// src/pages/Profile/Profile.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SectionTitle from '../../components/shared/SectionTitle';
import DefaultAvatar from '../assets/default-pp.png';

export default function Profile() {
  const navigate = useNavigate();

  // Routes associées à chaque item
  const menuItems = [
    { label: 'Info Personnel', path: '/edit-profile' },
    { label: 'Ma Balance et Payments', path: '/payments' },
    { label: 'Language', path: '/language' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Mes Données', path: '/data' },
    { label: 'Séjour de travaille', path: '/work-stays' },
  ];

  return (
    <div className="pb-20 px-4 mt-12 relative">
      <div className="text-center text-green-700 font-bold text-2xl mb-4">
        ATLASIA
      </div>
      <div className="text-center mt-6">
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-green-600">
          <img
            src={DefaultAvatar}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="font-semibold text-3xl mt-2">Amine Mellouli</h1>
        <div className="mt-4 text-green-700 font-medium">
          Devenir partenaire avec Atlasia<br />
          <span className="text-sm underline">voir plus</span>
        </div>
      </div>

      <SectionTitle title="Account Settings" />
      <ul className="space-y-4 ml-4">
        {menuItems.map((item) => (
          <li key={item.label}>
            <button
              onClick={() => navigate(item.path)}
              className="w-full flex justify-between items-center py-3 px-4 border rounded-lg bg-gray-50 hover:bg-gray-100 text-left"
            >
              <span>{item.label}</span>
            
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-center">
        <button 
        onClick={() => navigate('/welcome-owner')}
        className="bg-green-700 text-white py-2 px-6 rounded-full font-medium">
          Devenir propriétaire
        </button>
      </div>
    </div>
  );
}



