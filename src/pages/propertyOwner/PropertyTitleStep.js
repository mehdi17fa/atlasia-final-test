import React from "react";
import { useNavigate } from "react-router-dom";
import { usePropertyCreation } from "../../context/PropertyCreationContext";
import NavigationButton from "../../components/shared/NavigationButtons";

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

const currentStepKey = "title";
const currentStepIndex = stepOrder.findIndex(step => step.key === currentStepKey);
const stepsAfter = stepOrder.slice(currentStepIndex + 1);

export default function PropertyTitleStep() {
  const navigate = useNavigate();
  const { propertyData, setPropertyData } = usePropertyCreation();

  const title = propertyData.title || "";

  const handleChange = (e) => {
    setPropertyData((prev) => ({
      ...prev,
      title: e.target.value.slice(0, 25),
    }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      {/* Progress bar */}
      <div className="w-full max-w-md mx-auto px-4 pt-4">
        <div className="flex items-center justify-center py-4 bg-white shadow-sm">
            <span className="text-2xl font-bold text-green-700">ATLASIA</span>
        </div>
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
          {/* Do NOT render current step button */}
        </div>
      </div>
      {/* Step 6 */}
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 pt-4">
          <h2 className="text-green-800 text-lg font-bold text-center mb-1">Etape 6:</h2>
          <h3 className="text-black text-xl font-bold text-center mb-2">Attribuer un titre à votre annonce</h3>
          <p className="text-center text-gray-700 mb-4">Vous pourrez toujours le modifier plus tard!</p>
          <textarea
            className="w-full border-2 border-green-800 rounded-xl px-4 py-3 text-gray-700 focus:outline-none resize-none text-lg mb-2"
            rows={4}
            maxLength={25}
            value={title}
            onChange={handleChange}
            placeholder="Titre de l'annonce"
          />
          <div className="text-xs text-gray-500 mb-4 text-right">{title.length}/25</div>
          <button
            className="w-full bg-green-800 text-white rounded-full py-3 font-semibold text-lg hover:bg-green-900 transition"
            disabled={title.length === 0}
            onClick={() => {
              setPropertyData((prev) => ({
                ...prev,
                stepsCompleted: {
                  ...prev.stepsCompleted,
                  title: true,
                },
              }));
              navigate("/property-description");
            }}
          >
            Suivant
          </button>
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