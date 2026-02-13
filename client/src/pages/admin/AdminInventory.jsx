import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products as productsApi } from "../../api/client.js";
import { Pencil, Trash2, Leaf, Package } from "lucide-react";

const CATEGORIES = ["containers", "growing-media", "irrigation-tech", "vertical-gardening", "pest-management", "monitoring-tools"];

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", category: "containers", price: "", stock: "", sku: "" });

  const load = () => productsApi.list().then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) || 0 };
    try {
      if (editing) await productsApi.update(editing._id, payload);
      else await productsApi.create(payload);
      setEditing(null);
      setForm({ name: "", description: "", category: "containers", price: "", stock: "", sku: "" });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productsApi.delete(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-organic">
      <header className="sticky top-0 z-10 border-b border-forest-green-100/80 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-forest-green-700 transition-all hover:bg-forest-green-100"
          >
            ← Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-green-600 shadow-soft">
              <Leaf className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <span className="font-display text-lg font-bold text-forest-green-900">Inventory</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-forest-green-900 mb-8">Inventory</h1>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSave}
          className="card-organic mb-10 p-6 sm:p-8"
        >
          <h2 className="mb-6 flex items-center gap-2 font-display text-lg font-bold text-forest-green-900">
            <Package className="w-5 h-5 text-forest-green-600" />
            {editing ? "Edit product" : "Add product"}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-organic" required />
            <input type="text" placeholder="SKU" value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} className="input-organic" />
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="input-organic">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="input-organic" required />
            <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="input-organic" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input-organic mt-4 min-h-[80px]" rows={2} required />
          <div className="mt-6 flex gap-3">
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary">
              {editing ? "Update" : "Add"}
            </motion.button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm({ name: "", description: "", category: "containers", price: "", stock: "", sku: "" }); }} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </motion.form>

        {loading ? (
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 flex-1 animate-pulse rounded-3xl bg-forest-green-100/50" />)}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-organic overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-forest-green-100 bg-forest-green-50/50">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-forest-green-800">Name</th>
                    <th className="p-4 text-left text-sm font-semibold text-forest-green-800">Category</th>
                    <th className="p-4 text-left text-sm font-semibold text-forest-green-800">Price</th>
                    <th className="p-4 text-left text-sm font-semibold text-forest-green-800">Stock</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-forest-green-100/50 last:border-0"
                    >
                      <td className="p-4 font-semibold text-forest-green-900">{p.name}</td>
                      <td className="p-4 text-forest-green-700">{p.category}</td>
                      <td className="p-4 font-medium text-forest-green-800">₹{p.price?.toLocaleString()}</td>
                      <td className="p-4">
                        {p.stock} {p.stock <= 10 && <span className="text-amber-600 text-sm font-medium">(low)</span>}
                      </td>
                      <td className="p-4 flex gap-2">
                        <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setEditing(p); setForm({ name: p.name, description: p.description, category: p.category, price: p.price, stock: p.stock, sku: p.sku || "" }); }} className="rounded-xl p-2 text-forest-green-600 transition-colors hover:bg-forest-green-100">
                          <Pencil className="w-4 h-4" />
                        </motion.button>
                        <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleDelete(p._id)} className="rounded-xl p-2 text-red-600 transition-colors hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
