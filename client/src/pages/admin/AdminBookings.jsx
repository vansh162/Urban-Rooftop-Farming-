import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { booking as bookingApi } from "../../api/client.js";
import { Leaf, Calendar, MapPin, Image, Video } from "lucide-react";

const STATUS_OPTIONS = ["pending", "approved", "designing", "installation", "maintenance", "completed", "rejected"];

const statusClass = (s) => {
  if (s === "pending") return "bg-amber-100 text-amber-800";
  if (s === "rejected") return "bg-red-100 text-red-800";
  return "bg-forest-green-100 text-forest-green-800";
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const load = () => {
    bookingApi.adminList(statusFilter ? { status: statusFilter } : {}).then(setBookings).catch(() => setBookings([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      await bookingApi.adminUpdate(id, { status });
      setSelected((s) => (s && s._id === id ? { ...s, status } : s));
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-organic">
      <header className="sticky top-0 z-10 border-b border-forest-green-100/80 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-forest-green-700 transition-all hover:bg-forest-green-100"
          >
            ← Dashboard
          </Link>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-organic w-auto min-w-[160px]"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-forest-green-900 mb-8">Bookings</h1>

        {loading ? (
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-28 flex-1 animate-pulse rounded-3xl bg-forest-green-100/50" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              {bookings.map((b, i) => (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelected(b)}
                  className={`card-organic cursor-pointer p-5 transition-all hover:shadow-leaf ${selected?._id === b._id ? "ring-2 ring-forest-green-500 ring-offset-2" : ""}`}
                >
                  <p className="font-display font-bold text-forest-green-900">{b.user?.name} · {b.rooftopSizeSqFt} sq ft · {b.systemType}</p>
                  <p className="text-sm text-forest-green-700">{b.location?.city} · ₹{b.estimatedPriceINR?.toLocaleString()}</p>
                  <span className={`mt-2 inline-block rounded-xl px-2.5 py-1 text-xs font-semibold ${statusClass(b.status)}`}>{b.status}</span>
                </motion.div>
              ))}
            </div>

            {selected && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                className="card-organic p-6 sm:p-8"
              >
                <h3 className="font-display text-lg font-bold text-forest-green-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-forest-green-600" />
                  Booking details
                </h3>
                <div className="space-y-3 text-sm text-forest-green-800">
                  <p><strong>User:</strong> {selected.user?.name} ({selected.user?.email})</p>
                  <p><strong>Size:</strong> {selected.rooftopSizeSqFt} sq ft · <strong>Type:</strong> {selected.systemType}</p>
                  <p className="flex items-start gap-2"><strong><MapPin className="inline w-4 h-4" /></strong> {selected.location?.address}, {selected.location?.city}, {selected.location?.state} - {selected.location?.pincode}</p>
                  <p><strong>Estimate:</strong> ₹{selected.estimatedPriceINR?.toLocaleString()}</p>
                  {selected.media?.video && (
                    <p className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      <a href={selected.media.video} target="_blank" rel="noopener noreferrer" className="text-forest-green-600 font-semibold hover:underline">View video</a>
                    </p>
                  )}
                  {selected.media?.images?.length > 0 && (
                    <p className="flex items-center gap-2 flex-wrap">
                      <Image className="w-4 h-4 shrink-0" />
                      {selected.media.images.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-forest-green-600 font-semibold hover:underline">[Image {i + 1}]</a>
                      ))}
                    </p>
                  )}
                </div>
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-forest-green-800">Update status</label>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <motion.button
                        key={s}
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => updateStatus(selected._id, s)}
                        disabled={updating || selected.status === s}
                        className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors ${selected.status === s ? "bg-forest-green-600 text-white" : "bg-forest-green-100 text-forest-green-800 hover:bg-forest-green-200"}`}
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-xs text-forest-green-600">Approve = approve site visit; then move to designing → installation → maintenance → completed.</p>
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
