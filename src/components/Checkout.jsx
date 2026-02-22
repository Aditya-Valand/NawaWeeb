import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Truck, MapPin, ShieldCheck, CreditCard, AlertCircle, X, Check, Trash2 } from "lucide-react";
import api from "../api/axios";

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: isAuthenticated ? user?.email || "" : "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  // Checkout State
  const [cartItems, setCartItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // Load cart and Razorpay script
  useEffect(() => {
    const loadCart = async () => {
      const token = localStorage.getItem("token");
      let cart = [];
      if (token) {
        try {
          // Authorization header automatically added by axios interceptor
          const res = await api.get("/user/cart");
          if (res.data.success) {
            cart = res.data.cart;
          } else {
            cart = JSON.parse(localStorage.getItem("cart") || "[]");
          }
        } catch (err) {
          console.error("Failed to fetch server cart:", err);
          cart = JSON.parse(localStorage.getItem("cart") || "[]");
        }
      } else {
        cart = JSON.parse(localStorage.getItem("cart") || "[]");
      }
      setCartItems(cart);
      setOrderTotal(cart.reduce((sum, item) => sum + (item.price * item.qty), 0));
    };

    loadCart();

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script) document.body.removeChild(script);
    };
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) errors.fullName = "Full name required";
    if (!formData.email.trim()) errors.email = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email";
    
    if (!formData.phone.trim()) errors.phone = "Phone required";
    else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[- ]/g, ""))) errors.phone = "Invalid phone (10 digits)";
    
    if (!formData.street.trim()) errors.street = "Street address required";
    if (!formData.city.trim()) errors.city = "City required";
    if (!formData.state.trim()) errors.state = "State required";
    if (!formData.pincode.trim()) errors.pincode = "Pincode required";
    else if (!/^[0-9]{6}$/.test(formData.pincode)) errors.pincode = "Invalid pincode (6 digits)";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Remove item from cart
  const handleRemoveItem = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, idx) => idx !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // Recalculate subtotal
    const newSubtotal = updatedCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    setOrderTotal(newSubtotal);
  };

  // Handle payment
  const handlePayment = async () => {
    setError("");
    
    // Validate form
    if (!validateForm()) {
      setError("Please fill all fields correctly");
      return;
    }

    // Check cart
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Create Razorpay order
      const orderResponse = await api.post("/checkout/create-razorpay-order", {
        items: cartItems,
        totalAmount: orderTotal,
        shippingAddress: formData
      });

      const { razorpay_order_id, amount, currency, key_id } = orderResponse.data;

      if (!razorpay_order_id) {
        throw new Error("Failed to create order");
      }

      // Step 2: Open Razorpay modal
      const options = {
        key: key_id,
        amount: amount, // in paise
        currency: currency || "INR",
        order_id: razorpay_order_id,
        name: "NAWAWEEB",
        description: "Secure Premium Checkout",
        theme: {
          color: "#000000"
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        handler: async (response) => {
          try {
            // Step 3: Verify payment
            const verifyResponse = await api.post("/checkout/verify-razorpay", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shipping_address: formData
            });

            if (verifyResponse.data.success) {
              // Clear cart
              localStorage.removeItem("cart");
              
              // Redirect to success page
              navigate("/order-success", {
                state: {
                  orderId: verifyResponse.data.order_id,
                  amount: orderTotal
                }
              });
            }
          } catch (verifyErr) {
            setError(verifyErr.response?.data?.message || "Payment verification failed. Please contact support.");
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Payment failed. Please try again.");
      setIsLoading(false);
    }
  };

  // Animations
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <section className="min-h-screen bg-white pt-32 pb-12 px-4 md:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div {...fadeUp} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck size={32} className="text-black" strokeWidth={1.5} />
            <h1 className="text-4xl md:text-5xl font-clash font-black uppercase tracking-tight text-black">
              Security <span className="text-amber-600">Clearance</span>
            </h1>
          </div>
          <p className="font-editor italic text-gray-600 text-lg">
            Complete your artifacts acquisition with verified cryptography.
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border-2 border-red-400 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="text-red-500 shrink-0 mt-1" size={20} />
            <div>
              <p className="font-clash font-bold text-red-700 uppercase text-sm">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Form */}
          <motion.div
            variants={containerVariant}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2"
          >
            {/* Shipping Details Section */}
            <motion.div
              variants={itemVariant}
              className="border-2 border-black p-8 rounded-2xl mb-8 bg-white hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={24} className="text-black" strokeWidth={1.5} />
                <h2 className="text-2xl font-clash font-black uppercase text-black">
                  Shipping Details
                </h2>
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-clash font-black uppercase tracking-widest text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border-2 rounded-lg font-editor transition-all ${
                      validationErrors.fullName
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300 hover:border-black"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Artifact Collector"
                  />
                  {validationErrors.fullName && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.fullName}</p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-clash font-black uppercase tracking-widest text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full px-4 py-3 border-2 rounded-lg font-editor transition-all ${
                        validationErrors.email
                          ? "border-red-400 bg-red-50"
                          : "border-gray-300 hover:border-black"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="you@example.com"
                    />
                    {validationErrors.email && (
                      <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-clash font-black uppercase tracking-widest text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full px-4 py-3 border-2 rounded-lg font-editor transition-all ${
                        validationErrors.phone
                          ? "border-red-400 bg-red-50"
                          : "border-gray-300 hover:border-black"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="9876543210"
                    />
                    {validationErrors.phone && (
                      <p className="text-xs text-red-600 mt-1">{validationErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Street */}
                <div>
                  <label className="block text-xs font-clash font-black uppercase tracking-widest text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border-2 rounded-lg font-editor transition-all ${
                      validationErrors.street
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300 hover:border-black"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="123 Heritage Lane"
                  />
                  {validationErrors.street && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.street}</p>
                  )}
                </div>

                {/* City & State & Pincode */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-clash font-black uppercase tracking-widest text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full px-4 py-3 border-2 rounded-lg font-editor transition-all ${
                        validationErrors.city
                          ? "border-red-400 bg-red-50"
                          : "border-gray-300 hover:border-black"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="Lucknow"
                    />
                    {validationErrors.city && (
                      <p className="text-xs text-red-600 mt-1">{validationErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-clash font-black uppercase tracking-widest text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full px-4 py-3 border-2 rounded-lg font-editor transition-all ${
                        validationErrors.state
                          ? "border-red-400 bg-red-50"
                          : "border-gray-300 hover:border-black"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="UP"
                    />
                    {validationErrors.state && (
                      <p className="text-xs text-red-600 mt-1">{validationErrors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-clash font-black uppercase tracking-widest text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full px-4 py-3 border-2 rounded-lg font-editor transition-all ${
                        validationErrors.pincode
                          ? "border-red-400 bg-red-50"
                          : "border-gray-300 hover:border-black"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="226001"
                    />
                    {validationErrors.pincode && (
                      <p className="text-xs text-red-600 mt-1">{validationErrors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Method Section */}
            <motion.div
              variants={itemVariant}
              className="border-2 border-black p-8 rounded-2xl bg-white hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <CreditCard size={24} className="text-black" strokeWidth={1.5} />
                <h2 className="text-2xl font-clash font-black uppercase text-black">
                  Payment Method
                </h2>
              </div>
              
              <div className="flex items-center gap-3 p-4 border-2 border-yellow-500 bg-yellow-50 rounded-lg">
                <Check size={20} className="text-yellow-700" />
                <div>
                  <p className="font-clash font-bold text-yellow-900 uppercase text-sm">Razorpay Secure</p>
                  <p className="text-xs text-yellow-700 font-editor italic">PCI Compliant Payment Processing</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Cart Summary */}
          <motion.div
            variants={itemVariant}
            className="lg:col-span-1"
          >
            <div className="sticky top-32">
              <div className="border-3 border-black p-6 rounded-2xl bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <Truck size={24} className="text-black" strokeWidth={1.5} />
                  <h3 className="text-2xl font-clash font-black uppercase text-black">
                    Order Summary
                  </h3>
                </div>

                {/* Cart Items */}
                {cartItems.length > 0 ? (
                  <>
                    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto border-b-2 border-gray-200 pb-6">
                      {cartItems.map((item, idx) => (
                        <motion.div
                          key={idx}
                          variants={itemVariant}
                          className="flex justify-between items-center text-sm font-editor group"
                        >
                          <div className="flex-1">
                            <p className="text-black font-clash font-bold uppercase">{item.title}</p>
                            <p className="text-gray-600 text-xs">
                              {item.size} × {item.qty}
                              {item.isHandmade && <span className="text-amber-600 ml-2">(Handmade)</span>}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <p className="font-clash font-bold text-black whitespace-nowrap">
                              ₹{(item.price * item.qty).toLocaleString()}
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRemoveItem(idx)}
                              className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              title="Remove item"
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="space-y-3 mb-6 text-sm">
                      <div className="flex justify-between font-editor">
                        <span className="text-gray-700">Subtotal</span>
                        <span className="font-clash font-bold text-black">₹{orderTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-editor">
                        <span className="text-gray-700">Shipping</span>
                        <span className="font-clash font-bold text-black">FREE</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-3 border-amber-600 bg-amber-50 p-4 rounded-lg mb-6">
                      <div className="flex justify-between items-center">
                        <span className="font-clash font-black uppercase text-gray-700">Total</span>
                        <span className="text-3xl font-clash font-black text-amber-700">
                          ₹{orderTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Payment Button */}
                    <motion.button
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      onClick={handlePayment}
                      disabled={isLoading}
                      className="w-full py-4 bg-black text-white rounded-xl font-clash font-black uppercase tracking-wide border-2 border-black hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={20} strokeWidth={2} />
                          Proceed to Payment
                        </>
                      )}
                    </motion.button>

                    <p className="text-xs text-gray-600 text-center mt-4 font-editor italic">
                      Your payment is secured with 256-bit encryption
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 font-editor mb-4">Your cart is empty</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/shop")}
                      className="px-6 py-3 bg-black text-white rounded-lg font-clash font-bold uppercase"
                    >
                      Back to Shop
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
