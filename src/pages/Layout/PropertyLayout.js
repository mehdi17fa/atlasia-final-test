import React from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ArrowLeftIcon } from '../../assets/icons/arrow-left.svg';

export default function PropertyLayout({
  title,
  location,
  rating,
  reviewCount,
  mainImage,
  host,
  checkInTime,
  features,
  associatedPacks,
  mapImage,
  reviews,
  user,
}) {
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Main Image + Back Button */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        <img src={mainImage} alt={title} className="w-full h-96 object-cover" />
        <button
          className="absolute top-4 left-4 p-3 bg-black bg-opacity-30 rounded-full text-white flex items-center justify-center shadow-md"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="w-5 h-5" fill="white" stroke="white" />
        </button>
      </div>

      {/* Title and Location */}
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-600 mt-1">{location}</p>
        <div className="flex items-center space-x-2 text-gray-500 mt-1">
          <span className="text-green-600 font-medium">★ {rating}</span>
          <span>·</span>
          <span>{reviewCount} reviews</span>
        </div>
      </div>

      {/* Host */}
      {host ? (
        <div className="flex items-center space-x-4 mt-4">
          <img
            src={host.photo || "/placeholder-profile.jpg"}
            alt={host.name}
            className="w-14 h-14 rounded-full object-cover shadow"
          />
          <div>
            <p className="font-semibold text-gray-900">{host.name}</p>
            <p className="text-sm text-gray-500">Superhôte · Hôte depuis 7 ans</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 italic mt-4">Informations sur l'hôte non disponibles.</p>
      )}

      {/* Check-in */}
      <div className="border rounded-2xl p-4 shadow-sm">
        <p className="font-medium">🕒 Check-in</p>
        <p className="text-sm text-gray-500">à partir de {checkInTime}</p>
      </div>

      {/* Features */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Ce que propose ce logement</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700 font-medium">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              {feature.icon}
              <span>{feature.label}</span>
            </div>
          ))}
        </div>
        <button
          className="text-green-600 text-sm mt-2 float-right"
          onClick={() => host?.id && navigate(`/owner/${host.id}`)}
        >
          Afficher plus →
        </button>
      </div>

      {/* Associated Packs */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Les packs associés</h2>
        <div className="space-y-3">
          {associatedPacks.length ? (
            associatedPacks.map((pack, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-xl shadow hover:shadow-lg transition">
                <img
                  src={pack.image || "/placeholder-pack.jpg"}
                  alt={pack.name || "Pack"}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium">{pack.name || "Nom du pack indisponible"}</p>
                  <p className="text-sm text-gray-500">{pack.location || ""}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">Aucun pack associé pour cette propriété.</p>
          )}
        </div>
      </div>

      {/* Map */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Localisation</h2>
        <img src={mapImage} alt="Map" className="rounded-2xl w-full h-56 object-cover shadow" />
      </div>

      {/* Reviews */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-green-600 font-medium">★ {rating}</span>
          <span className="text-sm text-gray-500">{reviewCount} reviews</span>
        </div>
        {reviews.map((review, index) => (
          <div key={index} className="mt-2 bg-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="font-medium">{review.name}</p>
            <p className="text-sm text-gray-500">{review.date}</p>
            <p className="mt-2 text-sm">"{review.comment}"</p>
          </div>
        ))}
      </div>

      {/* Contact + Reserve */}
      <div className="border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        {host && (
          <div className="flex items-center space-x-3">
            <img src={host.photo || "/placeholder-profile.jpg"} alt="Hôte" className="w-12 h-12 rounded-full object-cover" />
            <p className="font-medium">{host.name}</p>
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => host?.id && navigate(`/owner/${host.id}`)}
            disabled={!host?.id}
            className={`px-4 py-2 rounded-2xl text-white font-semibold ${host?.id ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed opacity-50"}`}
          >
            Voir plus
          </button>
          <button
            disabled={!isLoggedIn}
            className={`px-4 py-2 rounded-2xl text-white font-semibold ${isLoggedIn ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed opacity-50"}`}
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
}
