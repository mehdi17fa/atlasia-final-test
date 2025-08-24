import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SectionTitle from "../../components/shared/SectionTitle";
import PropertyCard from "../../components/ListingCard/PropertyCard";
import Calendar from "../../components/shared/Calendar";
import OwnerBottomNavbar from "../../components/shared/NavbarPropriétaire";
import { AuthContext } from "../../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

// Mock data - replace with real data from your API
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

function CoHostRequestCard({ request, onAccept, onReject, loading }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-start space-x-4">
        <img
          src={request.partner?.profilePic || "/placeholder-profile.jpg"}
          alt="Partner"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900">
                {request.partner?.fullName || request.partner?.displayName || "Utilisateur"}
              </h4>
              <p className="text-sm text-gray-600">{request.partner?.email}</p>
              <p className="text-sm text-green-700 font-medium mt-1">
                Propriété: {request.property?.title || "Titre non disponible"}
              </p>
              <p className="text-sm text-gray-500">
                {request.property?.localisation?.city || "Localisation non spécifiée"}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onAccept(request._id)}
                disabled={loading}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
              >
                Accepter
              </button>
              <button
                onClick={() => onReject(request._id)}
                disabled={loading}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
              >
                Refuser
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Demande reçue le {new Date(request.createdAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WelcomeOwner() {
  const [reservationTab, setReservationTab] = useState("reserved");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedDates, setSelectedDates] = useState(null);
  const [coHostRequests, setCoHostRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Fetch co-host requests when component mounts
  useEffect(() => {
    fetchCoHostRequests();
  }, []);

  const fetchCoHostRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/partner/requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setCoHostRequests(response.data.requests);
      }
    } catch (err) {
      console.error("Error fetching co-host requests:", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE}/api/partner/accept/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Remove accepted request from list
        setCoHostRequests(prev => prev.filter(req => req._id !== requestId));
        alert("Demande de co-hébergement acceptée avec succès !");
      }
    } catch (err) {
      console.error("Error accepting request:", err);
      alert("Erreur lors de l'acceptation de la demande");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE}/api/partner/reject/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Remove rejected request from list
        setCoHostRequests(prev => prev.filter(req => req._id !== requestId));
        alert("Demande de co-hébergement refusée");
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Erreur lors du refus de la demande");
    } finally {
      setActionLoading(false);
    }
  };

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
        
        <h1 className="text-2xl font-bold text-green-900 mb-2 mt-4">
          Bienvenue {user?.firstName || user?.fullName || "Propriétaire"} :
        </h1>

        {/* Co-Host Requests Section */}
        {coHostRequests.length > 0 && (
          <div className="mb-6">
            <SectionTitle title={`Demandes de co-hébergement (${coHostRequests.length})`} />
            <div className="max-h-96 overflow-y-auto">
              {loadingRequests ? (
                <p className="text-center text-gray-500 py-4">Chargement des demandes...</p>
              ) : (
                coHostRequests.map((request) => (
                  <CoHostRequestCard
                    key={request._id}
                    request={request}
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                    loading={actionLoading}
                  />
                ))
              )}
            </div>
          </div>
        )}

        <SectionTitle title="Gérer mes propriétés" />
        <div className="flex gap-2 mb-4">
          <button 
            className="bg-green-700 text-white px-4 py-2 rounded-full font-semibold text-sm shadow hover:bg-green-800 transition" 
            onClick={() => navigate('/add-property')}
          >
            Ajouter propriété
          </button>
          <button 
            className="border border-green-800 text-green-700 px-4 py-2 rounded-full font-semibold text-sm bg-white hover:bg-green-50 transition" 
            onClick={() => navigate('/my-properties')}
          >
            Voir mes propriétés
          </button>
        </div>

        <SectionTitle title="Gérer mes réservations" />
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`flex-1 py-2 font-semibold text-sm ${
              reservationTab === "reserved" 
                ? "text-green-700 border-b-2 border-green-700" 
                : "text-gray-500"
            }`}
            onClick={() => setReservationTab("reserved")}
          >
            Réservée
          </button>
          <button
            className={`flex-1 py-2 font-semibold text-sm ${
              reservationTab === "pending" 
                ? "text-green-700 border-b-2 border-green-700" 
                : "text-gray-500"
            }`}
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
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold" 
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2 text-green-900">
              Disponibilités pour {selectedProperty?.name}
            </h3>
            <Calendar value={selectedDates} onChange={handleCalendarChange} mode="range" />
            <button 
              className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition" 
              onClick={closeModal}
            >
              Valider
            </button>
          </div>
        </div>
      )}

      <OwnerBottomNavbar />
    </div>
  );
}