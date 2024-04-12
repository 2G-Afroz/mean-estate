import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";
import {
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";
import {
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const [filePer, setFilePer] = useState(0);
  const [fileSizeErr, setFileSizeErr] = useState(false);
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const [updateSucess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    if (file.size > 2 * 1024 * 1024) {
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
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },
      () => {
        setFileUploadErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChanges = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
      console.log(err);
    }
  };

  const handleSignoutUser = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch("/api/user/logout");
      const data = res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (err) {
      dispatch(signoutUserFailure(err.message));
    }
  };

  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
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
            <span className="text-red-700 ">
              File size should be less than 2MB.
            </span>
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
          defaultValue={currentUser.username}
          onChange={handleChanges}
        />
        <input
          id="email"
          type="text"
          placeholder="Email"
          className="border p-3 mt-1 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChanges}
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="border p-3 mt-1 rounded-lg"
          onChange={handleChanges}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg mt-2 p-3 hover:opacity-95 disabled:opacity-80 uppercase"
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
			<div className="bg-green-700 p-3 text-center uppercase mt-3 rounded-lg text-white hover:opacity-95 cursor-pointer">
					<Link to="/create-listing">Create Listing</Link>
			</div>
      <div className="flex flex-row justify-between m-2">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignoutUser}
          className="text-red-700 cursor-pointer"
        >
          Sign out
        </span>
      </div>
      <p className="text-red-700">{error ? error : ""}</p>
      <p className="text-green-700">
        {updateSucess ? "Updated Successfully." : ""}
      </p>
    </div>
  );
}
