import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full w-24 h-24 self-center"
        />
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
