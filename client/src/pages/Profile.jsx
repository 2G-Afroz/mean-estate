import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const [filePer, setFilePer] = useState(0);
	const [fileSizeErr, setFileSizeErr] = useState(false);
  const [fileUploadErr, setFileUploadErr] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
		if(file.size > 2 * 1024 * 1024) {
			setFileSizeErr(true);
			return;
		}
		setFileSizeErr(false);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },
      (err) => {
        setFileUploadErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col">
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          onClick={() => fileRef.current.click()}
          className="rounded-full w-24 h-24 self-center"
        />
        <p className="self-center">
          {fileSizeErr ? (
            <span className="text-red-700 ">File size should be less than 2MB.</span>
          ) : fileUploadErr ? (
						<span className="text-red-700 ">Failed to upload image.</span>
					) : filePer > 0 && filePer < 100 ? (
            <span className="text-gray-700">Uploading {filePer}...</span>
          ) : filePer === 100 ? (
            <span className="text-green-700 ">
              Image uploaded Successfully.
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          id="username"
          type="text"
          placeholder="User Name"
          className="border p-3 mt-4 rounded-lg"
        />
        <input
          id="email"
          type="text"
          placeholder="Email"
          className="border p-3 mt-1 rounded-lg"
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="border p-3 mt-1 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg mt-2 p-3 hover:opacity-95 disabled:opacity-80 uppercase">
          Update
        </button>
      </form>
      <div className="flex flex-row justify-between m-2">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
