import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { booking as bookingApi, upload } from "../api/client.js";
import { MapPin, ChevronRight, Check, Image, Video } from "lucide-react";

const steps = ["Size & type", "Location", "Media", "Confirm"];

export default function BookingSection() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [rooftopSize, setRooftopSize] = useState("");
  const [systemType, setSystemType] = useState("soil");
  const [estimate, setEstimate] = useState(null);
  const [location, setLocation] = useState({ address: "", city: "", state: "", pincode: "" });
  const [media, setMedia] = useState({ video: "", images: [] });
  const [uploading, setUploading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchEstimate = async () => {
    const size = Number(rooftopSize);
    if (!size || size < 50 || size > 10000) {
      setError("Enter rooftop size between 50 and 10,000 sq ft.");
      return false;
    }
    setError("");
    try {
      const result = await bookingApi.estimate({ rooftopSizeSqFt: size, systemType });
      if (result.success) {
        setEstimate(result);
        setStep(2);
        return true;
      }
      setError(result.error || "Could not get estimate.");
      return false;
    } catch (err) {
      setError(err.message || "Server error.");
      return false;
    }
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 3 - media.images.length);
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of files) {
        const reader = new FileReader();
        const dataUrl = await new Promise((res) => {
          reader.onload = () => res(reader.result);
          reader.readAsDataURL(file);
        });
        const { url } = await upload.image(dataUrl);
        setMedia((m) => ({ ...m, images: [...m.images, url].slice(0, 3) }));
      }
    } catch (err) {
      setError(err.message || "Upload failed. Add Cloudinary keys or skip.");
    } finally {
      setUploading(false);
    }
  };

  const handleVideoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise((res) => {
        reader.onload = () => res(reader.result);
        reader.readAsDataURL(file);
      });
      const { url } = await upload.video(dataUrl);
      setMedia((m) => ({ ...m, video: url }));
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setError("Please log in to submit a booking.");
      return;
    }
    if (!location.address || !location.city || !location.state || !location.pincode) {
      setError("Complete location details required.");
      return;
    }
    setError("");
    setSubmitLoading(true);
    try {
      await bookingApi.create({
        rooftopSizeSqFt: Number(rooftopSize),
        systemType,
        location,
        estimatedPriceINR: estimate.estimatedPriceINR,
        media: media.video ? { video: media.video } : media.images.length ? { images: media.images } : {},
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Booking failed.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (success) {
    return (
      <section id="booking" className="scroll-mt-24 py-24 bg-sage">
        <div className="container mx-auto px-4 max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="card-organic p-10"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-green-100">
              <Check className="h-8 w-8 text-forest-green-600" />
            </div>
            <h3 className="font-display text-2xl font-bold text-forest-green-900 mb-2">Booking submitted</h3>
            <p className="text-forest-green-700 mb-6">We'll review and get in touch. Track status in your dashboard.</p>
            <Link to="/dashboard" className="btn-primary inline-flex gap-2">Go to Dashboard</Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="scroll-mt-24 py-24 bg-sage">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="font-display text-4xl font-bold text-forest-green-900 mb-2">Book Rooftop Service</h2>
            <p className="text-forest-green-700/90">Size → Location → Media (optional) → Submit</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {steps.map((s, i) => (
              <span
                key={s}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  step > i + 1
                    ? "bg-forest-green-600 text-white"
                    : step === i + 1
                    ? "bg-forest-green-200 text-forest-green-900 ring-2 ring-forest-green-400"
                    : "bg-forest-green-100/60 text-forest-green-500"
                }`}
              >
                {i + 1}. {s}
              </span>
            ))}
          </div>

          <motion.div layout className="card-organic p-8 sm:p-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="1"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-forest-green-800">Rooftop size (sq ft)</label>
                    <input
                      type="number"
                      min={50}
                      max={10000}
                      value={rooftopSize}
                      onChange={(e) => setRooftopSize(e.target.value)}
                      placeholder="e.g. 500"
                      className="input-organic"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-forest-green-800">System type</label>
                    <select
                      value={systemType}
                      onChange={(e) => setSystemType(e.target.value)}
                      className="input-organic"
                    >
                      <option value="soil">Soil (₹100/sq ft)</option>
                      <option value="hydro">Hydroponic (₹250/sq ft)</option>
                    </select>
                  </div>
                  {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
                  <button type="button" onClick={fetchEstimate} className="btn-primary w-full gap-2">
                    Get quote & continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="2"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {estimate && (
                    <p className="rounded-xl bg-forest-green-100 px-4 py-3 font-semibold text-forest-green-800">
                      Estimate: ₹{estimate.estimatedPriceINR?.toLocaleString()}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-forest-green-700 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-semibold">Location</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Address"
                    value={location.address}
                    onChange={(e) => setLocation((l) => ({ ...l, address: e.target.value }))}
                    className="input-organic"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={location.city}
                      onChange={(e) => setLocation((l) => ({ ...l, city: e.target.value }))}
                      className="input-organic"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={location.state}
                      onChange={(e) => setLocation((l) => ({ ...l, state: e.target.value }))}
                      className="input-organic"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={location.pincode}
                    onChange={(e) => setLocation((l) => ({ ...l, pincode: e.target.value }))}
                    className="input-organic"
                    required
                  />
                  {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                      Back
                    </button>
                    <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1 gap-2">
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="3"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <p className="text-forest-green-700/90 text-sm">
                    Upload 1 video or up to 3 images of your roof (optional). Requires Cloudinary config.
                  </p>
                  {!media.video && (
                    <div className="rounded-xl border-2 border-dashed border-forest-green-200 bg-forest-green-50/50 p-4">
                      <label className="flex cursor-pointer items-center gap-3">
                        <Video className="w-5 h-5 text-forest-green-600" />
                        <span className="text-sm font-medium text-forest-green-700">Add video</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoSelect}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                  {media.images.length < 3 && (
                    <div className="rounded-xl border-2 border-dashed border-forest-green-200 bg-forest-green-50/50 p-4">
                      <label className="flex cursor-pointer items-center gap-3">
                        <Image className="w-5 h-5 text-forest-green-600" />
                        <span className="text-sm font-medium text-forest-green-700">
                          Add images ({media.images.length}/3)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageSelect}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                  {uploading && <p className="text-sm text-forest-green-600">Uploading…</p>}
                  {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">
                      Back
                    </button>
                    <button type="button" onClick={() => setStep(4)} className="btn-primary flex-1 gap-2">
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="4"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="rounded-xl bg-forest-green-50 p-4 space-y-1">
                    <p className="font-semibold text-forest-green-900">
                      {rooftopSize} sq ft · {systemType} · ₹{estimate?.estimatedPriceINR?.toLocaleString()}
                    </p>
                    <p className="text-sm text-forest-green-700">
                      {location.address}, {location.city}, {location.state} – {location.pincode}
                    </p>
                  </div>
                  {!isAuthenticated && (
                    <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                      Log in to submit this booking.
                    </p>
                  )}
                  {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep(3)} className="btn-secondary flex-1">
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitLoading || !isAuthenticated}
                      className="btn-primary flex-1 gap-2"
                    >
                      {submitLoading ? "Submitting…" : "Submit booking"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
