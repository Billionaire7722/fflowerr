"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function CartSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [items, setItems] = useState<CartItem[]>([
    { id: 1, name: "Velvet Rose Bouquet", price: 85, quantity: 1 }
  ]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdered(true);
    setTimeout(() => {
       setIsOrdered(false);
       onClose();
    }, 3000);
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
              <h2 className="text-3xl font-serif">Your Garden</h2>
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
                <h3 className="text-2xl mb-2 font-serif">Order Received!</h3>
                <p className="text-gray-600 mb-8">Our florists are already gathering your fresh blooms.</p>
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
                          <button className="p-1 border rounded-md"><Minus size={14}/></button>
                          <span>{item.quantity}</span>
                          <button className="p-1 border rounded-md"><Plus size={14}/></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-black/10 pt-6 mt-6">
                  <div className="flex justify-between text-xl mb-6">
                    <span>Total Amount</span>
                    <span className="font-bold">${total}</span>
                  </div>
                  <button 
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full btn-primary"
                  >
                    Proceed to Delivery
                  </button>
                </div>
              </>
            ) : (
               <form onSubmit={handleOrderSubmit} className="flex-1 flex flex-col">
                 <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                   <div>
                     <label className="block text-sm font-medium mb-1">Your Name</label>
                     <input required className="w-full p-3 rounded-xl border border-black/10 bg-white" placeholder="Jane Doe" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium mb-1">Phone Number</label>
                     <input required className="w-full p-3 rounded-xl border border-black/10 bg-white" placeholder="+1 (555) 000-0000" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium mb-1">Custom Message (Optional)</label>
                     <textarea rows={4} className="w-full p-3 rounded-xl border border-black/10 bg-white" placeholder="A special something for someone special..." />
                   </div>
                 </div>

                 <div className="pt-6 border-t border-black/10">
                   <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
                     <Send size={18} />
                     Send Order
                   </button>
                   <button 
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="w-full mt-3 text-gray-500 text-sm hover:underline"
                   >
                     Back to cart
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
