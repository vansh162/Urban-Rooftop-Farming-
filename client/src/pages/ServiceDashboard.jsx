import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Calendar, Leaf, Home, ShoppingBag, ShoppingCart, MapPin } from "lucide-react";
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
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-blue-100 text-blue-800",
    designing: "bg-purple-100 text-purple-800",
    installation: "bg-indigo-100 text-indigo-800",
    maintenance: "bg-forest-green-100 text-forest-green-800",
    completed: "bg-forest-green-100 text-forest-green-700",
    rejected: "bg-red-100 text-red-800",
  };

  const navBtn = "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-forest-green-700 transition-all hover:bg-forest-green-100";

  return (
    <div className="min-h-screen bg-gradient-organic">
      <header className="sticky top-0 z-10 border-b border-forest-green-100/80 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-forest-green-900 sm:text-3xl">My Dashboard</h1>
              <p className="text-forest-green-700/90 text-sm">Welcome, {user?.name}. Track your bookings and maintenance.</p>
            </div>
            <nav className="flex flex-wrap items-center gap-2">
              <Link to="/" className={navBtn}><Home className="w-4 h-4" /> Home</Link>
              <Link to="/shop" className={navBtn}><ShoppingBag className="w-4 h-4" /> Continue Shopping</Link>
              <Link to="/cart" className={navBtn}>
                <ShoppingCart className="w-4 h-4" />
                Cart {cartCount > 0 && <span className="rounded-full bg-forest-green-600 px-2 py-0.5 text-xs text-white">{cartCount}</span>}
              </Link>
              <a href="/#booking" className={navBtn}>Get Quote</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold text-forest-green-900">
            <Calendar className="w-5 h-5 text-forest-green-600" />
            My Bookings
          </h2>
          {loading ? (
            <div className="flex gap-4">
              {[1, 2].map((i) => <div key={i} className="h-32 flex-1 animate-pulse rounded-3xl bg-forest-green-100/50" />)}
            </div>
          ) : bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-organic p-10 text-center"
            >
              <p className="text-forest-green-700 mb-4">No bookings yet.</p>
              <p className="mb-6 text-sm text-forest-green-600">
                <a href="/#booking" className="font-semibold text-forest-green-600 hover:underline">Request a quote</a>
                {" or "}
                <Link to="/shop" className="font-semibold text-forest-green-600 hover:underline">browse the shop</Link>.
              </p>
              <Link to="/#booking" className="btn-primary inline-flex">Get quote</Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b, i) => (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-organic p-6 sm:p-8"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest-green-100">
                        <MapPin className="h-6 w-6 text-forest-green-600" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-forest-green-900">{b.rooftopSizeSqFt} sq ft · {b.systemType}</p>
                        <p className="text-sm text-forest-green-700">{b.location?.city}, {b.location?.state} · ₹{b.estimatedPriceINR?.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className={`rounded-xl px-3 py-1.5 text-sm font-semibold ${statusColors[b.status] || "bg-gray-100 text-gray-800"}`}>
                      {b.status}
                    </span>
                  </div>
                  {b.maintenanceSchedule?.length > 0 && (
                    <div className="mt-6 border-t border-forest-green-100 pt-6">
                      <p className="mb-2 text-sm font-semibold text-forest-green-800">Maintenance</p>
                      <ul className="space-y-1.5 text-sm text-forest-green-700">
                        {b.maintenanceSchedule.map((m, j) => (
                          <li key={j} className="flex items-center gap-2">
                            {m.date ? new Date(m.date).toLocaleDateString() : "—"} {m.completed ? <span className="text-forest-green-600">✓ Done</span> : "Scheduled"}
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

        <section className="mt-12">
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold text-forest-green-900">
            <Leaf className="w-5 h-5 text-forest-green-600" />
            Harvest logs
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="card-organic p-10 text-center text-forest-green-700"
          >
            Harvest logs will appear here once your project is in maintenance phase.
          </motion.div>
        </section>
      </main>
    </div>
  );
}
