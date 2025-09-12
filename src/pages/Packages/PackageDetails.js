import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const API_BASE_URL = "http://localhost:4000/api";

const LoadingSpinner = () => (
  <div className="flex justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
  </div>
);

export default function PackageDetailPage() {
  const { packageId } = useParams();
  const { token, user } = useContext(AuthContext);

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingError, setBookingError] = useState(""); // New state for booking errors

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState("");

  // ================= FETCH PACKAGE =================
  useEffect(() => {
    const fetchPackage = async () => {
      if (!token) {
        setError("Vous devez être connecté pour voir ce package.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/packages/${packageId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPkg(res.data.package);
        setError(null);
      } catch (err) {
        console.error("Package fetch error:", err);
        if (err.response?.status === 401) {
          setError("Token invalide ou expiré. Veuillez vous reconnecter.");
        } else if (err.response?.status === 403) {
          setError("Vous n'êtes pas autorisé à accéder à ce package.");
        } else {
          setError(err.response?.data?.message || "Erreur lors du chargement du package");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId, token]);

  // ================= HANDLE BOOKING =================
  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      setBookingError("Veuillez sélectionner les dates");
      return;
    }

    if (!token) {
      setBookingError("Vous devez être connecté pour réserver.");
      return;
    }

    // Client-side validation
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      setBookingError("Dates invalides");
      return;
    }
    if (checkOutDate <= checkInDate) {
      setBookingError("La date de sortie doit être après la date d'entrée");
      return;
    }
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (nights < 1) {
      setBookingError("La réservation nécessite au moins une nuit");
      return;
    }
    if (guests < 1 || !Number.isInteger(Number(guests))) {
      setBookingError("Le nombre de guests doit être un entier ≥1");
      return;
    }

    // Optional: Validate against package dates if set
    if (pkg.startDate && checkInDate < new Date(pkg.startDate)) {
      setBookingError("La date d'entrée doit être après la date de début du package");
      return;
    }
    if (pkg.endDate && checkOutDate > new Date(pkg.endDate)) {
      setBookingError("La date de sortie doit être avant la date de fin du package");
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError(""); // Clear previous errors
      console.log('🚀 Booking payload:', { checkIn, checkOut, guests, pkg });  // Frontend log for debug

      // Updated endpoint to /api/packagebooking/package to avoid conflict with property bookings
      const endpoint = `${API_BASE_URL}/packagebooking/package`;
      const payload = {
        packageId: pkg._id,
        checkIn,
        checkOut,
        guests: Number(guests),  // Ensure integer
        message: `Booking via package ${pkg.name}`,
      };

      const res = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookingSuccess(res.data.message);
      setBookingError(""); // Clear any errors on success
      // Optional: Reset form
      setCheckIn(""); setCheckOut(""); setGuests(1);
    } catch (err) {
      console.error("Booking error:", err);
      console.error("Response data:", err.response?.data);  // Log server response
      setBookingError(
        err.response?.data?.message ||
          (err.response?.status === 403
            ? "Action non autorisée"
            : "Erreur lors de la réservation")
      );
      setBookingSuccess(""); // Clear success message on error
    } finally {
      setBookingLoading(false);
    }
  };

  // ================= RENDER =================
  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-red-600 p-4 font-semibold bg-red-100 rounded">
        {error}
      </div>
    );
  if (!pkg)
    return <div className="text-gray-600 p-4">Package introuvable</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{pkg.name}</h1>
      <p className="text-gray-700 mb-4">{pkg.description}</p>

      {pkg.restaurants?.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold">Restaurants inclus</h2>
          <ul className="list-disc list-inside">
            {pkg.restaurants.map((r, idx) => (
              <li key={idx}>{r.name}</li>
            ))}
          </ul>
        </div>
      )}

      {pkg.activities?.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold">Activités inclus</h2>
          <ul className="list-disc list-inside">
            {pkg.activities.map((a, idx) => (
              <li key={idx}>{a.name}</li>
            ))}
          </ul>
        </div>
      )}

      {pkg.services?.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold">Services inclus</h2>
          <ul className="list-disc list-inside">
            {pkg.services.map((s, idx) => (
              <li key={idx}>{s.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Sélectionnez les dates et le nombre de guests</h2>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <span className="mx-2">→</span>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="border rounded px-2 py-1 w-20"
            placeholder="Guests"
          />
        </div>
      </div>

      <button
        onClick={handleBooking}
        disabled={bookingLoading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {bookingLoading ? "Réservation..." : "Réserver maintenant"}
      </button>

      {/* Success Message */}
      {bookingSuccess && (
        <div className="mt-4 text-green-700 font-semibold bg-green-100 p-3 rounded">
          {bookingSuccess}
        </div>
      )}

      {/* Error Message */}
      {bookingError && (
        <div className="mt-4 text-red-600 font-semibold bg-red-100 p-3 rounded">
          {bookingError}
        </div>
      )}
    </div>
  );
}