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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-forest-green-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link to="/admin/inventory" className="text-forest-green-600 font-medium">Inventory</Link>
              <Link to="/admin/bookings" className="text-forest-green-600 font-medium">Bookings</Link>
              <Link to="/admin/maintenance" className="text-forest-green-600 font-medium">Maintenance</Link>
              <span className="text-gray-600">Welcome, {user?.name || "Admin"}</span>
              <div className="w-10 h-10 bg-forest-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Total Sales"
            value={loading ? "…" : formatRevenue(stats.totalSales || 0)}
            color="bg-blue-500"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            label="Pending Bookings"
            value={loading ? "…" : stats.newBookings ?? 0}
            color="bg-forest-green-500"
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            label="Revenue (INR)"
            value={loading ? "…" : formatRevenue(stats.revenue || 0)}
            color="bg-purple-500"
          />
          <StatCard
            icon={<AlertCircle className="w-6 h-6" />}
            label="Low Stock Items"
            value={loading ? "…" : stats.lowStockItems ?? 0}
            color="bg-red-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            icon={<Package className="w-8 h-8" />}
            title="Inventory Management"
            description="CRUD products, stock levels, alerts"
            to="/admin/inventory"
            color="from-blue-500 to-blue-600"
          />
          <ActionCard
            icon={<Calendar className="w-8 h-8" />}
            title="Booking Management"
            description="View media, approve/reject, update status"
            to="/admin/bookings"
            color="from-forest-green-500 to-forest-green-600"
          />
          <ActionCard
            icon={<Users className="w-8 h-8" />}
            title="Maintenance Scheduler"
            description="Assign staff to monthly visits"
            to="/admin/maintenance"
            color="from-purple-500 to-purple-600"
          />
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className={`${color} p-3 rounded-lg w-fit text-white mb-4`}>{icon}</div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </motion.div>
  );
}

function ActionCard({ icon, title, description, to, color }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="block bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className={`bg-gradient-to-br ${color} p-4 rounded-lg w-fit mb-4 text-white`}>{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </motion.div>
    </Link>
  );
}
