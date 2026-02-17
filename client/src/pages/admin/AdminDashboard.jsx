import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  BarChart3,
  Package,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  Leaf,
} from "lucide-react";
import { admin } from "../../api/client.js";

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    newBookings: 0,
    revenue: 0,
    lowStockItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    admin.overview().then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const formatRevenue = (n) => (n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`);

  const navLink = "rounded-xl px-4 py-2 text-sm font-semibold text-forest-green-700 transition-all hover:bg-forest-green-100";

  return (
    <div className="min-h-screen bg-gradient-organic">
      <header className="sticky top-0 z-10 border-b border-forest-green-100/80 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-green-600 shadow-soft">
              <Leaf className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <h1 className="font-display text-2xl font-bold text-forest-green-900">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/inventory" className={navLink}>Inventory</Link>
            <Link to="/admin/bookings" className={navLink}>Bookings</Link>
            <Link to="/admin/orders" className={navLink}>Orders</Link>
            <Link to="/admin/maintenance" className={navLink}>Maintenance</Link>
            <span className="text-sm text-forest-green-700">Welcome, {user?.name || "Admin"}</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-green-600 text-white font-semibold shadow-soft">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Total Sales"
            value={loading ? "…" : formatRevenue(stats.totalSales || 0)}
            color="bg-forest-green-500"
            i={0}
          />
          <StatCard
            icon={<Package className="w-6 h-6" />}
            label="Total Orders"
            value={loading ? "…" : stats.totalOrders ?? 0}
            color="bg-forest-green-600"
            i={1}
          />
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            label="Pending Bookings"
            value={loading ? "…" : stats.newBookings ?? 0}
            color="bg-forest-green-700"
            i={2}
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            label="Revenue (INR)"
            value={loading ? "…" : formatRevenue(stats.revenue || 0)}
            color="bg-forest-green-800"
            i={3}
          />
          <StatCard
            icon={<AlertCircle className="w-6 h-6" />}
            label="Low Stock Items"
            value={loading ? "…" : stats.lowStockItems ?? 0}
            color="bg-amber-500"
            i={4}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <ActionCard
            icon={<Package className="w-8 h-8" />}
            title="Inventory Management"
            description="CRUD products, stock levels, alerts"
            to="/admin/inventory"
            i={0}
          />
          <ActionCard
            icon={<Calendar className="w-8 h-8" />}
            title="Booking Management"
            description="View media, approve/reject, update status"
            to="/admin/bookings"
            i={1}
          />
          <ActionCard
            icon={<Package className="w-8 h-8" />}
            title="Order Management"
            description="See user orders and details"
            to="/admin/orders"
            i={2}
          />
          <ActionCard
            icon={<Users className="w-8 h-8" />}
            title="Maintenance Scheduler"
            description="Assign staff to monthly visits"
            to="/admin/maintenance"
            i={3}
          />
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06 }}
      whileHover={{ y: -4 }}
      className="card-organic p-6"
    >
      <div className={`${color} mb-4 flex w-fit rounded-2xl p-3 text-white shadow-soft`}>{icon}</div>
      <p className="mb-1 text-sm font-semibold text-forest-green-700">{label}</p>
      <p className="font-display text-2xl font-bold text-forest-green-900">{value}</p>
    </motion.div>
  );
}

function ActionCard({ icon, title, description, to, i }) {
  return (
    <Link to={to}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 + i * 0.06 }}
        whileHover={{ y: -4 }}
        className="card-organic block p-6 transition-shadow hover:shadow-leaf"
      >
        <div className="mb-4 flex w-fit rounded-2xl bg-gradient-to-br from-forest-green-500 to-forest-green-700 p-4 text-white shadow-soft">
          {icon}
        </div>
        <h3 className="font-display text-lg font-bold text-forest-green-900 mb-2">{title}</h3>
        <p className="text-sm text-forest-green-700">{description}</p>
      </motion.div>
    </Link>
  );
}
