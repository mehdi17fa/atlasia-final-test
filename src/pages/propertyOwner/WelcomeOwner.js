import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import SectionTitle from "../../components/shared/SectionTitle";
import PropertyCard from "../../components/ListingCard/PropertyCard";
import Calendar from "../../components/shared/Calendar";
import OwnerBottomNavbar from "../../components/shared/NavbarPropriétaire";
import { AuthContext } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { 
  PlusIcon, 
  HomeIcon, 
  CalendarDaysIcon, 
  ClockIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  MapPinIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

// Property Grid Card Component
function PropertyGridCard({ property, onClick }) {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-1"
      onClick={() => onClick(property)}
    >
      <div className="relative h-48 bg-gray-200">
        {property.image ? (
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <HomeIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.status === 'published' 
              ? 'bg-green-100 text-green-800' 
              : property.status === 'draft'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {property.status === 'published' ? '🌟 Publié' : 
             property.status === 'draft' ? '📝 Brouillon' : 
             property.status}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
          {property.title || "Titre non défini"}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {property.description || "Description non disponible"}
        </p>
        <div className="flex items-center text-xs text-gray-500">
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{property.location || "Localisation non définie"}</span>
        </div>
      </div>
    </div>
  );
}

function CoHostRequestCard({ request, onAccept, onReject, loading, isHighlighted = false }) {
  return (
    <div className={`bg-white border rounded-lg p-4 mb-4 shadow-sm transition-all duration-300 ${
      isHighlighted ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-200'
    }`}>
      {isHighlighted && (
        <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full inline-block mb-2 font-semibold">
          <SparklesIcon className="w-3 h-3 inline mr-1" />
          Nouvelle demande
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
                    <p className="text-xs text-gray-500 flex items-center">
                      <MapPinIcon className="w-3 h-3 mr-1" />
                      {request.property?.localisation?.city || "Localisation non spécifiée"}
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
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
              >
                {loading ? "..." : (
                  <>
                    <CheckIcon className="w-4 h-4 mr-1" />
                    Accepter
                  </>
                )}
              </button>
              <button
                onClick={() => onReject(request._id)}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
              >
                {loading ? "..." : (
                  <>
                    <XMarkIcon className="w-4 h-4 mr-1" />
                    Refuser
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-400 flex items-center">
              <CalendarDaysIcon className="w-3 h-3 mr-1" />
              Demande reçue le {new Date(request.createdAt).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium flex items-center">
              <ClockIcon className="w-3 h-3 mr-1" />
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
  
  // New states for properties
  const [ownerProperties, setOwnerProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [showAllProperties, setShowAllProperties] = useState(false);
  const [propertiesError, setPropertiesError] = useState(null);
  
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

  // Fetch owner properties when component mounts
  useEffect(() => {
    fetchOwnerProperties();
  }, []);

  const fetchOwnerProperties = async () => {
    try {
      setLoadingProperties(true);
      setPropertiesError(null);
      
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      
      console.log("🔍 Fetching owner properties...");
      console.log("🔑 Token found:", token ? "YES" : "NO");
      
      if (!token) {
        console.log("❌ No token found in localStorage");
        toast.error("Veuillez vous reconnecter");
        return;
      }

      const response = await axios.get(`${API_BASE}/api/property/mine/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("📡 Properties API Response:", response.data);
      
      if (response.data.properties) {
        setOwnerProperties(response.data.properties);
        console.log("✅ Properties loaded:", response.data.properties.length);
      } else {
        console.log("⚠️ No properties found in response");
        setOwnerProperties([]);
      }
    } catch (err) {
      console.error("❌ Error fetching owner properties:", err);
      console.error("📋 Error details:", {
        status: err.response?.status,
        message: err.response?.data?.message,
        data: err.response?.data
      });
      
      setPropertiesError("Erreur lors du chargement des propriétés");
      
      if (err.response?.status === 401) {
        toast.error("Session expirée, veuillez vous reconnecter");
      } else if (err.response?.status === 403) {
        toast.error("Accès non autorisé");
      } else {
        toast.error("Erreur lors du chargement des propriétés");
      }
    } finally {
      setLoadingProperties(false);
    }
  };

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

  // Determine how many properties to show
  const propertiesToShow = showAllProperties ? ownerProperties : ownerProperties.slice(0, 6);

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="w-full max-w-7xl mx-auto px-4 pt-4 md:px-8 lg:px-16">
        {/* App name and profile avatar on top */}
        <div className="flex items-center justify-between py-4 px-4 bg-white shadow-sm">
          <div className="w-12"></div> {/* Empty div for spacing */}
          <span className="text-2xl font-bold text-green-700">ATLASIA</span>
          
          {/* User avatar */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center justify-center"
            aria-label="Go to profile"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
              {user?.profilePic ? (
                <img 
                  src={user.profilePic} 
                  alt={user.fullName || user.name || 'User'} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.firstName ? user.firstName.charAt(0).toUpperCase() : (user?.fullName ? user.fullName.charAt(0).toUpperCase() : (user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')))}
                  </span>
                </div>
              )}
            </div>
          </button>
        </div>
        
        <h1 className="text-2xl font-bold text-green-900 mb-2 mt-4">
          Bienvenue {user?.firstName || user?.fullName || "Propriétaire"} 👋
        </h1>

        <SectionTitle title="Gérer mes propriétés" />
        <div className="flex gap-2 mb-6">
          <button 
            className="bg-green-700 text-white px-4 py-2 rounded-full font-semibold text-sm shadow hover:bg-green-800 transition flex items-center" 
            onClick={() => navigate('/add-property')}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Ajouter propriété
          </button>
          <button 
            className="border border-green-800 text-green-700 px-4 py-2 rounded-full font-semibold text-sm bg-white hover:bg-green-50 transition flex items-center" 
            onClick={() => navigate('/my-properties')}
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            Voir mes propriétés
          </button>
        </div>

        {/* Owner Properties Grid */}
        <div className="mb-8">
          {loadingProperties ? (
            <div className="text-center py-8">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
              <p className="text-gray-500 mt-2">Chargement de vos propriétés...</p>
            </div>
          ) : propertiesError ? (
            <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Erreur de chargement</h3>
              <p className="text-red-600 text-sm mb-4">{propertiesError}</p>
              <button 
                onClick={fetchOwnerProperties}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center mx-auto"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Réessayer
              </button>
            </div>
          ) : ownerProperties.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune propriété</h3>
              <p className="text-gray-500 text-sm mb-4">
                Vous n'avez pas encore ajouté de propriétés. Commencez par ajouter votre première propriété.
              </p>
              <button 
                onClick={() => navigate('/add-property')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Ajouter ma première propriété
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {propertiesToShow.map((property) => (
                  <PropertyGridCard
                    key={property._id}
                    property={property}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
              
              {ownerProperties.length > 6 && (
                <div className="text-center">
                  <button
                    onClick={() => setShowAllProperties(!showAllProperties)}
                    className="bg-white border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition-colors font-medium flex items-center mx-auto"
                  >
                    <EyeIcon className="w-4 h-4 mr-2" />
                    {showAllProperties ? 
                      `Voir moins (${ownerProperties.length - 6} masquées)` : 
                      `Voir plus (${ownerProperties.length - 6} autres)`
                    }
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <SectionTitle title="Gérer mes réservations" />
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`flex-1 py-2 font-semibold text-sm flex items-center justify-center ${
              reservationTab === "reserved" 
                ? "text-green-700 border-b-2 border-green-700" 
                : "text-gray-500"
            }`}
            onClick={() => setReservationTab("reserved")}
          >
            <CalendarDaysIcon className="w-4 h-4 mr-1" />
            Réservée
          </button>
          <button
            className={`flex-1 py-2 font-semibold text-sm flex items-center justify-center ${
              reservationTab === "pending" 
                ? "text-green-700 border-b-2 border-green-700" 
                : "text-gray-500"
            }`}
            onClick={() => setReservationTab("pending")}
          >
            <ClockIcon className="w-4 h-4 mr-1" />
            En Attente
          </button>
        </div>
        
        {/* Empty state for reservations */}
        <div className="mb-6">
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune réservation</h3>
            <p className="text-gray-500 text-sm">
              Les réservations de vos propriétés apparaîtront ici.
            </p>
          </div>
        </div>

        {/* Co-Host Requests Section */}
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
              <ArrowPathIcon className="w-4 h-4 mr-1" />
              Actualiser
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
              Disponibilités pour {selectedProperty?.title}
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