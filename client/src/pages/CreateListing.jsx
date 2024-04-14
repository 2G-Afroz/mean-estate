import React from "react";
import { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"

export default function CreateListing() {
	const navigate = useNavigate();
	const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
		name: '',
		description: '',
		address: '',
		type: 'rent',
		bedrooms: 1,
		bathrooms: 1,
		regularPrice: 50,
		discountedPrice: 0,
		offer: false,
		parking: false,
		furnished: false,
    imageUrls: [],
		userRef: currentUser._id
  });
  const [imageUploadError, setImageUploadError] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

  console.log(formData);

  const handleImageSubmit = (e) => {
		setUploading(true);
		setImageUploadError(false);
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
					setUploading(false);
          setImageUploadError(false);
        })
        .catch((error) => {
					setUploading(false);
          setImageUploadError(error);
					console.log(error);
        });
    } else {
			setUploading(false);
      setImageUploadError("You can only upload up to 6 images.");
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject("You can only upload images.");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

	const handleRemoveImage = (index) => () => {
		setFormData({
			...formData,
			imageUrls: formData.imageUrls.filter((_, i) => i !== index)
		});
	}

	const handleChange = (e) => {
		if(e.target.id === 'sell' || e.target.id === 'rent') {
			setFormData({
				...formData,
				type: e.target.id
			});
		}

		if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
			setFormData({
				...formData,
				[e.target.id]: e.target.checked
			});
		}

		if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
			setFormData({
				...formData,
				[e.target.id]: e.target.value
			});
		}
	}

	const handleSubmitForm = async (e) => {
		e.preventDefault();
		try {
			if(formData.imageUrls.length === 0) {
				return setError("You must upload at least one image.");
			}
			if(+formData.regularPrice < +formData.discountedPrice)
				return setError("Discounted price must be less than regular price.");
			setLoading(true);
			setError(false);
			const res = await fetch('/api/listing/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			const data = await res.json();
			setLoading(false);
			if(data.success === false) {
				setError(data.message);
				return;
			}

			navigate(`/listing/${data._id}`);
		}
		catch(err) {
			setError(err.message);
		}
	}

  return (
    <main className="p-3 mx-auto max-w-4xl">
      <h1 className="text-3xl text-center font-semibold my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmitForm} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="p-3 rounded-md"
            maxLength={60}
            minLength={5}
            required
						onChange={handleChange}
						value={formData.name}
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            className="p-3 rounded-md"
            required
						onChange={handleChange}
						value={formData.description}
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="p-3 rounded-md"
            required
						onChange={handleChange}
						value={formData.address}
          />
          <ul className="flex gap-6 flex-wrap">
            <li className="flex gap-1 items-center">
              <input onChange={handleChange} checked={formData.type === "sell"} type="checkbox" id="sell" className="w-5 h-5" />
              <span>Sell</span>
            </li>
            <li className="flex gap-1 items-center">
              <input onChange={handleChange} checked={formData.type === "rent"} type="checkbox" id="rent" className="w-5 h-5" />
              <span>Rent</span>
            </li>
            <li className="flex gap-1 items-center">
              <input onChange={handleChange} checked={formData.parking} type="checkbox" id="parking" className="w-5 h-5" />
              <span>Parking Spot</span>
            </li>
            <li className="flex gap-1 items-center">
              <input onChange={handleChange} checked={formData.furnished} type="checkbox" id="furnished" className="w-5 h-5" />
              <span>Furnished</span>
            </li>
            <li className="flex gap-1 items-center">
              <input onChange={handleChange} checked={formData.offer} type="checkbox" id="offer" className="w-5 h-5" />
              <span>Offer</span>
            </li>
          </ul>
          <ul className="flex flex-wrap gap-6">
            <li className="flex gap-2 items-center">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="p-2 border border-gray-300 rounded-md"
								onChange={handleChange}
								value={formData.bedrooms}
              />
              <span>Bedroomss</span>
            </li>
            <li className="flex gap-2 items-center">
              <input
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                className="p-2 border border-gray-300 rounded-md"
								onChange={handleChange}
								value={formData.bathrooms}
              />
              <span>Bathrooms</span>
            </li>
            <li className="flex gap-2 items-center">
              <input
                type="number"
                id="regularPrice"
                required
                className="p-2 border border-gray-300 rounded-md"
                min={50}
                max={99999}
								onChange={handleChange}
								value={formData.regularPrice}
              />
              <div className="flex flex-col text-start">
                <span>Regular price</span>
                <span className="text-xs">($/Month)</span>
              </div>
            </li>
						{formData.offer && (
            <li className="flex gap-2 items-center">
              <input
                type="number"
                id="discountedPrice"
                required
                className="p-2 border border-gray-300 rounded-md"
                min={0}
                max={99999}
								onChange={handleChange}
								value={formData.discountedPrice}
              />
              <div className="flex flex-col text-start">
                <span>Discounted price</span>
                <span className="text-xs">($/Month)</span>
              </div>
            </li>
						)}
          </ul>
        </div>
        <div className="flex flex-col flex-1">
          <p className="font-semibold mb-3">
            Images: &nbsp;
            <span className="font-normal text-gray-500">
              The first image will be the cover (max 6).
            </span>
          </p>
          <div className="flex flex-row gap-3">
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="border p-3 border-gray-300 rounded-md w-full"
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="text-green-700 border-green-700 border p-3 rounded-md uppercase hover:bg-green-100"
            >
							{uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-700">{imageUploadError}</p>
          )}
          {formData.imageUrls.map((url, index) => (
            <div key={index} className="flex flex-row flex-wrap justify-between border border-slate-500 my-1 p-1 rounded">
              <img
                src={url}
                alt="listing"
                className="w-20 h-20 rounded-md my-2"
              />
							<button type="button" onClick={handleRemoveImage(index)} className="text-red-700 p-3 uppercase hover:opacity-75">Delete</button>
            </div>
          ))}
          <button disabled={loading || uploading} className="text-center text-white bg-slate-700 p-3 rounded-md uppercase hover:opacity-95 disabled:opacity-80 my-4">
						{loading ? "Loading..." : "Create Listing"}
          </button>
					{error && <p className="text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
}
