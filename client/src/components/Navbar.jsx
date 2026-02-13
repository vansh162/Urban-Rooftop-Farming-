import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Leaf, Menu } from "lucide-react";
import { logout } from "../store/slices/authSlice.js";
import { auth } from "../api/client.js";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (_) {}
    dispatch(logout());
    navigate("/");
    setMobileOpen(false);
  };

  const linkClass =
    "rounded-xl px-4 py-2.5 text-sm font-semibold text-forest-green-700 transition-all duration-200 hover:bg-forest-green-100 hover:text-forest-green-800";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-forest-green-100/80 bg-white/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-2xl py-2 pr-3 transition-colors hover:bg-forest-green-50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-green-600 shadow-soft">
            <Leaf className="h-5 w-5 text-white" strokeWidth={2} />
          </div>
          <span className="font-display text-xl font-bold text-forest-green-900">Leafinity</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <a href="/#booking" className={linkClass}>
            Get Quote
          </a>
          <Link to="/shop" className={linkClass}>
            Shop
          </Link>
          {isAuthenticated ? (
            <>
              {role === "admin" ? (
                <Link to="/admin" className={linkClass}>
                  Admin
                </Link>
              ) : (
                <Link to="/dashboard" className={linkClass}>
                  Dashboard
                </Link>
              )}
              <span className="ml-2 rounded-xl bg-forest-green-50 px-3 py-2 text-sm font-medium text-forest-green-700">
                {user?.name}
              </span>
              <button type="button" onClick={handleLogout} className={linkClass}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2.5 px-5">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="rounded-xl p-2.5 text-forest-green-700 hover:bg-forest-green-100 md:hidden"
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-forest-green-100 bg-white/95 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-1 p-4">
            <a href="/#booking" className={linkClass} onClick={() => setMobileOpen(false)}>
              Get Quote
            </a>
            <Link to="/shop" className={linkClass} onClick={() => setMobileOpen(false)}>
              Shop
            </Link>
            {isAuthenticated ? (
              <>
                {role === "admin" ? (
                  <Link to="/admin" className={linkClass} onClick={() => setMobileOpen(false)}>
                    Admin
                  </Link>
                ) : (
                  <Link to="/dashboard" className={linkClass} onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                )}
                <span className="px-4 py-2 text-sm text-forest-green-600">{user?.name}</span>
                <button type="button" onClick={handleLogout} className={linkClass}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClass} onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary mt-2 text-center" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
