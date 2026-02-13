import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice.js";
import { auth } from "../api/client.js";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await auth.register({ name, email, password });
      dispatch(setCredentials(data));
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero bg-leaf-pattern px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link
          to="/"
          className="mb-8 flex justify-center gap-2.5 rounded-2xl py-2 pr-3 transition-colors hover:bg-white/60"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-green-600 shadow-soft">
            <Leaf className="h-6 w-6 text-white" strokeWidth={2} />
          </div>
          <span className="font-display text-2xl font-bold text-forest-green-900">Leafinity</span>
        </Link>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card-organic p-8 sm:p-10"
        >
          <h1 className="font-display text-2xl font-bold text-forest-green-900 mb-6">Create account</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-forest-green-800">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-organic" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-forest-green-800">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-organic" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-forest-green-800">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="input-organic"
              />
            </div>
            {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{error}</p>}
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="btn-primary w-full">
              {loading ? "Creating account…" : "Register"}
            </motion.button>
          </form>
          <p className="mt-6 text-center text-forest-green-700 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-forest-green-600 hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
