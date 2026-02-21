import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Layouts
import HomeLayout from "../src/Homelayout/HomeLayout";
import AdminLayout from "./admin/AdminLayout";

// Public Pages
import Shop from "./components/Shop"; // The dynamic shop component we discussed
import Auth from "./components/Auth/Auth";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import OrderSuccess from "./components/OrderSuccess";
import Wishlist from "./components/Wishlist";
import OrderHistory from "./components/OrderHistory";
import OurStory from "./components/OurStory";
import Contact from "./components/Contact";

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

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
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
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="ourstory" element={<OurStory />} />
          <Route path="contact" element={<Contact />} />
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