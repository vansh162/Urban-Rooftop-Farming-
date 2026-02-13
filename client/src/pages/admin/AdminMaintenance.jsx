import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { booking as bookingApi } from "../../api/client.js";
import { Leaf, Wrench, Check } from "lucide-react";

export default function AdminMaintenance() {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState({ date: "", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    bookingApi.adminList({ status: "maintenance" }).then(setBookings).catch(() => setBookings([])).finally(() => setLoading(false));
  }, []);

  const addMaintenanceVisit = async () => {
    if (!selected || !schedule.date) return;
    setSaving(true);
    try {
      const next = [...(selected.maintenanceSchedule || []), { date: schedule.date, completed: false, notes: schedule.notes }];
      await bookingApi.adminUpdate(selected._id, { maintenanceSchedule: next });
      setSelected((s) => s ? { ...s, maintenanceSchedule: next } : null);
      setSchedule({ date: "", notes: "" });
      bookingApi.adminList({ status: "maintenance" }).then(setBookings);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const markComplete = async (bookingId, index) => {
    try {
      const b = bookings.find((x) => x._id === bookingId);
      if (!b) return;
      const next = [...(b.maintenanceSchedule || [])];
      next[index] = { ...next[index], completed: true };
      await bookingApi.adminUpdate(bookingId, { maintenanceSchedule: next });
      setSelected((s) => s?._id === bookingId ? { ...s, maintenanceSchedule: next } : s);
      bookingApi.adminList({ status: "maintenance" }).then(setBookings);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-organic">
      <header className="sticky top-0 z-10 border-b border-forest-green-100/80 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-forest-green-700 transition-all hover:bg-forest-green-100"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-forest-green-900 mb-2">Maintenance Scheduler</h1>
        <p className="text-forest-green-700 mb-8">Bookings in &quot;maintenance&quot; status. Add monthly visits and mark complete.</p>

        {loading ? (
          <div className="flex gap-4">
            {[1, 2].map((i) => <div key={i} className="h-24 flex-1 animate-pulse rounded-3xl bg-forest-green-100/50" />)}
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
                  <p className="font-display font-bold text-forest-green-900">{b.user?.name}</p>
                  <p className="text-sm text-forest-green-700">{b.location?.city} · {(b.maintenanceSchedule || []).length} visit(s)</p>
                </motion.div>
              ))}
              {bookings.length === 0 && (
                <div className="card-organic p-10 text-center text-forest-green-700">No bookings in maintenance.</div>
              )}
            </div>

            {selected && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                className="card-organic p-6 sm:p-8"
              >
                <h3 className="font-display text-lg font-bold text-forest-green-900 mb-6 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-forest-green-600" />
                  {selected.user?.name} – Maintenance
                </h3>
                <div className="space-y-4">
                  <input
                    type="date"
                    value={schedule.date}
                    onChange={(e) => setSchedule((s) => ({ ...s, date: e.target.value }))}
                    className="input-organic"
                  />
                  <input
                    type="text"
                    placeholder="Notes"
                    value={schedule.notes}
                    onChange={(e) => setSchedule((s) => ({ ...s, notes: e.target.value }))}
                    className="input-organic"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addMaintenanceVisit}
                    disabled={saving || !schedule.date}
                    className="btn-primary"
                  >
                    Add visit
                  </motion.button>
                </div>
                <ul className="mt-8 space-y-3 border-t border-forest-green-100 pt-6">
                  {(selected.maintenanceSchedule || []).map((m, i) => (
                    <li key={i} className="flex items-center justify-between rounded-xl bg-forest-green-50/50 px-4 py-3">
                      <span className="text-sm text-forest-green-800">
                        {m.date ? new Date(m.date).toLocaleDateString() : "—"} {m.notes && `· ${m.notes}`}
                      </span>
                      {!m.completed ? (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => markComplete(selected._id, i)}
                          className="text-sm font-semibold text-forest-green-600 hover:underline"
                        >
                          Mark done
                        </motion.button>
                      ) : (
                        <span className="flex items-center gap-1 text-sm font-semibold text-forest-green-600">
                          <Check className="w-4 h-4" /> Done
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
