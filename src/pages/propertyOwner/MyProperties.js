import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import PropertyCard from "../../components/ListingCard/PropertyCard";
import { AuthContext } from "../../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyProperties = async () => {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        user?.accessToken ||
        user?.token;
      const res = await axios.get(`${API_BASE}/api/property`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(res.data.properties || []);
    };
    fetchMyProperties();
  }, [user]);

  return (
    <div className="min-h-screen bg-white flex flex-col p-4">
      <h1 className="text-2xl font-bold text-green-800 text-center mb-4">Mes propriétés</h1>
      {properties.length === 0 ? (
        <p className="text-center text-gray-500">Aucune propriété trouvée</p>
      ) : (
        <div className="flex flex-col gap-4">
          {properties.map((prop) => (
            <PropertyCard
              key={prop._id}
              name={prop.title}
              description={prop.description}
              location={prop.localisation?.city}
              image={prop.photos?.[0]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
