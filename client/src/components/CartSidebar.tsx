"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Send, CheckCircle2, Loader2, Trash2, ShoppingBasket, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { API_BASE_URL } from "@/lib/api";

export default function CartSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { items, updateQuantity, total, clearCart, removeItem } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    customMessage: ""
  });
  const formatVND = (value: number | string) => {
    return Number(value).toLocaleString('vi-VN') + " VND";
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: items.map(i => ({ productId: i.id, quantity: i.quantity }))
        })
      });

      if (response.ok) {
        setIsOrdered(true);
        clearCart();
        setTimeout(() => {
           setIsOrdered(false);
           setIsCheckingOut(false);
           onClose();
        }, 3000);
      }
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Gửi đơn hàng thất bại. Vui lòng kiểm tra lại kết nối.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--floral-cream)] shadow-2xl z-[101] p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-serif text-emerald-950">Giỏ Hàng</h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-black mt-1">pili.blossom boutique</p>
              </div>
              <div className="flex gap-2">
                {items.length > 0 && !isCheckingOut && (
                  <button 
                    onClick={clearCart}
                    className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                    title="Xóa tất cả"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button onClick={onClose} className="p-2.5 hover:bg-black/5 rounded-full transition-colors text-slate-500 hover:text-black">
                  <X size={24} />
                </button>
              </div>
            </div>

            {isOrdered ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-6"
              >
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-sm">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl mb-3 font-serif text-emerald-950">Đơn Hàng Thành Công!</h3>
                <p className="text-slate-500 font-medium leading-relaxed italic">
                  Các nghệ nhân của &quot;pili.blossom&quot; đang tỉ mỉ chuẩn bị những đóa hoa tươi thắm nhất dành riêng cho bạn.
                </p>
              </motion.div>
            ) : !isCheckingOut ? (
              <>
                <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                  {items.length > 0 ? (
                    items.map(item => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={item.id} 
                        className="flex gap-5 group"
                      >
                        <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden bg-slate-100 shadow-sm flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200 bg-pink-50">
                              <ShoppingBag size={32} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-serif text-lg text-emerald-950 line-clamp-1 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{item.name}</h4>
                              <button 
                                onClick={() => removeItem(item.id)}
                                className="p-1.5 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                title="Xóa khỏi giỏ hàng"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <p className="text-emerald-800/60 font-black text-sm tracking-widest mt-0.5">{formatVND(item.price)}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-black/5 bg-white rounded-xl overflow-hidden shadow-sm">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-2 hover:bg-black/5 text-slate-400 hover:text-black transition-colors"
                              >
                                <Minus size={14}/>
                              </button>
                              <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-2 hover:bg-black/5 text-slate-400 hover:text-black transition-colors"
                              >
                                <Plus size={14}/>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-10">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6 group hover:scale-110 transition-transform">
                        <ShoppingBasket size={40} />
                      </div>
                      <h3 className="text-xl font-serif text-emerald-950 mb-2">Giỏ hàng đang trống</h3>
                      <p className="text-slate-400 text-sm italic mb-8">Hãy chọn những đóa hoa rực rỡ nhất cho mình nhé!</p>
                      <button 
                        onClick={onClose}
                        className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 hover:text-emerald-800 transition-colors"
                      >
                        Tiếp Tục Khám Phá
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-black/10 pt-6 mt-6">
                  <div className="flex justify-between text-xl mb-6">
                    <span>Tổng tiền</span>
                    <span className="font-bold">{formatVND(total)}</span>
                  </div>
                  <button 
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full btn-primary"
                  >
                    Tiến Hành Đặt Hàng
                  </button>
                </div>
              </>
            ) : (
               <form onSubmit={handleOrderSubmit} className="flex-1 flex flex-col">
                 <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                   <div>
                     <label className="block text-xs font-black uppercase tracking-widest text-emerald-800/60 mb-2 ml-1">Tên của bạn</label>
                     <input 
                       required 
                       value={formData.customerName}
                       onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                       className="w-full p-4 rounded-2xl border-2 border-transparent bg-white shadow-sm focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium placeholder:text-slate-300" 
                       placeholder="Nguyễn Văn A" 
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-black uppercase tracking-widest text-emerald-800/60 mb-2 ml-1">Số điện thoại</label>
                     <input 
                       required 
                       value={formData.phone}
                       onChange={(e) => setFormData({...formData, phone: e.target.value})}
                       className="w-full p-4 rounded-2xl border-2 border-transparent bg-white shadow-sm focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium placeholder:text-slate-300" 
                       placeholder="09xx xxx xxx" 
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-black uppercase tracking-widest text-emerald-800/60 mb-2 ml-1">Lời nhắn (Tùy chọn)</label>
                     <textarea 
                       rows={4} 
                       value={formData.customMessage}
                       onChange={(e) => setFormData({...formData, customMessage: e.target.value})}
                       className="w-full p-4 rounded-2xl border-2 border-transparent bg-white shadow-sm focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium placeholder:text-slate-300 resize-none" 
                       placeholder="Gửi gắm lời chúc yêu thương..." 
                     />
                   </div>
                 </div>

                 <div className="pt-6 border-t border-black/10">
                   <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                   >
                     {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                     {isSubmitting ? "Đang gửi..." : "Gửi Đơn Hàng"}
                   </button>
                   <button 
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="w-full mt-3 text-gray-500 text-sm hover:underline"
                   >
                     Quay lại giỏ hàng
                   </button>
                 </div>
               </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
