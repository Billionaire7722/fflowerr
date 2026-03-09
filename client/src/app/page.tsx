"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Leaf, Star, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CartSidebar from "@/components/CartSidebar";
import { useCart } from "@/contexts/CartContext";

const FLOWERS = [
  { id: "1", name: "Bó Hồng Nhung", price: 85, color: "bg-pink-100", image: "/rose.jpg" },
  { id: "2", name: "Hoa Ly Nắng Mai", price: 65, color: "bg-yellow-100", image: "/lily.jpg" },
  { id: "3", name: "Lan Đêm", price: 120, color: "bg-purple-100", image: "/orchid.jpg" },
  { id: "4", name: "Giấc Mơ Khuynh Diệp", price: 45, color: "bg-green-100", image: "/eucalyptus.jpg" },
];

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addItem, items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Floating Cart Button */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed top-8 right-8 z-[50] glass-morphism p-5 rounded-full group hover:bg-[var(--floral-green)] hover:text-white transition-all duration-500"
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
      <section className="relative h-[80vh] flex items-center justify-center text-center p-6 bg-gradient-to-br from-[#ffafbd] to-[#ffc3a0]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl z-10"
        >
          <span className="text-[var(--floral-green)] font-semibold tracking-widest uppercase mb-4 block">Cửa Hàng pili.blossom</span>
          <h1 className="text-6xl md:text-8xl mb-6 text-[var(--floral-dark)]">Khám Phá <br/> Thế Giới Hoa</h1>
          <p className="text-xl text-[var(--floral-dark)] opacity-80 mb-8 max-w-xl mx-auto">
            Những bó hoa được làm thủ công ghi lại vẻ đẹp tinh túy của thiên nhiên, giao tận tay bạn.
          </p>
          <Link href="/products">
            <button className="btn-primary transition-all hover:scale-105 active:scale-95">Khám Phá Bộ Sưu Tập</button>
          </Link>
        </motion.div>
        
        {/* Floating Petals Decor (Simplified for now) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <Leaf className="absolute top-20 left-20 animate-bounce" size={40} />
           <Leaf className="absolute bottom-40 right-40 animate-pulse" size={60} />
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl mb-4 text-[var(--floral-dark)]">Hoa Yêu Thích Theo Mùa</h2>
            <div className="h-1 w-20 bg-[var(--floral-green)]"></div>
          </div>
          <p className="text-gray-500 max-w-xs italic">Được tuyển chọn bởi các nghệ nhân cắm hoa cho mùa hoa nở đẹp nhất hiện tại.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FLOWERS.map((flower, index) => (
            <motion.div
              key={flower.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className={`relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 ${flower.color} card-hover`}>
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                   <Leaf size={100} />
                </div>
                <div className="absolute bottom-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem({ id: flower.id, name: flower.name, price: flower.price });
                      setIsCartOpen(true);
                    }}
                    className="glass-morphism p-4 rounded-full hover:bg-[var(--floral-green)] hover:text-white transition-colors border border-black/5"
                  >
                    <ShoppingCart size={24} />
                  </button>
                </div>
              </div>
              <h3 className="text-xl mb-1 group-hover:text-[var(--floral-green)] transition-colors font-serif">{flower.name}</h3>
              <p className="text-lg font-bold text-[var(--floral-dark)] opacity-70">${flower.price}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats/Badges */}
      <section className="bg-[var(--floral-dark)] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <Star className="text-[var(--floral-gold)] mb-4" size={40} />
              <h4 className="text-xl mb-2">Chất Lượng Nghệ Nhân</h4>
              <p className="opacity-60">Mỗi bó hoa là một tác phẩm nghệ thuật độc bản.</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="text-[var(--floral-gold)] mb-4" size={40} />
              <h4 className="text-xl mb-2">Giao Hàng Trong Ngày</h4>
              <p className="opacity-60">Hoa tươi đến cửa nhà bạn chỉ trong vài giờ.</p>
            </div>
            <div className="flex flex-col items-center">
              <Leaf className="text-[var(--floral-gold)] mb-4" size={40} />
              <h4 className="text-xl mb-2">Nguồn Gốc Đạo Đức</h4>
              <p className="opacity-60">Trực tiếp từ các nông trại bền vững địa phương.</p>
            </div>
        </div>
      </section>
    </main>
  );
}
