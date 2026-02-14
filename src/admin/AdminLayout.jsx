import React from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { LayoutDashboard, PackagePlus, Inbox, LogOut, ChevronRight } from "lucide-react";

const sidebarItems = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { id: "products", label: "Manage Drops", icon: PackagePlus, path: "/admin/products" },
  { id: "orders", label: "Order Inbox", icon: Inbox, path: "/admin/orders" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/auth");
  };

  return (
    <div className="flex min-h-screen bg-[#F0FDF4] font-clash">
      {/* Sidebar */}
      <aside className="w-72 bg-primary text-white p-8 hidden lg:flex flex-col border-r border-emerald-900/10">
        <div className="mb-12">
          <h2 className="text-3xl font-black italic tracking-tighter">NAWAWEEB</h2>
          <p className="text-[10px] text-accent font-bold tracking-[0.3em] uppercase">
            Artisan Panel
          </p>
        </div>

        <nav className="flex-1 space-y-3">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${
                  isActive ? "bg-accent text-primary shadow-xl" : "hover:bg-primary-light/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={20} />
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-4 text-white/40 hover:text-accent transition-colors"
        >
          <LogOut size={20} />
          <span className="font-bold text-sm">Seal Domain (Logout)</span>
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 lg:p-12 h-screen overflow-y-auto relative">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
