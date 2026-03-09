import { 
  Trash2, 
  Plus,
  Image as ImageIcon,
  Video as VideoIcon,
  Loader2,
  X,
  Upload,
  CheckCircle2
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  images: string[];
  videos: string[];
  tags: string[];
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{url: string, type: 'image' | 'video'}[]>([]);

  useEffect(() => {
    fetchProducts();
    const socket = io("http://localhost:3100");
    socket.on("productUpdated", () => fetchProducts());
    return () => { socket.disconnect(); };
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3100/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatVND = (value: string) => {
    const raw = value.replace(/\D/g, "");
    return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatVND(e.target.value);
    setFormData({ ...formData, price: formatted });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = Array.from(e.target.files || []);
    if (type === 'image') {
      if (selectedImages.length + files.length > 7) return alert("Tối đa 7 ảnh");
      setSelectedImages([...selectedImages, ...files]);
    } else {
      if (selectedVideos.length + files.length > 3) return alert("Tối đa 3 video");
      setSelectedVideos([...selectedVideos, ...files]);
    }

    const newPreviews = files.map(f => ({
      url: URL.createObjectURL(f),
      type
    }));
    setPreviews([...previews, ...newPreviews]);
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const body = new FormData();
    body.append("name", formData.name);
    body.append("price", formData.price.replace(/\./g, ""));
    body.append("description", formData.description);
    body.append("tags", JSON.stringify(formData.tags));
    
    selectedImages.forEach(img => body.append("images", img));
    selectedVideos.forEach(vid => body.append("videos", vid));

    try {
      const res = await fetch("http://localhost:3100/products", {
        method: "POST",
        body
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: "", price: "", description: "", tags: [] });
        setSelectedImages([]);
        setSelectedVideos([]);
        setPreviews([]);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <header className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Danh Mục Sản Phẩm</h1>
          <p className="text-slate-500 mt-1">Quản lý bộ sưu tập hoa và truyền thông đa phương tiện.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 uppercase tracking-widest"
        >
          <Plus size={20} />
          Tạo Sản Phẩm Mới
        </button>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-slate-800">
        <AnimatePresence>
          {isLoading ? (
            <div className="col-span-full py-40 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" size={48} /></div>
          ) : products.map((product) => (
            <motion.div key={product.id} layout className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden group">
              <div className="relative h-64 bg-slate-100 italic">
                {product.images?.[0] ? (
                  <img src={product.images[0]} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={48} /></div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 px-4 py-2 rounded-xl font-bold text-emerald-700 shadow-sm">
                  {formatVND(String(product.price))} đ
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">#{tag}</span>
                  ))}
                </div>
                <p className="text-slate-500 text-sm line-clamp-2 mb-6">{product.description}</p>
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-slate-50 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors">Chỉnh sửa</button>
                  <button className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal Expansion */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white z-[101] shadow-2xl p-10 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900">Thông Tin Sản Phẩm</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors text-slate-500"><X/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 text-slate-800">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Tên sản phẩm</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none" placeholder="Bó Hồng Ecuador..." />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Giá bán (VND)</label>
                    <input required value={formData.price} onChange={handlePriceChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-emerald-600" placeholder="1.000.000" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Tags</label>
                    <div className="flex gap-2">
                      <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" placeholder="Best seller..." />
                      <button type="button" onClick={addTag} className="p-4 bg-slate-900 text-white rounded-2xl"><Plus size={20}/></button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold flex items-center gap-2">
                          {tag} <X size={12} className="cursor-pointer" onClick={() => setFormData({...formData, tags: formData.tags.filter(t => t !== tag)})}/>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Media Upload */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Hình ảnh & Video (Max 7 ảnh, 3 video)</label>
                  <div className="grid grid-cols-4 gap-4">
                    {previews.map((prev, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        {prev.type === 'image' ? <img src={prev.url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><VideoIcon className="text-slate-400"/></div>}
                        <button type="button" onClick={() => {
                          setPreviews(previews.filter((_, idx) => idx !== i));
                        }} className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-rose-500"><X size={14}/></button>
                      </div>
                    ))}
                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition-all">
                      <Upload className="text-slate-400 mb-2" />
                      <span className="text-[10px] font-bold text-slate-500">Thêm Media</span>
                      <input type="file" multiple className="hidden" accept="image/*,video/*" onChange={e => {
                        const files = Array.from(e.target.files || []);
                        const imgs = files.filter(f => f.type.startsWith('image'));
                        const vids = files.filter(f => f.type.startsWith('video'));
                        if (imgs.length) handleFileChange({ target: { files: imgs } } as any, 'image');
                        if (vids.length) handleFileChange({ target: { files: vids } } as any, 'video');
                      }} />
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Mô tả chi tiết</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none min-h-[150px]" placeholder="Kể câu chuyện về đóa hoa này..." />
                </div>

                <button disabled={isSubmitting} type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-[0.98]">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24}/>}
                  {isSubmitting ? "Đang lưu hệ thống..." : "Xác Nhận & Đăng Bán"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
