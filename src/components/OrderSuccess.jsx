import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Truck, ShieldCheck, ArrowRight } from "lucide-react";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, amount } = location.state || {};

  useEffect(() => {
    if (!orderId) {
      navigate("/shop");
    }
  }, [orderId, navigate]);

  const containerVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const checkmark = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  const pulseRing = {
    initial: { boxShadow: "0 0 0 0 rgba(0, 0, 0, 0.2)" },
    animate: {
      boxShadow: "0 0 0 30px rgba(0, 0, 0, 0)",
    },
    transition: { duration: 1.5, repeat: 3 }
  };

  return (
    <section className="min-h-screen bg-white pt-24 pb-12 px-4 md:px-6 flex items-center justify-center">
      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full"
      >
        {/* Success Checkmark */}
        <motion.div
          {...pulseRing}
          className="mx-auto w-24 h-24 bg-black rounded-full flex items-center justify-center mb-8 relative"
        >
          <svg
            className="w-12 h-12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.polyline
              variants={checkmark}
              initial="hidden"
              animate="visible"
              points="20 6 9 17 4 12"
            />
          </svg>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-clash font-black uppercase tracking-tight text-black mb-3">
            Artifacts <span className="text-amber-600">Secured</span>
          </h1>
          <p className="font-editor italic text-xl text-gray-700">
            Your gear has been successfully acquired and is being prepared for shipment.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="border-3 border-black p-8 rounded-2xl mb-8 bg-white hover:shadow-xl transition-shadow"
        >
          {/* Order ID */}
          <div className="mb-6 pb-6 border-b-2 border-gray-200">
            <p className="text-xs font-clash font-black uppercase tracking-widest text-gray-600 mb-2">
              Order Number
            </p>
            <p className="text-2xl font-clash font-black tracking-tight text-black break-all">
              #{orderId || "LOADING..."}
            </p>
          </div>

          {/* Amount */}
          {amount && (
            <div className="mb-6 pb-6 border-b-2 border-gray-200">
              <p className="text-xs font-clash font-black uppercase tracking-widest text-gray-600 mb-2">
                Amount Paid
              </p>
              <p className="text-3xl font-clash font-black text-black">
                ₹{amount.toLocaleString()}
              </p>
            </div>
          )}

          {/* Status Timeline */}
          <div className="space-y-4">
            <p className="text-xs font-clash font-black uppercase tracking-widest text-gray-600 mb-4">
              Order Status
            </p>

            {[
              { icon: Check, label: "Payment Confirmed", active: true },
              { icon: ShieldCheck, label: "Order Verified", active: true },
              { icon: Truck, label: "Preparing for Shipment", active: false }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex items-center gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.active
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <step.icon size={20} strokeWidth={2} />
                </div>
                <span
                  className={`font-clash font-bold uppercase text-sm ${
                    step.active ? "text-black" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info Boxes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {[
            {
              icon: Truck,
              title: "Free Shipping",
              text: "Your order ships within 2-3 business days"
            },
            {
              icon: ShieldCheck,
              title: "100% Verified",
              text: "Your payment has been successfully verified"
            }
          ].map((box, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="border-2 border-black p-5 rounded-xl bg-white hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <box.icon size={18} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="font-clash font-bold uppercase text-sm text-black mb-1">
                    {box.title}
                  </h4>
                  <p className="font-editor italic text-xs text-gray-600">
                    {box.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/orders")}
            className="py-4 px-6 bg-black text-white border-2 border-black rounded-xl font-clash font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck size={20} strokeWidth={2} />
            View Order Details
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/shop")}
            className="py-4 px-6 bg-white text-black border-2 border-black rounded-xl font-clash font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight size={20} strokeWidth={2} />
          </motion.button>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="font-editor italic text-gray-600 text-sm mb-2">
            A confirmation email has been sent to your registered email address.
          </p>
          <p className="font-clash font-bold uppercase text-xs text-gray-500 tracking-widest">
            Need help? Contact us at support@nawaweeb.com
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
