import { set } from "mongoose";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {

	const navigate = useNavigate();
	const [sidebarData, setSidebarData] = useState({
		searchTerm: "",
		type: "all",
		parking: false,
		furnished: false,
		offer: false,
		sort: "created_at",
		order: "desc",
	});
	const [loading, setLoading] = useState(false);
	const [listings, setListings] = useState([]);
	const [showMore, setShowMore] = useState(false);

	const handleChange = (e) => {
		if(e.target.id === "searchTerm") {
			setSidebarData({
				...sidebarData,
				searchTerm: e.target.value
			});
		}
	
		if(e.target.id === "all" || e.target.id === "rent" || e.target.id === "sell") {
			setSidebarData({
				...sidebarData,
				type: e.target.id
			});
		}

		if(e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
			setSidebarData({
				...sidebarData,
				[e.target.id]: e.target.checked || e.target.checked === "true" ? true : false,
			});
		}

		if(e.target.id === "sort_order") {
			const sort = e.target.value.split("_")[0] || "createdAt";
			const order = e.target.value.split("_")[1] || "desc";
			setSidebarData({
				...sidebarData,
				sort,
				order,
			});
		}
	}

	const handleFormSubmit = (e) => {
		e.preventDefault();

		const urlParams = new URLSearchParams();
		urlParams.set("searchTerm", sidebarData.searchTerm);
		urlParams.set("type", sidebarData.type);
		urlParams.set("parking", sidebarData.parking);
		urlParams.set("furnished", sidebarData.furnished);
		urlParams.set("offer", sidebarData.offer);
		urlParams.set("sort", sidebarData.sort);
		urlParams.set("order", sidebarData.order);

		const searchQuery = urlParams.toString();
		
		navigate(`/search?${searchQuery}`);
	}

	const onShowMoreClick = async () => {
		const startIndex = listings.length;
		const urlParam = new URLSearchParams(location.search);
		urlParam.set('startIndex', startIndex);
		const searchQuery = urlParam.toString();
		const res = await fetch(`/api/listing/?${searchQuery}`);
		const data = await res.json();
		setListings([...listings, ...data]);
		if(data.length < 9)
			setShowMore(false);
	}

	useEffect(() => {
		const urlSearchParams = new URLSearchParams(location.search);
		const searchTerm = urlSearchParams.get("searchTerm");
		const type = urlSearchParams.get("type");
		const parking = urlSearchParams.get("parking");
		const furnished = urlSearchParams.get("furnished");
		const offer = urlSearchParams.get("offer");
		const sort = urlSearchParams.get("sort");
		const order = urlSearchParams.get("order");

		if(searchTerm || type || parking || furnished || offer || sort || order) {
			setSidebarData({
				searchTerm: searchTerm || "",
				type: type || "all",
				parking: parking === "true" ? true : false,
				furnished: furnished === "true" ? true : false,
				offer: offer === "true" ? true : false,
				sort: sort || "created_at",
				order: order || "desc",
			});

		const fetchListings = async () => {
			setLoading(true);
			const searchQuery = urlSearchParams.toString();
			const response = await fetch(`/api/listing?${searchQuery}`);
			const data = await response.json();
			if(data.length > 8)
				setShowMore(true);
			setLoading(false);
			setListings(data);
		};
		fetchListings();
		}
	}, [location.search]);


  return (
    <main className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <input
              type="text"
              id="searchTerm"
              name="search"
              placeholder="Search..."
							className="border rounded-lg p-3 w-full"
							value={sidebarData.searchTerm}
							onChange={handleChange}
            />
          </div>
					<div className="flex gap-2 flex-wrap items-center">
						<label className="font-semibold">Type:</label>
						<div className="flex items-center gap-1">
							<input type="checkbox" id="all" className="w-5 h-5" onChange={handleChange} checked={sidebarData.type === "all"}/>
							<span>Rent &amp; Sell</span>
						</div>
						<div className="flex items-center gap-1">
							<input type="checkbox" id="rent" className="w-5 h-5" onChange={handleChange} checked={sidebarData.type === "rent"}/>
							<span>Rent</span>
						</div>
						<div className="flex items-center gap-1">
							<input type="checkbox" id="sell" className="w-5 h-5" onChange={handleChange} checked={sidebarData.type === "sell"}/>
							<span>Sell</span>
						</div>
						<div className="flex items-center gap-1">
							<input type="checkbox" id="offer" className="w-5 h-5" onChange={handleChange} checked={sidebarData.offer}/>
							<span>Offer</span>
						</div>
					</div>
					<div className="flex gap-2 flex-wrap items-center">
						<label className="font-semibold">Amenities:</label>
						<div className="flex items-center gap-1">
							<input type="checkbox" id="parking" className="w-5 h-5" onChange={handleChange} checked={sidebarData.parking}/>
							<span>Parking</span>
						</div>
						<div className="flex items-center gap-1">
							<input type="checkbox" id="furnished" className="w-5 h-5" onChange={handleChange} checked={sidebarData.furnished}/>
							<span>Furnished</span>
						</div>
					</div>
					<div className="flex gap-2">
						<label className="font-semibold">Sort: </label>
						<select onChange={handleChange} defaultValue={"created_at_des"} id="sort_order" className="border rounded-lg p-3">
							<option value="regularPrice_desc">Price high to low</option>
							<option value="regularPrice_asc">Price low to high</option>
							<option value="createdAt_desc">Latest</option>
							<option value="createdAt_asc">Oldest</option>
						</select>
					</div>
					<button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95">Search</button>
        </form>
      </div>
      <div className="mx-6">
      	<h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listing Results:</h1>
				<div className="flex flex-row flex-wrap">
					{!loading && listings.length === 0 && (
						<p className="text-lg text-slate-700 text-center p-3">No listings found!</p>
					)}
					{loading && (
						<p className="text-lg text-slate-700 text-center p-3">Loading...</p>
					)}
					{!loading && listings.length > 0 && (
						listings.map((listing, index) => (
							<ListingItem key={index} listing={listing}/>
						))
					)}
				</div>
				{showMore && (
					<button onClick={onShowMoreClick}
					className="text-green-700 text-center w-full"
					>
						show More...
					</button>
				)}
			</div>
    </main>
  );
}
