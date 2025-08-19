import React, { useRef } from "react";
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

const currentStepKey = "photos";
const currentStepIndex = stepOrder.findIndex((step) => step.key === currentStepKey);
const stepsAfter = stepOrder.slice(currentStepIndex + 1);

export default function PropertyPhotosStep() {
  const navigate = useNavigate();
  const { propertyData, setPropertyData } = usePropertyCreation();
  const fileInputRef = useRef();

  // Ensure photos is always an array
  const photos = propertyData.photos || [];

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setPropertyData((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), ...files].slice(0, 10), // Limit to 10 photos if you want
    }));
  };

  const handleRemovePhoto = (idx) => {
    setPropertyData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
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
      {/* Step 5 */}
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 pt-4">
          <h2 className="text-green-800 text-lg font-bold text-center mb-1">Etape 5:</h2>
          <h3 className="text-black text-xl font-bold text-center mb-6">Choisissez au moins 4 photos</h3>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {photos.length === 0 ? (
              <div className="col-span-2 flex justify-center">
                <button
                  type="button"
                  className="border-2 border-dashed border-[#a084e8] rounded-lg w-64 h-40 flex flex-col items-center justify-center text-[#a084e8] hover:bg-[#f5f5f5] transition"
                  onClick={() => fileInputRef.current.click()}
                >
                  <span className="text-4xl mb-2">+</span>
                  <span className="text-base font-semibold">Ajouter une photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFilesChange}
                  />
                </button>
              </div>
            ) : (
              <>
                {photos.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative border-2 border-dashed rounded-lg w-92 h-32 p-2 flex flex-col items-center justify-center"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`photo-${idx + 1}`}
                      className="w-98 h-28 object-cover rounded"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => handleRemovePhoto(idx)}
                      aria-label="Supprimer la photo"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {photos.length < 10 && (
                  <button
                    type="button"
                    className={
                      photos.length % 2 === 0
                        ? "col-span-2 border-2 border-dashed border-[#a084e8] rounded-lg w-94 h-32 flex flex-col items-center justify-center text-[#a084e8] hover:bg-[#f5f5f5] transition"
                        : "border-2 border-dashed border-[#a084e8] rounded-lg w-42 h-32 flex flex-col items-center justify-center text-[#a084e8] hover:bg-[#f5f5f5] transition"
                    }
                    onClick={() => fileInputRef.current.click()}
                  >
                    <span className={photos.length % 2 === 0 ? "text-4xl mb-2" : "text-3xl mb-1"}>+</span>
                    <span className={photos.length % 2 === 0 ? "text-base font-semibold" : "text-xs font-semibold"}>
                      Ajouter
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFilesChange}
                    />
                  </button>
                )}
              </>
            )}
          </div>
          <button
            className="w-full bg-green-800 text-white rounded-full py-3 font-semibold text-lg hover:bg-green-900 transition"
            disabled={photos.length < 4}
            onClick={() => {
              setPropertyData((prev) => ({
                ...prev,
                stepsCompleted: {
                  ...prev.stepsCompleted,
                  photos: true, // Mark this step as completed
                },
              }));
              navigate("/property-title");
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