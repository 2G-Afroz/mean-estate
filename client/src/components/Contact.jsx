import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({listing}) {

	const [landlord, setLandlord] = useState(null);
	const [message, setMessage] = useState(null);

	useEffect(() => {
		const fetchLandlord = async () => {
			try {
				const response = await fetch(`/api/user/${listing.userRef}`);
				const data = await response.json();
				setLandlord(data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchLandlord();
	}, [listing.userRef]);

	console.log(landlord);

	return (
		<div>
			{landlord && (
				<div className='flex flex-col mt-4 gap-1'>
					<h2>Contact to <span className='font-bold'>{landlord.username}</span> for new <span className='font-bold'>{listing.name}</span></h2>
					<textarea onChange={(e) => {setMessage(e.target.value)}} className='w-full h-32 border p-2' placeholder='Type your message here'></textarea>
					<Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}>
						<button className='bg-green-500 text-white p-2 rounded'>Send Message</button>
					</Link>
				</div>
			)}
		</div>
	)
}
