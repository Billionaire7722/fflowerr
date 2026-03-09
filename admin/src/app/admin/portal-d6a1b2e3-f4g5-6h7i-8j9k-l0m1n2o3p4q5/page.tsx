"use client";

import AdminLayout from "@/components/AdminLayout";
import { 
  TrendingUp, 
  Users, 
  ShoppingBasket, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Package,
  Activity
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [liveOrders, setLiveOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
    
    const socket = io("http://localhost:3000");
    socket.on("orderCreated", (order: any) => {
      setLiveOrders(prev => [order, ...prev].slice(0, 5));
      fetchAnalytics();
    });

    return () => { socket.disconnect(); };
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("http://localhost:3000/analytics/overview");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  if (!stats) return <AdminLayout><div className="flex items-center justify-center h-full text-slate-400 font-medium">Đang tải dữ liệu từ vườn hoa...</div></AdminLayout>;

  return (
    <AdminLayout>
      <header className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Trung Tâm Điều Hành</h1>
          <p className="text-slate-500 mt-1">Vẻ đẹp từ những đóa hoa, hiệu quả từ những con số.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2 text-sm font-bold shadow-sm">
            <Zap size={18} />
            ĐANG TRỰC TUYẾN
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200 text-sm font-medium">
            Tháng {new Date().getMonth() + 1}, {new Date().getFullYear()}
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          { label: "Tổng Doanh Thu", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: "+15%", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Vốn Nguyên Liệu", value: `$${stats.totalMaterialCost.toLocaleString()}`, icon: Package, trend: "+2%", color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Lợi Nhuận Ròng", value: `$${stats.netProfit.toLocaleString()}`, icon: TrendingUp, trend: "+8%", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Tháng Đỉnh Cao", value: stats.bestMonth, icon: Activity, trend: "Hot", color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-emerald-200 transition-colors"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon size={28} />
              </div>
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {stat.trend}
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">{stat.label}</h3>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/50 h-[450px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900">Doanh Thu & Lợi Nhuận</h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" /> Doanh thu
                 </div>
                 <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <div className="w-3 h-3 rounded-full bg-rose-400" /> Lợi nhuận
                 </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 500}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 500}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.12)', padding: '15px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" stroke="#fb7185" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Feed Sidebar */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             Luồng Đơn Hàng Live
          </h3>
          
          <div className="space-y-6">
            <AnimatePresence>
              {liveOrders.length > 0 ? liveOrders.map((order, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={order.id || idx}
                  className="bg-white/5 border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-rose-400">{order.customerName}</span>
                    <span className="text-xs font-bold text-emerald-400">${Number(order.totalPrice).toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-1 italic">"{order.customMessage || "Không có lời nhắn"}"</p>
                  <div className="mt-4 flex items-center justify-between">
                     <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Vừa xong</span>
                     <div className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">MỚI</div>
                  </div>
                </motion.div>
              )) : (
                <div className="py-20 text-center text-slate-500">
                  <ShoppingBasket size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm">Đang chờ những đơn hàng hoa đầu tiên trong ngày...</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <button className="w-full mt-10 py-4 bg-white/10 rounded-2xl text-sm font-bold hover:bg-white/20 transition-all border border-white/5">
            Xem Tất Cả Đơn Hàng
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
