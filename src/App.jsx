import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Layouts (kept as eager imports — they are shell wrappers, not heavy pages)
import HomeLayout from "../src/Homelayout/HomeLayout";
import AdminLayout from "./admin/AdminLayout";

// Public Pages — lazy loaded for code splitting
const Shop = React.lazy(() => import("./components/Shop"));
const ProductDetail = React.lazy(() => import("./components/ProductDetail"));
const Auth = React.lazy(() => import("./components/Auth/Auth"));
const ForgotPassword = React.lazy(() => import("./components/Auth/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./components/Auth/ResetPassword"));
const Cart = React.lazy(() => import("./components/Cart"));
const Checkout = React.lazy(() => import("./components/Checkout"));
const OrderSuccess = React.lazy(() => import("./components/OrderSuccess"));
const Wishlist = React.lazy(() => import("./components/Wishlist"));
const OrderHistory = React.lazy(() => import("./components/OrderHistory"));
const OurStory = React.lazy(() => import("./components/OurStory"));
const Contact = React.lazy(() => import("./components/Contact"));

// Admin Pages — lazy loaded (never needed by regular users)
const Dashboard = React.lazy(() => import("./admin/Dashboard"));
const ProductManager = React.lazy(() => import("./admin/ProductManager"));
const OrderInbox = React.lazy(() => import("./admin/OrderInbox"));

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

// Minimal page fallback for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center font-editor italic text-primary/40">
    Loading...
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </Router>
  );
}

export default App;
