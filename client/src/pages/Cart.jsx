import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, setQuantity, clearCart } from "../store/slices/cartSlice.js";
import { Leaf, Trash2, Minus, Plus } from "lucide-react";

export default function Cart() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Link to="/shop" className="btn-primary">Browse products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-forest-green-800 font-semibold">
            <Leaf className="w-8 h-8 text-forest-green-600" />
            Leafinity
          </Link>
          <Link to="/shop" className="text-forest-green-600 font-medium">Continue shopping</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-forest-green-900 mb-6">Cart</h1>
        <div className="bg-white rounded-xl border border-gray-200 divide-y">
          {items.map((i) => (
            <div key={i.productId} className="p-4 flex items-center gap-4 flex-wrap">
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-forest-green-50 flex items-center justify-center">
                {i.image ? (
                  <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl text-forest-green-300">🪴</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{i.name}</p>
                <p className="text-sm text-gray-500">₹{i.price?.toLocaleString()} each</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => dispatch(setQuantity({ productId: i.productId, quantity: Math.max(0, i.quantity - 1) }))}
                    className="p-2 text-forest-green-700 hover:bg-forest-green-50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="min-w-[2.5rem] text-center font-medium text-gray-900 py-2">{i.quantity}</span>
                  <button
                    type="button"
                    onClick={() => dispatch(setQuantity({ productId: i.productId, quantity: i.quantity + 1 }))}
                    className="p-2 text-forest-green-700 hover:bg-forest-green-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button type="button" onClick={() => dispatch(removeFromCart(i.productId))} className="p-2 text-red-600 hover:bg-red-50 rounded" aria-label="Remove item">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="font-medium whitespace-nowrap">₹{(i.price * i.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between items-center">
          <button type="button" onClick={() => dispatch(clearCart())} className="text-gray-500 hover:text-red-600 text-sm">Clear cart</button>
          <div className="text-right">
            <p className="text-lg font-bold text-forest-green-800">Subtotal: ₹{subtotal.toLocaleString()}</p>
            <Link to="/checkout" className="btn-primary mt-2 inline-block">Proceed to checkout</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
