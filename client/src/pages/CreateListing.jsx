import React from 'react'

export default function CreateListing() {
	return (
		<main className='p-3 mx-auto max-w-4xl'>
			<h1 className='text-3xl text-center font-semibold my-7'>Create a Listing</h1>
			<form className='flex flex-col sm:flex-row gap-4'>
				<div className='flex flex-col gap-4 flex-1'>
					<input type="text" id='name' placeholder='Name' className='p-3 rounded-md' maxLength={60} minLength={10} required/>
					<textarea type="text" id='description' placeholder='Description' className='p-3 rounded-md' required/>
					<input type="text" id='address' placeholder='Address' className='p-3 rounded-md' required/>
					<ul className='flex gap-6 flex-wrap'>
						<li className='flex gap-1 items-center'>
							<input type="checkbox" id='sell' className='w-5 h-5'/>
							<span>Sell</span>
						</li>
						<li className='flex gap-1 items-center'>
							<input type="checkbox" id='rent' className='w-5 h-5'/>
							<span>Rent</span>
						</li>
						<li className='flex gap-1 items-center'>
							<input type="checkbox" id='parking' className='w-5 h-5'/>
							<span>Parking Spot</span>
						</li>
						<li className='flex gap-1 items-center'>
							<input type="checkbox" id='furnished' className='w-5 h-5'/>
							<span>Furnished</span>
						</li>
						<li className='flex gap-1 items-center'>
							<input type="checkbox" id='offer' className='w-5 h-5'/>
							<span>Offer</span>
						</li>
					</ul>
					<ul className='flex flex-wrap gap-6'>
						<li className='flex gap-2 items-center'>
							<input type="number" id='bedrooms' min={1} max={10} required className='p-2 border border-gray-300 rounded-md'/>
							<span>Bedroomss</span>
						</li>
						<li className='flex gap-2 items-center'>
							<input type="number" id='bathrooms' min={1} max={10} required className='p-2 border border-gray-300 rounded-md'/>
							<span>Bathrooms</span>
						</li>
						<li className='flex gap-2 items-center'>
							<input type="number" id='regular-price' required className='p-2 border border-gray-300 rounded-md' min={1} max={9999}/>
							<div className='flex flex-col text-start'>
								<span>Regular price</span>
								<span className='text-xs'>($/Month)</span>
							</div>
						</li>
						<li className='flex gap-2 items-center'>
							<input type="number" id='discounted-price' required className='p-2 border border-gray-300 rounded-md' min={1} max={9999}/>
							<div className='flex flex-col text-start'>
								<span>Discounted price</span>
								<span className='text-xs'>($/Month)</span>
							</div>
						</li>
					</ul>
				</div>
				<div className='flex flex-col flex-1'>
					<p className='font-semibold mb-3'>Images: <span className='font-normal text-gray-500'>The first image will be the cover (max 6).</span></p>
					<div className='flex flex-row gap-3'>
						<input type="file" id='images' accept='image/*' multiple className='border p-3 border-gray-300 rounded-md w-full'/>
						<button className='text-green-700 border-green-700 border p-3 rounded-md uppercase hover:bg-green-100'>Upload</button>
					</div>
				<button className='text-center text-white bg-slate-700 p-3 rounded-md uppercase hover:opacity-95 disabled:opacity-80 my-4'>Create Listing</button>
				</div>
			</form>
		</main>
	)
}
