import React from "react";
import ListingCard from "./ListingCard";

export default function ListingCardGrid({ listings, onCardClick, showHeartButton = true, showDeleteButton = false, onDelete }) {
  const validListings = listings.filter((listing) => listing._id);
  console.log("ListingCardGrid received listings:", validListings);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {validListings.map((listing) => (
        <ListingCard
          key={listing._id}
          data={listing}
          onCardClick={onCardClick}
          showHeartButton={showHeartButton}
          showDeleteButton={showDeleteButton}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}