import { React, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import "swiper/css/bundle";
// Importing icons
import { FaBath, FaChair, FaMapMarkerAlt, FaParking } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import Contact from "../components/Contact";

export default function Listing() {
	const { currentUser } = useSelector((state) => state.user);
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
	const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/listing/${params.id}`);
        const data = await response.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);

  return (
    <main>
      {loading && <p className="text-center mt-8">Loading...</p>}
      {error && <p className="text-center mt-8">Something went wrong</p>}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className="h-[400px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${image})` }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="p-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${listing.discountedPrice}
              {listing.type === "rent" ? "/month" : ""}
            </p>
            <p className="flex items-center gap-1 mt-6 my-2 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex flex-row gap-4 mt-4">
              <p className="text-center w-full p-1 px-5 rounded max-w-[200px] bg-red-900 text-white">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              <p className="text-center w-full p-1 rounded max-w-[200px] bg-green-900 text-white">
                {listing.offer
                  ? `$${+listing.regularPrice - +listing.discountedPrice} Off`
                  : ""}
              </p>
            </div>
            <p className="my-4 text-slate-800">
              <span className="font-bold text-black">Description: </span>
              {listing.description}
            </p>
            <ul className="flex flex-row gap-4 flex-wrap">
              <li className="flex items-center gap-2 bg-green-100 px-2 border border-green-500 rounded">
									<FaBed className="text-green-700" />
									<span>{listing.bedrooms} {listing.bedrooms > 1 ? "beds": "bed"}</span>
              </li>
              <li className="flex items-center gap-2 bg-green-100 px-2 border border-green-500 rounded">
									<FaBath className="text-green-700" />
									<span>{listing.bathrooms} {listing.bathrooms > 1 ? "baths": "bath"}</span>
              </li>
              <li className="flex items-center gap-2 bg-green-100 px-2 border border-green-500 rounded">
									<FaParking className="text-green-700" />
									<span>{listing.parking ? "Parking": "No Parking"}</span>
              </li>
              <li className="flex items-center gap-2 bg-green-100 px-2 border border-green-500 rounded">
									<FaChair className="text-green-700" />
									<span>{listing.furnished ? "Furnished": "Not Furnished"}</span>
              </li>
            </ul>
						{currentUser && currentUser._id !== listing.userRef && !contact &&(
							<p onClick={() => {
								setContact(true);
							}} className="uppercase text-center p-3 bg-slate-700 rounded text-white mt-3">Contact landlord</p>
						)}
						{contact && (
							<Contact listing={listing}/>
						)}
          </div>
        </div>
      )}
    </main>
  );
}
