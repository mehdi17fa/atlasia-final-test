import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  MapPinIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ArchiveBoxIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

// API configuration
const API_BASE_URL = 'http://localhost:4000/api';

// API helper
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
  </div>
);

const PropertyCard = ({ property }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
    <div className="relative">
      {property.photos && property.photos[0] ? (
        <img
          src={`${API_BASE_URL.replace('/api', '')}/${property.photos[0]}`}
          alt={property.title}
          className="w-full h-48 object-cover"
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
      <h3 className="font-semibold text-gray-900 mb-2">
        {property.title || 'Propriété sans titre'}
      </h3>
      
      <div className="text-sm text-gray-600 mb-2">
        <div className="flex items-center mb-1">
          <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
          {property.localisation?.city}, {property.localisation?.address}
        </div>
        
        <div className="flex items-center space-x-4 text-xs">
          <span>{property.info?.guests || 0} invités</span>
          <span>{property.info?.bedrooms || 0} chambres</span>
          <span>{property.info?.bathrooms || 0} salles de bain</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className={`px-2 py-1 rounded-full text-xs ${
            property.status === 'published' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {property.status === 'published' ? 'Publiée' : 'Brouillon'}
          </span>
        </div>
        
        {property.price && (
          <div className="text-sm font-medium text-gray-900">
            {property.price.weekdays || property.price.weekend}€/nuit
          </div>
        )}
      </div>
    </div>
  </div>
);

const PackageCard = ({ package: pkg }) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getItemsCount = () => {
    const services = pkg.services?.length || 0;
    const activities = pkg.activities?.length || 0;
    const restaurants = pkg.restaurants?.length || 0;
    return services + activities + restaurants;
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
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">
            {pkg.name || 'Package sans titre'}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {pkg.description || 'Aucune description'}
          </p>
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pkg.status)}`}>
          {pkg.status === 'published' ? 'Publié' : 'Brouillon'}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <HomeIcon className="h-4 w-4 mr-2 text-gray-500" />
          <span>{pkg.property?.title || 'Propriété non définie'}</span>
        </div>
        
        <div className="flex items-center">
          <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-500" />
          <span>
            {pkg.startDate && pkg.endDate 
              ? `${new Date(pkg.startDate).toLocaleDateString('fr-FR')} - ${new Date(pkg.endDate).toLocaleDateString('fr-FR')}`
              : 'Dates non définies'
            }
          </span>
        </div>
        
        <div className="flex items-center">
          <ArchiveBoxIcon className="h-4 w-4 mr-2 text-gray-500" />
          <span>{getItemsText()}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Créé le {new Date(pkg.createdAt).toLocaleDateString('fr-FR')}
        </div>
        
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

const EmptyState = ({ type, onAction, actionText }) => (
  <div className="text-center py-12">
    <div className="mb-4 flex justify-center">
      {type === 'properties' ? (
        <HomeIcon className="h-16 w-16 text-gray-300" />
      ) : (
        <ArchiveBoxIcon className="h-16 w-16 text-gray-300" />
      )}
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {type === 'properties' ? 'Aucune propriété co-hôte' : 'Aucun package créé'}
    </h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      {type === 'properties' 
        ? 'Vous ne co-hébergez aucune propriété pour le moment. Explorez les opportunités de co-hébergement.'
        : 'Vous n\'avez pas encore créé de package. Commencez par créer votre premier package d\'expériences.'
      }
    </p>
    <button
      onClick={onAction}
      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
    >
      {actionText}
    </button>
  </div>
);

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchProperties(), fetchPackages()]);
  };

  const fetchProperties = async () => {
    try {
      setIsLoadingProperties(true);
      const response = await apiCall('/partner/my-properties');
      setProperties(response.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Erreur lors du chargement des propriétés');
    } finally {
      setIsLoadingProperties(false);
    }
  };

  const fetchPackages = async () => {
    try {
      setIsLoadingPackages(true);
      const response = await apiCall('/packages/mine');
      setPackages(response.packages || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Erreur lors du chargement des packages');
    } finally {
      setIsLoadingPackages(false);
    }
  };

  const stats = {
    totalProperties: properties.length,
    publishedProperties: properties.filter(p => p.status === 'published').length,
    totalPackages: packages.length,
    publishedPackages: packages.filter(p => p.status === 'published').length,
    draftPackages: packages.filter(p => p.status === 'draft').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord partenaire</h1>
              <p className="text-gray-600">Gérez vos propriétés co-hôtes et vos packages</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/cohosting-explore')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <HomeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Propriétés co-hôtes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Propriétés publiées</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.publishedProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ArchiveBoxIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total packages</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalPackages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <RocketLaunchIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Packages publiés</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.publishedPackages}</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Properties Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Mes propriétés co-hôtes</h2>
            <button
              onClick={() => navigate('/cohosting-explore')}
              className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center"
            >
              Explorer plus de propriétés
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </button>
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
              type="properties"
              onAction={() => navigate('/cohosting-explore')}
              actionText="Explorer les propriétés"
            />
          )}
        </div>

        {/* Packages Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Mes packages</h2>
            <div className="flex items-center space-x-4">
              {stats.draftPackages > 0 && (
                <span className="text-sm text-amber-600">
                  {stats.draftPackages} brouillon{stats.draftPackages > 1 ? 's' : ''}
                </span>
              )}
              <button
                onClick={() => navigate('/create-package')}
                className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center"
              >
                Créer un nouveau package
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          {isLoadingPackages ? (
            <LoadingSpinner />
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <PackageCard key={pkg._id} package={pkg} />
              ))}
            </div>
          ) : (
            <EmptyState
              type="packages"
              onAction={() => navigate('/create-package')}
              actionText="Créer mon premier package"
            />
          )}
        </div>
      </div>
    </div>
  );
}