import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  MapPinIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ArchiveBoxIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
  ArrowRightIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:4000/api';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
  </div>
);

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const getImageUrl = (imagePath) =>
    imagePath
      ? imagePath.startsWith('http')
        ? imagePath
        : `${API_BASE_URL.replace('/api', '')}/uploads/profilepic/${imagePath}`
      : null;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {property.photos && property.photos.length > 0 ? (
          <img
            src={getImageUrl(property.photos[0])}
            alt={property.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x200?text=Pas+d\'image';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <HomeIcon className="h-16 w-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
          Co-hôte
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{property.title || 'Propriété sans titre'}</h3>
        <div className="text-sm text-gray-600 mb-2">
          <div className="flex items-center mb-1">
            <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
            <span>
              {property.localisation?.city || 'Ville non définie'}
              {property.localisation?.address && `, ${property.localisation.address}`}
            </span>
          </div>
          {property.info && (
            <div className="flex items-center space-x-4 text-xs">
              <span>{property.info.guests || 0} invités</span>
              <span>{property.info.bedrooms || 0} chambres</span>
              <span>{property.info.bathrooms || 0} salles de bain</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-2">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              property.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {property.status === 'published' ? 'Publiée' : 'Brouillon'}
          </span>
          {property.price && (
            <div className="text-sm font-medium text-gray-900">{property.price.weekdays || property.price.weekend || 0}€/nuit</div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {property.equipments && property.equipments.length > 0 && (
              <span>
                {property.equipments.length} équipement{property.equipments.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={() => navigate(`/property/${property._id}`)}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            Voir détails
          </button>
        </div>
      </div>
    </div>
  );
};

const PackageCard = ({ package: pkg }) => {
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getItemsText = () => {
    const items = [];
    if (pkg.services?.length > 0) items.push(`${pkg.services.length} service${pkg.services.length > 1 ? 's' : ''}`);
    if (pkg.activities?.length > 0) items.push(`${pkg.activities.length} activité${pkg.activities.length > 1 ? 's' : ''}`);
    if (pkg.restaurants?.length > 0) items.push(`${pkg.restaurants.length} restaurant${pkg.restaurants.length > 1 ? 's' : ''}`);
    return items.join(', ') || 'Aucun élément';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{pkg.name || 'Package sans titre'}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{pkg.description || 'Aucune description'}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getStatusColor(pkg.status)}`}>
          {pkg.status === 'published' ? 'Publié' : 'Brouillon'}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <HomeIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
          <span className="truncate">{pkg.property?.title || 'Propriété non définie'}</span>
        </div>

        <div className="flex items-center">
          <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
          <span className="text-xs">
            {pkg.startDate && pkg.endDate
              ? `${new Date(pkg.startDate).toLocaleDateString('fr-FR')} - ${new Date(pkg.endDate).toLocaleDateString('fr-FR')}`
              : 'Dates non définies'}
          </span>
        </div>

        <div className="flex items-center">
          <ArchiveBoxIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
          <span className="text-xs">{getItemsText()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">Créé le {new Date(pkg.createdAt).toLocaleDateString('fr-FR')}</div>

        <button
          onClick={() => navigate(`/package/${pkg._id}`)}
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          Voir détails
        </button>
      </div>
    </div>
  );
};

const EmptyState = ({ type, onAction, actionText, icon: Icon, title, description }) => (
  <div className="text-center py-12">
    <div className="mb-4 flex justify-center">
      <Icon className="h-16 w-16 text-gray-300" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
    <button
      onClick={onAction}
      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
    >
      {actionText}
    </button>
  </div>
);

const ErrorAlert = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
    <div className="flex items-center">
      <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
      <div className="flex-1">
        <p className="text-red-800">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-red-600 hover:text-red-700 text-sm font-medium ml-4"
        >
          Réessayer
        </button>
      )}
    </div>
  </div>
);

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [properties, setProperties] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [error, setError] = useState(null);
  const [activePackageTab, setActivePackageTab] = useState('property'); // tab state

  const apiCall = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchProperties(), fetchPackages()]);
  };

  const fetchProperties = async () => {
    try {
      setIsLoadingProperties(true);
      setError(null);

      const response = await apiCall('/partner/my-properties');
      if (response.success && Array.isArray(response.properties)) {
        setProperties(response.properties);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError(error.message || 'Erreur lors du chargement des propriétés');
      setProperties([]);
    } finally {
      setIsLoadingProperties(false);
    }
  };

  const fetchPackages = async () => {
    try {
      setIsLoadingPackages(true);
      const response = await apiCall('/packages/mine');
      if (response.success && Array.isArray(response.packages)) {
        setPackages(response.packages);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError(error.message || 'Erreur lors du chargement des packages');
      setPackages([]);
    } finally {
      setIsLoadingPackages(false);
    }
  };

  const individualPackages = packages.filter((pkg) => !pkg.property);
  const propertyLinkedPackages = packages.filter((pkg) => pkg.property);

  const stats = {
    totalProperties: properties.length,
    publishedProperties: properties.filter((p) => p.status === 'published').length,
    totalPackages: packages.length,
    publishedPackages: packages.filter((p) => p.status === 'published').length,
    draftPackages: packages.filter((p) => p.status === 'draft').length,
    totalIndividualPackages: individualPackages.length,
    totalPropertyLinkedPackages: propertyLinkedPackages.length,
  };

  const retryFetch = () => {
    setError(null);
    fetchData();
  };

  const tabs = [
    { id: 'property', label: 'Packages liés à une propriété' },
    { id: 'individual', label: 'Packages individuels' },
  ];

  const currentPackages = activePackageTab === 'property' ? propertyLinkedPackages : individualPackages;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* HEADER & ACTION BUTTONS */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord partenaire</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/cohosting-explore')}
              className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Explorer les propriétés
            </button>
            <button
              onClick={() => navigate('/create-package')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Créer un package
            </button>
          </div>
        </div>


        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
            <HomeIcon className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-gray-500 text-sm">Mes cohostings</span>
            <span className="font-semibold text-lg">{stats.publishedProperties}</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
            <ArchiveBoxIcon className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-gray-500 text-sm">Packages publiés</span>
            <span className="font-semibold text-lg">{stats.publishedPackages}</span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
            <ClockIcon className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-gray-500 text-sm">Brouillons</span>
            <span className="font-semibold text-lg">{stats.draftPackages}</span>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={retryFetch} />}

        {/* PROPERTIES SECTION */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Mes propriétés</h2>
          </div>
          {isLoadingProperties ? (
            <LoadingSpinner />
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={HomeIcon}
              title="Aucune propriété"
              description="Vous n'avez pas encore ajouté de propriété."
              onAction={() => navigate('/create-property')}
              actionText="Ajouter une propriété"
            />
          )}
        </div>

        {/* PACKAGES SECTION */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Mes packages</h2>
            <button
              onClick={() => navigate('/create-package')}
              className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center"
            >
              Créer un nouveau package
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>

          {/* Tabs Buttons */}
          <div className="flex space-x-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePackageTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activePackageTab === tab.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Packages List with Slide Animation */}
          <div className="relative min-h-[200px]">
            <AnimatePresence mode="wait">
              {isLoadingPackages ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingSpinner />
                </motion.div>
              ) : currentPackages.length > 0 ? (
                <motion.div
                  key={activePackageTab}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentPackages.map((pkg) => (
                      <PackageCard key={pkg._id} package={pkg} />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <EmptyState
                    type="packages"
                    icon={ArchiveBoxIcon}
                    title={
                      activePackageTab === 'property'
                        ? 'Aucun package lié à une propriété'
                        : 'Aucun package individuel'
                    }
                    description={
                      activePackageTab === 'property'
                        ? "Vous n'avez pas encore créé de package lié à une propriété."
                        : "Vous n'avez pas encore créé de package individuel."
                    }
                    onAction={() => navigate('/create-package')}
                    actionText="Créer un package"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
