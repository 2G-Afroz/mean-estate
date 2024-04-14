import { React, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
								<div className="h-[550px] bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}></div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
      )}
    </main>
  );
}
