import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { booking as bookingApi } from "../../api/client.js";

const STATUS_OPTIONS = ["pending", "approved", "designing", "installation", "maintenance", "completed", "rejected"];

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/admin" className="text-forest-green-600 font-medium">← Dashboard</Link>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-forest-green-900 mb-6">Bookings</h1>
        {loading ? <p className="text-gray-500">Loading…</p> : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  onClick={() => setSelected(b)}
                  className={`bg-white rounded-xl border p-4 cursor-pointer ${selected?._id === b._id ? "ring-2 ring-forest-green-500" : "border-gray-200"}`}
                >
                  <p className="font-medium">{b.user?.name} · {b.rooftopSizeSqFt} sq ft · {b.systemType}</p>
                  <p className="text-sm text-gray-500">{b.location?.city} · ₹{b.estimatedPriceINR?.toLocaleString()}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${b.status === "pending" ? "bg-yellow-100" : b.status === "rejected" ? "bg-red-100" : "bg-forest-green-100"}`}>{b.status}</span>
                </div>
              ))}
            </div>
            {selected && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Booking details</h3>
                <p><strong>User:</strong> {selected.user?.name} ({selected.user?.email})</p>
                <p><strong>Size:</strong> {selected.rooftopSizeSqFt} sq ft · <strong>Type:</strong> {selected.systemType}</p>
                <p><strong>Location:</strong> {selected.location?.address}, {selected.location?.city}, {selected.location?.state} - {selected.location?.pincode}</p>
                <p><strong>Estimate:</strong> ₹{selected.estimatedPriceINR?.toLocaleString()}</p>
                {selected.media?.video && <p><strong>Video:</strong> <a href={selected.media.video} target="_blank" rel="noopener noreferrer" className="text-forest-green-600 underline">View</a></p>}
                {selected.media?.images?.length > 0 && (
                  <p><strong>Images:</strong>
                    {selected.media.images.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="ml-2 text-forest-green-600 underline">[{i + 1}]</a>
                    ))}
                  </p>
                )}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update status</label>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateStatus(selected._id, s)}
                        disabled={updating || selected.status === s}
                        className={`px-3 py-1 rounded text-sm ${selected.status === s ? "bg-forest-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">Approve = approve site visit; then move to designing → installation → maintenance → completed.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
