// src/pages/Explore/Explore.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import ListingCardGrid from "../../components/ListingCard/ListingCardGrid";
import SectionTitle from "../../components/shared/SectionTitle";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function Explore() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/property`);
        setProperties(res.data.properties || []);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/property/${id}`);
  };

  if (loading) return <p className="text-center mt-20">Chargement...</p>;

  return (
    <div className="px-4 py-8">
      <SectionTitle title="Explorer" />
      <ListingCardGrid listings={properties} onCardClick={handleCardClick} />
    </div>
  );
}
