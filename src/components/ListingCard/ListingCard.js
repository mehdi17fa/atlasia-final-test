import React, { useState, useContext } from "react";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ReactComponent as BedIcon } from "../../assets/icons/bedroom.svg";
import { ReactComponent as GuestIcon } from "../../assets/icons/guests.svg";
import { ReactComponent as BathIcon } from "../../assets/icons/bathroom.svg";
import { ReactComponent as AreaIcon } from "../../assets/icons/superficie.svg";
import Tag from "../shared/Tag";
import FavoritesContext from "../../context/FavoritesContext";

export default function ListingCard({ data, onCardClick, showHeartButton = true, showDeleteButton = false, onDelete }) {
  const { isFavorited, addFavorite, removeFavorite, loading: contextLoading } = useContext(FavoritesContext);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!data?._id) {
    console.warn("Invalid data._id for ListingCard:", data);
    return null;
  }

  const currentIsFavorited = isFavorited(data._id);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      console.log("Toggling favorite for propertyId:", data._id);
      if (currentIsFavorited) {
        const success = await removeFavorite(data._id);
        if (!success) throw new Error("Failed to remove favorite");
      } else {
        const success = await addFavorite(data._id);
        if (!success) throw new Error("Failed to add favorite");
      }
    } catch (err) {
      console.error("Error toggling favorite for propertyId:", data._id, err.response?.data || err);
      alert(err.response?.data?.message || "Failed to update favorite status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    setDeleteLoading(true);
    try {
      console.log("Deleting favorite for propertyId:", data._id);
      const success = await removeFavorite(data._id);
      if (!success) {
        console.warn("Delete failed but state will update to maintain UI consistency");
      }
      if (onDelete) {
        onDelete(data._id);
      }
    } catch (err) {
      console.error("Error removing favorite for propertyId:", data._id, err.response?.data || err);
      alert(err.response?.data?.message || "Failed to remove favorite");
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(data._id);
    }
  };

  return (
    <>
      <div 
        className="w-[360px] border rounded-xl shadow-md bg-white overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleCardClick}
      >
        <div className="relative">
          <img src={data.image || "/placeholder.jpg"} alt={data.title || "Property"} className="h-60 w-full object-cover" />
          {showHeartButton && (
            <button
              onClick={handleToggleFavorite}
              disabled={isLoading || contextLoading}
              className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors ${
                currentIsFavorited ? "text-red-500" : "text-gray-500"
              } ${isLoading || contextLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading || contextLoading ? (
                <div className="w-7 h-7 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              ) : currentIsFavorited ? (
                <HeartIconSolid className="w-7 h-7" />
              ) : (
                <HeartIconOutline className="w-7 h-7" />
              )}
            </button>
          )}
          {showDeleteButton && (
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors text-gray-500 hover:text-red-500 ${deleteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <TrashIcon className="w-7 h-7" />
            </button>
          )}
          <Tag text={`à partir ${data.price || 0} MAD / nuit`} />
        </div>
        <div className="p-5 space-y-3">
          <div className="flex flex-wrap justify-between text-base text-gray-600">
            <p className="font-semibold text-black">{data.location || "Unknown"}</p>
            {data.typelocation && (
              <p className="text-gray-500">{data.typelocation}</p>
            )}
          </div>
          <h3 className="font-bold text-2xl text-black">{data.title || "Untitled"}</h3>
          <div className="flex flex-wrap gap-4 text-base text-gray-600 items-center">
            <div className="flex items-center gap-1">
              <BedIcon className="w-6 h-6" />
              {data.bedrooms || 0} chambres
            </div>
            <div className="flex items-center gap-1">
              <GuestIcon className="w-6 h-6" />
              {data.guests || 0} invités
            </div>
            <div className="flex items-center gap-1">
              <BathIcon className="w-6 h-6" />
              {data.bathrooms || 0} SDB
            </div>
            <div className="flex items-center gap-1">
              <AreaIcon className="w-6 h-6" />
              {data.area || 0} m²
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <span className="font-medium">{data.title || "this property"}</span> from your favorites?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}