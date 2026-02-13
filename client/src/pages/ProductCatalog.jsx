import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { products as productsApi } from "../api/client.js";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setQuantity } from "../store/slices/cartSlice.js";
import { ShoppingCart, Leaf, Minus, Plus } from "lucide-react";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "containers", label: "Containers" },
  { value: "growing-media", label: "Growing Media" },
  { value: "irrigation-tech", label: "Irrigation & Tech" },
  { value: "vertical-gardening", label: "Vertical Gardening" },
  { value: "pest-management", label: "Pest Management" },
  { value: "monitoring-tools", label: "Monitoring" },
];

const placeholderImage = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop";

export default function ProductCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.items ?? []);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    setLoading(true);
    productsApi.list(category ? { category } : {}).then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));
  }, [category]);

  const setCategoryFilter = (value) => {
    if (value) setSearchParams({ category: value });
    else setSearchParams({});
  };

  const getCartQty = (productId) => cartItems.find((i) => i.productId === productId)?.quantity ?? 0;

  const handleAddToCart = (p) => {
    dispatch(addToCart({ productId: p._id, name: p.name, price: p.price, quantity: 1, image: p.images?.[0] || placeholderImage }));
  };

  const handleQuantity = (p, delta) => {
    const qty = getCartQty(p._id);
    const newQty = qty + delta;
    if (newQty <= 0) dispatch(setQuantity({ productId: p._id, quantity: 0 }));
    else if (newQty <= p.stock) {
      if (qty === 0) dispatch(addToCart({ productId: p._id, name: p.name, price: p.price, quantity: newQty, image: p.images?.[0] || placeholderImage }));
      else dispatch(setQuantity({ productId: p._id, quantity: newQty }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-organic">
      <header className="sticky top-0 z-10 border-b border-forest-green-100/80 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 rounded-2xl py-2 pr-3 transition-colors hover:bg-forest-green-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-green-600 shadow-soft">
              <Leaf className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <span className="font-display text-xl font-bold text-forest-green-900">Leafinity</span>
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-2 rounded-2xl bg-forest-green-100 px-4 py-2.5 font-semibold text-forest-green-800 transition-all hover:bg-forest-green-200"
          >
            <ShoppingCart className="h-5 w-5" />
            Cart {cartCount > 0 && <span className="rounded-full bg-forest-green-600 px-2 py-0.5 text-sm text-white">{cartCount}</span>}
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-bold text-forest-green-900 sm:text-4xl mb-6"
        >
          Shop
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategoryFilter(c.value)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                category === c.value
                  ? "bg-forest-green-600 text-white shadow-soft"
                  : "bg-white text-forest-green-700 shadow-soft hover:bg-forest-green-50 border border-forest-green-100"
              }`}
            >
              {c.label}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 w-full max-w-[280px] animate-pulse rounded-3xl bg-forest-green-100/50" />
            ))}
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-forest-green-100 bg-white p-12 text-center shadow-soft"
          >
            <p className="text-forest-green-700 mb-4">No products found. Run <code className="rounded-lg bg-forest-green-100 px-2 py-1 text-sm">npm run seed</code> in server.</p>
            <Link to="/" className="btn-primary inline-flex">Back to home</Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="card-organic group overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden bg-forest-green-50">
                  {(p.images?.[0] || placeholderImage).startsWith("http") ? (
                    <img
                      src={p.images?.[0] || placeholderImage}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-6xl text-forest-green-300">🪴</div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-forest-green-700 backdrop-blur-sm">
                    {p.category.replace(/-/g, " ")}
                  </span>
                  {p.stock <= 10 && p.stock > 0 && (
                    <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                      {p.stock} left
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-forest-green-900 line-clamp-2">{p.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-forest-green-700/80">{p.description}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xl font-bold text-forest-green-700">₹{p.price?.toLocaleString()}</span>
                    {getCartQty(p._id) > 0 ? (
                      <div className="flex items-center rounded-xl border-2 border-forest-green-200 bg-forest-green-50/50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleQuantity(p, -1)}
                          className="p-2.5 text-forest-green-700 hover:bg-forest-green-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="min-w-[2.25rem] text-center font-semibold text-forest-green-900 py-1">{getCartQty(p._id)}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantity(p, 1)}
                          disabled={getCartQty(p._id) >= p.stock}
                          className="p-2.5 text-forest-green-700 hover:bg-forest-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(p)}
                        disabled={p.stock < 1}
                        className="btn-primary text-sm py-2.5 px-4 disabled:opacity-50"
                      >
                        Add to cart
                      </button>
                    )}
                  </div>
                  {p.stock < 1 && <p className="mt-2 text-xs font-medium text-red-600">Out of stock</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
