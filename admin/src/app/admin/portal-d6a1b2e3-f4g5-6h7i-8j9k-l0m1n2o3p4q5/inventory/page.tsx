"use client";

import AdminLayout from "@/components/AdminLayout";
import { 
  Package, 
  Trash2, 
  Edit3, 
  Plus,
  AlertTriangle,
  TrendingDown,
  Layers,
  Coins
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Material {
  id: string;
  name: string;
  unitCost: number;
  stockLevel: number;
  unit: string;
}

export default function InventoryPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await fetch("http://localhost:3000/materials");
      const data = await res.json();
      setMaterials(data);
    } catch (err) {
      console.error("Failed to fetch materials:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalValue = materials.reduce((acc, m) => acc + (Number(m.unitCost) * m.stockLevel), 0);
  const lowStockCount = materials.filter(m => m.stockLevel < 10).length;

  return (
    <AdminLayout>
      <header className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Kho Nguyên Liệu</h1>
          <p className="text-slate-500 mt-1">Quản lý kho tàng hương sắc và tối ưu hóa chi phí.</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 uppercase tracking-widest">
          <Plus size={20} />
          Nhập Kho Mới
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         {[
           { label: "Giá Trị Tồn Kho", value: `$${totalValue.toLocaleString()}`, icon: Coins, color: "text-emerald-600", bg: "bg-emerald-50" },
           { label: "Cảnh Báo Hết Hàng", value: `${lowStockCount} Mục`, icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50", warning: lowStockCount > 0 },
           { label: "Tổng Phân Loại", value: `${materials.length} Loại`, icon: Layers, color: "text-amber-600", bg: "bg-amber-50" },
         ].map((stat, i) => (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             key={i} 
             className={`bg-white p-8 rounded-[2rem] border ${stat.warning ? 'border-rose-200' : 'border-slate-200/60'} shadow-xl shadow-slate-200/40 group hover:border-emerald-200 transition-all`}
           >
             <div className="flex justify-between items-center mb-6">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:rotate-12 transition-transform`}>
                   <stat.icon size={28} />
                </div>
                {stat.warning && <div className="animate-ping w-2 h-2 rounded-full bg-rose-500" />}
             </div>
             <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">{stat.label}</p>
             <p className={`text-3xl font-black ${stat.warning ? 'text-rose-600' : 'text-slate-900'}`}>{stat.value}</p>
           </motion.div>
         ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-2xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Nguyên Liệu</th>
                <th className="px-10 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Tồn Kho</th>
                <th className="px-10 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Đơn Giá</th>
                <th className="px-10 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                   <td colSpan={4} className="py-20 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent" />
                      <p className="mt-4 text-slate-400 font-bold">Đang kiểm kê kho...</p>
                   </td>
                </tr>
              ) : materials.map((item, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={item.id} 
                  className="hover:bg-emerald-50/20 transition-colors group"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="bg-white border border-slate-100 p-3 rounded-2xl text-slate-400 group-hover:text-emerald-500 group-hover:scale-110 shadow-sm transition-all duration-300">
                         <Package size={24} />
                      </div>
                      <span className="font-bold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-xl font-black ${item.stockLevel < 10 ? 'text-rose-600' : 'text-slate-900'}`}>
                        {item.stockLevel}
                      </span>
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">{item.unit}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                     <span className="text-lg font-bold text-slate-600 group-hover:text-slate-900 transition-colors">${Number(item.unitCost).toFixed(2)}</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3 invisible group-hover:visible transition-all">
                      <button className="p-3 bg-white border border-slate-100 hover:border-emerald-200 hover:text-emerald-600 rounded-2xl transition-all shadow-sm hover:shadow-md">
                        <Edit3 size={20} />
                      </button>
                      <button className="p-3 bg-white border border-slate-100 hover:border-rose-200 hover:text-rose-600 rounded-2xl transition-all shadow-sm hover:shadow-md">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
