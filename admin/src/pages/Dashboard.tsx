import { 
  TrendingUp, 
  ShoppingBasket, 
  DollarSign,
  Zap,
  Package,
  Activity
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { API_BASE_URL } from "../lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [liveOrders, setLiveOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
    
    const socket = io(API_BASE_URL);
    socket.on("orderCreated", (order: any) => {
      setLiveOrders(prev => [order, ...prev].slice(0, 5));
      fetchAnalytics();
      toast.success(`Đơn hàng mới từ ${order.customerName}!`, {
        description: `Tổng giá trị: $${Number(order.totalPrice).toFixed(2)}`,
        icon: <ShoppingBasket className="text-emerald-500" size={18} />,
      });
    });

    return () => { socket.disconnect(); };
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/overview`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  if (!stats) return <div className="flex items-center justify-center h-full text-slate-400 font-medium">Đang tải dữ liệu từ vườn hoa...</div>;

  return (
    <div className="max-w-[1600px] mx-auto">
      <header className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Trung Tâm Điều Hành</h1>
          <p className="text-slate-500 font-medium">Vẻ đẹp từ những đóa hoa, hiệu quả từ những con số.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2 text-sm font-bold shadow-sm">
            <Zap size={18} />
            ĐANG TRỰC TUYẾN
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200 text-sm font-bold text-slate-500 uppercase tracking-widest leading-none flex items-center h-full">
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
            className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-emerald-200 transition-colors"
          >
            {/* Percentage Badge - Top Right */}
            <div className={`absolute top-6 right-6 flex items-center text-[10px] font-black px-2.5 py-1 rounded-full ${stat.trend.startsWith('+') || stat.trend === 'Hot' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} border border-emerald-100/50`}>
              {stat.trend}
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-sm`}>
                <stat.icon size={28} />
              </div>
            </div>
            <h3 className="text-slate-400 text-[10px] font-black mb-1 uppercase tracking-[0.2em]">{stat.label}</h3>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/50 h-[480px] flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Doanh Thu & Lợi Nhuận</h3>
              <div className="flex gap-6">
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" /> Doanh thu
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-rose-400 shadow-lg shadow-rose-400/20" /> Lợi nhuận
                 </div>
              </div>
            </div>
            
            <div className="flex-1 min-h-0 relative">
              {stats.chartData && stats.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="profit" stroke="#fb7185" strokeWidth={3} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                  <Activity size={64} className="mb-6 opacity-20" />
                  <p className="font-black uppercase tracking-widest text-xs mb-2">Chưa có dữ liệu thống kê</p>
                  <p className="text-sm font-medium text-slate-400 text-center px-8">Hệ thống đang tổng hợp dữ liệu từ các đơn hàng mới...</p>
                  {/* Subtle Line Illustration Placeholder */}
                  <svg className="absolute inset-x-0 bottom-0 w-full h-32 opacity-5 pointer-events-none" viewBox="0 0 1000 100" preserveAspectRatio="none">
                    <path d="M0,80 C100,20 200,90 300,50 C400,10 500,80 600,40 C700,0 800,70 900,30 C1000,10 1000,100 0,100 Z" fill="currentColor" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Feed Sidebar */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col h-[480px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black flex items-center gap-3 tracking-tight text-balance">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
               Luồng Đơn Hàng Live
            </h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time</span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            <AnimatePresence>
              {liveOrders.length > 0 ? liveOrders.map((order, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={order.id || idx}
                  className="bg-white/5 border border-white/5 p-5 rounded-[1.5rem] hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-black text-rose-400 group-hover:text-rose-300 transition-colors uppercase tracking-tight text-sm">{order.customerName}</span>
                    <span className="text-xs font-black text-emerald-400">${Number(order.totalPrice).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 italic font-medium leading-relaxed">"{order.customMessage || "Sứ giả hoa tươi..."}"</p>
                  <div className="mt-4 flex items-center justify-between">
                     <span className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Vừa xong</span>
                     <div className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[9px] font-black tracking-tighter shadow-sm border border-emerald-500/10">MỚI</div>
                  </div>
                </motion.div>
              )) : (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <ShoppingBasket size={32} className="text-slate-600 opacity-50" />
                  </div>
                  <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-1 text-center">Đang chờ đơn hàng</p>
                  <p className="text-xs text-slate-600 font-medium italic text-center">Sớm thôi, những đóa hoa sẽ bay đi...</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <button className="w-full mt-8 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 active:scale-95 shadow-lg">
            Quản lý đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}
