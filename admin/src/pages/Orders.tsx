import { useEffect, useState } from "react";
import { 
  CheckCircle, 
  Clock, 
  MoreVertical,
  Search,
  Filter,
  Loader2,
  Calendar,
  ShoppingBasket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

interface Order {
  id: string;
  customerName: string;
  phone: string;
  totalPrice: number;
  status: 'PENDING_VERIFICATION' | 'COMPLETED';
  createdAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    
    const socket = io("http://localhost:3100");
    socket.on("orderCreated", () => {
      fetchOrders();
    });

    return () => { socket.disconnect(); };
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3100/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PENDING_VERIFICATION' ? 'COMPLETED' : 'PENDING_VERIFICATION';
    try {
      await fetch(`http://localhost:3100/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      fetchOrders();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div>
      <header className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Đơn Hàng Boutique</h1>
          <p className="text-slate-500 mt-1">Danh sách tinh hoa những đơn hàng đang chờ nghệ nhân.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input className="pl-12 pr-6 py-3 border border-slate-200 rounded-[1.25rem] bg-white text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none w-72 transition-all shadow-sm text-slate-800" placeholder="Tìm kiếm khách hàng..." />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-[1.25rem] bg-white text-sm font-bold shadow-sm hover:bg-slate-50 transition-all text-slate-700">
            <Filter size={20} />
            Bộ Lọc
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-2xl shadow-slate-200/40 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
             <div className="relative">
                <Loader2 className="animate-spin text-emerald-500" size={56} />
                <div className="absolute inset-0 blur-xl bg-emerald-500/20 animate-pulse" />
             </div>
             <p className="mt-6 font-bold text-slate-500">Đang hái những đóa hoa đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-32 text-center text-slate-400 flex flex-col items-center">
             <div className="bg-slate-50 p-8 rounded-full mb-6">
                <ShoppingBasket size={64} className="opacity-20" />
             </div>
             <h3 className="text-xl font-bold text-slate-700">Chưa có đơn hàng nào</h3>
             <p className="mt-2 text-slate-500">Sẵn sàng kéo, chúng ta sẽ sớm có khách hàng!</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Mã</th>
                  <th className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Khách Hàng</th>
                  <th className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Sản Phẩm</th>
                  <th className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Trạng Thái</th>
                  <th className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {orders.map((order, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={order.id} 
                      className="hover:bg-emerald-50/30 transition-colors group cursor-pointer"
                    >
                      <td className="px-10 py-8">
                         <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-slate-300 group-hover:text-emerald-400 uppercase tracking-tighter transition-colors">Order</span>
                            <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-emerald-600 transition-colors truncate max-w-[80px]">{order.id.split('-')[0]}</span>
                         </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm ring-2 ring-slate-50">
                              {order.customerName[0]}
                           </div>
                           <div>
                             <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{order.customerName}</div>
                             <div className="text-sm text-slate-500 font-medium">{order.phone}</div>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-col">
                           <span className="text-lg font-black text-slate-900">${Number(order.totalPrice).toFixed(2)}</span>
                           <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                              <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                           </span>
                        </div>
                      </td>
                      <td className="px-8 py-8 text-center">
                        <button 
                          onClick={(e) => { e.stopPropagation(); updateStatus(order.id, order.status); }}
                          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-md group ${
                            order.status === 'COMPLETED' 
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                              : 'bg-rose-100 text-rose-700 hover:bg-rose-200 hover:scale-105'
                          }`}
                        >
                          {order.status === 'COMPLETED' ? <CheckCircle size={16} /> : <Clock size={16} className="animate-pulse" />}
                          {order.status === 'COMPLETED' ? 'Hoàn Thành' : 'Đang Chờ'}
                        </button>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <button className="p-3 hover:bg-white hover:shadow-lg rounded-2xl transition-all text-slate-400 hover:text-rose-500 border border-transparent hover:border-slate-100">
                          <MoreVertical size={20} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
