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
  const [imagePreview, setImagePreview] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const load = () => {
    bookingApi.adminList(statusFilter ? { status: statusFilter } : {}).then(setBookings).catch(() => setBookings([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  // Update image list when a booking is selected
  useEffect(() => {
    if (!selected) {
      setImageList([]);
      setCurrentImageIndex(0);
      setImagePreview(null);
      return;
    }
    const imgs = selected.media?.images
      ? Array.isArray(selected.media.images)
        ? selected.media.images
        : [selected.media.images]
      : [];
    setImageList(imgs);
  }, [selected]);

  // keyboard navigation for modal
  useEffect(() => {
    const onKey = (e) => {
      if (!imagePreview) return;
      if (e.key === "Escape") return setImagePreview(null);
      if (e.key === "ArrowRight") return goNext();
      if (e.key === "ArrowLeft") return goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imagePreview, imageList, currentImageIndex]);

  const openGalleryAt = (index) => {
    if (!imageList || !imageList.length) return;
    const idx = Math.max(0, Math.min(index, imageList.length - 1));
    setCurrentImageIndex(idx);
    setImagePreview(imageList[idx]);
  };

  const goNext = () => {
    if (!imageList.length) return;
    const next = (currentImageIndex + 1) % imageList.length;
    setCurrentImageIndex(next);
    setImagePreview(imageList[next]);
  };

  const goPrev = () => {
    if (!imageList.length) return;
    const prev = (currentImageIndex - 1 + imageList.length) % imageList.length;
    setCurrentImageIndex(prev);
    setImagePreview(imageList[prev]);
  };

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



  const openAllImages = () => {
    if (!imageList || !imageList.length) return;
    imageList.forEach((url) => window.open(url, "_blank", "noopener,noreferrer"));
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
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-semibold text-forest-green-800">Video</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <a
                          href={selected.media.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative overflow-hidden rounded-xl border border-forest-green-100 bg-black"
                        >
                          <video
                            src={selected.media.video}
                            className="h-24 w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 group-hover:bg-white/90 transition-all">
                              <div className="h-0 w-0 border-l-[6px] border-t-[4px] border-b-[4px] border-l-forest-green-600 border-t-transparent border-b-transparent ml-1" />
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  )}

                  {imageList.length > 0 && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => openGalleryAt(0)}
                        className="inline-flex items-center gap-2 rounded-xl bg-forest-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:brightness-95"
                      >
                        View images ({imageList.length})
                      </button>
                      <button
                        type="button"
                        onClick={openAllImages}
                        className="ml-3 inline-flex items-center gap-2 rounded-xl bg-forest-green-100 px-3 py-1.5 text-sm font-semibold text-forest-green-800 hover:bg-forest-green-200"
                      >
                        Open all
                      </button>
                    </div>
                  )}

                  {selected.media?.images && (() => {
                    const imgs = Array.isArray(selected.media.images)
                      ? selected.media.images
                      : selected.media.images
                      ? [selected.media.images]
                      : [];
                    if (imgs.length === 0) return null;
                    return (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Image className="w-4 h-4 shrink-0" />
                          <span className="text-sm font-semibold text-forest-green-800">Images</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {imgs.map((url, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setImagePreview(url)}
                              className="overflow-hidden rounded-xl border border-forest-green-100 bg-white p-0"
                            >
                              <img loading="lazy" src={url} alt={`roof-${i + 1}`} className="h-24 w-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
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
      {imagePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setImagePreview(null)}>
          <div className="max-w-4xl w-full p-4">
            <div className="relative bg-white rounded-2xl overflow-hidden">
              <button
                onClick={() => setImagePreview(null)}
                className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-2 text-sm"
              >
                Close
              </button>
              <img src={imagePreview} alt="preview" className="w-full h-[70vh] object-contain bg-black" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
