import React from 'react';


export default function HomeIntermédiaire() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <div className="p-4 md:p-8">
        <h1 className="text-green-700 font-bold text-xl md:text-2xl">Atlasia</h1>
        <h2 className="mt-2 text-xl md:text-2xl font-semibold">Bienvenue Snowfall:</h2>
      </div>

      {/* Hosting section */}
      <div className="px-4 md:px-8 mt-2">
        <h3 className="text-lg font-semibold text-green-800">Hostings</h3>
        <div className="flex gap-2 mt-2 flex-wrap">
          <button className="bg-green-700 text-white px-4 py-2 rounded-full text-sm">Devenir co-hôte</button>
          <button className="border border-black text-black px-4 py-2 rounded-full text-sm">Gérer mes hosting</button>
        </div>
      </div>

      {/* Réservations */}
      <div className="px-4 md:px-8 mt-6">
        <h3 className="text-lg font-semibold text-green-800">Gérer mes réservations</h3>
        <div className="flex text-sm mt-2 mb-2">
          <span className="border-b-2 border-green-700 mr-4 pb-1">Réservée</span>
          <span className="text-gray-400">En Attente</span>
        </div>

        {/* Réservations cards */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img src="https://via.placeholder.com/60" alt="Appartement Zephire" className="w-16 h-16 rounded-md object-cover" />
            <span>Appartement Zephire</span>
          </div>
          <div className="flex items-center gap-4">
            <img src="https://via.placeholder.com/60" alt="Villa Makarska" className="w-16 h-16 rounded-md object-cover" />
            <div>
              <div>Villa Makarska</div>
              <div className="text-sm text-gray-500">Ifrane - Downtown</div>
            </div>
          </div>
        </div>
      </div>

      {/* Packs */}
      <div className="px-4 md:px-8 mt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-green-800">Mes packs :</h3>
          <button className="text-green-700 text-sm flex items-center gap-1">
            Modifier <span className="text-xs">✏️</span>
          </button>
        </div>

        <div className="flex text-sm mt-2 mb-2">
          <span className="border-b-2 border-green-700 mr-4 pb-1">Réservée</span>
          <span className="text-gray-400">En Attente</span>
        </div>

        <div className="flex items-center gap-4">
          <img src="https://via.placeholder.com/60" alt="Pack Logement+Quad" className="w-16 h-16 rounded-md object-cover" />
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
