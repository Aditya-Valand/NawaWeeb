import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";
import {
    Package, Truck, CheckCircle, Clock, ChevronDown,
    MapPin, ExternalLink, ShieldAlert, RotateCcw
} from "lucide-react";

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await api.get('/orders');
                setOrders(res.data.orders || []);
            } catch (err) {
                console.error("Failed to retrieve archives", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const buyAgain = async (item) => {
        // 1. Add to local storage cart
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        // Check if exists
        const existingIndex = cart.findIndex(
            c => c.productId === (item.product_variants?.products?.id || item.products?.id) &&
                c.variantId === item.variant_id
        );

        const productData = item.product_variants?.products || item.products;
        const variantData = item.product_variants;

        if (!productData) return;

        const newItem = {
            productId: productData.id,
            variantId: item.variant_id,
            title: productData.title,
            image: productData.images?.[0],
            size: variantData?.size || 'One Size',
            price: variantData?.price || productData.price,
            qty: 1, // Default to 1
            isHandmade: false // Add logic if needed
        };

        if (existingIndex > -1) {
            cart[existingIndex].qty += 1;
        } else {
            cart.push(newItem);
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        // 2. Sync if logged in
        const token = localStorage.getItem("token");
        if (token) {
            try {
                await api.post('/user/cart/sync', {
                    localCart: cart
                });
            } catch (err) {
                console.error("Failed to sync cart", err);
            }
        }

        // 3. Redirect to Cart
        navigate("/cart");
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'delivered': return { color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle, label: 'Mission Complete' };
            case 'shipped': return { color: 'text-blue-600', bg: 'bg-blue-100', icon: Truck, label: 'In Transit' };
            case 'cancelled': return { color: 'text-red-600', bg: 'bg-red-100', icon: ShieldAlert, label: 'Aborted' };
            default: return { color: 'text-[#FFD700]', bg: 'bg-yellow-50', icon: Clock, label: 'Processing' };
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-clash uppercase">Decryption in progress...</div>;

    return (
        <section className="min-h-screen bg-[#FAFAFA] pt-24 pb-20 px-4 md:px-12">
            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b-2 border-black pb-6">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                            Syndicate Records
                        </span>
                        <h1 className="text-5xl md:text-7xl font-clash font-black text-black leading-[0.85] uppercase tracking-tighter mt-2">
                            Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-black">Archives</span>
                        </h1>
                    </div>
                </div>

                {/* ORDERS LIST */}
                <div className="space-y-8">
                    {orders.length === 0 ? (
                        <div className="p-12 border-2 border-dashed border-gray-200 rounded-[2rem] text-center">
                            <Package size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="font-clash font-bold text-xl uppercase text-gray-400">No Missions on Record</h3>
                            <button onClick={() => navigate("/shop")} className="mt-6 text-sm font-bold uppercase border-b border-black">
                                Start a New Mission
                            </button>
                        </div>
                    ) : (
                        orders.map((order, i) => {
                            const status = getStatusConfig(order.status);
                            const StatusIcon = status.icon;

                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-[2.5rem] border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden relative group"
                                >
                                    {/* Decorative ID Watermark */}
                                    <div className="absolute top-[-20px] right-[-20px] text-[120px] font-clash font-black text-gray-50 opacity-50 pointer-events-none select-none">
                                        {String(i + 1).padStart(2, '0')}
                                    </div>

                                    {/* Top Row: Meta Data */}
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl ${status.bg}`}>
                                                <StatusIcon size={24} className={status.color} />
                                            </div>
                                            <div>
                                                <h3 className="font-clash font-black text-xl uppercase tracking-wider">
                                                    Order #{order.id.slice(0, 8)}
                                                </h3>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span className={status.color}>{status.label}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[10px] font-black uppercase text-gray-300 tracking-widest">Total Tribute</span>
                                            <span className="font-clash font-black text-2xl">₹{order.total_amount}</span>
                                        </div>
                                    </div>

                                    {/* Middle Row: Items Grid */}
                                    <div className="bg-gray-50/50 rounded-3xl p-4 md:p-6 mb-6">
                                        <div className="space-y-4">
                                            {order.order_items.map((item, idx) => {
                                                // Access nested data safely
                                                const product = item.product_variants?.products || item.products; // Fallback if no variant
                                                const variant = item.product_variants;

                                                return (
                                                    <div key={idx} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                                                        <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-gray-100 shrink-0">
                                                            {product?.images?.[0] && (
                                                                <img src={product.images[0]} className="w-full h-full object-cover" alt="Artifact" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-clash font-bold text-sm uppercase">{product?.title || "Unknown Artifact"}</h4>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                                                                {variant?.size ? `Size: ${variant.size}` : 'Standard'} • Qty: {item.quantity}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="block font-clash font-bold text-sm">₹{item.price_at_purchase}</span>
                                                            <button
                                                                onClick={() => buyAgain(item)}
                                                                className="text-[10px] font-bold uppercase text-[#FFD700] flex items-center gap-1 mt-1 hover:text-black transition-colors"
                                                            >
                                                                <RotateCcw size={10} /> Buy Again
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Bottom Row: Actions */}
                                    <div className="flex justify-between items-center relative z-10">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <MapPin size={14} /> Shipping to {order.city || "Headquarters"}
                                        </div>
                                        <button className="flex items-center gap-2 text-xs font-clash font-bold uppercase hover:text-[#FFD700] transition-colors">
                                            Track Signal <ExternalLink size={14} />
                                        </button>
                                    </div>

                                </motion.div>
                            );
                        })
                    )}
                </div>

            </div>
        </section>
    );
}