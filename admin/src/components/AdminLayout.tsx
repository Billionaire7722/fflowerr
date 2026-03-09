"use client";

import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  BarChart3, 
  LogOut,
  Flower2,
  Bell
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster, toast } from 'sonner';
import { useEffect } from "react";
import { io } from "socket.io-client";

const ADMIN_PATH = "/admin/portal-d6a1b2e3-f4g5-6h7i-8j9k-l0m1n2o3p4q5";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const socket = io("http://localhost:3000");

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
    <div className="flex min-h-screen bg-slate-50">
      <Toaster position="top-right" richColors />
      
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white p-8 flex flex-col fixed h-full border-r border-white/5">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2.5 rounded-2xl shadow-lg shadow-rose-500/20">
             <Flower2 size={28} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-bold block tracking-tight">Florist Admin</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-rose-400 font-bold">Premium Boutique</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={22} className={isActive ? "text-white" : "group-hover:text-gold-400"} />
                <span className="font-medium">{link.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        <div className="pt-8 border-t border-white/10 space-y-4">
           <div className="px-4 py-3 bg-white/5 rounded-2xl flex items-center justify-between">
              <span className="text-sm text-slate-400">Trạng thái hệ thống</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-emerald-500 uppercase">Live</span>
              </div>
           </div>
           <button className="flex items-center gap-3 px-5 py-4 text-slate-400 hover:text-rose-400 transition-colors w-full text-left font-medium">
             <LogOut size={22} />
             <span>Đăng Xuất</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-12 bg-gradient-to-br from-slate-50 to-white min-h-screen">
        {children}
      </main>
    </div>
  );
}
