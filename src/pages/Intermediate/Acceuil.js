import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeIntermédiaire() {
  const navigate = useNavigate();

  const handleDevenirCoHote = () => {
    navigate('/cohosting-explore');
  };

  const handleGererHosting = () => {
    navigate('/partner/cohosting-management');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      {/* Packs */}
<div className="px-4 md:px-8 mt-6">
  <div className="flex justify-between items-center">
    <h3 className="text-lg font-semibold text-green-800">Mes packs :</h3>
    <div className="flex gap-2">
      <button
        onClick={() => navigate("/create-package")}
        className="bg-green-700 text-white px-3 py-1 rounded-full text-sm hover:bg-green-800 transition-colors flex items-center gap-1"
      >
        Créer un pack <span className="text-xs">➕</span>
      </button>
      <button className="text-green-700 text-sm flex items-center gap-1">
        Modifier <span className="text-xs">✏️</span>
      </button>
    </div>
  </div>

  <div className="flex text-sm mt-2 mb-2">
    <span className="border-b-2 border-green-700 mr-4 pb-1">Réservée</span>
    <span className="text-gray-400">En Attente</span>
  </div>

  <div className="flex items-center gap-4">
    <img
      src="https://via.placeholder.com/60"
      alt="Pack Logement+Quad"
      className="w-16 h-16 rounded-md object-cover"
    />
    <span>Pack Logement+Quad</span>
  </div>
</div>


      {/* Bottom Navbar - visible only on mobile */}
      {/* <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md md:hidden flex justify-between px-4 py-2 text-xs text-center">
        <div className="flex flex-col items-center text-green-700">
          <FaHome size={20} />
          <span>Accueil</span>
        </div>
        <div className="flex flex-col items-center">
          <FaBoxOpen size={20} />
          <span>Activités</span>
        </div>
        <div className="flex flex-col items-center">
          <FaHotel size={20} />
          <span>Hosting</span>
        </div>
        <div className="flex flex-col items-center">
          <FaComments size={20} />
          <span>Inbox</span>
        </div>
        <div className="flex flex-col items-center">
          <FaUser size={20} />
          <span>Profile</span>
        </div>
      </div> */}
    </div>
  );
}