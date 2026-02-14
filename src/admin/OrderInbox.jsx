import React, { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Phone, Clock } from "lucide-react";

export default function OrderInbox() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
     const token = localStorage.getItem("token") ;
      const res = await axios.get("http://localhost:5000/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.data.orders);
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-black text-primary uppercase italic">Incoming <span className="text-accent-dark">Scrolls</span></h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="p-6 bg-white border border-emerald-100 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-1">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${order.orderType === 'Handmade' ? 'bg-accent text-primary' : 'bg-primary text-white'}`}>
                {order.orderType}
              </span>
              <h3 className="text-xl font-black text-primary uppercase pt-2">{order.productName}</h3>
              <div className="flex gap-4 text-xs text-primary/50 font-bold uppercase">
                <span className="flex items-center gap-1"><Clock size={12}/> {new Date(order.createdAt).toLocaleDateString()}</span>
                <span>Size: {order.size}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="font-clash font-bold text-primary">{order.customerContact}</p>
              <button className="px-5 py-2 bg-primary text-white rounded-full text-xs font-bold uppercase hover:bg-emerald-800 transition-colors">
                Contact Customer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}