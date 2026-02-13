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
    dispatch(addToCart({ productId: p._id, name: p.name, price: p.price, quantity: 1, image: p.images?.[0] }));
  };

  const handleQuantity = (p, delta) => {
    const qty = getCartQty(p._id);
    const newQty = qty + delta;
    if (newQty <= 0) dispatch(setQuantity({ productId: p._id, quantity: 0 }));
    else if (newQty <= p.stock) {
      if (qty === 0) dispatch(addToCart({ productId: p._id, name: p.name, price: p.price, quantity: newQty, image: p.images?.[0] }));
      else dispatch(setQuantity({ productId: p._id, quantity: newQty }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-forest-green-800 font-semibold">
            <Leaf className="w-8 h-8 text-forest-green-600" />
            Leafinity
          </Link>
          <Link to="/cart" className="flex items-center gap-2 text-forest-green-700 font-medium">
            <ShoppingCart className="w-5 h-5" />
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-forest-green-900 mb-4">Shop</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategoryFilter(c.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === c.value ? "bg-forest-green-600 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-forest-green-50"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        {loading ? (
          <p className="text-gray-500">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products found. Run <code className="bg-gray-200 px-1 rounded">npm run seed</code> in server.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-forest-green-50 flex items-center justify-center text-4xl text-forest-green-300">
                  {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : "🪴"}
                </div>
                <div className="p-4">
                  <p className="text-xs text-forest-green-600 font-medium uppercase">{p.category}</p>
                  <h3 className="font-semibold text-gray-900 mt-1">{p.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{p.description}</p>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-forest-green-700">₹{p.price?.toLocaleString()}</span>
                    {getCartQty(p._id) > 0 ? (
                      <div className="flex items-center gap-1 border border-forest-green-200 rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => handleQuantity(p, -1)}
                          className="p-2 text-forest-green-700 hover:bg-forest-green-50 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="min-w-[2rem] text-center font-medium text-gray-900 py-1">{getCartQty(p._id)}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantity(p, 1)}
                          disabled={getCartQty(p._id) >= p.stock}
                          className="p-2 text-forest-green-700 hover:bg-forest-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(p)}
                        disabled={p.stock < 1}
                        className="btn-primary text-sm py-2 px-4"
                      >
                        Add to cart
                      </button>
                    )}
                  </div>
                  {p.stock <= 10 && p.stock > 0 && <p className="text-xs text-amber-600 mt-1">Only {p.stock} left</p>}
                  {p.stock < 1 && <p className="text-xs text-red-600 mt-1">Out of stock</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
