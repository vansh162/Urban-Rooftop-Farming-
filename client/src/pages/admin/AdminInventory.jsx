import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { products as productsApi } from "../../api/client.js";
import { Pencil, Trash2 } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/admin" className="text-forest-green-600 font-medium">← Dashboard</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-forest-green-900 mb-6">Inventory</h1>

        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
          <h2 className="font-semibold mb-4">{editing ? "Edit product" : "Add product"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="px-4 py-2 border rounded-lg" required />
            <input type="text" placeholder="SKU" value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} className="px-4 py-2 border rounded-lg" />
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="px-4 py-2 border rounded-lg">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="px-4 py-2 border rounded-lg" required />
            <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="px-4 py-2 border rounded-lg" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full mt-4 px-4 py-2 border rounded-lg" rows={2} required />
          <div className="mt-4 flex gap-2">
            <button type="submit" className="btn-primary">{editing ? "Update" : "Add"}</button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: "", description: "", category: "containers", price: "", stock: "", sku: "" }); }} className="btn-secondary">Cancel</button>}
          </div>
        </form>

        {loading ? <p className="text-gray-500">Loading…</p> : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4">{p.category}</td>
                    <td className="p-4">₹{p.price?.toLocaleString()}</td>
                    <td className="p-4">{p.stock} {p.stock <= 10 && <span className="text-amber-600 text-sm">(low)</span>}</td>
                    <td className="p-4 flex gap-2">
                      <button type="button" onClick={() => { setEditing(p); setForm({ name: p.name, description: p.description, category: p.category, price: p.price, stock: p.stock, sku: p.sku || "" }); }} className="p-2 text-forest-green-600 hover:bg-forest-green-50 rounded"><Pencil className="w-4 h-4" /></button>
                      <button type="button" onClick={() => handleDelete(p._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
