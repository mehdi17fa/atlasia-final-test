// src/pages/Explore/Explore.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import ListingCardGrid from "../../components/ListingCard/ListingCardGrid";
import SectionTitle from "../../components/shared/SectionTitle";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function Explore() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/property`);
        setListings(res.data); // backend returns ready-to-render objects
      } catch (err) {
        console.error("Explore fetch error:", err);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleCardClick = (listing) => {
    navigate(`/property/${listing._id}`);
  };

  if (loading) {
    return <div className="p-6 text-center">Chargement des propriétés...</div>;
  }

  if (listings.length === 0) {
    return <div className="p-6 text-center text-gray-500">Aucune propriété disponible pour le moment.</div>;
  }

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <SectionTitle title="Options Populaires:" />
      <ListingCardGrid listings={listings} onCardClick={handleCardClick} />

      <SectionTitle title="Logement Downtown:" />
      <ListingCardGrid listings={listings} onCardClick={handleCardClick} />
    </div>
  );
}
