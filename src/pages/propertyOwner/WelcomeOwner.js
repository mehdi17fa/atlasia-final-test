import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import SectionTitle from "../../components/shared/SectionTitle";
import PropertyCard from "../../components/ListingCard/PropertyCard";
import Calendar from "../../components/shared/Calendar";
import OwnerBottomNavbar from "../../components/shared/NavbarPropriétaire";
import { AuthContext } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

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

function CoHostRequestCard({ request, onAccept, onReject, loading, isHighlighted = false }) {
  return (
    <div className={`bg-white border rounded-lg p-4 mb-4 shadow-sm transition-all duration-300 ${
      isHighlighted ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-200'
    }`}>
      {isHighlighted && (
        <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full inline-block mb-2 font-semibold">
          ✨ Nouvelle demande
        </div>
      )}
      <div className="flex items-start space-x-4">
        <img
          src={request.partner?.profilePic || "/placeholder-profile.jpg"}
          alt="Partner"
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">
                {request.partner?.fullName || request.partner?.displayName || "Utilisateur"}
              </h4>
              <p className="text-sm text-gray-600">{request.partner?.email}</p>
              
              {/* Property Info with Image */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  {request.property?.photos?.[0] && (
                    <img
                      src={request.property.photos[0]}
                      alt="Property"
                      className="w-16 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-green-700">
                      {request.property?.title || "Titre non disponible"}
                    </p>
                    <p className="text-xs text-gray-500">
                      📍 {request.property?.localisation?.city || "Localisation non spécifiée"}
                      {request.property?.localisation?.address && `, ${request.property.localisation.address}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2 ml-4">
              <button
                onClick={() => onAccept(request._id)}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? "..." : "✓ Accepter"}
              </button>
              <button
                onClick={() => onReject(request._id)}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? "..." : "✗ Refuser"}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-400">
              📅 Demande reçue le {new Date(request.createdAt).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
              En attente
            </span>
          </div>
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
  const [highlightedRequestId, setHighlightedRequestId] = useState(null);
  
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  // Check if we need to highlight a specific request (from email link)
  useEffect(() => {
    const highlightRequest = searchParams.get('highlight');
    console.log("🎯 Highlight request ID from URL:", highlightRequest);
    console.log("👤 Current user:", user);
    console.log("🏠 User role:", user?.role);
    
    if (highlightRequest) {
      setHighlightedRequestId(highlightRequest);
      // Scroll to requests section after component loads
      setTimeout(() => {
        const requestsSection = document.getElementById('cohost-requests-section');
        if (requestsSection) {
          requestsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }, [searchParams, user]);

  // Fetch co-host requests when component mounts
  useEffect(() => {
    fetchCoHostRequests();
  }, []);

  const fetchCoHostRequests = async () => {
    try {
      // Check both possible token locations
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      
      console.log("🔍 Fetching co-host requests...");
      console.log("🔑 Token found:", token ? "YES" : "NO");
      console.log("📦 Token value:", token ? token.substring(0, 20) + "..." : "NULL");
      
      if (!token) {
        console.log("❌ No token found in localStorage");
        toast.error("Veuillez vous reconnecter");
        return;
      }

      const response = await axios.get(`${API_BASE}/api/partner/requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("📡 API Response:", response.data);
      
      if (response.data.success) {
        setCoHostRequests(response.data.requests);
        console.log("✅ Requests loaded:", response.data.requests.length);
      } else {
        console.log("⚠️ API returned success: false");
      }
    } catch (err) {
      console.error("❌ Error fetching co-host requests:", err);
      console.error("📋 Error details:", {
        status: err.response?.status,
        message: err.response?.data?.message,
        data: err.response?.data
      });
      
      if (err.response?.status === 401) {
        toast.error("Session expirée, veuillez vous reconnecter");
      } else if (err.response?.status === 403) {
        toast.error("Accès non autorisé");
      } else {
        toast.error("Erreur lors du chargement des demandes");
      }
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
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
        toast.success("🎉 Demande de co-hébergement acceptée avec succès !");
        
        // Remove highlight
        if (highlightedRequestId === requestId) {
          setHighlightedRequestId(null);
        }
      }
    } catch (err) {
      console.error("Error accepting request:", err);
      const errorMsg = err.response?.data?.message || "Erreur lors de l'acceptation de la demande";
      toast.error(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
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
        toast.success("Demande de co-hébergement refusée");
        
        // Remove highlight
        if (highlightedRequestId === requestId) {
          setHighlightedRequestId(null);
        }
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
      const errorMsg = err.response?.data?.message || "Erreur lors du refus de la demande";
      toast.error(errorMsg);
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
    console.log("Selected dates for property:", selectedProperty, dates);
  };

  const closeModal = () => {
    setShowCalendar(false);
    setSelectedProperty(null);
    setSelectedDates(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="w-full max-w-7xl mx-auto px-4 pt-4 md:px-8 lg:px-16">
        {/* App name centered on top */}
        <div className="flex items-center justify-center py-4 bg-white shadow-sm">
          <span className="text-2xl font-bold text-green-700">ATLASIA</span>
        </div>
        
        <h1 className="text-2xl font-bold text-green-900 mb-2 mt-4">
          Bienvenue {user?.firstName || user?.fullName || "Propriétaire"} 👋
        </h1>

        <SectionTitle title="Gérer mes propriétés" />
        <div className="flex gap-2 mb-6">
          <button 
            className="bg-green-700 text-white px-4 py-2 rounded-full font-semibold text-sm shadow hover:bg-green-800 transition" 
            onClick={() => navigate('/add-property')}
          >
            ➕ Ajouter propriété
          </button>
          <button 
            className="border border-green-800 text-green-700 px-4 py-2 rounded-full font-semibold text-sm bg-white hover:bg-green-50 transition" 
            onClick={() => navigate('/my-properties')}
          >
            🏠 Voir mes propriétés
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
            📅 Réservée
          </button>
          <button
            className={`flex-1 py-2 font-semibold text-sm ${
              reservationTab === "pending" 
                ? "text-green-700 border-b-2 border-green-700" 
                : "text-gray-500"
            }`}
            onClick={() => setReservationTab("pending")}
          >
            ⏳ En Attente
          </button>
        </div>
        
        {/* Example reservation cards */}
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

        {/* Co-Host Requests Section - Replacing "Top propriétés" */}
        <div id="cohost-requests-section" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-green-900 font-bold text-lg flex items-center">
              🤝 Demandes de co-hébergement
              {coHostRequests.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {coHostRequests.length}
                </span>
              )}
            </span>
            <button 
              className="flex items-center text-green-700 font-semibold text-sm hover:underline"
              onClick={() => window.location.reload()}
            >
              🔄 Actualiser
            </button>
          </div>
          
          {loadingRequests ? (
            <div className="text-center py-8">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
              <p className="text-gray-500 mt-2">Chargement des demandes...</p>
            </div>
          ) : coHostRequests.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune demande en attente</h3>
              <p className="text-gray-500 text-sm">
                Les demandes de co-hébergement apparaîtront ici quand des partenaires souhaitent gérer vos propriétés.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {coHostRequests.map((request) => (
                <CoHostRequestCard
                  key={request._id}
                  request={request}
                  onAccept={handleAcceptRequest}
                  onReject={handleRejectRequest}
                  loading={actionLoading}
                  isHighlighted={highlightedRequestId === request._id}
                />
              ))}
            </div>
          )}
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