"use client";

import AdminLayout from "@/components/AdminLayout";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const COLORS = ['#10b981', '#fb7185', '#fbbf24', '#8b5cf6', '#3b82f6'];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3000/analytics/overview")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <AdminLayout><div className="p-10 text-slate-400">Đang tổng hợp báo cáo tài chính...</div></AdminLayout>;

  return (
    <AdminLayout>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Phân Tích Chuyên Sâu</h1>
        <p className="text-slate-500 mt-1">Dữ liệu tài chính minh bạch cho sự phát triển bền vững.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-xl"
        >
          <h3 className="text-xl font-bold mb-8">Cấu Trúc Doanh Thu & Lợi Nhuận</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Lợi Nhuận', value: stats.netProfit },
                    { name: 'Chi Phí Nguyên Liệu', value: stats.totalMaterialCost },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#fb7185" />
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-xl"
        >
          <h3 className="text-xl font-bold mb-8">Hiệu Suất Theo Tháng</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                <Bar dataKey="profit" fill="#fb7185" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="mt-10 bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
         <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Biên Lợi Nhuận Gộp</p>
               <p className="text-5xl font-black text-emerald-400">{((stats.netProfit / stats.totalRevenue) * 100).toFixed(1)}%</p>
            </div>
            <div>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Vốn Lưu Động</p>
               <p className="text-5xl font-black text-rose-400">${stats.totalMaterialCost.toLocaleString()}</p>
            </div>
            <div>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Dự Báo Tăng Trưởng</p>
               <p className="text-5xl font-black text-amber-400">+12.5%</p>
            </div>
         </div>
      </div>
    </AdminLayout>
  );
}
