"use client";

import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { 
  CheckCircle, 
  Clock, 
  MoreVertical,
  Search,
  Filter,
  Loader2
} from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  phone: string;
  totalPrice: number;
  status: 'PENDING_VERIFICATION' | 'COMPLETED';
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3000/orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Polling for "real-time"
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PENDING_VERIFICATION' ? 'COMPLETED' : 'PENDING_VERIFICATION';
    try {
      await fetch(`http://localhost:3000/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus as any } : o));
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <AdminLayout>
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Quản Lý Đơn Hàng</h1>
          <p className="text-slate-500">Theo dõi và xác nhận các đơn hàng mới trong thời gian thực.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="pl-10 pr-4 py-2 border rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Tìm kiếm đơn hàng..." />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-xl bg-white text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Lọc
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400">
             <Loader2 className="animate-spin mb-4" size={40} />
             <p>Đang chuẩn bị danh sách đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-20 text-center text-slate-400">
             <p>Chưa có đơn hàng nào. Những đóa hoa đang chờ đợi chủ nhân!</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Mã Đơn</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Khách Hàng</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tổng Tiền</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Trạng Thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ngày Đặt</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-blue-600 truncate max-w-[120px]">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{order.customerName}</div>
                    <div className="text-xs text-slate-400">{order.phone}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">${Number(order.totalPrice).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => updateStatus(order.id, order.status)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        order.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }`}
                    >
                      {order.status === 'COMPLETED' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {order.status === 'COMPLETED' ? 'Hoàn Thành' : 'Chờ Xác Nhận'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
