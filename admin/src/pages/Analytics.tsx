import { 
  TrendingUp, 
  Activity
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../lib/api";

export default function Analytics() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/analytics/overview`)
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <div className="flex items-center justify-center h-full text-slate-400 font-medium">Phân tích dòng chảy dữ liệu...</div>;

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Kinh Doanh Chi Tiết</h1>
        <p className="text-slate-500 mt-1">Phân tích sâu về hiệu suất và sự tăng trưởng của thương hiệu.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-slate-800">
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-xl h-[500px]"
        >
          <div className="flex items-center gap-4 mb-8">
             <div className="bg-purple-50 text-purple-600 p-3 rounded-2xl">
                <TrendingUp size={24} />
             </div>
             <h3 className="text-xl font-bold">Biểu Đồ Doanh Thu Tháng</h3>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[10, 10, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.1 }}
           className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-xl h-[500px]"
        >
          <div className="flex items-center gap-4 mb-8">
             <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl">
                <Activity size={24} />
             </div>
             <h3 className="text-xl font-bold">Tỷ Lệ Tăng Trưởng Lợi Nhuận</h3>
          </div>
          <div className="flex flex-col items-center justify-center h-[70%]">
             <div className="text-6xl font-black text-slate-900 mb-2">+24.5%</div>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">So với quý trước</p>
             <div className="mt-10 w-full max-w-sm h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "75%" }}
                   className="h-full bg-emerald-500" 
                />
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
