"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Send, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CartSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [items, setItems] = useState<CartItem[]>([
    { id: "1", name: "Bó Hồng Nhung", price: 85, quantity: 1 }
  ]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    customMessage: ""
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: items.map(i => ({ productId: i.id, quantity: i.quantity }))
        })
      });

      if (response.ok) {
        setIsOrdered(true);
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
              <h2 className="text-3xl font-serif">Khu Vườn Của Bạn</h2>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full"><X /></button>
            </div>

            {isOrdered ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl mb-2 font-serif">Đã Nhận Đơn Hàng!</h3>
                <p className="text-gray-600 mb-8">Nghệ nhân của chúng tôi đang chuẩn bị những đóa hoa tươi nhất cho bạn.</p>
              </motion.div>
            ) : !isCheckingOut ? (
              <>
                <div className="flex-1 overflow-y-auto space-y-6">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-pink-100 rounded-2xl flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-gray-500">${item.price}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button 
                            onClick={() => setItems(prev => prev.map(i => i.id === item.id ? {...i, quantity: Math.max(1, i.quantity - 1)} : i))}
                            className="p-1 border rounded-md"
                          >
                            <Minus size={14}/>
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                             onClick={() => setItems(prev => prev.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i))}
                             className="p-1 border rounded-md"
                          >
                            <Plus size={14}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-black/10 pt-6 mt-6">
                  <div className="flex justify-between text-xl mb-6">
                    <span>Tổng tiền</span>
                    <span className="font-bold">${total}</span>
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
                     <label className="block text-sm font-medium mb-1">Tên của bạn</label>
                     <input 
                       required 
                       value={formData.customerName}
                       onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                       className="w-full p-3 rounded-xl border border-black/10 bg-white focus:ring-2 focus:ring-[var(--floral-green)] outline-none" 
                       placeholder="Nguyễn Văn A" 
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                     <input 
                       required 
                       value={formData.phone}
                       onChange={(e) => setFormData({...formData, phone: e.target.value})}
                       className="w-full p-3 rounded-xl border border-black/10 bg-white focus:ring-2 focus:ring-[var(--floral-green)] outline-none" 
                       placeholder="0901 234 567" 
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium mb-1">Lời nhắn (Tùy chọn)</label>
                     <textarea 
                       rows={4} 
                       value={formData.customMessage}
                       onChange={(e) => setFormData({...formData, customMessage: e.target.value})}
                       className="w-full p-3 rounded-xl border border-black/10 bg-white focus:ring-2 focus:ring-[var(--floral-green)] outline-none" 
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
