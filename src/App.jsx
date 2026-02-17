import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import HomeLayout from "../src/Homelayout/HomeLayout";
import AdminLayout from "./admin/AdminLayout";

// Public Pages
import Shop from "./components/Shop"; // The dynamic shop component we discussed
import Auth from "./components/Auth/Auth";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import OrderHistory from "./components/OrderHistory";

// Admin Pages
import Dashboard from "./admin/Dashboard";
import ProductManager from "./admin/ProductManager";
import OrderInbox from "./admin/OrderInbox";
import ProductDetail from "./components/ProductDetail";
// 🛡️ Guard Logic: Keeps normal users out of the Artisan Panel
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || userRole !== "admin") {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC CLAN ROUTES --- 
            Wrapped in HomeLayout for consistent Navbar/Footer */}
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Shop />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="auth" element={<Auth />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="orders" element={<OrderHistory />} />
        </Route>

        {/* --- PRIVATE ARTISAN ROUTES --- 
            Protected by role-based logic */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Default: /admin */}
          <Route index element={<Dashboard />} />

          {/* Products: /admin/products */}
          <Route path="products" element={<ProductManager />} />

          {/* Edit Product: /admin/products/:id */}
          <Route path="products/:id" element={<ProductManager />} />

          {/* Orders: /admin/orders */}
          <Route path="orders" element={<OrderInbox />} />
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;