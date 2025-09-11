// src/pages/PacksPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArchiveBoxIcon,
  HomeIcon,
  CalendarDaysIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const API_BASE_URL = "http://localhost:4000/api";

const LoadingSpinner = () => (
  <div className="flex justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
  </div>
);

const PackageCard = ({ pkg }) => {
  const navigate = useNavigate();

  const getItemsText = () => {
    const items = [];
    if (pkg.services?.length) items.push(`${pkg.services.length} service${pkg.services.length > 1 ? 's' : ''}`);
    if (pkg.activities?.length) items.push(`${pkg.activities.length} activité${pkg.activities.length > 1 ? 's' : ''}`);
    if (pkg.restaurants?.length) items.push(`${pkg.restaurants.length} restaurant${pkg.restaurants.length > 1 ? 's' : ''}`);
    return items.join(", ") || "Aucun élément";
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{pkg.name || "Package sans titre"}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{pkg.description || "Aucune description"}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          pkg.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}>
          {pkg.status === "published" ? "Publié" : "Brouillon"}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <UserIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
          <span>{pkg.partner?.name || pkg.partner?.fullName || "Inconnu"}</span>
        </div>

        {pkg.property && (
          <div className="flex items-center">
            <HomeIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
            <span>{pkg.property.title || "Propriété non définie"}</span>
          </div>
        )}

        {pkg.startDate && pkg.endDate && (
          <div className="flex items-center">
            <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
            <span>
              {new Date(pkg.startDate).toLocaleDateString("fr-FR")} - {new Date(pkg.endDate).toLocaleDateString("fr-FR")}
            </span>
          </div>
        )}

        <div className="flex items-center">
          <ArchiveBoxIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
          <span>{getItemsText()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">Créé le {new Date(pkg.createdAt).toLocaleDateString("fr-FR")}</div>
        <button
          onClick={() => navigate(`/package/${pkg._id}`)}
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          Voir détails
        </button>
      </div>
    </div>
  );
};

export default function PacksPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/packages/published`);
      if (!res.ok) throw new Error("Erreur lors du chargement des packages");

      const data = await res.json();
      setPackages(data.packages || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Packs et services</h1>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
      ) : packages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Aucun package publié pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}
