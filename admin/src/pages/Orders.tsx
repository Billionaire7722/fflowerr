import { useEffect, useState } from "react";
import { 
  CheckCircle, 
  Clock, 
  MoreVertical,
  Search,
  Filter,
  Loader2,
  Calendar,
  ShoppingBasket,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { API_BASE_URL } from "../lib/api";

interface Order {
  id: string;
  customerName: string;
  phone: string;
  totalPrice: number;
  status: 'PENDING_VERIFICATION' | 'COMPLETED';
  createdAt: string;
  customMessage?: string;
  items: {
    id: string;
    product: {
      name: string;
      images: string[];
    };
    quantity: number;
    price: number;
  }[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
    
    const socket = io(API_BASE_URL);
    socket.on("orderCreated", (order: any) => {
      fetchOrders();
      toast.success("Có đơn hàng mới!", {
        description: `Khách hàng: ${order.customerName}`,
        icon: <ShoppingBasket className="text-emerald-500" size={18} />,
      });
    });

    return () => { socket.disconnect(); };
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatVND = (value: number | string) => {
    return Number(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  const updateStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PENDING_VERIFICATION' ? 'COMPLETED' : 'PENDING_VERIFICATION';
    try {
      await fetch(`${API_BASE_URL}/orders/${id}/status`, {
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
          <div className="py-40 text-center flex flex-col items-center max-w-md mx-auto">
             <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mb-8 relative">
                <ShoppingBasket size={48} className="text-emerald-400" />
                <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-3">Chưa có đơn hàng nào</h3>
             <p className="text-slate-500 font-medium mb-10 leading-relaxed text-balance">
                Vườn hoa của bạn đang rực rỡ, nhưng chưa có ong bướm nào ghé thăm. Hãy thử chạy một chiến dịch quảng cáo để thu hút khách hàng ngay!
             </p>
             <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10">
                Chạy quảng cáo ngay
             </button>
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
                             {order.customMessage && (
                               <div className="text-[10px] text-rose-400 italic font-medium mt-1 line-clamp-1 max-w-[200px]">
                                 "{order.customMessage}"
                               </div>
                             )}
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-col">
                           <span className="text-lg font-black text-slate-900">{formatVND(order.totalPrice)}</span>
                           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                             {order.items?.length || 0} sản phẩm
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
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md active:scale-95"
                        >
                          Chi Tiết
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

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-xl bg-white z-[101] shadow-2xl overflow-y-auto font-sans text-slate-800"
            >
              <div className="sticky top-0 bg-white/80 backdrop-blur-xl z-10 px-10 py-8 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Chi Tiết Đơn Hàng</h2>
                  <p className="text-slate-500 font-medium text-xs">Mã đơn: #{selectedOrder.id.split('-')[0].toUpperCase()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all text-slate-400"><X /></button>
              </div>

              <div className="p-10 space-y-10">
                {/* Customer Info */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Thông tin khách hàng</p>
                   <div className="space-y-3">
                      <div className="flex justify-between">
                         <span className="text-sm font-bold text-slate-500">Họ & Tên</span>
                         <span className="text-sm font-black text-slate-900">{selectedOrder.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-sm font-bold text-slate-500">Số điện thoại</span>
                         <span className="text-sm font-black text-slate-900">{selectedOrder.phone}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-slate-200">
                         <span className="text-sm font-bold text-slate-500">Thời gian</span>
                         <span className="text-sm font-black text-slate-900">{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</span>
                      </div>
                   </div>
                </div>

                {/* Custom Message */}
                {selectedOrder.customMessage && (
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lời nhắn từ khách hàng</label>
                    <div className="bg-rose-50/50 p-8 rounded-[2rem] border border-rose-100/50 italic text-rose-700 font-medium leading-relaxed relative overflow-hidden text-lg">
                       <div className="absolute top-0 right-0 p-4 opacity-5"><ShoppingBasket size={80}/></div>
                       "{selectedOrder.customMessage}"
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="space-y-6">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Danh sách sản phẩm</label>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-6 p-4 bg-white border border-slate-100 rounded-2xl group hover:border-emerald-200 transition-all">
                        <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden shadow-sm">
                           {item.product.images?.[0] ? (
                             <img src={item.product.images[0]} className="w-full h-full object-cover" alt="" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold italic text-xs">No image</div>
                           )}
                        </div>
                        <div className="flex-1">
                           <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors uppercase tracking-tight text-sm line-clamp-1">{item.product.name}</h4>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-black text-emerald-600">{formatVND(item.price)} đ</span>
                              <span className="text-[10px] text-slate-400 font-bold">× {item.quantity}</span>
                           </div>
                        </div>
                        <div className="text-right">
                           <span className="text-sm font-black text-slate-900">{formatVND(Number(item.price) * item.quantity)} đ</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="pt-8 border-t-2 border-dashed border-slate-100">
                   <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng giá trị đơn hàng</p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                           <CheckCircle size={12}/> {selectedOrder.status === 'COMPLETED' ? 'Đã thanh toán' : 'Chờ xác thực'}
                        </div>
                      </div>
                      <div className="text-right">
                         <span className="text-4xl font-black text-slate-900 tracking-tighter">{formatVND(selectedOrder.totalPrice)}</span>
                      </div>
                   </div>
                </div>

                <div className="pt-10">
                   <button 
                     onClick={() => {
                        updateStatus(selectedOrder.id, selectedOrder.status);
                        setSelectedOrder({...selectedOrder, status: selectedOrder.status === 'COMPLETED' ? 'PENDING_VERIFICATION' : 'COMPLETED' });
                     }}
                     className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl transition-all active:scale-[0.98] ${
                        selectedOrder.status === 'COMPLETED'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200'
                     }`}
                   >
                     {selectedOrder.status === 'COMPLETED' ? 'Giao Hàng Thành Công' : 'Xác Nhận & Hoàn Tất'}
                   </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
