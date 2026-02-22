import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { 
  Layers, 
  ShoppingBag, 
  IndianRupee, 
  Activity, 
  TrendingUp,
   AlertCircle 
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Inside src/components/Dashboard.jsx

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Authorization header automatically added by axios interceptor
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
        const msg = err.response?.data?.message || err.message || "Failed to load stats";
        console.error("Dashboard fetch error:", err.response?.data || err.message);
        setFetchError(msg);
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

      {fetchError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
          <AlertCircle size={18} className="shrink-0" />
          <span><strong>Error loading stats:</strong> {fetchError}</span>
        </div>
      )}

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