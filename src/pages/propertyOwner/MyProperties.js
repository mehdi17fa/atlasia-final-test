// src/pages/MyProperties/MyProperties.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import ListingCardGrid from "../../components/ListingCard/ListingCardGrid";
import SectionTitle from "../../components/shared/SectionTitle";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function MyProperties() {
  const [draftProperties, setDraftProperties] = useState([]);
  const [publishedProperties, setPublishedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProperties = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
        if (!token) {
          console.warn("No token found, please log in.");
          setDraftProperties([]);
          setPublishedProperties([]);
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE}/api/property/mine/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const properties = res.data.properties || [];

        // Split into drafts and published
        const drafts = properties.filter((p) => p.status === "draft");
        const published = properties.filter((p) => p.status === "published");

        setDraftProperties(drafts);
        setPublishedProperties(published);
      } catch (err) {
        console.error("Error fetching my properties:", err);
        setDraftProperties([]);
        setPublishedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProperties();
  }, []);

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
