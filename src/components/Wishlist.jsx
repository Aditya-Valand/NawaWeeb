import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart, X, ShoppingBag, Ghost
} from "lucide-react";

export default function Wishlist() {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                // Redirect to auth if not logged in? Or show empty?
                // Let's just show empty for now or redirect
                // navigate("/auth");
                setLoading(false);
                return;
            }

            const res = await api.get('/user/getwishlist');
            setWishlist(res.data.wishlist || []);
        } catch (err) {
            console.error("Failed to fetch bonded spirits", err);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            // Optimistic UI Update
            setWishlist(prev => prev.filter(item => item.products.id !== productId));

            await api.post('/user/togglewish', { productId });
        } catch (err) {
            console.error("Failed to sever bond", err);
            // Revert if needed? Ideally yes, but complex.
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-clash uppercase">Syncing Soul...</div>;

    return (
        <section className="min-h-screen bg-[#FAFAFA] pt-24 pb-20 px-4 md:px-12">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b-2 border-black pb-6">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                            Saved Frequencies
                        </span>
                        <h1 className="text-5xl md:text-8xl font-clash font-black text-black leading-[0.85] uppercase tracking-tighter mt-2">
                            Soul <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-yellow-600">Bound</span>
                        </h1>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="font-editor text-xl italic text-gray-500">
                            {wishlist.length} Artifacts Preserved
                        </p>
                    </div>
                </div>

                {wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                        <Ghost size={80} strokeWidth={1} />
                        <p className="font-clash font-bold text-xl mt-4 uppercase">Your Spirit is Hollow</p>
                        <button onClick={() => navigate("/shop")} className="mt-6 border-b-2 border-black font-bold uppercase hover:text-accent-dark transition-colors">
                            Find Connections
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                        <AnimatePresence>
                            {wishlist.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="group relative"
                                >
                                    {/* Image Container */}
                                    <div
                                        onClick={() => navigate(`/product/${item.products.id}`)}
                                        className="relative aspect-[3/4] bg-white rounded-[2rem] overflow-hidden border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                    >
                                        <img
                                            src={item.products.images[0]}
                                            alt={item.products.title}
                                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!item.products.is_active ? 'grayscale' : ''}`}
                                        />

                                        {/* Hover Actions */}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/product/${item.products.id}`); }}
                                                className="p-3 bg-white text-black rounded-full hover:bg-[#FFD700] transition-colors"
                                            >
                                                <ShoppingBag size={20} />
                                            </button>
                                        </div>

                                        {/* Remove Button (Always Visible) */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFromWishlist(item.products.id); }}
                                            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-black hover:bg-red-500 hover:text-white transition-colors z-20"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    {/* Details */}
                                    <div className="mt-4 flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-clash font-bold text-black uppercase leading-tight">
                                                {item.products.title}
                                            </h3>
                                            {!item.products.is_active && (
                                                <span className="text-[9px] font-bold text-red-500 uppercase">Artifact Lost (Inactive)</span>
                                            )}
                                        </div>
                                        <span className="font-clash font-black text-sm">₹{item.products.price}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </section>
    );
}