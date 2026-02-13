import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { booking as bookingApi, upload } from "../api/client.js";

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
      <section id="booking" className="scroll-mt-20 py-20 bg-forest-green-50">
        <div className="container mx-auto px-4 text-center max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-xl shadow-lg border border-forest-green-200">
            <p className="text-forest-green-700 font-semibold text-lg">Booking request submitted.</p>
            <p className="text-gray-600 mt-2">We'll review and get in touch. Track status in your dashboard.</p>
            <Link to="/dashboard" className="btn-primary mt-6 inline-block">Go to Dashboard</Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="scroll-mt-20 py-20 bg-forest-green-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-forest-green-900 mb-2">Book Rooftop Service</h2>
          <p className="text-gray-600 mb-6">Multi-step: size → location → media (optional) → submit.</p>

          <div className="flex gap-2 mb-6">
            {steps.map((s, i) => (
              <span
                key={s}
                className={`px-3 py-1 rounded-full text-sm ${step > i + 1 ? "bg-forest-green-600 text-white" : step === i + 1 ? "bg-forest-green-200 text-forest-green-900" : "bg-gray-200 text-gray-500"}`}
              >
                {i + 1}. {s}
              </span>
            ))}
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-forest-green-100">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rooftop size (sq ft)</label>
                    <input
                      type="number"
                      min={50}
                      max={10000}
                      value={rooftopSize}
                      onChange={(e) => setRooftopSize(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">System type</label>
                    <select value={systemType} onChange={(e) => setSystemType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green-500">
                      <option value="soil">Soil (₹100/sq ft)</option>
                      <option value="hydro">Hydroponic (₹250/sq ft)</option>
                    </select>
                  </div>
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <button type="button" onClick={fetchEstimate} className="btn-primary w-full">Get quote & next</button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                  {estimate && <p className="text-forest-green-700 font-medium">Estimate: ₹{estimate.estimatedPriceINR?.toLocaleString()}</p>}
                  <input type="text" placeholder="Address" value={location.address} onChange={(e) => setLocation((l) => ({ ...l, address: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="City" value={location.city} onChange={(e) => setLocation((l) => ({ ...l, city: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" required />
                    <input type="text" placeholder="State" value={location.state} onChange={(e) => setLocation((l) => ({ ...l, state: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" required />
                  </div>
                  <input type="text" placeholder="Pincode" value={location.pincode} onChange={(e) => setLocation((l) => ({ ...l, pincode: e.target.value }))} className="w-full px-4 py-3 border rounded-lg" required />
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                    <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1">Next</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                  <p className="text-sm text-gray-600">Upload 1 video or up to 3 images of your roof (optional). Requires Cloudinary config.</p>
                  {!media.video && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Video</label>
                      <input type="file" accept="video/*" onChange={handleVideoSelect} disabled={uploading} className="w-full text-sm" />
                    </div>
                  )}
                  {media.images.length < 3 && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Images ({media.images.length}/3)</label>
                      <input type="file" accept="image/*" multiple onChange={handleImageSelect} disabled={uploading} className="w-full text-sm" />
                    </div>
                  )}
                  {uploading && <p className="text-sm text-gray-500">Uploading…</p>}
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                    <button type="button" onClick={() => setStep(4)} className="btn-primary flex-1">Next</button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="4" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <p className="text-gray-700">{rooftopSize} sq ft, {systemType} · ₹{estimate?.estimatedPriceINR?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{location.address}, {location.city}, {location.state} - {location.pincode}</p>
                  {!isAuthenticated && <p className="text-amber-700 text-sm">Log in to submit this booking.</p>}
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setStep(3)} className="btn-secondary flex-1">Back</button>
                    <button type="button" onClick={handleSubmit} disabled={submitLoading || !isAuthenticated} className="btn-primary flex-1">
                      {submitLoading ? "Submitting…" : "Submit booking"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
