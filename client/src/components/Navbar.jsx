import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Leaf } from "lucide-react";
import { logout } from "../store/slices/authSlice.js";
import { auth } from "../api/client.js";

export default function Navbar() {
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (_) {}
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-forest-green-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-forest-green-800 font-semibold hover:text-forest-green-600 transition-colors">
            <Leaf className="w-8 h-8 text-forest-green-600" />
            <span>Leafinity</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="/#booking" className="text-gray-700 hover:text-forest-green-600 font-medium transition-colors">
              Get Quote
            </a>
            <Link to="/shop" className="text-gray-700 hover:text-forest-green-600 font-medium transition-colors">
              Shop
            </Link>
            {isAuthenticated ? (
              <>
                {role === "admin" ? (
                  <Link to="/admin" className="text-gray-700 hover:text-forest-green-600 font-medium transition-colors">
                    Admin
                  </Link>
                ) : (
                  <Link to="/dashboard" className="text-gray-700 hover:text-forest-green-600 font-medium transition-colors">
                    Dashboard
                  </Link>
                )}
                <span className="text-gray-500 text-sm hidden sm:inline">{user?.name}</span>
                <button type="button" onClick={handleLogout} className="text-gray-700 hover:text-forest-green-600 font-medium transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-forest-green-600 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
