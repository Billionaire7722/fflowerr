"use client";

import AdminLayout from "@/components/AdminLayout";
import { 
  Flower2, 
  Trash2, 
  Edit3, 
  Plus,
  Search,
  Image as ImageIcon,
  Tag,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    
    const socket = io("http://localhost:3000");
    socket.on("productUpdated", () => {
      fetchProducts();
    });

    return () => { socket.disconnect(); };
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <header className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Danh Mục Sản Phẩm</h1>
          <p className="text-slate-500 mt-1">Nơi lưu giữ những tuyệt tác hoa tươi của cửa hàng.</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-rose-500/20 active:scale-95 uppercase tracking-widest">
          <Plus size={20} />
          Tạo Sản Phẩm Mới
        </button>
      </header>

      <div className="mb-10 flex gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={20} />
          <input className="w-full pl-14 pr-6 py-4 border border-slate-200 rounded-3xl bg-white text-sm focus:ring-4 focus:ring-rose-500/10 focus:border-rose-300 outline-none transition-all shadow-sm" placeholder="Tìm kiếm tên hoa, loại hoa..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {isLoading ? (
            <div className="col-span-full py-32 text-center text-slate-400">
               <Loader2 className="animate-spin text-rose-500 mx-auto" size={48} />
               <p className="mt-4 font-bold">Đang trưng bày kệ hoa...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full py-32 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-[3rem]">
               <Flower2 size={64} className="mx-auto mb-4 opacity-10 text-rose-500" />
               <p className="text-xl font-bold text-slate-600">Kệ hoa đang trống</p>
               <p className="mt-1">Hãy bắt đầu bằng cách tạo ra sản phẩm hoa đầu tiên!</p>
            </div>
          ) : products.map((product, i) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={product.id}
              className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl overflow-hidden group hover:border-rose-200 transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100 italic flex items-center justify-center text-slate-300">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <ImageIcon size={48} className="opacity-20" />
                )}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-rose-600 shadow-lg text-sm">
                  ${Number(product.price).toFixed(2)}
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2 truncate group-hover:text-rose-600 transition-colors">{product.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed">{product.description || "Chưa có mô tả cho tuyệt tác này."}</p>
                
                <div className="flex gap-4">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-2xl font-bold text-xs transition-colors border border-slate-100 hover:border-rose-100">
                    <Edit3 size={16} />
                    Chỉnh sửa
                  </button>
                  <button className="p-3 bg-slate-50 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-2xl transition-colors border border-slate-100 hover:border-rose-200">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
