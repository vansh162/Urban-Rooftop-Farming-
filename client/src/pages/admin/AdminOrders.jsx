import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { orders as ordersApi } from "../../api/client.js";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.adminList()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

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
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-forest-green-900 mb-8">Orders</h1>

        {loading ? (
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 flex-1 animate-pulse rounded-3xl bg-forest-green-100/50" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-forest-green-700">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((o, idx) => (
              <motion.div
                key={o._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="card-organic p-5"
              >
                <p className="font-display font-bold text-forest-green-900">
                  {o.user?.name || "Unknown user"} &middot; ₹{o.subtotal?.toLocaleString()}
                </p>
                <p className="text-sm text-forest-green-700">
                  {new Date(o.createdAt).toLocaleDateString()} – {o.items?.length || 0} items
                </p>
                <Link
                  to={`/admin/orders/${o._id}`}
                  className="mt-2 inline-block rounded-xl px-3 py-1 text-sm font-semibold bg-forest-green-600 text-white hover:brightness-95"
                >
                  View details
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
