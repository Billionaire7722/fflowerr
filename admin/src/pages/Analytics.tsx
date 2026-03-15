import { TrendingUp, Activity, ShoppingBasket, CheckCircle2, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../lib/api";

export default function Analytics() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/analytics/overview`)
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 font-medium">
        Phân tích dòng ch?y d? li?u...
      </div>
    );
  }

  const hasRevenue = stats.chartData && stats.chartData.length > 0;
  const hasOrders = Number.isFinite(stats.totalOrders) && stats.totalOrders > 0;

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          Kinh Doanh Chi Ti?t
        </h1>
        <p className="text-slate-500 mt-1">
          Phân tích d?a trên d? li?u don hàng th?c t?.
        </p>
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
            <h3 className="text-xl font-bold">Bi?u Ð? Doanh Thu Tháng</h3>
          </div>
          {hasRevenue ? (
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "15px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[70%] text-slate-400">
              <Activity size={56} className="mb-6 opacity-30" />
              <p className="text-sm font-semibold">Chua có d? li?u doanh thu</p>
              <p className="text-xs text-slate-400 mt-2">
                Bi?u d? s? hi?n th? khi có don hàng hoàn t?t.
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-xl h-[500px]"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl">
              <ShoppingBasket size={24} />
            </div>
            <h3 className="text-xl font-bold">T?ng Quan Ðon Hàng</h3>
          </div>

          {hasOrders ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500 font-semibold">
                  <ShoppingBasket size={18} /> T?ng don hàng
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {stats.totalOrders.toLocaleString("vi-VN")}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-emerald-600 font-semibold">
                  <CheckCircle2 size={18} /> Hoàn t?t
                </div>
                <div className="text-2xl font-black text-emerald-600">
                  {stats.completedOrders.toLocaleString("vi-VN")}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-amber-600 font-semibold">
                  <Clock size={18} /> Ðang ch?
                </div>
                <div className="text-2xl font-black text-amber-600">
                  {stats.pendingOrders.toLocaleString("vi-VN")}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[70%] text-slate-400">
              <Activity size={56} className="mb-6 opacity-30" />
              <p className="text-sm font-semibold">Chua có don hàng</p>
              <p className="text-xs text-slate-400 mt-2">
                D? li?u s? hi?n th? khi có don hàng m?i.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
