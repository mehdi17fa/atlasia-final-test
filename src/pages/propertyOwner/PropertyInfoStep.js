import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePropertyCreation } from "../../context/PropertyCreationContext";
import NavigationButton from "../../components/shared/NavigationButtons";

// Import icons for each info type
import { ReactComponent as GuestsIcon } from "../../assets/icons/Properties/guests.svg";
import { ReactComponent as RoomsIcon } from "../../assets/icons/Properties/rooms.svg";
import { ReactComponent as BedsIcon } from "../../assets/icons/Properties/beds.svg";
import { ReactComponent as BathsIcon } from "../../assets/icons/Properties/baths.svg";

const infoTypes = [
  {
    label: "Invités",
    icon: GuestsIcon,
    key: "guests",
    min: 1,
  },
  {
    label: "Chambres",
    icon: RoomsIcon,
    key: "rooms",
    min: 1,
  },
  {
    label: "Lits",
    icon: BedsIcon,
    key: "beds",
    min: 1,
  },
  {
    label: "Salles de bain",
    icon: BathsIcon,
    key: "baths",
    min: 1,
  },
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

const currentStepKey = "info";

export default function PropertyInfoStep() {
  const navigate = useNavigate();
  const { propertyData, setPropertyData } = usePropertyCreation();

  const info = propertyData.info;

  const handleChange = (key, delta, min) => {
    setPropertyData((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        [key]: Math.max(min, prev.info[key] + delta),
      },
    }));
  };

  const stepsCompleted = propertyData.stepsCompleted;

  const currentStepIndex = stepOrder.findIndex(
    (step) => step.key === currentStepKey
  );
  const stepsAfter = stepOrder.slice(currentStepIndex + 1);

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      {/* Progress bar */}
      <div className="w-full max-w-md mx-auto px-4 pt-4">
        <div className="flex items-center justify-center py-4 bg-white shadow-sm">
            <span className="text-2xl font-bold text-green-700">ATLASIA</span>
        </div>
        {stepOrder.slice(0, currentStepIndex).map((step) =>
          stepsCompleted[step.key] ? (
            <NavigationButton
              key={step.key}
              left={step.label}
              right="✓"
              to={step.to}
              active={false}
            />
          ) : null
        )}
        {/* Do NOT render current step button */}
      </div>
      {/* Step 3 */}
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 pt-4">
          <h2 className="text-green-800 text-lg font-bold text-center mb-1">
            Etape 3:
          </h2>
          <h3 className="text-black text-xl font-bold text-center mb-6">
            Informations
          </h3>
          <div className="flex flex-col gap-5 mb-8">
            {infoTypes.map(({ label, icon: Icon, key, min }) => (
              <div key={key} className="flex items-center gap-3">
                <Icon className="w-8 h-8 text-green-800" />
                <span className="flex-1 font-semibold text-lg text-green-800">
                  {label}
                </span>
                <button
                  className="w-8 h-8 rounded-full bg-green-800 text-white text-xl flex items-center justify-center"
                  onClick={() => handleChange(key, -1, min)}
                  disabled={info[key] <= min}
                  aria-label={`Moins de ${label}`}
                >
                  –
                </button>
                <span className="w-6 text-center font-bold text-lg">
                  {info[key]}
                </span>
                <button
                  className="w-8 h-8 rounded-full bg-green-800 text-white text-xl flex items-center justify-center"
                  onClick={() => handleChange(key, 1, min)}
                  aria-label={`Plus de ${label}`}
                >
                  +
                </button>
              </div>
            ))}
          </div>
          <button
            className="w-full bg-green-800 text-white rounded-full py-3 font-semibold text-lg hover:bg-green-900 transition"
            onClick={() => {
              setPropertyData((prev) => ({
                ...prev,
                stepsCompleted: {
                  ...prev.stepsCompleted,
                  info: true, // Mark this step as completed
                },
              }));
              navigate("/property-equip");
            }}
          >
            Suivant
          </button>
        </div>
        {/* Completed steps after current, below Suivant */}
        <div className="mt-4 flex flex-col gap-2">
          {stepsAfter.map((step) =>
            stepsCompleted[step.key] ? (
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