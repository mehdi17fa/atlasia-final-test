import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function PublishProperty() {
  const { id } = useParams(); // property id from URL
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePublish = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const authToken =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      user?.accessToken ||
      user?.token;

    if (!authToken) {
      setError("Veuillez vous connecter pour publier.");
      setLoading(false);
      return;
    }

    if (!startDate || !endDate) {
      setError("Veuillez sélectionner les deux dates.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.patch(
        `${API_BASE}/api/property/${id}/publish`,
        { start: startDate, end: endDate },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setSuccess("Propriété publiée avec succès !");
      // redirect to Explore or property page
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Erreur lors de la publication."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          Publier votre propriété
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{success}</div>
        )}

        <label className="block mb-2 font-semibold">Date de début</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block mb-2 font-semibold">Date de fin</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={handlePublish}
          disabled={loading}
          className={`w-full py-3 rounded-full text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-green-800 hover:bg-green-900"
          } transition`}
        >
          {loading ? "Publication..." : "Publier"}
        </button>
      </div>
    </div>
  );
}
