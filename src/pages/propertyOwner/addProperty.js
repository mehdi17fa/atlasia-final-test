import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePropertyCreation } from "../../context/PropertyCreationContext";

const cities = [
  "Ifrane",
  "Fès",
  "Marrakech",
  "Casablanca",
  "Rabat",
  "Agadir",
  "Tanger",
];

export default function AddProperty() {
  const { propertyData, setPropertyData } = usePropertyCreation();
  const { city, address, postalCode } = propertyData.localisation;
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [animateError, setAnimateError] = useState(false);
  const buttonRef = useRef(null);

  const handleChange = (field, value) => {
    setPropertyData((prev) => ({
      ...prev,
      localisation: {
        ...prev.localisation,
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    if (!city || !address || !postalCode) {
      setShowError(true);
      setAnimateError(true);
      setTimeout(() => setAnimateError(false), 700); // duration matches animation
      return;
    }
    setShowError(false);
    navigate("/property-type");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      {/* Header */}
      <div className="w-full max-w-md mx-auto mt-6 mb-2 px-4">
        <h1 className="text-green-800 text-2xl font-bold text-center mb-2">
          Atlasia
        </h1>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 pt-4">
          <h2 className="text-green-800 text-lg font-bold text-center mb-1">
            Etape 1:
          </h2>
          <h3 className="text-black text-xl font-bold text-center mb-6">
            Localisation
          </h3>

          {/* Ville */}
          <div className="mb-4">
            <label className="block text-green-800 font-semibold mb-1">
              Ville
              <span className="text-red-500"> *</span>
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none"
              value={city}
              onChange={(e) => handleChange("city", e.target.value)}
            >
              <option value="" disabled hidden>
                Choisir la ville
              </option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Adresse */}
          <div className="mb-4">
            <label className="block text-green-800 font-semibold mb-1">
              Adresse
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none"
              placeholder="Entre l’adresse"
              value={address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          {/* Code postal */}
          <div className="mb-8">
            <label className="block text-green-800 font-semibold mb-1">
              Code postal
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none"
              placeholder="Entre le code postal"
              value={postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
            />
          </div>

          {/* Suivant Button */}
          <button
            ref={buttonRef}
            className={`w-full bg-green-800 text-white rounded-full py-3 font-semibold text-lg hover:bg-green-900 transition
              ${animateError ? "animate-shake bg-red-600" : ""}
            `}
            disabled={false}
            onClick={handleNext}
            style={{
              transition: "background 1s",
            }}
          >
            Suivant
          </button>
          {showError && (
            <label className="block text-red-500 text-xs mt-2 font-normal text-center">
              Les champs marqués d'un astérisque (*) sont obligatoires.
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
