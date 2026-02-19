import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { 
  Layers, 
  ShoppingBag, 
  IndianRupee, 
  Activity, 
  TrendingUp 
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ 
    totalOrders: 0, 
    totalProducts: 0, 
    totalRevenue: 0 
  });
  const [loading, setLoading] = useState(true);

  // Inside src/components/Dashboard.jsx

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // console.log("1. Starting Fetch...");

        // FETCH PRODUCTS
        // console.log("2. Fetching Products...");
        const productsRes = await api.get('/products');
        // console.log("3. Products Success:", productsRes.data);

        // FETCH ORDERS (The one failing)
        // console.log("4. Fetching Orders...");
        const ordersRes = await api.get('/orders/all');
        // console.log("5. Orders Success:", ordersRes.data);

        // Calculate Stats
        // Inside fetchStats try block in Dashboard.jsx

// 1. Correct the products path
const productList = productsRes.data.data?.products || [];

// 2. Correct the orders path (since we fixed the controller above)
const orderList = ordersRes.data.orders || []; 

// 3. Calculate Revenue
const totalRevenue = orderList.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);

setStats({ 
  totalProducts: productList.length,
  totalOrders: orderList.length,
  totalRevenue: totalRevenue
});

      } catch (err) {
        // 🚨 THIS IS THE DEBUGGING PART 🚨
        console.error("❌ FULL ERROR OBJECT:", err);
        
        if (err.response) {
          // The server responded with a status code (like 400)
          console.error("❌ DATA:", err.response.data);
          console.error("❌ STATUS:", err.response.status);
          console.error("❌ HEADERS:", err.response.headers);
          
          // Show alert with the REAL message
          alert(`Server Error: ${JSON.stringify(err.response.data)}`);
        } else if (err.request) {
          // The request was made but no response was received
          console.error("❌ NO RESPONSE:", err.request);
        } else {
          // Something happened in setting up the request
          console.error("❌ SETUP ERROR:", err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-primary/40 font-editor italic">
        <Activity className="animate-pulse mr-2" /> Initializing Command Center...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-5xl font-black text-primary uppercase leading-none">
          Command <br/><span className="text-accent-dark">Center</span>
        </h1>
        <p className="text-primary/40 font-editor italic mt-2">
          Overview of the Clan's operations.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: REVENUE (New!) */}
        <div className="p-8 bg-primary text-white rounded-[2.5rem] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <IndianRupee size={100} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/10 rounded-full">
                <TrendingUp size={18} className="text-accent" />
              </div>
              <p className="text-xs font-bold text-accent uppercase tracking-widest">
                Clan Treasury
              </p>
            </div>
            <p className="text-5xl font-black font-clash">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-[10px] text-white/40 mt-2 uppercase font-bold">
              Total Lifetime Revenue
            </p>
          </div>
        </div>

        {/* CARD 2: ORDERS */}
        <div className="p-8 bg-white border border-emerald-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-emerald-50 rounded-full text-emerald-600">
              <ShoppingBag size={18} />
            </div>
            <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">
              Total Orders
            </p>
          </div>
          <p className="text-6xl font-black text-primary">
            {stats.totalOrders}
          </p>
        </div>

        {/* CARD 3: PRODUCTS */}
        <div className="p-8 bg-white border border-emerald-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
           <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 rounded-full text-blue-600">
              <Layers size={18} />
            </div>
            <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">
              Active Artifacts
            </p>
          </div>
          <p className="text-6xl font-black text-primary">
            {stats.totalProducts}
          </p>
        </div>

      </div>
    </div>
  );
}