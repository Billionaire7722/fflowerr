"use client";

import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  BarChart3, 
  Settings, 
  LogOut,
  Flower2
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { name: "Tổng Quan", href: "/management-portal", icon: LayoutDashboard },
    { name: "Đơn Hàng", href: "/management-portal/orders", icon: ShoppingBag },
    { name: "Kho Hàng", href: "/management-portal/inventory", icon: Package },
    { name: "Phân Tích", href: "/management-portal/analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-blue-500 p-2 rounded-lg">
             <Flower2 size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">Florist Admin</span>
        </div>

        <nav className="flex-1 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/10">
           <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors w-full text-left">
            <LogOut size={20} />
             <span>Đăng Xuất</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
