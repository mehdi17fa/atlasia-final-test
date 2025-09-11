import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const CreatePackageForm = ({ onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // START at 0 -> package type selection screen
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data state (added packageType)
  const [formData, setFormData] = useState({
    packageType: null, // 'property' | 'individual' (null until chosen)
    property: '',
    restaurants: [],
    activities: [],
    services: [],
    startDate: '',
    endDate: '',
    name: '',
    description: '',
    totalPrice: ''
  });

  // Properties that partner can cohost
  const [availableProperties, setAvailableProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // Load partner's properties on mount (still happening even if user chooses individual)
  useEffect(() => {
    fetchPartnerProperties();
  }, []);

  const fetchPartnerProperties = async () => {
    try {
      setLoadingProperties(true);
      console.log('🔍 Fetching properties with token:', token ? 'EXISTS' : 'MISSING');
      const response = await fetch(`${API_BASE}/api/partner/my-properties`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableProperties(data.properties || []);
      } else {
        const errText = await response.text();
        console.error('Failed to load properties', response.status, errText);
        setAvailableProperties([]);
      }
    } catch (err) {
      console.error('Fetch error', err);
      setAvailableProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  // Navigation helpers
  const handleNext = () => {
    if (currentStep < 6) setCurrentStep((s) => s + 1);
  };

  const handleStepClick = (stepNumber) => {
    // avoid jumping to step 1 if user hasn't chosen type yet
    if (currentStep === 0) return;
    if (stepNumber <= currentStep) setCurrentStep(stepNumber);
  };

  const handleInputChange = (field, value) => {
    // if switching to individual, clear property selection
    if (field === 'packageType' && value === 'individual') {
      setFormData((prev) => ({ ...prev, packageType: value, property: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    setError('');
  };

  // Items management
  const addItem = (category, item) => {
    if (!item.name || item.price === '' || item.price === null) return;
    setFormData((prev) => ({
      ...prev,
      [category]: [...prev[category], { ...item, price: parseFloat(item.price) }]
    }));
  };

  const removeItem = (category, index) => {
    setFormData((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const editItem = (category, index, updatedItem) => {
    setFormData((prev) => ({
      ...prev,
      [category]: prev[category].map((it, i) => (i === index ? { ...updatedItem, price: parseFloat(updatedItem.price) } : it))
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        // If user selected individual type, step1 (property) is not required
        return formData.packageType === 'individual' ? true : !!formData.property;
      case 2:
        return (formData.restaurants.length > 0) || (formData.activities.length > 0) || (formData.services.length > 0);
      case 3:
        return formData.startDate && formData.endDate && (new Date(formData.startDate) <= new Date(formData.endDate));
      case 4:
        return (formData.name || '').trim() !== '' && (formData.description || '').trim() !== '';
      case 5:
        return formData.totalPrice && parseFloat(formData.totalPrice) > 0;
      default:
        return true;
    }
  };

  // Save draft
  const handleSaveDraft = async () => {
    setIsLoading(true);
    setError('');
    try {
      const payload = { ...formData };
      if (payload.totalPrice) payload.totalPrice = parseFloat(payload.totalPrice);

      const response = await fetch(`${API_BASE}/api/packages`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        if (onSuccess) onSuccess(data);
        navigate('/partner-welcome');
      } else {
        const t = await response.text();
        setError(t.substring(0, 200) || 'Failed to save draft');
      }
    } catch (err) {
      console.error(err);
      setError('Error saving draft');
    } finally {
      setIsLoading(false);
    }
  };

  // Publish flow
  const handlePublish = async () => {
    // validate all steps (1..5)
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4) || !validateStep(5)) {
      setError('Please complete all required steps before publishing');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const payload = { ...formData };
      if (payload.totalPrice) payload.totalPrice = parseFloat(payload.totalPrice);

      const createResp = await fetch(`${API_BASE}/api/packages`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!createResp.ok) {
        const t = await createResp.text();
        setError(t.substring(0, 200) || 'Failed to create package');
        setIsLoading(false);
        return;
      }

      const createData = await createResp.json();
      const pkgId = createData.package?._id;

      if (!pkgId) {
        setError('Package created but could not retrieve id');
        setIsLoading(false);
        return;
      }

      const publishResp = await fetch(`${API_BASE}/api/packages/${pkgId}/publish`, {
        method: 'PATCH',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (!publishResp.ok) {
        const t = await publishResp.text();
        setError(t.substring(0, 200) || 'Failed to publish package');
        setIsLoading(false);
        return;
      }

      const publishData = await publishResp.json();
      if (onSuccess) onSuccess(publishData);
      navigate('/partner-welcome');
    } catch (err) {
      console.error(err);
      setError('Error publishing package');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    'Choose Property',
    'Select Items',
    'Set Dates',
    'Basic Info',
    'Set Price',
    'Review & Publish'
  ];

  // ---------- NEW: Step 0 - Package Type Selection UI ----------
  const PackageTypeSelection = () => {
    const choose = (type) => {
      handleInputChange('packageType', type);
      // If property type -> go to step 1 to select property
      // If individual -> skip property step and go to items (step 2)
      if (type === 'property') {
        setCurrentStep(1);
      } else {
        setCurrentStep(2);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Créer un package</h2>
          <p className="text-gray-600 mb-8">Choisissez le type de package à créer :</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => choose('individual')}
              className="py-6 px-4 rounded-lg border border-gray-200 hover:shadow-md hover:bg-gray-50 transition flex flex-col items-start text-left"
            >
              <div className="text-lg font-semibold">Package individuel</div>
              <div className="text-sm text-gray-600 mt-2">
                Créez un package d'expériences qui n'est pas lié à une propriété (ex. city tour, food experience).
              </div>
            </button>

            <button
              onClick={() => choose('property')}
              className="py-6 px-4 rounded-lg border border-gray-200 hover:shadow-md hover:bg-gray-50 transition flex flex-col items-start text-left bg-white"
            >
              <div className="text-lg font-semibold">Package lié à une propriété</div>
              <div className="text-sm text-gray-600 mt-2">
                Créez un package dédié à une propriété que vous co-hébergez (ex. welcome bundle for guests).
              </div>
            </button>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                if (onCancel) onCancel();
                else navigate(-1);
              }}
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  };

  // If we are at step 0 render only selection screen
  if (currentStep === 0) {
    return <PackageTypeSelection />;
  }

  // ---------- Rest of the original form UI (starts from step 1) ----------
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleStepClick(idx + 1)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                idx + 1 <= currentStep
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-200 text-gray-600 cursor-not-allowed'
              }`}>
                {idx + 1}
              </div>
              <span className="text-xs mt-2 text-gray-600">{s}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(Math.min(currentStep, steps.length) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-96">
        {/* Step 1: Choose Property (only relevant if packageType === 'property') */}
        {currentStep === 1 && (
          <div>
            {/* Back arrow to go back to type selection */}
            <div className="mb-4">
              <button
                onClick={() => {
                  // Reset selection and go back to step 0
                  setFormData((prev) => ({ ...prev, packageType: null, property: '' }));
                  setCurrentStep(0);
                }}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <span className="mr-2 text-lg">←</span>
                <span>Retour</span>
              </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choisissez une propriété</h2>

            {loadingProperties ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading your properties...</p>
              </div>
            ) : (
              <>
                {formData.packageType === 'property' && availableProperties.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">You don't have any properties to create packages for.</p>
                    <p className="text-sm text-gray-500 mt-2">You need to be accepted as a co-host first.</p>
                  </div>
                ) : formData.packageType === 'property' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableProperties.map((property) => (
                      <div
                        key={property._id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          formData.property === property._id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                        onClick={() => handleInputChange('property', property._id)}
                      >
                        {property.photos && property.photos.length > 0 && (
                          <img
                            src={property.photos[0]}
                            alt={property.title}
                            className="w-full h-32 object-cover rounded-md mb-3"
                          />
                        )}
                        <h3 className="font-semibold text-gray-900">{property.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {property.localisation?.city || 'Location not specified'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      You're creating an <strong>Individual Package</strong> — no property is required.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Proceed to add items and details in the next steps.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 2: Select Items */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Items</h2>
            <p className="text-gray-600 mb-6">Add restaurants, activities, or services to your package (at least one required)</p>

            <div className="space-y-8">
              <ItemSection
                title="Restaurants"
                category="restaurants"
                items={formData.restaurants}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                onEditItem={editItem}
              />

              <ItemSection
                title="Activities"
                category="activities"
                items={formData.activities}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                onEditItem={editItem}
              />

              <ItemSection
                title="Services"
                category="services"
                items={formData.services}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                onEditItem={editItem}
              />
            </div>
          </div>
        )}

        {/* Step 3: Set Dates */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Set Package Dates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Basic Info */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Package Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter package name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows="4"
                  placeholder="Describe your package..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Set Price */}
        {currentStep === 5 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Set Package Price</h2>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Price (MAD)</label>
              <input
                type="number"
                value={formData.totalPrice}
                onChange={(e) => handleInputChange('totalPrice', e.target.value)}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Step 6: Review */}
        {currentStep === 6 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Publish</h2>
            <PackagePreview formData={formData} availableProperties={availableProperties} />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <div className="flex space-x-2">
          {currentStep > 1 && (
            <>
              <button
                onClick={() => setCurrentStep(1)}
                className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                First
              </button>
              <button
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Back
              </button>
            </>
          )}
        </div>

        <div className="flex space-x-3">
          {currentStep < 6 ? (
            <>
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 text-green-600 bg-green-100 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={() => setCurrentStep((s) => {
                  // If currently at step 1 and user selected individual, skip to step 2
                  if (s === 1 && formData.packageType === 'individual') return 2;
                  return Math.min(6, s + 1);
                })}
                className={`px-4 py-2 text-white rounded-md transition-colors ${
                  validateStep(currentStep)
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                disabled={!validateStep(currentStep) || isLoading}
              >
                Next
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 text-green-600 bg-green-100 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                onClick={handlePublish}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Publishing...' : 'Publish Package'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Item Section Component with inline editing (unchanged)
const ItemSection = ({ title, category, items, onAddItem, onRemoveItem, onEditItem }) => {
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', thumbnail: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingItem, setEditingItem] = useState({ name: '', description: '', price: '', thumbnail: '' });

  const handleAdd = () => {
    onAddItem(category, newItem);
    setNewItem({ name: '', description: '', price: '', thumbnail: '' });
    setShowAddForm(false);
  };

  const startEditing = (index, item) => {
    setEditingIndex(index);
    setEditingItem({ ...item });
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingItem({ name: '', description: '', price: '', thumbnail: '' });
  };

  const saveEdit = () => {
    onEditItem(category, editingIndex, editingItem);
    setEditingIndex(null);
    setEditingItem({ name: '', description: '', price: '', thumbnail: '' });
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-green-500 hover:text-green-600 font-medium"
        >
          + Add {title.slice(0, -1)}
        </button>
      </div>

      {/* Existing Items */}
      {items.length > 0 && (
        <div className="space-y-3 mb-4">
          {items.map((item, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-md">
              {editingIndex === index ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <textarea
                    placeholder="Description"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="2"
                  />
                  <input
                    type="number"
                    placeholder="Price (MAD)"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    step="0.01"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm disabled:opacity-50"
                      disabled={!editingItem.name || !editingItem.price}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                    <p className="text-sm font-medium text-green-600 mt-1">{item.price} MAD</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => startEditing(index, item)}
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onRemoveItem(category, index)}
                      className="text-red-500 hover:text-red-600 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="space-y-3 border-t pt-4">
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            placeholder="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="2"
          />
          <input
            type="number"
            placeholder="Price (MAD)"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            min="0"
            step="0.01"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
              disabled={!newItem.name || !newItem.price}
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Package Preview Component
const PackagePreview = ({ formData, availableProperties }) => {
  const selectedProperty = availableProperties.find((p) => p._id === formData.property);
  const totalItems = (formData.restaurants?.length || 0) + (formData.activities?.length || 0) + (formData.services?.length || 0);

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Package Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Basic Information</h4>
            <p><strong>Type:</strong> {formData.packageType === 'property' ? `Property – ${selectedProperty?.title || 'Not selected'}` : 'Individual'}</p>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Description:</strong> {formData.description}</p>
            <p><strong>Price:</strong> {formData.totalPrice} MAD</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Property & Dates</h4>
            <p><strong>Property:</strong> {selectedProperty?.title || '—'}</p>
            <p><strong>Start Date:</strong> {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : '—'}</p>
            <p><strong>End Date:</strong> {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : '—'}</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-2">Included Items ({totalItems} total)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formData.restaurants.length > 0 && (
              <div>
                <h5 className="font-medium text-green-600">Restaurants ({formData.restaurants.length})</h5>
                <ul className="text-sm text-gray-600 mt-1">
                  {formData.restaurants.map((item, index) => <li key={index}>{item.name} - {item.price} MAD</li>)}
                </ul>
              </div>
            )}

            {formData.activities.length > 0 && (
              <div>
                <h5 className="font-medium text-green-600">Activities ({formData.activities.length})</h5>
                <ul className="text-sm text-gray-600 mt-1">
                  {formData.activities.map((item, index) => <li key={index}>{item.name} - {item.price} MAD</li>)}
                </ul>
              </div>
            )}

            {formData.services.length > 0 && (
              <div>
                <h5 className="font-medium text-green-600">Services ({formData.services.length})</h5>
                <ul className="text-sm text-gray-600 mt-1">
                  {formData.services.map((item, index) => <li key={index}>{item.name} - {item.price} MAD</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePackageForm;
