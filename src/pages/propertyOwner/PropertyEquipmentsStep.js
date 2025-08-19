import React from "react";
import { useNavigate } from "react-router-dom";
import { usePropertyCreation } from "../../context/PropertyCreationContext";
import NavigationButton from "../../components/shared/NavigationButtons";

// Import both black and green icons for each equipment
import { ReactComponent as WifiBlack } from "../../assets/icons/PropertyEquipment/wifiBlack.svg";
import { ReactComponent as WifiGreen } from "../../assets/icons/PropertyEquipment/wifiGreen.svg";
import { ReactComponent as TvBlack } from "../../assets/icons/PropertyEquipment/tvBlack.svg";
import { ReactComponent as TvGreen } from "../../assets/icons/PropertyEquipment/tvGreen.svg";
import { ReactComponent as WasherBlack } from "../../assets/icons/PropertyEquipment/washerBlack.svg";
import { ReactComponent as WasherGreen } from "../../assets/icons/PropertyEquipment/washerGreen.svg";
import { ReactComponent as AcBlack } from "../../assets/icons/PropertyEquipment/acBlack.svg";
import { ReactComponent as AcGreen } from "../../assets/icons/PropertyEquipment/acGreen.svg";
import { ReactComponent as HeaterBlack } from "../../assets/icons/PropertyEquipment/heaterBlack.svg";
import { ReactComponent as HeaterGreen } from "../../assets/icons/PropertyEquipment/heaterGreen.svg";
import { ReactComponent as KitchenBlack } from "../../assets/icons/PropertyEquipment/kitchenBlack.svg";
import { ReactComponent as KitchenGreen } from "../../assets/icons/PropertyEquipment/kitchenGreen.svg";
import { ReactComponent as ParkingBlack } from "../../assets/icons/PropertyEquipment/parkingBlack.svg";
import { ReactComponent as ParkingGreen } from "../../assets/icons/PropertyEquipment/parkingGreen.svg";
import { ReactComponent as PoolBlack } from "../../assets/icons/PropertyEquipment/poolBlack.svg";
import { ReactComponent as PoolGreen } from "../../assets/icons/PropertyEquipment/poolGreen.svg";
import { ReactComponent as PlaygroundBlack } from "../../assets/icons/PropertyEquipment/playgroundBlack.svg";
import { ReactComponent as PlaygroundGreen } from "../../assets/icons/PropertyEquipment/playgroundGreen.svg";

const equipmentsList = [
  { key: "wifi", label: "Wifi", iconBlack: WifiBlack, iconGreen: WifiGreen },
  { key: "tv", label: "Télévision", iconBlack: TvBlack, iconGreen: TvGreen },
  { key: "washer", label: "Lave-linge", iconBlack: WasherBlack, iconGreen: WasherGreen },
  { key: "ac", label: "Climatisation", iconBlack: AcBlack, iconGreen: AcGreen },
  { key: "heater", label: "chauffage", iconBlack: HeaterBlack, iconGreen: HeaterGreen },
  { key: "kitchen", label: "Cuisine", iconBlack: KitchenBlack, iconGreen: KitchenGreen },
  { key: "parking", label: "Parking", iconBlack: ParkingBlack, iconGreen: ParkingGreen },
  { key: "pool", label: "Piscine", iconBlack: PoolBlack, iconGreen: PoolGreen },
  { key: "playground", label: "aire de jeux", iconBlack: PlaygroundBlack, iconGreen: PlaygroundGreen },
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

const currentStepKey = "equipments";
const currentStepIndex = stepOrder.findIndex((step) => step.key === currentStepKey);
const stepsAfter = stepOrder.slice(currentStepIndex + 1);

export default function PropertyEquipmentsStep() {
  const navigate = useNavigate();
  const { propertyData, setPropertyData } = usePropertyCreation();

  const selectedEquipments = propertyData.equipments || [];

  const toggleEquipment = (key) => {
    setPropertyData((prev) => ({
      ...prev,
      equipments: selectedEquipments.includes(key)
        ? selectedEquipments.filter((k) => k !== key)
        : [...selectedEquipments, key],
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
      {/* Step 4 */}
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 pt-4">
          <h2 className="text-green-800 text-lg font-bold text-center mb-1">Etape 4:</h2>
          <h3 className="text-black text-xl font-bold text-center mb-6">Les équipements de votre logement</h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {equipmentsList.map(({ key, label, iconBlack: IconBlack, iconGreen: IconGreen }) => {
              const selected = selectedEquipments.includes(key);
              const Icon = selected ? IconGreen : IconBlack;
              const textColor = selected ? "text-green-800" : "text-[#222]";
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleEquipment(key)}
                  className={`flex flex-col items-center border-2 rounded-xl p-3 transition-all duration-200 ${
                    selected ? "border-green-800 bg-green-50" : "border-green-800 bg-white"
                  }`}
                >
                  <Icon className="w-8 h-8 mb-1 transition-all duration-200" />
                  <span className={`text-sm font-semibold transition-colors duration-200 ${textColor}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            className="w-full bg-green-800 text-white rounded-full py-3 font-semibold text-lg hover:bg-green-900 transition"
            onClick={() => {
              setPropertyData((prev) => ({
                ...prev,
                stepsCompleted: {
                  ...prev.stepsCompleted,
                  equipments: true, // Mark this step as completed
                },
              }));
              navigate("/property-photos");
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