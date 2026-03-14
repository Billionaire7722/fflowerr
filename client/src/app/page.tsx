"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Leaf, Star, Clock, Loader2, Menu, X, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import CartSidebar from "@/components/CartSidebar";
import { useCart } from "@/contexts/CartContext";
import { API_BASE_URL } from "@/lib/api";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  categoryId?: string;
  category?: Category;
}

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { addItem, items } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  useEffect(() => {
    fetchProducts();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatVND = (value: number | string) => {
    return Number(value).toLocaleString('vi-VN') + " VND";
  };

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.categoryId === selectedCategory)
    : products;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[var(--floral-cream)]">
      <button 
        onClick={() => setIsDrawerOpen(true)}
        className="fixed top-8 left-8 z-[50] glass-morphism p-5 rounded-full group hover:bg-emerald-600 hover:text-white transition-all duration-500 shadow-xl"
      >
        <Menu size={28} className="group-hover:rotate-90 transition-transform" />
      </button>

      {/* Navigation Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-[61] shadow-2xl p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full p-0.5 border border-emerald-100 overflow-hidden">
                    <img src="/logo.svg" alt="Logo" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <span className="font-serif text-3xl font-bold text-emerald-900 tracking-tighter group-hover:text-emerald-600 transition-colors">pili.blossom</span>
                </Link>
                <button onClick={() => setIsDrawerOpen(false)} className="p-3 bg-slate-50 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all text-slate-400">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <button 
                  onClick={() => { setSelectedCategory(null); setIsDrawerOpen(false); setCurrentPage(1); }}
                  className={`w-full text-left px-6 py-5 rounded-2xl font-serif text-xl border transition-all flex justify-between items-center group ${!selectedCategory ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'border-transparent hover:bg-slate-50 text-slate-600'}`}
                >
                  Tất cả sản phẩm
                  <ChevronRight size={20} className={`opacity-0 group-hover:opacity-100 transition-opacity ${!selectedCategory ? 'opacity-100' : ''}`} />
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setIsDrawerOpen(false); setCurrentPage(1); }}
                    className={`w-full text-left px-6 py-5 rounded-2xl font-serif text-xl border transition-all flex justify-between items-center group ${selectedCategory === cat.id ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'border-transparent hover:bg-slate-50 text-slate-600'}`}
                  >
                    {cat.name}
                    <ChevronRight size={20} className={`opacity-0 group-hover:opacity-100 transition-opacity ${selectedCategory === cat.id ? 'opacity-100' : ''}`} />
                  </button>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-100 mt-auto">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest text-center">Gói trọn tình yêu qua từng đóa hoa</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed top-8 right-8 z-[50] glass-morphism p-5 rounded-full group hover:bg-emerald-600 hover:text-white transition-all duration-500 shadow-xl"
      >
        <ShoppingCart size={28} className="group-hover:scale-110 transition-transform" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
      </button>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/banner.jpg" 
            alt="Banner" 
            className="w-full h-full object-cover transition-transform duration-[10000ms] hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[var(--floral-cream)]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 max-w-4xl px-6 w-full"
        >
          <div className="glass-morphism p-8 md:p-20 rounded-[2.5rem] md:rounded-[3rem] border border-white/20 shadow-2xl backdrop-blur-3xl bg-black/20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col items-center text-center"
            >
              <h1 className="text-4xl md:text-8xl font-serif text-white mb-6 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] leading-tight">
                Gói Trọn <br/> <span className="italic text-emerald-200">Hương Sắc</span>
              </h1>
              
              <p className="text-lg md:text-2xl text-white/95 mb-10 max-w-xl mx-auto font-light tracking-wide leading-relaxed drop-shadow-md">
                Những đóa hoa nghệ thuật mang sứ mệnh kết nối tâm hồn và lan tỏa vẻ đẹp thiên nhiên.
              </p>
              
              <Link href="/products">
                <button className="group relative bg-white text-emerald-900 px-10 md:px-12 py-4 md:py-5 rounded-full font-black text-xs md:text-sm uppercase tracking-[0.3em] overflow-hidden transition-all hover:pr-16 hover:bg-emerald-50 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                  <span className="relative z-10 transition-all">Khám Phá Ngay</span>
                  <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={20} />
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.5em]">Cuộn xuống</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* Product Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl mb-4 text-[var(--floral-dark)] font-serif">
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : "Sản Phẩm Của Chúng Tôi"}
            </h2>
            <div className="h-1.5 w-24 bg-emerald-600 rounded-full"></div>
          </div>
          <p className="text-gray-500 max-w-xs italic text-sm border-l-2 border-emerald-100 pl-4">
            {selectedCategory 
              ? `Khám phá bộ sưu tập ${categories.find(c => c.id === selectedCategory)?.name} tinh tế.`
              : "Được tuyển chọn từ những đóa hoa tươi thắm nhất vừa được nghệ nhân hoàn thiện."}
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" size={48} /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
              {currentProducts.map((flower, index) => (
              <motion.div
                key={flower.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className={`relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 bg-slate-50 card-hover border border-black/5`}>
                  {flower.images?.[0] ? (
                    <img src={flower.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={flower.name} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <Leaf size={100} />
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem({ 
                          id: flower.id, 
                          name: flower.name, 
                          price: flower.price,
                          image: flower.images?.[0] || ""
                        });
                        setIsCartOpen(true);
                      }}
                      className="glass-morphism p-4 rounded-full hover:bg-emerald-600 hover:text-white transition-colors border border-black/5"
                    >
                      <ShoppingCart size={24} />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg md:text-xl mb-1 group-hover:text-emerald-600 transition-colors font-serif line-clamp-1">{flower.name}</h3>
                <p className="text-sm md:text-lg font-bold text-emerald-900 opacity-70">{formatVND(flower.price)}</p>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-20 flex justify-center items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-3 bg-white rounded-full border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-12 h-12 rounded-full font-black text-xs uppercase tracking-widest transition-all ${currentPage === i + 1 ? 'bg-emerald-600 text-white shadow-xl scale-110' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-3 bg-white rounded-full border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
          </>
        )}
      </section>

      {/* Stats/Badges */}
      <section className="bg-[var(--floral-dark)] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-2 md:gap-12 text-center">
            <div className="flex flex-col items-center px-1">
              <Star className="text-[var(--floral-gold)] mb-2 md:mb-3 size-6 md:size-7" />
              <h4 className="text-xs md:text-xl mb-1 font-serif leading-tight">Chất Lượng Nghệ Nhân</h4>
              <p className="opacity-60 text-[10px] md:text-base">Mỗi bó hoa là một tác phẩm độc bản.</p>
            </div>
            <div className="flex flex-col items-center px-1 border-x border-white/10">
              <Clock className="text-[var(--floral-gold)] mb-2 md:mb-3 size-6 md:size-7" />
              <h4 className="text-xs md:text-xl mb-1 font-serif leading-tight">Giao Hàng Trong Ngày</h4>
              <p className="opacity-60 text-[10px] md:text-base">Hoa tươi đến cửa nhà bạn nhanh chóng.</p>
            </div>
            <div className="flex flex-col items-center px-1">
              <Leaf className="text-[var(--floral-gold)] mb-2 md:mb-3 size-6 md:size-7" />
              <h4 className="text-xs md:text-xl mb-1 font-serif leading-tight">Nguồn Gốc Đạo Đức</h4>
              <p className="opacity-60 text-[10px] md:text-base">Trực tiếp từ các nông trại bền vững.</p>
            </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-4 text-center border-t border-black/5 mt-8">
         <span className="font-serif text-3xl opacity-20">pili.blossom</span>
      </footer>
    </main>
  );
}
