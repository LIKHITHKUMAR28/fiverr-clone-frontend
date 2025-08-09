import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Logo + Username/Role */}
        <div className="flex flex-col">
          <Link 
            to="/" 
            className="text-2xl font-bold tracking-wide text-blue-400 hover:text-blue-300 transition"
          >
            Freelance<span className="text-purple-400">Hub</span>
          </Link>
          {user && (
            <span className="text-xs text-gray-400 italic mt-0.5">
              {user.username} 
              <br/>
              Role: {user.role}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          {user?.role === "freelancer" && (
            <>
              <Link to="/create-gig" className="hover:text-blue-300 transition">
                + Create Gig
              </Link>
              <Link to="/orders" className="hover:text-blue-300 transition">
                Orders
              </Link>
            </>
          )}

          {user?.role === "client" && (
            <>
              <Link to="/gigs" className="hover:text-purple-300 transition">
                Explore Gigs
              </Link>
              <Link to="/orders" className="hover:text-purple-300 transition">
                Orders
              </Link>
            </>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
