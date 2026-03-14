"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  ArrowLeft, 
  Search, 
  Filter, 
  Sparkles,
  Leaf,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import CartSidebar from "@/components/CartSidebar";
import { API_BASE_URL } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  tags: string[];
}

import { useCart } from "@/contexts/CartContext";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatVND = (value: number | string) => {
    return Number(value).toLocaleString('vi-VN') + " VND";
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = activeTag ? p.tags?.includes(activeTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-[var(--floral-cream)] relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-black/5 px-8 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform text-emerald-900" />
          <div className="w-10 h-10 bg-emerald-50 rounded-full p-0.5 border border-emerald-100 overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
            <img src="/logo.svg" alt="Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <span className="font-serif text-2xl font-bold text-emerald-900 tracking-tighter group-hover:text-emerald-600 transition-colors">pili.blossom</span>
        </Link>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="bg-black text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-xl"
        >
          Giỏ hàng
        </button>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Hero */}
      <header className="pt-40 pb-16 px-8 text-center max-w-5xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-serif mb-8 text-[var(--floral-dark)]">Sắc Hoa <br/> Gói Trọn Yêu Thương</h1>
        
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button 
            onClick={() => setActiveTag(null)}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${!activeTag ? 'bg-emerald-600 text-white shadow-xl scale-110' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
          >
            Tất cả
          </button>
          {Array.from(new Set(products.flatMap(p => p.tags || []))).map(tag => (
            <button 
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTag === tag ? 'bg-emerald-600 text-white shadow-xl scale-110' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm đóa hoa dành cho bạn..."
            className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white shadow-2xl shadow-emerald-900/5 focus:ring-4 focus:ring-emerald-500/5 outline-none text-lg border-2 border-transparent focus:border-emerald-100 transition-all font-serif italic"
          />
        </div>
      </header>

      {/* Grid */}
      <section className="px-8 pb-32 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 3) * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white shadow-3xl shadow-emerald-900/5 mb-8 border border-white">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-emerald-50"><ImageIcon size={120} /></div>
                  )}
                  
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl font-black text-emerald-900 shadow-xl text-lg">
                    {formatVND(p.price)}
                  </div>

                  <button 
                    onClick={() => {
                      addItem({ 
                        id: p.id, 
                        name: p.name, 
                        price: Number(p.price),
                        image: p.images?.[0] || ""
                      });
                      setIsCartOpen(true);
                    }}
                    className="absolute bottom-6 inset-x-6 bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transform translate-y-20 group-hover:translate-y-0 transition-all duration-500 hover:bg-emerald-600 shadow-2xl"
                  >
                    Thêm Vào Giỏ
                  </button>
                </div>

                <div className="flex gap-2 mb-3">
                  {p.tags?.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
                <h3 className="text-3xl font-serif mb-3 text-emerald-950 group-hover:underline cursor-pointer decoration-emerald-200 underline-offset-8">{p.name}</h3>
                <p className="text-slate-400 line-clamp-2 leading-relaxed italic text-sm">{p.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Branding */}
      <footer className="py-20 text-center border-t border-black/5 mt-20">
         <span className="font-serif text-3xl opacity-20">pili.blossom</span>
      </footer>
    </div>
  );
}
