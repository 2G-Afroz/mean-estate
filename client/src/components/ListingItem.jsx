import React from "react";
import { FaMap, FaMapMarkedAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white flex flex-col shadow-md hover:shadow-lg overflow-hidden rounded-lg w-full sm:w-[330px] m-1">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
        />
        <div className="p-3 flex flex-col gap-3">
          <p className="text-lg font-semibold text-slate-700 truncate">{listing.name}</p>
					<div className="flex flex-row gap-2 items-center">
						<FaMapMarkedAlt className="inline text-green-700" />
						<p className="truncate text-sm text-gray-600">{listing.address}</p>
					</div>
					<p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
					<p className="font-semibold text-slate-500">${listing.offer ? listing.discountedPrice.toLocaleString('en-US') : listing.regularPrice}{listing.type === "rent" ? "/Month" : ""}</p>
					<div className="flex gap-4 font-semibold">
						<p>{listing.bedrooms} {listing.bedrooms > 1 ? "Beds" : "Bed"}</p>
						<p>{listing.bathrooms} {listing.bathrooms > 1 ? "Baths" : "Bath"}</p>
					</div>
        </div>
				
      </Link>
    </div>
  );
}
