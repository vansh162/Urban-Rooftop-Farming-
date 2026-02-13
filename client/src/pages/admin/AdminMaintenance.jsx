import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { booking as bookingApi } from "../../api/client.js";

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link to="/admin" className="text-forest-green-600 font-medium">← Dashboard</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-forest-green-900 mb-6">Maintenance Scheduler</h1>
        <p className="text-gray-600 mb-6">Bookings in &quot;maintenance&quot; status. Add monthly visits and mark complete.</p>
        {loading ? <p className="text-gray-500">Loading…</p> : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  onClick={() => setSelected(b)}
                  className={`bg-white rounded-xl border p-4 cursor-pointer ${selected?._id === b._id ? "ring-2 ring-forest-green-500" : "border-gray-200"}`}
                >
                  <p className="font-medium">{b.user?.name}</p>
                  <p className="text-sm text-gray-500">{b.location?.city} · {(b.maintenanceSchedule || []).length} visit(s)</p>
                </div>
              ))}
              {bookings.length === 0 && <p className="text-gray-500">No bookings in maintenance.</p>}
            </div>
            {selected && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{selected.user?.name} – Maintenance</h3>
                <div className="space-y-4">
                  <input type="date" value={schedule.date} onChange={(e) => setSchedule((s) => ({ ...s, date: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                  <input type="text" placeholder="Notes" value={schedule.notes} onChange={(e) => setSchedule((s) => ({ ...s, notes: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                  <button type="button" onClick={addMaintenanceVisit} disabled={saving || !schedule.date} className="btn-primary">
                    Add visit
                  </button>
                </div>
                <ul className="mt-6 space-y-2">
                  {(selected.maintenanceSchedule || []).map((m, i) => (
                    <li key={i} className="flex items-center justify-between py-2 border-b">
                      <span>{m.date ? new Date(m.date).toLocaleDateString() : "—"} {m.notes && `· ${m.notes}`}</span>
                      {!m.completed ? <button type="button" onClick={() => markComplete(selected._id, i)} className="text-sm text-forest-green-600 hover:underline">Mark done</button> : <span className="text-green-600 text-sm">Done</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
