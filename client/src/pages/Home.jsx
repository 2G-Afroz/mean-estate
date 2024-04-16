import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
	SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = React.useState([]);
  const [rentListings, setRentListings] = React.useState([]);
  const [sellListings, setSellListings] = React.useState([]);
  console.log(offerListings);
  console.log(rentListings);
  console.log(sellListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchSellListings = async () => {
      try {
        const res = await fetch("/api/listing?type=sell&limit=4");
        const data = await res.json();
        setSellListings(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOfferListings();
    fetchRentListings();
    fetchSellListings();
  }, []);

  return (
    <div>
      {/* Top */}
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br /> place with ease
        </h1>
        <p className="text-gray-500">
          Search for your next home with ease. We have a wide range of
          properties to choose from.
        </p>
        <Link
          to="/search"
          className="font-semibold text-blue-700 hover:underline"
        >
          Search
        </Link>
      </div>
      {/* Swiper */}
      <Swiper navigation>
        {offerListings.length > 0 &&
          offerListings.map((listing, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-[400px] bg-cover bg-center"
                style={{ backgroundImage: `url(${listing.imageUrls[0]})` }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* Lists(offer, rent, sell) */}
			<div className="mx-8">
				{offerListings.length > 0 && (
					<div className="mt-4">
						<div>
							<h2 className="font-semibold text-slate-700 text-2xl">Recent Offers</h2>
							<Link className="text-sm text-blue-700 hover:underline" to={"/search?offer=true"}>Show more offers</Link>
							<div className="flex gap-4 flex-wrap">
								{offerListings.map((listing, index) => (
									<div key={index}>
										<ListingItem key={index} listing={listing}/>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
				{offerListings.length > 0 && (
					<div className="mt-4">
						<div>
							<h2 className="font-semibold text-slate-700 text-2xl">Recent places for Rent</h2>
							<Link className="text-sm text-blue-700 hover:underline" to={"/search?type=rent"}>Show more places for rent</Link>
							<div className="flex gap-4 flex-wrap">
								{rentListings.map((listing, index) => (
									<div key={index}>
										<ListingItem key={index} listing={listing}/>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
				{offerListings.length > 0 && (
					<div className="mt-4">
						<div>
							<h2 className="font-semibold text-slate-700 text-2xl">Recent places for Sell</h2>
							<Link className="text-sm text-blue-700 hover:underline" to={"/search?type=sell"}>Show more places for sell</Link>
							<div className="flex gap-2 flex-wrap">
								{sellListings.map((listing, index) => (
									<div key={index}>
										<ListingItem key={index} listing={listing}/>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
    </div>
  );
}
