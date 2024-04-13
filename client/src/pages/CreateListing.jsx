import React from "react";
import { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { set } from "mongoose";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
	const [uploading, setUploading] = useState(false);

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

  return (
    <main className="p-3 mx-auto max-w-4xl">
      <h1 className="text-3xl text-center font-semibold my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="p-3 rounded-md"
            maxLength={60}
            minLength={10}
            required
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            className="p-3 rounded-md"
            required
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="p-3 rounded-md"
            required
          />
          <ul className="flex gap-6 flex-wrap">
            <li className="flex gap-1 items-center">
              <input type="checkbox" id="sell" className="w-5 h-5" />
              <span>Sell</span>
            </li>
            <li className="flex gap-1 items-center">
              <input type="checkbox" id="rent" className="w-5 h-5" />
              <span>Rent</span>
            </li>
            <li className="flex gap-1 items-center">
              <input type="checkbox" id="parking" className="w-5 h-5" />
              <span>Parking Spot</span>
            </li>
            <li className="flex gap-1 items-center">
              <input type="checkbox" id="furnished" className="w-5 h-5" />
              <span>Furnished</span>
            </li>
            <li className="flex gap-1 items-center">
              <input type="checkbox" id="offer" className="w-5 h-5" />
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
              />
              <span>Bathrooms</span>
            </li>
            <li className="flex gap-2 items-center">
              <input
                type="number"
                id="regular-price"
                required
                className="p-2 border border-gray-300 rounded-md"
                min={1}
                max={9999}
              />
              <div className="flex flex-col text-start">
                <span>Regular price</span>
                <span className="text-xs">($/Month)</span>
              </div>
            </li>
            <li className="flex gap-2 items-center">
              <input
                type="number"
                id="discounted-price"
                required
                className="p-2 border border-gray-300 rounded-md"
                min={1}
                max={9999}
              />
              <div className="flex flex-col text-start">
                <span>Discounted price</span>
                <span className="text-xs">($/Month)</span>
              </div>
            </li>
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
          <button className="text-center text-white bg-slate-700 p-3 rounded-md uppercase hover:opacity-95 disabled:opacity-80 my-4">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
