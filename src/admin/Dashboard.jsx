import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, totalProducts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Note: You'll need to add a /stats route to your backend or fetch all and count
      const orders = await axios.get("http://localhost:5000/api/orders/all", config);
      const products = await axios.get("http://localhost:5000/api/products", config);
      setStats({ 
        totalOrders: orders.data.results, 
        totalProducts: products.data.data.products.length 
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-5xl font-black text-primary uppercase leading-none">Command <br/><span className="text-accent-dark">Center</span></h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-white border border-emerald-100 rounded-[2.5rem] shadow-sm">
          <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">Total Clan Requests</p>
          <p className="text-6xl font-black text-primary">{stats.totalOrders}</p>
        </div>
        <div className="p-8 bg-white border border-emerald-100 rounded-[2.5rem] shadow-sm">
          <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">Active Artifacts</p>
          <p className="text-6xl font-black text-primary">{stats.totalProducts}</p>
        </div>
      </div>
    </div>
  );
}