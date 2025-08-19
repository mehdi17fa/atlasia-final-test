import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../../components/shared/SectionTitle";
import PropertyCard from "../../components/ListingCard/PropertyCard";
import Calendar from "../../components/shared/Calendar";
import OwnerBottomNavbar from "../../components/shared/NavbarPropriétaire";

const user = {
  firstName: "Mehdi",
  id: 1,
  email: "mehdi@example.com"
};

const properties = [
  {
    id: 1,
    name: "Appartement Zephire",
    description: "Un bel appartement lumineux au centre d'Ifrane, proche de toutes commodités.",
    location: "Ifrane - Downtown",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Villa Makarska",
    description: "Villa spacieuse avec piscine privée et grand jardin.",
    location: "Ifrane - Downtown",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
  }
];

export default function WelcomeOwner() {
  const [reservationTab, setReservationTab] = useState("reserved");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedDates, setSelectedDates] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (property) => {
    setSelectedProperty(property);
    setShowCalendar(true);
  };

  const handleCalendarChange = (dates) => {
    setSelectedDates(dates);
    // You can handle saving here
    console.log("Selected dates for property:", selectedProperty, dates);
  };

  const closeModal = () => {
    setShowCalendar(false);
    setSelectedProperty(null);
    setSelectedDates(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      <div className="w-full max-w-7xl mx-auto px-4 pt-4 md:px-8 lg:px-16">
        {/* App name centered on top */}
          <div className="flex items-center justify-center py-4 bg-white shadow-sm">
            <span className="text-2xl font-bold text-green-700">ATLASIA</span>
          </div>
        <h1 className="text-2xl font-bold text-green-900 mb-2 mt-4">Bienvenue {user.firstName}:</h1>
        <SectionTitle title="Gérer mes propriétés" />
        <div className="flex gap-2 mb-4">
          <button className="bg-green-700 text-white px-4 py-2 rounded-full font-semibold text-sm shadow hover:bg-green-800 transition" onClick={() => navigate('/add-property')}>Ajouter propriété</button>
          <button className="border border-green-800 text-green-700 px-4 py-2 rounded-full font-semibold text-sm bg-white hover:bg-green-800 transition" onClick={() => navigate('/list-property-owner')}>Voir mes propriétés</button>
        </div>
        <SectionTitle title="Gérer mes réservations" />
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`flex-1 py-2 font-semibold text-sm ${reservationTab === "reserved" ? "text-green-700 border-b-2 border-green-700" : "text-gray-500"}`}
            onClick={() => setReservationTab("reserved")}
          >
            Réservée
          </button>
          <button
            className={`flex-1 py-2 font-semibold text-sm ${reservationTab === "pending" ? "text-green-700 border-b-2 border-green-700" : "text-gray-500"}`}
            onClick={() => setReservationTab("pending")}
          >
            En Attente
          </button>
        </div>
        {/* Example reservation cards (reuse PropertyCard for now) */}
        <div className="mb-6">
          {properties.map((prop) => (
            <PropertyCard
              key={prop.id}
              name={prop.name}
              description={prop.description}
              location={prop.location}
              image={prop.image}
              onClick={() => handleCardClick(prop)}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mb-2 mt-6">
          <span className="text-green-900 font-bold text-lg">Top propriétés :</span>
          <button className="flex items-center text-green-700 font-semibold text-sm hover:underline">
            Voir plus <span className="ml-1">&rarr;</span>
          </button>
        </div>
        <div>
          {properties.map((prop) => (
            <PropertyCard
              key={prop.id}
              name={prop.name}
              description={prop.description}
              location={prop.location}
              image={prop.image}
              onClick={() => handleCardClick(prop)}
            />
          ))}
        </div>
      </div>
      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 relative w-[350px]">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold" onClick={closeModal}>&times;</button>
            <h3 className="text-lg font-bold mb-2 text-green-900">Disponibilités pour {selectedProperty?.name}</h3>
            <Calendar value={selectedDates} onChange={handleCalendarChange} mode="range" />
            <button className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition" onClick={closeModal}>Valider</button>
          </div>
        </div>
      )}
    </div>
    
  );
}
