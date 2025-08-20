// src/pages/OwnerDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PhoneIcon } from "@heroicons/react/24/outline";


const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function OwnerDetails() {
  const { ownerId } = useParams();
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/user/${ownerId}`);
        setOwner(res.data.user);
      } catch (err) {
        console.error("Error fetching owner:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOwner();
  }, [ownerId]);

  if (loading) return <p className="text-center mt-20">Chargement...</p>;
  if (!owner) return <p className="text-center mt-20">Hôte introuvable</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Photo + Name */}
      <div className="flex items-center space-x-4">
        <img
          src={owner.profileImage || "/placeholder-profile.jpg"}
          alt={owner.fullName || owner.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-semibold">{owner.fullName || owner.name}</h1>
          <p className="text-sm text-gray-500">{owner.role || "Propriétaire"}</p>
        </div>
      </div>

      {/* Phone */}
      {owner.phone && (
  <div className="border rounded-lg p-4 flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <PhoneIcon className="w-6 h-6 text-green-600" />
      <span className="text-gray-700">{owner.phone}</span>
    </div>
    <a
      href={`tel:${owner.phone}`}
      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
    >
      Appeler
    </a>
  </div>
)}

      {/* Additional info */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold text-lg mb-2">À propos de l'hôte</h2>
        <p className="text-gray-600">{owner.bio || "Aucune description disponible."}</p>
      </div>
    </div>
  );
}
