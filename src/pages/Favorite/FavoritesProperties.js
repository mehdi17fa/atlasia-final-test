import React, { useState, useEffect } from "react";
import axios from "axios";
import ListingCardGrid from "../../components/ListingCard/ListingCardGrid";
import SectionTitle from "../../components/shared/SectionTitle";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function FavoritesProperties() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Please log in to view your favorites");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched favorites (full response):", res.data);
        // Normalize favorites to match ListingCardGrid structure
        const normalizedFavorites = res.data.favorites
          .filter((fav) => fav.propertyId?._id)
          .map((fav) => ({
            _id: fav.propertyId._id,
            image: fav.propertyId.photos?.[0] || "/placeholder.jpg",
            title: fav.propertyId.title || "Untitled",
            location: fav.propertyId.localisation?.city || "Unknown",
            typelocation: fav.propertyId.propertyType,
            price: fav.propertyId.price?.weekdays || 0,
            bedrooms: fav.propertyId.info?.bedrooms || 0,
            guests: fav.propertyId.info?.guests || 0,
            bathrooms: fav.propertyId.info?.bathrooms || 0,
            area: fav.propertyId.info?.area || 0,
          }));
        console.log("Normalized favorites:", normalizedFavorites);
        setFavorites(normalizedFavorites);
      } catch (err) {
        console.error("Error fetching favorites:", err.response?.data || err);
        setError("Failed to load favorites. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/property/${id}`);
  };

  const handleDelete = (propertyId) => {
    console.log("Removing from state, propertyId:", propertyId);
    setFavorites((prev) => prev.filter((fav) => fav._id !== propertyId));
  };

  if (loading) return <p className="text-center mt-20">Chargement...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <div className="px-4 py-8">
      <SectionTitle title="Vos Favoris" />
      {favorites.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">Vous n'avez aucun favori pour le moment.</p>
      ) : (
        <ListingCardGrid
          listings={favorites}
          onCardClick={handleCardClick}
          showHeartButton={false}
          showDeleteButton={true}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

