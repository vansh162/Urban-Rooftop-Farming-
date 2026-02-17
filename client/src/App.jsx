import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout } from "./store/slices/authSlice.js";
import { auth } from "./api/client.js";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProductCatalog from "./pages/ProductCatalog.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import ServiceDashboard from "./pages/ServiceDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminInventory from "./pages/admin/AdminInventory.jsx";
import AdminBookings from "./pages/admin/AdminBookings.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails.jsx";
import AdminMaintenance from "./pages/admin/AdminMaintenance.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    auth.me().then((data) => dispatch(setCredentials(data))).catch(() => dispatch(logout()));
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/shop" element={<ProductCatalog />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/dashboard" element={<ProtectedRoute><ServiceDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/inventory" element={<ProtectedRoute adminOnly><AdminInventory /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><AdminBookings /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/orders/:id" element={<ProtectedRoute adminOnly><AdminOrderDetails /></ProtectedRoute>} />
      <Route path="/admin/maintenance" element={<ProtectedRoute adminOnly><AdminMaintenance /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
