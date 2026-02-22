import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Zap } from "lucide-react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const response = await api.post('/auth/forgot-password', { email });

            if (response.data.success) {
                setStatus("success");
                setMessage(response.data.message);
            } else {
                setStatus("error");
                setMessage(response.data.message || "Failed to process request.");
            }
        } catch (err) {
            setStatus("error");
            setMessage(err.response?.data?.message || "Server error. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-bg-light flex items-center justify-center p-4 lg:p-0">
            <div className="w-full max-w-6xl h-[85vh] bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(45,73,64,0.1)] overflow-hidden flex flex-col lg:flex-row border border-emerald-100">

                {/* LEFT SIDE: THE VIBE */}
                <div className="hidden lg:flex w-1/2 bg-primary relative items-center justify-center p-12 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-emerald-500/20 to-transparent" />
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
                        transition={{ duration: 12, repeat: Infinity }}
                        className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/20 blur-[100px] rounded-full"
                    />

                    <div className="relative z-10 text-center">
                        <h2 className="text-5xl font-clash font-black text-accent leading-none mb-6 uppercase">
                            Lost Key?
                        </h2>
                        <p className="font-editor italic text-emerald-100/70 text-xl max-w-xs mx-auto">
                            "Even in the void, a path remains."
                        </p>
                    </div>

                    <div className="absolute left-8 bottom-12 [writing-mode:vertical-rl] text-accent/30 font-clash font-bold tracking-[1em] text-[10px] uppercase rotate-180">
                        パスワードリセット
                    </div>
                </div>

                {/* RIGHT SIDE: THE FORM */}
                <div className="flex-1 p-8 lg:p-20 flex flex-col justify-center relative overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link to="/auth" className="inline-flex items-center gap-2 text-primary/40 hover:text-primary transition-colors mb-8 font-clash font-medium text-sm">
                            <ArrowLeft size={16} /> Back to Login
                        </Link>

                        <div className="mb-10">
                            <h3 className="text-4xl font-clash font-black text-primary uppercase leading-none">
                                Reset Password
                            </h3>
                            <p className="text-primary/40 font-editor italic mt-2">
                                Enter your email to receive recovery instructions.
                            </p>
                        </div>

                        {status === "success" ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center"
                            >
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail size={24} />
                                </div>
                                <h4 className="font-clash font-bold text-lg text-primary mb-2">Check your email</h4>
                                <p className="text-primary/60 text-sm mb-6">
                                    {message}
                                </p>
                                <Link to="/auth" className="block w-full py-4 bg-primary text-accent rounded-xl font-clash font-bold text-sm tracking-wide hover:shadow-lg transition-all">
                                    Return to Login
                                </Link>
                            </motion.div>
                        ) : (
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                    {status === "loading" ? "Sending..." : "Send Reset Link"}
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