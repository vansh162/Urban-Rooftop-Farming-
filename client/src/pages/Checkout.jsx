import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { orders } from "../api/client.js";
import { clearCart } from "../store/slices/cartSlice.js";
import { Leaf } from "lucide-react";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Link to="/shop" className="btn-primary">Browse products</Link>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to checkout.</p>
          <Link to="/login" className="btn-primary">Log in</Link>
        </div>
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-forest-green-800 font-semibold">
            <Leaf className="w-8 h-8 text-forest-green-600" />
            Leafinity
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-forest-green-900 mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="font-semibold text-gray-900">Shipping address</h2>
          <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
            <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
          </div>
          <input type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
          <p className="font-medium text-forest-green-800">Total: ₹{subtotal.toLocaleString()}</p>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">Place order</button>
        </form>
      </main>
    </div>
  );
}
