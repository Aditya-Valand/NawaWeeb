import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login status on app start
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token
          const res = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Handle response structure (res.data.data.user based on your previous code)
          setUser(res.data.data.user || res.data.user);
        } catch (err) {
          console.error("Session expired:", err);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  // 🚀 NEW: Async Login with Cart Sync
  const login = async (email, password) => {
    try {
      // 1. Call Login API
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      // Adapt to your backend response structure
      const token = res.data.token;
      const userData = res.data.user || res.data.data?.user;

      if (!token) throw new Error("No token returned from API");

      // 2. Save Auth Data
      localStorage.setItem('token', token);
      localStorage.setItem('role', userData.role);
      setUser(userData);

      // 3. 🛒 CART SYNC LOGIC (The Magic)
      try {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

        if (localCart.length > 0) {
          // A. Upload local "guest" cart to server
          // A. Upload local "guest" cart to server
          // Note: Adjust '/api/users/cart/sync' if your route is different
          await axios.post(
            "http://localhost:5000/api/user/cart/sync",
            { localCart },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        // B. Download the FINAL merged cart
        const serverCartRes = await axios.get(
          "http://localhost:5000/api/user/cart",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // C. Update Local Storage with the server truth
        if (serverCartRes.data.success) {
          localStorage.setItem("cart", JSON.stringify(serverCartRes.data.cart));
        }
      } catch (cartErr) {
        console.error("Cart Sync Warning:", cartErr);
        // We don't block login if cart sync fails, just log it
      }

      return { success: true };

    } catch (err) {
      console.error("Login Error:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Login failed"
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Optional: Clear cart on logout so the next user doesn't see it
    localStorage.removeItem('cart');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);