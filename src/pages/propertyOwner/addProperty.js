import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePropertyCreation } from "../../context/PropertyCreationContext";
import NavigationButton from "../../components/shared/NavigationButtons";

const cities = [
  "Ifrane",
  "Fès",
  "Marrakech",
  "Casablanca",
  "Rabat",
  "Agadir",
  "Tanger",
];

const stepOrder = [
  { key: "localisation", label: "Localisation", to: "/add-property" },
  { key: "propertyType", label: "Type de propriété", to: "/property-type" },
  { key: "info", label: "Informations", to: "/property-infos" },
  { key: "equipments", label: "Equipements", to: "/property-equip" },
  { key: "photos", label: "Photos", to: "/property-photos" },
  { key: "title", label: "Titre", to: "/property-title" },
  { key: "description", label: "Description", to: "/property-description" },
  { key: "price", label: "Prix", to: "/property-price" },
  { key: "documents", label: "Documents légaux", to: "/property-documents" },
];

export default function AddProperty() {
  const { propertyData, setPropertyData } = usePropertyCreation();
  const { city, address, postalCode } = propertyData.localisation || {};
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [animateError, setAnimateError] = useState(false);
  const buttonRef = useRef(null);

  const handleChange = (field, value) => {
    setPropertyData((prev) => ({
      ...prev,
      localisation: {
        ...(prev.localisation || { city: "", address: "", postalCode: "" }),
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
    setPropertyData((prev) => ({
      ...prev,
      stepsCompleted: {
        ...prev.stepsCompleted,
        localisation: true, // Mark this step as completed
      },
    }));
    navigate("/property-type");
  };

  const currentStepKey = "localisation";
  const currentStepIndex = stepOrder.findIndex(
    (step) => step.key === currentStepKey
  );
  const stepsAfter = stepOrder.slice(currentStepIndex + 1);

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      {/* Progress bar */}
      <div className="w-full max-w-md mx-auto mt-6 mb-2 px-4">
        <div className="flex items-center justify-center py-4 bg-white shadow-sm">
            <span className="text-2xl font-bold text-green-700">ATLASIA</span>
            <button
                    onClick={() => navigate("/welcome-owner")}

                    className="absolute left-0 ml-4 text-2xl text-black">&lt;</button>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 pt-4">
          <div className="mb-4">
            {stepOrder.slice(0, currentStepIndex).map((step) =>
              propertyData.stepsCompleted[step.key] ? (
                <NavigationButton
                  key={step.key}
                  left={step.label}
                  right="✓"
                  to={step.to}
                  active={false}
                />
              ) : null
            )}
            {/* Remove current step button here */}
          </div>
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
        {/* Completed steps after current, below Suivant */}
        <div className="mt-4 flex flex-col gap-2">
          {stepsAfter.map((step) =>
            propertyData.stepsCompleted[step.key] ? (
              <NavigationButton
                key={step.key}
                left={step.label}
                right="✓"
                to={step.to}
                active={false}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
