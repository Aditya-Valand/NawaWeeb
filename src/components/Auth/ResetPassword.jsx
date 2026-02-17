import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Lock, ArrowRight, CheckCircle, Zap } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.data.success) {
        setStatus("success");
        setMessage(response.data.message);

        // Optional: Redirect after a few seconds
        setTimeout(() => {
          navigate("/auth");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(response.data.message || "Failed to reset password.");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center p-4 lg:p-0">
      <div className="w-full max-w-6xl h-[85vh] bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(45,73,64,0.1)] overflow-hidden flex flex-col lg:flex-row border border-emerald-100">

        {/* LEFT SIDE: VIBE */}
        <div className="hidden lg:flex w-1/2 bg-primary relative items-center justify-center p-12 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-emerald-500/20 to-transparent" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-accent/10 blur-[100px] rounded-full"
          />

          <div className="relative z-10 text-center">
            <h2 className="text-5xl font-clash font-black text-accent leading-none mb-6 uppercase">
              Secure The<br />Vessel
            </h2>
            <p className="font-editor italic text-emerald-100/70 text-xl max-w-xs mx-auto">
              "A new seal, a fresh start."
            </p>
          </div>

          <div className="absolute right-8 top-12 [writing-mode:vertical-lr] text-accent/30 font-clash font-bold tracking-[1em] text-[10px] uppercase">
            新しいパスワード
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="flex-1 p-8 lg:p-20 flex flex-col justify-center relative overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-10">
              <h3 className="text-4xl font-clash font-black text-primary uppercase leading-none">
                New Password
              </h3>
              <p className="text-primary/40 font-editor italic mt-2">
                Create a strong password to secure your account.
              </p>
            </div>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center p-8 bg-emerald-50 rounded-3xl border border-emerald-100"
              >
                <CheckCircle size={64} className="text-emerald-500 mb-4" />
                <h4 className="text-2xl font-clash font-bold text-primary mb-2">Password Updated!</h4>
                <p className="text-primary/60 mb-6">
                  Your password has been successfully reset. Redirecting you to login...
                </p>
                <Link to="/auth" className="px-8 py-3 bg-primary text-accent rounded-full font-clash font-bold text-sm tracking-wide hover:shadow-lg transition-all">
                  Login Now
                </Link>
              </motion.div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
                  <input
                    type="password"
                    name="password"
                    placeholder="New Password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-bg-light border-none rounded-2xl py-4 pl-12 pr-4 font-clash text-sm focus:ring-2 ring-accent outline-none"
                    disabled={status === "loading"}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-bg-light border-none rounded-2xl py-4 pl-12 pr-4 font-clash text-sm focus:ring-2 ring-accent outline-none"
                    disabled={status === "loading"}
                  />
                </div>

                {status === "error" && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-5 bg-primary text-accent rounded-full font-clash font-black text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-primary/20 transition-all mt-8 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Updating..." : "Reset Password"}
                  {!status === "loading" && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            )}

          </motion.div>

          <div className="absolute bottom-10 right-10 text-emerald-50 pointer-events-none">
            <Zap size={120} strokeWidth={0.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
