// src/Layout/CoHostPropertyLayout.jsx
import React from "react";
import { ArrowLeftIcon, WifiIcon, UserGroupIcon, HomeIcon, BuildingOfficeIcon, CheckIcon } from "@heroicons/react/24/solid";

export default function CoHostPropertyLayout({
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
  onCoHostClick
}) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-4">
        <button onClick={() => window.history.back()} className="p-2 bg-gray-200 rounded-full">
          <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>

      <p className="text-gray-600 mb-2">{location}</p>
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <span>⭐ {rating}</span>
        <span>·</span>
        <span>{reviewCount} avis</span>
      </div>

      {/* Main Image */}
      <img
        src={mainImage || "/placeholder.jpg"}
        alt={title}
        className="w-full h-96 object-cover rounded-2xl shadow mb-6"
      />

      {/* Features */}
      {features?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {features.map((f, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              {f.icon}
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Associated Packs */}
      {associatedPacks?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Packs associés</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {associatedPacks.map((pack, idx) => (
              <div key={idx} className="rounded-xl shadow p-3">
                <img
                  src={pack.image}
                  alt={pack.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <h3 className="mt-2 font-medium">{pack.name}</h3>
                <p className="text-sm text-gray-500">{pack.location}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Host */}
      {host && (
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={host.photo || "/default-avatar.png"}
            alt={host.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{host.name}</p>
            <p className="text-sm text-gray-500">Hôte</p>
          </div>
        </div>
      )}

      {/* Co-Host Button */}
      <div className="text-center">
        <button
          onClick={onCoHostClick}
          className="bg-green-500 hover:bg-green-600 text-black rounded-2xl px-6 py-3 font-semibold shadow flex items-center justify-center mx-auto"
        >
          <CheckIcon className="w-5 h-5 mr-2" />
          Devenir Co-hoster
        </button>
      </div>
    </div>
  );
}
