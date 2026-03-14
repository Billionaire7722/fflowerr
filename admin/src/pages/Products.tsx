import { 
  Trash2, 
  Plus,
  Image as ImageIcon,
  Video as VideoIcon,
  Loader2,
  X,
  Upload,
  Search,
  CheckCircle2,
  Pencil
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { API_BASE_URL } from "../lib/api";

interface Material {
  id: string;
  name: string;
  unitCost: number;
  unit: string;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  images: string[];
  videos: string[];
  tags: string[];
  categoryId?: string;
  category?: Category;
  productionCost?: number;
  materials?: { materialId: string; quantity: number }[];
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [materialsList, setMaterialsList] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    tags: [] as string[],
    categoryId: "",
    selectedMaterials: [] as { materialId: string; quantity: number }[],
  });
  const [tagInput, setTagInput] = useState("");
  const [searchMaterial, setSearchMaterial] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{url: string, type: 'image' | 'video'}[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchMaterials();
    fetchCategories();
    const socket = io(API_BASE_URL);
    
    socket.on("productUpdated", (data: any) => {
      fetchProducts();
      if (data && data.name && !data.deleted) {
        toast.info(`Sản phẩm đã được cập nhật: ${data.name}`);
      }
    });

    socket.on("lowStock", (material: any) => {
      toast.warning(`Cảnh báo: ${material.name} sắp hết hàng! (${material.stockLevel} ${material.unit})`, {
        duration: 8000,
        action: {
          label: 'Nhập kho ngay',
          onClick: () => window.location.href = '/admin/inventory'
        }
      });
    });

    return () => { socket.disconnect(); };
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/materials`);
      const data = await res.json();
      setMaterialsList(data);
    } catch (err) {
      console.error(err);
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
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách sản phẩm");
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

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: formatVND(product.price),
      description: product.description || "",
      tags: product.tags || [],
      categoryId: product.categoryId || "",
      selectedMaterials: product.materials?.map(m => ({ materialId: m.materialId, quantity: m.quantity })) || [],
    });
    setPreviews(product.images.map(img => ({ url: img, type: 'image' }))); // Note: Simplification for previews
    setIsModalOpen(true);
  };

  const addMaterial = (material: Material) => {
    if (!formData.selectedMaterials.some(m => m.materialId === material.id)) {
      setFormData({
        ...formData,
        selectedMaterials: [...formData.selectedMaterials, { materialId: material.id, quantity: 1 }]
      });
    }
    setSearchMaterial("");
  };

  const updateMaterialQuantity = (materialId: string, quantity: number) => {
    setFormData({
      ...formData,
      selectedMaterials: formData.selectedMaterials.map(m => 
        m.materialId === materialId ? { ...m, quantity: Math.max(1, quantity) } : m
      )
    });
  };

  const removeMaterial = (materialId: string) => {
    setFormData({
      ...formData,
      selectedMaterials: formData.selectedMaterials.filter(m => m.materialId !== materialId)
    });
  };

  const calculateProductionCost = () => {
    return formData.selectedMaterials.reduce((sum, m) => {
      const material = materialsList.find(mat => mat.id === m.materialId);
      return sum + (material ? Number(material.unitCost) * m.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const body = new FormData();
    body.append("name", formData.name);
    body.append("price", formData.price.replace(/\./g, ""));
    body.append("description", formData.description);
    body.append("tags", JSON.stringify(formData.tags));
    body.append("categoryId", formData.categoryId);
    body.append("materials", JSON.stringify(formData.selectedMaterials));
    
    if (editingId) {
      // Send info about existing assets to keep them
      const existingImages = previews.filter(p => !p.url.startsWith('blob:') && p.type === 'image').map(p => p.url);
      const existingVideos = previews.filter(p => !p.url.startsWith('blob:') && p.type === 'video').map(p => p.url);
      existingImages.forEach(img => body.append("existingImages[]", img));
      existingVideos.forEach(vid => body.append("existingVideos[]", vid));
    }

    selectedImages.forEach(img => body.append("images", img));
    selectedVideos.forEach(vid => body.append("videos", vid));

    try {
      const url = editingId 
        ? `${API_BASE_URL}/products/${editingId}`
        : `${API_BASE_URL}/products`;

      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        body
      });
      if (res.ok) {
        toast.success(editingId ? "Cập nhật sản phẩm thành công!" : "Đăng bán sản phẩm thành công!");
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: "", price: "", description: "", tags: [], categoryId: "", selectedMaterials: [] });
        setSelectedImages([]);
        setSelectedVideos([]);
        setPreviews([]);
        fetchProducts();
      } else {
        const errData = await res.json();
        toast.error(`Lỗi: ${errData.message || "Không thể lưu sản phẩm"}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối máy chủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Đã xóa sản phẩm");
      }
    } catch (err) {
       toast.error("Lỗi khi xóa sản phẩm");
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <header className="mb-12 flex flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Danh Mục Sản Phẩm</h1>
          <p className="text-slate-500 font-medium">Quản lý bộ sưu tập hoa nghệ thuật và truyền thông đa phương tiện.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              className="w-64 pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none font-medium transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          </div>
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ name: "", price: "", description: "", tags: [], categoryId: "", selectedMaterials: [] });
              setSelectedImages([]);
              setSelectedVideos([]);
              setPreviews([]);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Tạo Sản Phẩm Mới</span>
            <span className="sm:hidden">Thêm</span>
          </button>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="col-span-full py-40 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Đang tải dữ liệu...</p>
            </div>
          ) : products.map((product) => (
            <motion.div 
              key={product.id} 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 flex flex-col h-full relative"
            >
              {/* Product Image Section */}
              <div className="relative h-64 overflow-hidden bg-slate-100 italic">
                {product.images?.[0] ? (
                  <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50"><ImageIcon size={48} /></div>
                )}
                
                {/* Stock Status Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest text-emerald-600 shadow-sm border border-emerald-100 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Còn hàng
                </div>

                {/* Price Badge - Bottom Right of Image */}
                <div className="absolute bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-sm shadow-xl border border-white/10 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {Number(product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND
                </div>
              </div>

              {/* Product Info Section */}
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1 tracking-tight">{product.name}</h3>
                  </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {product.category && (
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-indigo-100">{product.category.name}</span>
                      )}
                      {product.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-slate-100">#{tag}</span>
                    ))}
                    {product.productionCost && (
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-amber-100">Vốn: {Number(product.productionCost).toLocaleString('vi-VN')} đ</span>
                    )}
                  </div>
                </div>

                <p className="text-slate-500 text-xs font-medium line-clamp-2 leading-relaxed mb-6 flex-1">{product.description}</p>
                
                <div className="flex items-center justify-between pt-5 border-t border-slate-50 mt-auto">
                  <div className="text-emerald-600 font-black text-base md:hidden">
                    {Number(product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND
                  </div>
                  <div className="text-emerald-600 font-black text-base hidden md:block opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                    {Number(product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-95 border border-slate-100"
                      title="Chỉnh sửa"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-95 border border-slate-100"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white z-[101] shadow-2xl overflow-y-auto"
            >
              <div className="sticky top-0 bg-white/80 backdrop-blur-xl z-10 px-10 py-8 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Thông Tin Sản Phẩm</h2>
                  <p className="text-slate-500 font-medium text-sm">Điền đầy đủ các thông tin để đăng bán sản phẩm mới.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all text-slate-400"><X/></button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-10 text-slate-800">
                {/* Basic Info */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Tên sản phẩm rực rỡ</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 outline-none font-bold text-lg transition-all" placeholder="Bó Hồng Ecuador Mùa Thu..." />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Giá bán nghệ nhân (VND)</label>
                      <input required value={formData.price} onChange={handlePriceChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 outline-none font-black text-emerald-600 text-xl transition-all" placeholder="1.000.000" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Danh mục sản phẩm</label>
                      <select 
                        required 
                        value={formData.categoryId} 
                        onChange={e => setFormData({...formData, categoryId: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 outline-none font-bold transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Chọn danh mục...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Phân loại & Hashtags</label>
                    <div className="flex gap-2">
                      <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 outline-none font-bold transition-all" placeholder="Best seller..." />
                      <button type="button" onClick={addTag} className="w-14 h-14 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-emerald-600 transition-all active:scale-90"><Plus size={24}/></button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <AnimatePresence>
                        {formData.tags.map(tag => (
                          <motion.span 
                            key={tag} 
                            initial={{ scale: 0.8, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100/50"
                          >
                            {tag} <X size={14} className="cursor-pointer hover:text-rose-500" onClick={() => setFormData({...formData, tags: formData.tags.filter(t => t !== tag)})}/>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Materials Selection */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nguyên Liệu & Định Lượng</label>
                    <div className="text-right">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Tổng Vốn Sản Xuất</span>
                       <span className="text-lg font-black text-emerald-600">{Number(calculateProductionCost()).toLocaleString('vi-VN')} VND</span>
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      value={searchMaterial}
                      onChange={e => setSearchMaterial(e.target.value)}
                      className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 outline-none font-medium transition-all"
                      placeholder="Tìm nguyên liệu (hoa, giấy gói, ruy băng...)"
                    />
                    {searchMaterial && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 shadow-2xl rounded-2xl z-20 max-h-60 overflow-y-auto">
                        {materialsList.filter(m => m.name.toLowerCase().includes(searchMaterial.toLowerCase())).map(m => (
                           <div 
                             key={m.id} 
                             onClick={() => addMaterial(m)}
                             className="p-4 hover:bg-emerald-50 cursor-pointer flex justify-between items-center border-b border-slate-50 last:border-0"
                           >
                             <span className="font-bold">{m.name}</span>
                             <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{Number(m.unitCost).toLocaleString('vi-VN')} / {m.unit}</span>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {formData.selectedMaterials.map(sm => {
                       const mat = materialsList.find(m => m.id === sm.materialId);
                       return (
                         <div key={sm.materialId} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <div className="flex-1">
                             <div className="font-bold text-slate-800">{mat?.name}</div>
                             <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{Number(mat?.unitCost).toLocaleString('vi-VN')} đ / {mat?.unit}</div>
                           </div>
                           <div className="flex items-center gap-3">
                             <input 
                               type="number" 
                               value={sm.quantity} 
                               onChange={e => updateMaterialQuantity(sm.materialId, parseInt(e.target.value))}
                               className="w-20 p-2 bg-white border border-slate-200 rounded-xl text-center font-black"
                             />
                             <span className="text-xs font-bold text-slate-400">{mat?.unit}</span>
                           </div>
                           <button type="button" onClick={() => removeMaterial(sm.materialId)} className="p-2 text-rose-400 hover:text-rose-600"><X size={20}/></button>
                         </div>
                       );
                    })}
                  </div>
                </div>

                {/* Media Upload */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Thư viện truyền thông</label>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Max 7 ảnh • 3 video</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <AnimatePresence>
                      {previews.map((prev, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-slate-100 border border-slate-200 group"
                        >
                          {prev.type === 'image' ? (
                            <img src={prev.url} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
                              <VideoIcon size={24} className="mb-1 text-emerald-400"/>
                              <span className="text-[8px] font-black uppercase tracking-tighter">Video</span>
                            </div>
                          )}
                          <button type="button" onClick={() => {
                            setPreviews(previews.filter((_, idx) => idx !== i));
                          }} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl text-rose-500 shadow-lg hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"><X size={16}/></button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[1.5rem] hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition-all group">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-100 mb-3 transition-all">
                        <Upload className="text-slate-400 group-hover:text-emerald-500" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-700">Tải lên</span>
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
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Câu chuyện về đóa hoa này</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 outline-none min-h-[180px] font-medium leading-relaxed transition-all" placeholder="Khách hàng sẽ cảm nhận được vẻ đẹp tinh khôi..." />
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <button disabled={isSubmitting} type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-emerald-600 transition-all active:scale-[0.98]">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24}/>}
                    {isSubmitting ? "Đang gieo mầm dữ liệu..." : "Hoàn Tất & Đăng Bán"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
