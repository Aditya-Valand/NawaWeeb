import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trash2, Minus, Plus, ArrowRight, ShieldCheck,
    Ghost, Sparkles
} from "lucide-react";

export default function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [loading, setLoading] = useState(true);

    // Load Cart
    useEffect(() => {
        fetchCart();
    }, []);

    // Window focus handler to re-fetch if updated elsewhere
    useEffect(() => {
        const handleFocus = () => fetchCart();
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    const fetchCart = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const res = await api.get("/user/cart");
                if (res.data.success) {
                    setCartItems(res.data.cart);
                }
            } catch (err) {
                console.error("Failed to fetch server cart:", err);
            } finally {
                setLoading(false);
            }
        } else {
            // Guest Mode
            const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
            setCartItems(storedCart);
            setLoading(false);
        }
    };

    // Calculate Totals
    useEffect(() => {
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
        setSubtotal(total);
    }, [cartItems]);

    // Update Qty
    const updateQty = async (index, newQty) => {
        if (newQty < 1) return;

        // Optimistic Update
        const oldCart = [...cartItems];
        const updated = [...cartItems];
        updated[index].qty = newQty;
        setCartItems(updated);

        const token = localStorage.getItem("token");
        if (token) {
            // Prepare payload for sync
            // Note: Our sync endpoint merges. 
            // Ideally we should have a specific 'update' endpoint but sync works for upsert.
            // We only send the item we changed to be efficient? No, sync expects an array.
            // Let's send the single updated item to sync/upsert it.
            try {
                await api.post("/user/cart/sync", {
                    localCart: [updated[index]]
                });
            } catch (err) {
                console.error("Failed to update qty on server:", err);
                setCartItems(oldCart); // Revert on error
            }
        } else {
            localStorage.setItem("cart", JSON.stringify(updated));
        }
    };

    // Remove Item
    const removeItem = async (index) => {
        const itemToRemove = cartItems[index];

        // Optimistic Update
        const oldCart = [...cartItems];
        const updated = cartItems.filter((_, i) => i !== index);
        setCartItems(updated);

        const token = localStorage.getItem("token");
        if (token) {
            try {
                await api.post("/user/cart/remove", {
                    productId: itemToRemove.productId,
                    variantId: itemToRemove.variantId
                });
            } catch (err) {
                console.error("Failed to remove item on server:", err);
                setCartItems(oldCart);
            }
        } else {
            localStorage.setItem("cart", JSON.stringify(updated));
            window.dispatchEvent(new Event("storage"));
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-clash uppercase">Accessing Containment...</div>;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#F4F4F5] flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative"
                >
                    <Ghost size={120} strokeWidth={1} className="text-gray-300" />
                    <div className="absolute top-0 right-0 animate-bounce">
                        <span className="text-4xl">💤</span>
                    </div>
                </motion.div>
                <h2 className="mt-8 text-4xl font-clash font-black text-primary uppercase">
                    Your Stash is Empty
                </h2>
                <p className="font-editor italic text-gray-500 mt-2 mb-8">
                    The spirits are waiting. Manifest some drip.
                </p>
                <button
                    onClick={() => navigate("/shop")}
                    className="px-10 py-4 bg-black text-white rounded-full font-clash font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl"
                >
                    Summon Artifacts
                </button>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-[#FAFAFA] pt-24 pb-20 px-4 md:px-12">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-black pb-6">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                            Inventory Protocol
                        </span>
                        <h1 className="text-5xl md:text-7xl font-clash font-black text-black leading-[0.85] uppercase tracking-tighter mt-2">
                            Artifact <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-black">Containment</span>
                        </h1>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="font-editor text-xl italic text-gray-500">
                            {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} Sealed
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">

                    {/* LEFT: CART ITEMS LIST */}
                    <div className="lg:col-span-2 space-y-8">
                        <AnimatePresence>
                            {cartItems.map((item, index) => (
                                <motion.div
                                    key={`${item.productId}-${item.variantId}`}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="group relative flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 hover:border-black/5 hover:shadow-lg transition-all duration-300"
                                >
                                    {/* Compact Image (3:4 Aspect Ratio) */}
                                    <div className="w-20 h-28 shrink-0 bg-gray-100 rounded-xl overflow-hidden relative">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {item.isHandmade && (
                                            <div className="absolute bottom-0 inset-x-0 bg-[#FFD700] text-black text-[7px] font-black text-center py-0.5 uppercase tracking-wider">
                                                Handmade
                                            </div>
                                        )}
                                    </div>

                                    {/* Details Column */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between h-28 py-1">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="text-sm font-clash font-bold text-black uppercase truncate leading-tight">
                                                    {item.title}
                                                </h3>
                                                {/* Price moved to top right */}
                                                <span className="font-clash font-black text-sm whitespace-nowrap">
                                                    ₹{item.price * item.qty}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                <span className="bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border border-gray-100">
                                                    Size: {item.size}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Bottom Row: Qty Controls & Remove */}
                                        <div className="flex items-center justify-between mt-auto">
                                            {/* Minimal Qty Control */}
                                            <div className="flex items-center bg-gray-50 rounded-lg p-0.5 gap-2 border border-gray-100">
                                                <button
                                                    onClick={() => updateQty(index, item.qty - 1)}
                                                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black hover:bg-white rounded-md transition-all shadow-sm"
                                                    disabled={item.qty <= 1}
                                                >
                                                    <Minus size={10} />
                                                </button>
                                                <span className="font-clash font-bold text-xs w-3 text-center text-black">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQty(index, item.qty + 1)}
                                                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black hover:bg-white rounded-md transition-all shadow-sm"
                                                    disabled={item.qty >= (item.maxStock || 10)}
                                                >
                                                    <Plus size={10} />
                                                </button>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeItem(index)}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                                title="Remove Item"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT: CHECKOUT SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 bg-black text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">

                            {/* Decorative Background Blur */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700] rounded-full blur-[80px] opacity-20 pointer-events-none" />

                            <h2 className="text-2xl font-clash font-black uppercase mb-8 relative z-10">
                                Tribute <span className="text-[#FFD700]">Details</span>
                            </h2>

                            <div className="space-y-4 mb-8 relative z-10">
                                <div className="flex justify-between text-white/60 font-medium">
                                    <span>Subtotal</span>
                                    <span className="font-clash text-white">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-white/60 font-medium">
                                    <span>Shipping</span>
                                    <span className="text-[#FFD700] text-xs font-bold uppercase tracking-wider border border-[#FFD700]/30 px-2 py-0.5 rounded">Free (Clan Perk)</span>
                                </div>
                                <div className="h-px bg-white/10 my-4" />
                                <div className="flex justify-between items-end">
                                    <span className="font-clash font-bold text-lg">Total</span>
                                    <span className="font-clash font-black text-4xl">₹{subtotal}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => alert("Payment Integration Next!")}
                                className="w-full group relative py-5 bg-white text-black rounded-2xl font-clash font-black text-sm uppercase tracking-[0.2em] overflow-hidden hover:scale-[1.02] transition-transform duration-300"
                            >
                                <div className="absolute inset-0 bg-[#FFD700] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    Secure Drop <ArrowRight size={18} />
                                </span>
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                                <ShieldCheck size={12} /> Encrypted Transaction
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}