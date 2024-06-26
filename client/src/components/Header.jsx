import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    setSearchTerm(searchTermFromUrl);

    if(searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

	const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to={"/"}>
          <h1 className="font-bold text-sm sm:text-xl flex-wrap">
            <span className="text-slate-500">Afroz</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            type="text"
            placeholder="Search..."
            value={searchTerm ? searchTerm : ""}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to={"/"}>
            <li className="text-slate-700 hover:underline">Home</li>
          </Link>
          <Link to={"/about"}>
            <li className="text-slate-700 hover:underline">About</li>
          </Link>


          <Link to={"/profile"}>
					{ currentUser ? (
						<img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full" />
						) : (
            	<li className="text-slate-700 hover:underline">Sign In</li>
					)}
					</Link>
        </ul>
      </div>
    </header>
  );
}
