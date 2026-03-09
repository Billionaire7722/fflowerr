"use client";

import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";
import { 
  CheckCircle, 
  Clock, 
  MoreVertical,
  Search,
  Filter
} from "lucide-react";

const ORDERS = [
  { id: "#ORD-7421", customer: "Jane Doe", phone: "+1 555-123", total: 125.00, status: "Pending", date: "10 mins ago" },
  { id: "#ORD-7420", customer: "John Smith", phone: "+1 555-456", total: 85.50, status: "Completed", date: "1 hour ago" },
  { id: "#ORD-7419", customer: "Alice Johnson", phone: "+1 555-789", total: 210.00, status: "Pending", date: "3 hours ago" },
];

export default function OrdersPage() {
  return (
    <AdminLayout>
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Order Management</h1>
          <p className="text-slate-500">Track and verify incoming floral requests in real-time.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="pl-10 pr-4 py-2 border rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Search orders..." />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-xl bg-white text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Order ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ORDERS.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 font-medium text-blue-600">{order.id}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">{order.customer}</div>
                  <div className="text-xs text-slate-400">{order.phone}</div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-800">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status === 'Completed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                <td className="px-6 py-4">
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
