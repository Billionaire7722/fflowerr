import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  BarChart3, 
  LogOut,
  Flower2
} from "lucide-react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { toast } from 'sonner';
import { API_BASE_URL } from "../lib/api";

const ADMIN_PATH = "/admin/portal-d6a1b2e3-f4g5-6h7i-8j9k-l0m1n2o3p4q5";

export default function AdminLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    const socket = io(API_BASE_URL);

    socket.on("orderCreated", (order) => {
      toast.success(`Đơn hàng mới từ ${order.customerName}!`, {
        description: `Tổng cộng: $${order.totalPrice}`,
        icon: <ShoppingBag className="text-emerald-500" />
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const links = [
    { name: "Tổng Quan", href: ADMIN_PATH, icon: LayoutDashboard },
    { name: "Sản Phẩm", href: `${ADMIN_PATH}/products`, icon: Flower2 },
    { name: "Đơn Hàng", href: `${ADMIN_PATH}/orders`, icon: ShoppingBag },
    { name: "Kho Hàng", href: `${ADMIN_PATH}/inventory`, icon: Package },
    { name: "Phân Tích", href: `${ADMIN_PATH}/analytics`, icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col fixed h-full border-r border-white/5 z-20">
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-xl shadow-lg shadow-rose-500/20">
             <Flower2 size={24} className="text-white" />
          </div>
          <div>
            <span className="text-lg font-black block tracking-tight leading-none">pili.blossom</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-rose-400 font-bold block mt-1">Premium Admin</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full" 
                  />
                )}
                <Icon size={20} className={isActive ? "text-emerald-400" : "group-hover:text-emerald-400"} />
                <span className="font-semibold text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
           {/* System Status */}
           <div className="px-4 py-2.5 bg-white/5 rounded-xl flex items-center justify-between border border-white/5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hệ thống</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Live</span>
              </div>
           </div>

           {/* User Profile */}
           <div className="p-3 bg-white/5 rounded-2xl flex items-center gap-3 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-8 h-8" />
              </div>
              <div className="flex-1 overflow-hidden">
                 <p className="text-xs font-bold truncate">Admin Artist</p>
                 <p className="text-[10px] text-slate-500 font-medium">pili.blossom @ owner</p>
              </div>
           </div>

           <button className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-rose-400 transition-colors w-full text-left font-bold text-xs uppercase tracking-widest">
             <LogOut size={18} />
             <span>Đăng Xuất</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-10 bg-gradient-to-br from-slate-50 to-white min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
