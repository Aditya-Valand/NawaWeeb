import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Mail,
  Clock,
  Package,
  MapPin,
  Truck, 
  CheckCircle, 
  AlertCircle,
  User,
  ChevronDown
} from "lucide-react";

export default function OrderInbox() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No auth token found. Please log out and log back in.");
        return;
      }

      // Authorization header automatically added by axios interceptor
      const res = await api.get('/orders/all');
      

      setOrders(res.data.orders || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to fetch orders";
      setError(msg);
      console.error("Order fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Status Update (Pending -> Shipped -> Delivered)
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const token = localStorage.getItem("token");
      
      await api.patch(`/orders/${orderId}/status`, 
        { status: newStatus }
      );

      // Optimistic UI Update (Update local state immediately)
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper: Status Color Logic (lowercase matches DB enum values)
  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  if (loading) return <div className="p-10 text-center font-editor opacity-50">Unrolling scrolls...</div>;

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-primary uppercase italic">
            Order <span className="text-accent-dark">Inbox</span>
          </h2>
          <p className="text-sm font-bold text-primary/40 uppercase tracking-widest mt-2">
            {orders.length} Active Scrolls
          </p>
        </div>
      </header>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm uppercase">Error loading orders</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      )}
      
      <div className="grid gap-6">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="group relative bg-white border border-emerald-100 rounded-[2rem] p-6 hover:shadow-lg transition-all duration-300"
          >
            {/* --- TOP ROW: Meta Data --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-dashed border-emerald-100">
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/5 rounded-2xl text-primary">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="font-clash font-bold text-lg text-primary">
                    Order #{order.id.slice(0, 8)}...
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-primary/40 uppercase">
                    <Clock size={12}/> 
                    {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>

              {/* Status & Payment Badge */}
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase border ${order.payment_status === 'paid' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                  {order.payment_status || 'Unpaid'}
                </span>

                {/* Status Dropdown */}
                <div className="relative">
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className={`appearance-none cursor-pointer pl-4 pr-10 py-1.5 rounded-full text-xs font-black uppercase border focus:outline-none focus:ring-2 ring-primary/20 ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"/>
                </div>
              </div>
            </div>

            {/* --- MIDDLE ROW: Content --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left: Customer Info */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">Customer Details</p>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 bg-accent/20 rounded-lg text-accent-dark">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-primary text-lg leading-none">
                      {order.profiles?.full_name || "Guest Ronin"}
                    </p>
                    <div className="flex items-center gap-1.5 text-primary/60 text-sm mt-1 font-medium">
                      <Mail size={12} />
                      {order.profiles?.email || "No email provided"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Order Items */}
              {/* Right: Order Items */}
<div className="space-y-3">
  <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">Artifacts Manifested</p>
  <div className="space-y-2">
    {order.order_items?.map((item, idx) => {
      // Accessing the deeply nested product data
      const product = item.product_variants?.products;
      const variant = item.product_variants;

      return (
        <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2">
             {product?.images?.[0] && (
               <img src={product.images[0]} alt="prod" className="w-8 h-8 rounded-md object-cover bg-white"/>
             )}
             <div className="flex flex-col">
               <span className="font-bold text-primary">
                 {product?.title || "Unknown Artifact"}
               </span>
               <span className="text-[10px] font-bold text-primary/40 uppercase">
                 Size: {variant?.size || 'N/A'} • Qty: {item.quantity}
               </span>
             </div>
          </div>
          <span className="font-editor font-bold">₹{item.price_at_purchase}</span>
        </div>
      );
    })}
  </div>
  
  {/* Total Amount */}
  <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
    <span className="text-xs font-black text-primary uppercase">Total Tribute</span>
    <span className="text-xl font-black text-primary">₹{order.total_amount}</span>
  </div>
</div>

            </div>

            {/* --- BOTTOM ROW: Shipping Address --- */}
            {order.shipping_address && (
              <div className="mt-4 pt-4 border-t border-dashed border-emerald-100 flex items-start gap-3">
                <MapPin size={14} className="text-primary/30 shrink-0 mt-0.5" />
                <p className="text-xs text-primary/50 font-medium">
                  {[
                    order.shipping_address.fullName,
                    order.shipping_address.street,
                    order.shipping_address.city,
                    order.shipping_address.state,
                    order.shipping_address.pincode,
                    order.shipping_address.phone
                  ].filter(Boolean).join(', ')}
                </p>
              </div>
            )}
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest">No scrolls in the inbox</p>
          </div>
        )}
      </div>
    </div>
  );
}