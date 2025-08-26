// src/pages/MyProperties/MyProperties.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import ListingCardGrid from "../../components/ListingCard/ListingCardGrid";
import SectionTitle from "../../components/shared/SectionTitle";
import { AuthContext } from "../../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function MyProperties() {
  const { token } = useContext(AuthContext);
  const [draftProperties, setDraftProperties] = useState([]);
  const [publishedProperties, setPublishedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      // Pas de token, on ne fetch pas
      setLoading(false);
      return;
    }

    const fetchMyProperties = async () => {
      setLoading(true);
      try {
        console.log("🔑 Fetching with token:", token);
        const res = await axios.get(`${API_BASE}/api/property/mine/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const properties = res.data.properties || [];

        setDraftProperties(properties.filter((p) => p.status === "draft"));
        setPublishedProperties(properties.filter((p) => p.status === "published"));
      } catch (err) {
        console.error("Error fetching my properties:", err);
        setDraftProperties([]);
        setPublishedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProperties();
  }, [token]); // 🔁 Se relance automatiquement si le token change

  if (loading) return <div className="p-6 text-center">Chargement...</div>;

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      {/* Draft Properties */}
      <SectionTitle title="Brouillons" />
      {draftProperties.length > 0 ? (
        <ListingCardGrid listings={draftProperties} />
      ) : (
        <p className="text-center text-gray-500 mb-8">Aucun brouillon disponible.</p>
      )}

      {/* Published Properties */}
      <SectionTitle title="Publié" />
      {publishedProperties.length > 0 ? (
        <ListingCardGrid listings={publishedProperties} />
      ) : (
        <p className="text-center text-gray-500">Aucune propriété publiée.</p>
      )}
    </div>
  );
}
