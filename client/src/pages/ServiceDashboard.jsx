import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Calendar, Leaf, Home, ShoppingBag, ShoppingCart } from "lucide-react";
import { booking } from "../api/client.js";

export default function ServiceDashboard() {
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    booking.my().then(setBookings).catch(() => setBookings([])).finally(() => setLoading(false));
  }, []);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-blue-100 text-blue-800",
    designing: "bg-purple-100 text-purple-800",
    installation: "bg-indigo-100 text-indigo-800",
    maintenance: "bg-forest-green-100 text-forest-green-800",
    completed: "bg-gray-100 text-gray-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
            <div>
              <h1 className="text-2xl font-bold text-forest-green-900">My Dashboard</h1>
              <p className="text-gray-600 text-sm">Welcome, {user?.name}. Track your bookings and maintenance.</p>
            </div>
            <nav className="flex flex-wrap items-center gap-2 sm:gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-forest-green-50 hover:text-forest-green-700 font-medium transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-forest-green-50 hover:text-forest-green-700 font-medium transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
              </Link>
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-forest-green-50 hover:text-forest-green-700 font-medium transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Cart {cartCount > 0 && <span className="bg-forest-green-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">{cartCount}</span>}
              </Link>
              <a
                href="/#booking"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-forest-green-50 hover:text-forest-green-700 font-medium transition-colors"
              >
                Get Quote
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" /> My Bookings
          </h2>
          {loading ? (
            <p className="text-gray-500">Loading…</p>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              No bookings yet.{" "}
              <a href="/#booking" className="text-forest-green-600 hover:underline">Request a quote</a>
              {" or "}
              <Link to="/shop" className="text-forest-green-600 hover:underline">browse the shop</Link>.
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {b.rooftopSizeSqFt} sq ft · {b.systemType}
                      </p>
                      <p className="text-sm text-gray-500">
                        {b.location?.city}, {b.location?.state} · ₹{b.estimatedPriceINR?.toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[b.status] || "bg-gray-100"}`}>
                      {b.status}
                    </span>
                  </div>
                  {b.maintenanceSchedule?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-700 mb-2">Maintenance</p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {b.maintenanceSchedule.map((m, i) => (
                          <li key={i}>
                            {m.date ? new Date(m.date).toLocaleDateString() : "—"} {m.completed ? "✓ Done" : "Scheduled"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5" /> Harvest logs
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            Harvest logs will appear here once your project is in maintenance phase.
          </div>
        </section>
      </main>
    </div>
  );
}
