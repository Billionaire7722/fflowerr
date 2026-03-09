"use client";

import AdminLayout from "@/components/AdminLayout";
import { 
  TrendingUp, 
  Users, 
  ShoppingBasket, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
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
  Area
} from 'recharts';

const DATA = [
  { name: 'Th1', revenue: 4000, profit: 2400 },
  { name: 'Th2', revenue: 3000, profit: 1398 },
  { name: 'Th3', revenue: 2000, profit: 9800 },
  { name: 'Th4', revenue: 2780, profit: 3908 },
  { name: 'Th5', revenue: 1890, profit: 4800 },
  { name: 'Th6', revenue: 2390, profit: 3800 },
];

export default function Dashboard() {
  return (
    <AdminLayout>
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Tổng Quan Kinh Doanh</h1>
          <p className="text-slate-500">Chào mừng quản lý quay trở lại. Đây là tình hình kinh doanh hôm nay.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm font-medium">
          Ngày 09 Tháng 03, 2026
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Tổng Doanh Thu", value: "$12,450", icon: DollarSign, trend: "+12%", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Đơn Hàng Mới", value: "84", icon: ShoppingBasket, trend: "+5%", color: "text-green-600", bg: "bg-green-50" },
          { label: "Lợi Nhuận Ròng", value: "$6,210", icon: TrendingUp, trend: "-2%", color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Khách Hàng Đang Hoạt Động", value: "1,240", icon: Users, trend: "+8%", color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend}
                {stat.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-[400px]">
          <h3 className="text-lg font-bold mb-6">Phân Tích Doanh Thu</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-[400px]">
          <h3 className="text-lg font-bold mb-6">Hiệu Suất Bán Hàng</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
}
