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
  user, // current logged-in user
}) {
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Main Image */}
      <div className="relative">
        <img src={mainImage} alt={title} className="w-full h-64 md:h-96 object-cover rounded-lg" />
        {/* Back Button */}
        <button
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black bg-opacity-30 text-white flex items-center justify-center shadow-md"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="w-5 h-5" fill="white" stroke="white" />
        </button>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="text-sm text-gray-600">
          <span className="text-green-600 font-medium">★ {rating}</span> · {reviewCount} reviews · {location}
        </div>
      </div>

      {/* Host */}
      {host ? (
        <div className="flex items-center space-x-4 mt-6 px-4">
          <img
            src={host.photo || "/placeholder-profile.jpg"}
            alt={`Photo de ${host.name}`}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900">Hôte : {host.name}</p>
            <p className="text-sm text-gray-500">Superhôte · Hôte depuis 7 ans</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 italic mt-4 px-4">Informations sur l'hôte non disponibles.</p>
      )}

      {/* Check-in */}
      <div className="border rounded-lg p-4">
        <p className="font-medium">🕒 Check-in</p>
        <p className="text-sm text-gray-500">à partir de {checkInTime}</p>
      </div>

      {/* Features */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Ce que propose ce logement</h2>
        <div className="grid grid-cols-2 mt-4 md:grid-cols-3 font-semibold gap-4 text-sm text-gray-700">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              {feature.icon}
              <span>{feature.label}</span>
            </div>
          ))}
        </div>
        <button className="text-green-600 mt-2 text-sm float-right">
          Afficher plus →
        </button>
      </div>

      {/* Associated Packs */}
      <div>
        <h2 className="font-semibold text-lg mb-2 mt-8">Les packs associés</h2>
        <div className="space-y-3">
          {associatedPacks.map((pack, index) => (
            <div key={index} className="flex items-center space-x-4">
              <img src={pack.image} alt={pack.name} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <p className="font-medium">{pack.name}</p>
                <p className="text-sm text-gray-500">{pack.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Localisation</h2>
        <img src={mapImage} alt="Map" className="rounded-lg w-full h-56 object-cover" />
      </div>

      {/* Reviews */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-green-600 font-medium">★ {rating}</span>
          <span className="text-sm text-gray-600">{reviewCount} reviews</span>
        </div>
        {reviews.map((review, index) => (
          <div key={index} className="mt-2 bg-gray-100 rounded-lg p-4">
            <p className="font-medium">{review.name}</p>
            <p className="text-sm text-gray-500">{review.date}</p>
            <p className="mt-2 text-sm">"{review.comment}"</p>
          </div>
        ))}
      </div>

      {/* Contact + Reserve */}
      <div className="border rounded-lg p-4 flex flex-row items-center justify-between gap-4">
        {host && (
          <div className="flex items-center space-x-3">
            <img
              src={host.photo || "/placeholder-profile.jpg"}
              alt="Hôte"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{host.name}</p>
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-2">
          {/* Voir plus button */}
          <button
            onClick={() => host?.id && navigate(`/owner/${host.id}`)}
            disabled={!host?.id}
            className={`bg-gray-300 text-white px-4 py-2 rounded-lg whitespace-nowrap ${host?.id ? "bg-green-600 hover:bg-green-700" : "cursor-not-allowed opacity-50"}`}
          >
            Voir plus
          </button>

          {/* Reserve button */}
          <button
            disabled={!isLoggedIn}
            className={`bg-gray-300 text-white px-4 py-2 rounded-lg whitespace-nowrap ${isLoggedIn ? "bg-green-600 hover:bg-green-700" : "cursor-not-allowed opacity-50"}`}
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
}
