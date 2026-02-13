import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { removeFromCart, setQuantity, clearCart } from "../store/slices/cartSlice.js";
import { Leaf, Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

const placeholderImage = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop";

function EmptyCartIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto mb-6 flex h-40 w-40 items-center justify-center rounded-3xl bg-forest-green-100/80"
    >
      <div className="relative">
        <ShoppingBag className="h-20 w-20 text-forest-green-400" strokeWidth={1.2} />
        <Leaf className="absolute -right-2 -top-2 h-8 w-8 text-forest-green-500" strokeWidth={1.5} />
      </div>
    </motion.div>
  );
}

export default function Cart() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-organic flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card-organic max-w-md w-full p-10 text-center"
        >
          <EmptyCartIllustration />
          <h2 className="font-display text-2xl font-bold text-forest-green-900 mb-2">Your cart is empty</h2>
          <p className="text-forest-green-700/90 mb-6">Add products from the shop to get started.</p>
          <Link to="/shop" className="btn-primary inline-flex gap-2">
            <ShoppingBag className="w-5 h-5" />
            Browse products
          </Link>
        </motion.div>
      </div>
    );
  }

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
          <Link to="/shop" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-forest-green-700 hover:bg-forest-green-100 transition-colors">
            Continue shopping
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-bold text-forest-green-900 mb-8"
        >
          Cart
        </motion.h1>

        <div className="space-y-4">
          {items.map((i, idx) => (
            <motion.div
              key={i.productId}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card-organic flex flex-wrap items-center gap-4 p-5 sm:p-6"
            >
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-forest-green-50 sm:h-28 sm:w-28">
                {(i.image && i.image.startsWith("http")) ? (
                  <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                ) : (
                  <img src={placeholderImage} alt={i.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-forest-green-900">{i.name}</p>
                <p className="text-sm text-forest-green-600">₹{i.price?.toLocaleString()} each</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-xl border-2 border-forest-green-200 bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => dispatch(setQuantity({ productId: i.productId, quantity: Math.max(0, i.quantity - 1) }))}
                    className="p-2.5 text-forest-green-700 hover:bg-forest-green-50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="min-w-[2.5rem] text-center font-semibold text-forest-green-900 py-2">{i.quantity}</span>
                  <button
                    type="button"
                    onClick={() => dispatch(setQuantity({ productId: i.productId, quantity: i.quantity + 1 }))}
                    className="p-2.5 text-forest-green-700 hover:bg-forest-green-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(removeFromCart(i.productId))}
                  className="rounded-xl p-2.5 text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <p className="w-full font-bold text-forest-green-800 sm:w-auto sm:text-lg">₹{(i.price * i.quantity).toLocaleString()}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col items-end gap-4 sm:flex-row sm:justify-between"
        >
          <button
            type="button"
            onClick={() => dispatch(clearCart())}
            className="text-sm font-medium text-forest-green-600 hover:text-red-600 transition-colors"
          >
            Clear cart
          </button>
          <div className="flex flex-col items-end gap-3">
            <p className="text-xl font-bold text-forest-green-900">Subtotal: ₹{subtotal.toLocaleString()}</p>
            <Link to="/checkout" className="btn-primary">
              Proceed to checkout
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
