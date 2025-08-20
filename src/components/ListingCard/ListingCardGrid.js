// src/components/ListingCard/ListingCardGrid.js
import React from "react";

export default function ListingCardGrid({ listings, onCardClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <div
          key={listing._id}
          className="border rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer"
          onClick={() => onCardClick && onCardClick(listing._id)}
        >
          <img
            src={listing.image || "/placeholder.jpg"}
            alt={listing.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="font-semibold text-lg">{listing.title}</h2>
            <p className="text-gray-500">{listing.location}</p>
            <p className="mt-2 font-bold">{listing.price ? `${listing.price} MAD / nuit` : ""}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
