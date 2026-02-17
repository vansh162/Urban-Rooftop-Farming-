import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { orders as ordersApi } from "../../api/client.js";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ordersApi.adminGet(id)
      .then(setOrder)
      .catch((err) => setError(err.message || "Failed to load order"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Order not found.</p>
      </div>
    );
  }

  const STATUS_OPTIONS = [
    "pending",
    "confirmed",
    "paid",
    "ready to ship",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const updated = await ordersApi.adminUpdate(id, { status: newStatus });
      setOrder(updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-organic">
      <header className="sticky top-0 z-10 border-b border-forest-green-100/80 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-forest-green-700 transition-all hover:bg-forest-green-100"
          >
            ← Back to orders
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-forest-green-900 mb-8">Order Details</h1>
        <div className="space-y-4">
          <p><strong>User:</strong> {order.user?.name} ({order.user?.email})</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Subtotal:</strong> ₹{order.subtotal?.toLocaleString()}</p>
          <p>
            <strong>Status:</strong>{' '}
            <select
              value={order.status}
              disabled={updating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="input-organic inline-block w-auto"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {updating && <span className="ml-2 text-sm text-forest-green-700">Updating…</span>}
          </p>
          <div>
            <h3 className="font-semibold">Items</h3>
            <ul className="list-disc pl-5">
              {order.items.map((it) => (
                <li key={it.product}><strong>{it.name}</strong> x{it.quantity} @ ₹{it.price}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Shipping Address</h3>
            <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
