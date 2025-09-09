import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("FavoritesContext fetched favorites:", res.data);
        const favoriteIds = res.data.favorites
          .map((fav) => fav.propertyId?._id?.toString())
          .filter(Boolean);
        setFavorites(new Set(favoriteIds));
      } catch (err) {
        console.error("Error fetching favorites for context:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const addFavorite = async (propertyId) => {
    if (!propertyId) {
      console.error("Cannot add favorite: propertyId is undefined");
      return false;
    }
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return false;

      const response = await axios.post(
        `${API_BASE}/api/favorites/add`,
        { propertyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Add favorite response:", response.data);
      if (response.data.favorite && response.data.favorite.propertyId) {
        setFavorites((prev) => new Set([...prev, response.data.favorite.propertyId.toString()]));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error adding favorite:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to add favorite");
      return false;
    }
  };

  const removeFavorite = async (propertyId) => {
    if (!propertyId) {
      console.error("Cannot remove favorite: propertyId is undefined");
      return false;
    }
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return false;

      const response = await axios.delete(`${API_BASE}/api/favorites/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Remove favorite response:", response.data);
      setFavorites((prev) => {
        const newSet = new Set(prev);
        newSet.delete(propertyId.toString());
        return newSet;
      });
      return true;
    } catch (err) {
      console.error("Error removing favorite:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to remove favorite");
      return false;
    }
  };

  const isFavorited = (propertyId) => {
    if (!propertyId) {
      console.warn("isFavorited called with undefined propertyId");
      return false;
    }
    return favorites.has(propertyId.toString());
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorited, addFavorite, removeFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;