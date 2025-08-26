import React, { useState, useEffect } from 'react';

// API configuration
const API_BASE_URL = 'http://localhost:4000/api';

// API helper
// Fixed API helper function
const apiCall = async (endpoint, options = {}) => {
    // Get token from localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header with Bearer token
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

// Step 1: Property Selection
const PropertySelection = ({ selectedProperty, onPropertySelect, onNext, isLoading, properties }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-green-600 mb-4 flex items-center justify-center">
          🏠
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choisir une propriété</h2>
        <p className="text-gray-600">Sélectionnez la propriété pour laquelle vous souhaitez créer un package</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des propriétés...</p>
        </div>
      ) : (
        <div className="grid gap-4 max-h-96 overflow-y-auto">
          {properties.map((property) => (
            <div
              key={property._id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedProperty?._id === property._id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => onPropertySelect(property)}
            >
              <div className="flex items-center space-x-4">
                {property.photos && property.photos[0] && (
                  <img
                    src={`${API_BASE_URL.replace('/api', '')}/${property.photos[0]}`}
                    alt={property.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{property.title || 'Propriété sans titre'}</h3>
                  <p className="text-sm text-gray-600">
                    {property.localisation?.city}, {property.localisation?.address}
                  </p>
                  <p className="text-sm text-gray-500">
                    {property.info?.guests} invités • {property.info?.bedrooms} chambres
                  </p>
                </div>
                {selectedProperty?._id === property._id && (
                  <span className="text-green-600 text-xl">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!selectedProperty}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
        >
          Suivant
          <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
};

// Step 2: Package Type Selection
const PackageTypeSelection = ({ selectedTypes, onTypeToggle, onNext, onPrev }) => {
  const packageTypes = [
    { key: 'services', label: 'Services', icon: '🛎️', description: 'Conciergerie, ménage, etc.' },
    { key: 'activities', label: 'Activités', icon: '🎯', description: 'Excursions, sports, loisirs' },
    { key: 'restaurants', label: 'Restaurants', icon: '🍽️', description: 'Restaurants, cafés, bars' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-green-600 mb-4 flex items-center justify-center text-3xl">
          📦
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Type de package</h2>
        <p className="text-gray-600">Choisissez au moins un type de service à inclure</p>
      </div>

      <div className="grid gap-4">
        {packageTypes.map((type) => (
          <div
            key={type.key}
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
              selectedTypes.includes(type.key)
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
            onClick={() => onTypeToggle(type.key)}
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{type.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{type.label}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
              {selectedTypes.includes(type.key) && (
                <span className="text-green-600 text-xl">✓</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center"
        >
          <span className="mr-2">←</span>
          Précédent
        </button>
        <button
          onClick={onNext}
          disabled={selectedTypes.length === 0}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
        >
          Suivant
          <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
};

// Step 3: Date Selection
const DateSelection = ({ startDate, endDate, onDateChange, onNext, onPrev }) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-green-600 mb-4 flex items-center justify-center text-3xl">
          📅
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dates du package</h2>
        <p className="text-gray-600">Définissez la période de validité de votre package</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de début
          </label>
          <input
            type="date"
            value={startDate}
            min={today}
            onChange={(e) => onDateChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de fin
          </label>
          <input
            type="date"
            value={endDate}
            min={startDate || today}
            onChange={(e) => onDateChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center"
        >
          <span className="mr-2">←</span>
          Précédent
        </button>
        <button
          onClick={onNext}
          disabled={!startDate || !endDate}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
        >
          Suivant
          <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
};

// Step 4: Package Info
const PackageInfo = ({ name, description, onInfoChange, onNext, onPrev }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-green-600 mb-4 flex items-center justify-center text-3xl">
          📝
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations du package</h2>
        <p className="text-gray-600">Donnez un nom et une description à votre package</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du package *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onInfoChange('name', e.target.value)}
            placeholder="Ex: Package Découverte Marrakech"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => onInfoChange('description', e.target.value)}
            placeholder="Décrivez votre package, ce qu'il inclut, les avantages..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center"
        >
          <span className="mr-2">←</span>
          Précédent
        </button>
        <button
          onClick={onNext}
          disabled={!name.trim() || !description.trim()}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
        >
          Suivant
          <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
};

// Step 5: Items Management
const ItemsManagement = ({ selectedTypes, items, onItemsChange, onNext, onPrev }) => {
  const [activeType, setActiveType] = useState(selectedTypes[0]);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '' });

  const addItem = () => {
    if (!newItem.name || !newItem.price) return;
    
    const item = {
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price)
    };
    
    const updatedItems = { ...items };
    if (!updatedItems[activeType]) updatedItems[activeType] = [];
    updatedItems[activeType].push(item);
    
    onItemsChange(updatedItems);
    setNewItem({ name: '', description: '', price: '' });
  };

  const removeItem = (type, index) => {
    const updatedItems = { ...items };
    updatedItems[type].splice(index, 1);
    onItemsChange(updatedItems);
  };

  const hasItems = selectedTypes.some(type => items[type]?.length > 0);
  
  const typeLabels = {
    services: 'Services',
    activities: 'Activités', 
    restaurants: 'Restaurants'
  };

  const typeIcons = {
    services: '🛎️',
    activities: '🎯',
    restaurants: '🍽️'
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-green-600 mb-4 flex items-center justify-center text-3xl">
          📋
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ajouter des éléments</h2>
        <p className="text-gray-600">Ajoutez au moins un élément à votre package</p>
      </div>

      {/* Type Tabs */}
      <div className="flex border-b border-gray-200">
        {selectedTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4 py-2 font-medium text-sm border-b-2 flex items-center ${
              activeType === type
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="mr-2">{typeIcons[type]}</span>
            {typeLabels[type]} ({items[type]?.length || 0})
          </button>
        ))}
      </div>

      {/* Add New Item Form */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-3 flex items-center">
          <span className="mr-2">{typeIcons[activeType]}</span>
          Ajouter un {typeLabels[activeType].toLowerCase()}
        </h3>
        <div className="grid gap-3">
          <input
            type="text"
            placeholder="Nom"
            value={newItem.name}
            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Description (optionnel)"
            value={newItem.description}
            onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Prix (MAD)"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={addItem}
              disabled={!newItem.name || !newItem.price}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {(items[activeType] || []).map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium">{item.name}</h4>
              {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
              <p className="text-sm font-medium text-green-600">{item.price} MAD</p>
            </div>
            <button
              onClick={() => removeItem(activeType, index)}
              className="text-red-500 hover:text-red-700 px-2 py-1"
            >
              ✕
            </button>
          </div>
        ))}
        {(!items[activeType] || items[activeType].length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun {typeLabels[activeType].toLowerCase()} ajouté</p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center"
        >
          <span className="mr-2">←</span>
          Précédent
        </button>
        <button
          onClick={onNext}
          disabled={!hasItems}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
        >
          Suivant
          <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
};

// Step 6: Final Review and Publish
const FinalReview = ({ packageData, onPublish, onSaveDraft, onPrev, isSubmitting }) => {
  const totalItems = (packageData.items?.services?.length || 0) + 
                    (packageData.items?.activities?.length || 0) + 
                    (packageData.items?.restaurants?.length || 0);

  const getTypeIcon = (type) => {
    const icons = { services: '🛎️', activities: '🎯', restaurants: '🍽️' };
    return icons[type] || '📋';
  };

  const getTypeLabel = (type) => {
    const labels = { services: 'Services', activities: 'Activités', restaurants: 'Restaurants' };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-green-600 mb-4 flex items-center justify-center text-3xl">
          🚀
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Finaliser le package</h2>
        <p className="text-gray-600">Vérifiez les informations et publiez votre package</p>
      </div>

      {/* Package Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <span className="mr-2">📋</span>
          Résumé du package
        </h3>
        
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600 block mb-1">🏠 Propriété:</span>
            <p className="font-medium">{packageData.selectedProperty?.title}</p>
            <p className="text-sm text-gray-600">
              {packageData.selectedProperty?.localisation?.city}
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600 block mb-1">📦 Nom du package:</span>
            <p className="font-medium">{packageData.name}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600 block mb-1">📝 Description:</span>
            <p className="text-gray-700">{packageData.description}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 block mb-1">📅 Date de début:</span>
              <p className="font-medium">{new Date(packageData.startDate).toLocaleDateString('fr-FR')}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 block mb-1">📅 Date de fin:</span>
              <p className="font-medium">{new Date(packageData.endDate).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          
          {/* Items Summary */}
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-sm text-green-700 font-medium block mb-2">
              📊 Éléments du package ({totalItems} au total)
            </span>
            <div className="space-y-2">
              {packageData.selectedTypes.map(type => {
                const items = packageData.items[type] || [];
                if (items.length === 0) return null;
                
                return (
                  <div key={type} className="flex items-center text-sm">
                    <span className="mr-2">{getTypeIcon(type)}</span>
                    <span className="font-medium">{getTypeLabel(type)}:</span>
                    <span className="ml-2 text-gray-700">
                      {items.length} élément{items.length > 1 ? 's' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          disabled={isSubmitting}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center"
        >
          <span className="mr-2">←</span>
          Précédent
        </button>
        
        <div className="space-x-3">
          <button
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            {isSubmitting ? '⏳ Sauvegarde...' : '💾 Sauvegarder en brouillon'}
          </button>
          <button
            onClick={onPublish}
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? '⏳ Publication...' : '🚀 Publier'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const PackageCreationFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [packageId, setPackageId] = useState(null);
  
  // Form data
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState({ services: [], activities: [], restaurants: [] });

  const totalSteps = 6;

// Fetch cohosted properties
useEffect(() => {
    const fetchProperties = async () => {
        // Debug token
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        console.log('Token found:', !!token);
        
        try {
          const response = await apiCall('/partner/my-properties');
          console.log('API response:', response);
          setProperties(response.properties || []);
        } catch (error) {
          console.error('Error fetching properties:', error);
          console.error('Error details:', error.message);
          alert('Erreur lors du chargement des propriétés');
        } finally {
          setIsLoading(false);
        }
      };

    fetchProperties();
  }, []);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleDateChange = (field, value) => {
    if (field === 'startDate') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const handleInfoChange = (field, value) => {
    if (field === 'name') {
      setName(value);
    } else {
      setDescription(value);
    }
  };

  const createOrUpdatePackage = async (publishStatus = 'draft') => {
    setIsSubmitting(true);
    
    try {
      const packageData = {
        property: selectedProperty._id,
        name,
        description,
        startDate,
        endDate,
        ...items
      };

      let response;
      if (packageId) {
        // Update existing package
        response = await apiCall(`/packages/${packageId}`, {
          method: 'PATCH',
          body: JSON.stringify(packageData)
        });
      } else {
        // Create new package
        response = await apiCall('/packages', {
          method: 'POST',
          body: JSON.stringify(packageData)
        });
        setPackageId(response.package._id);
      }

      if (publishStatus === 'published') {
        await apiCall(`/packages/${response.package._id}/publish`, {
          method: 'PATCH'
        });
      }

      alert(publishStatus === 'published' ? '✅ Package publié avec succès!' : '💾 Package sauvegardé en brouillon!');
      
      // Reset form
      setCurrentStep(1);
      setSelectedProperty(null);
      setSelectedTypes([]);
      setStartDate('');
      setEndDate('');
      setName('');
      setDescription('');
      setItems({ services: [], activities: [], restaurants: [] });
      setPackageId(null);
      
    } catch (error) {
      console.error('Error saving package:', error);
      alert('❌ Erreur lors de la sauvegarde du package');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = () => createOrUpdatePackage('published');
  const handleSaveDraft = () => createOrUpdatePackage('draft');

  const steps = [
    { number: 1, title: 'Propriété', icon: '🏠' },
    { number: 2, title: 'Type', icon: '📦' },
    { number: 3, title: 'Dates', icon: '📅' },
    { number: 4, title: 'Informations', icon: '📝' },
    { number: 5, title: 'Éléments', icon: '📋' },
    { number: 6, title: 'Publication', icon: '🚀' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📦 Créer un nouveau package
          </h1>
          <p className="text-gray-600">
            Créez un package d'expériences pour vos clients
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm ${
                  currentStep >= step.number ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.number ? (
                    <span>✓</span>
                  ) : (
                    <span>{step.icon}</span>
                  )}
                </div>
                <div className="ml-2 text-xs font-medium text-gray-600">
                  {step.title}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-3 ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-500">
            Étape {currentStep} sur {totalSteps}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentStep === 1 && (
            <PropertySelection
              selectedProperty={selectedProperty}
              onPropertySelect={setSelectedProperty}
              onNext={nextStep}
              isLoading={isLoading}
              properties={properties}
            />
          )}

          {currentStep === 2 && (
            <PackageTypeSelection
              selectedTypes={selectedTypes}
              onTypeToggle={toggleType}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}

          {currentStep === 3 && (
            <DateSelection
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}

          {currentStep === 4 && (
            <PackageInfo
              name={name}
              description={description}
              onInfoChange={handleInfoChange}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}

          {currentStep === 5 && (
            <ItemsManagement
              selectedTypes={selectedTypes}
              items={items}
              onItemsChange={setItems}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}

          {currentStep === 6 && (
            <FinalReview
              packageData={{
                selectedProperty,
                selectedTypes,
                startDate,
                endDate,
                name,
                description,
                items
              }}
              onPublish={handlePublish}
              onSaveDraft={handleSaveDraft}
              onPrev={prevStep}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>💡 Vous pouvez sauvegarder votre progression à tout moment</p>
        </div>
      </div>
    </div>
  );
};

export default PackageCreationFlow;