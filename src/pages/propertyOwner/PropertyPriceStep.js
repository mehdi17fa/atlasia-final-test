import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePropertyCreation } from "../../context/PropertyCreationContext";
import LocationIcon from "../../assets/icons/Properties/location.svg";
import EditIcon from "../../assets/icons/edit.svg";
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

export default function PropertyPriceStep() {
  const navigate = useNavigate();
  const { propertyData, setPropertyData } = usePropertyCreation();

  const currentStepKey = "price";
  const currentStepIndex = stepOrder.findIndex((step) => step.key === currentStepKey);
  const stepsBefore = stepOrder.slice(0, currentStepIndex);
  const stepsAfter = stepOrder.slice(currentStepIndex + 1);

  const priceWeek = propertyData.priceWeek ?? 0;
  const priceWeekend = propertyData.priceWeekend ?? 0;

  const [editType, setEditType] = useState(null); // "week" or "weekend"

  // Refs for the inputs
  const weekInputRef = useRef(null);
  const weekendInputRef = useRef(null);

  // Auto-select input content when entering edit mode
  useEffect(() => {
    if (editType === "week" && weekInputRef.current) {
      weekInputRef.current.focus();
      weekInputRef.current.select();
    }
    if (editType === "weekend" && weekendInputRef.current) {
      weekendInputRef.current.focus();
      weekendInputRef.current.select();
    }
  }, [editType]);

  const handlePriceChange = (type, value) => {
    // Only allow up to 5 digits
    let val = value.replace(/\D/g, "").slice(0, 5);
    val = Math.max(0, parseInt(val) || 0);
    setPropertyData((prev) => ({
      ...prev,
      priceWeek: type === "week" ? val : prev.priceWeek,
      priceWeekend: type === "weekend" ? val : prev.priceWeekend,
    }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      {/* Completed steps before current */}
      <div className="w-full max-w-md mx-auto px-4 pt-4">
        <div className="flex items-center justify-center py-4 bg-white shadow-sm">
            <span className="text-2xl font-bold text-green-700">ATLASIA</span>
        </div>
        <div className="mb-4">
          {stepsBefore.map((step) =>
            propertyData.stepsCompleted?.[step.key] ? (
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
      {/* Step 8 */}
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 pt-4">
          <h2 className="text-green-800 text-lg font-bold text-center mb-1">Etape 8:</h2>
          <h3 className="text-black text-xl font-bold text-center mb-2">Définir le prix</h3>
          <p className="text-center text-gray-700 mb-4">
            Fixez un tarif de base pour <span className="text-green-800 font-semibold">les jours de semaine</span> et <span className="text-green-800 font-semibold">les week-ends</span>
          </p>
          {/* Weekday price */}
          <div className="flex flex-col items-center mb-6">
            <span className="text-green-800 font-semibold mb-1">Prix jours de semaine</span>
            {editType === "week" ? (
              <input
                ref={weekInputRef}
                type="number"
                min={0}
                max={99999}
                className="text-center text-3xl font-bold border-b-2 border-green-800 outline-none w-40 mb-2"
                value={priceWeek}
                onChange={(e) => handlePriceChange("week", e.target.value)}
                onBlur={() => setEditType(null)}
                autoFocus
              />
            ) : (
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setEditType("week")}
              >
                <span className="text-4xl font-bold"> {priceWeek} MAD </span>
                <img src={EditIcon} alt="Editer" className="w-6 h-6" />
              </div>
            )}
          </div>
          {/* Weekend price */}
          <div className="flex flex-col items-center mb-6">
            <span className="text-green-800 font-semibold mb-1">Prix week-end</span>
            {editType === "weekend" ? (
              <input
                ref={weekendInputRef}
                type="number"
                min={0}
                max={99999}
                className="text-center text-3xl font-bold border-b-2 border-green-800 outline-none w-40 mb-2"
                value={priceWeekend}
                onChange={(e) => handlePriceChange("weekend", e.target.value)}
                onBlur={() => setEditType(null)}
                autoFocus
              />
            ) : (
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setEditType("weekend")}
              >
                <span className="text-4xl font-bold"> {priceWeekend} MAD </span>
                <img src={EditIcon} alt="Editer" className="w-6 h-6" />
              </div>
            )}
          </div>
          <button
            className="w-full border border-green-800 text-green-800 rounded-full py-2 font-semibold text-base flex items-center justify-center gap-2 mb-4"
            onClick={() => alert("Voir les annonces similaires")}
          >
            <img src={LocationIcon} alt="Localisation" className="w-5 h-5" />
            Voir les annonces similaires
          </button>
          <button
            className="w-full bg-green-800 text-white rounded-full py-3 font-semibold text-lg hover:bg-green-900 transition"
            disabled={priceWeek <= 0 || priceWeekend <= 0}
            onClick={() => {
              setPropertyData((prev) => ({
                ...prev,
                stepsCompleted: {
                  ...prev.stepsCompleted,
                  price: true, // Mark this step as completed
                },
              }));
              navigate("/property-documents");
            }}
          >
            Suivant
          </button>
        </div>
        {/* Completed steps after current */}
        <div className="mt-4 flex flex-col gap-2">
          {stepsAfter.map((step) =>
            propertyData.stepsCompleted?.[step.key] ? (
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