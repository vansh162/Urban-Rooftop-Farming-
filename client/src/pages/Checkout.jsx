import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { orders } from "../api/client.js";
import { clearCart } from "../store/slices/cartSlice.js";
import { Leaf, MapPin } from "lucide-react";

export default function Checkout() {
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-organic flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-organic max-w-md p-10 text-center">
          <p className="text-forest-green-700 mb-6">Your cart is empty.</p>
          <Link to="/shop" className="btn-primary">Browse products</Link>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-organic flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-organic max-w-md p-10 text-center">
          <p className="text-forest-green-700 mb-6">Please log in to checkout.</p>
          <Link to="/login" className="btn-primary">Log in</Link>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address || !city || !state || !pincode) {
      setError("Please fill shipping address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await orders.create({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: { address, city, state, pincode },
      });
      dispatch(clearCart());
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Order failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-organic">
      <header className="border-b border-forest-green-100/80 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 rounded-2xl py-2 pr-3 transition-colors hover:bg-forest-green-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-green-600 shadow-soft">
              <Leaf className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <span className="font-display text-xl font-bold text-forest-green-900">Leafinity</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-bold text-forest-green-900 mb-8"
        >
          Checkout
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="card-organic p-8 sm:p-10 space-y-5"
        >
          <div className="flex items-center gap-2 text-forest-green-800 mb-4">
            <MapPin className="w-5 h-5 text-forest-green-600" />
            <h2 className="font-display text-lg font-bold">Shipping address</h2>
          </div>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input-organic"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="input-organic" required />
            <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="input-organic" required />
          </div>
          <input type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} className="input-organic" required />
          <div className="rounded-xl bg-forest-green-50 px-4 py-3">
            <p className="font-bold text-forest-green-900">Total: ₹{subtotal.toLocaleString()}</p>
          </div>
          {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{error}</p>}
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="btn-primary w-full">
            {loading ? "Placing order…" : "Place order"}
          </motion.button>
        </motion.form>
      </main>
    </div>
  );
}
