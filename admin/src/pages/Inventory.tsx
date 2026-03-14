import { 
  Package, 
  Trash2, 
  Edit3, 
  Plus,
  AlertTriangle,
  Layers,
  Coins,
  Loader2,
  X,
  Upload,
  DollarSign,
  CheckCircle2
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
  stockLevel: number;
  unit: string;
  image?: string;
}

export default function Inventory() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    stockLevel: "",
    unitCost: "",
    unit: "cành",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();

    const socket = io(API_BASE_URL);
    socket.on("productUpdated", (data: any) => {
      if (data.type === 'material') {
        fetchMaterials();
        if (!data.deleted) {
          toast.info(`Kho đã được cập nhật: ${data.material?.name || 'Nguyên liệu'}`);
        }
      }
    });

    return () => { socket.disconnect(); };
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/materials`);
      const data = await res.json();
      setMaterials(data);
    } catch (err) {
      console.error("Failed to fetch materials:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: Material) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      stockLevel: String(item.stockLevel),
      unitCost: String(item.unitCost),
      unit: item.unit
    });
    setPreview(item.image || null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const body = new FormData();
    body.append("name", formData.name);
    body.append("stockLevel", formData.stockLevel);
    body.append("unitCost", formData.unitCost);
    body.append("unit", formData.unit);
    if (selectedImage) body.append("image", selectedImage);

    try {
      const url = editingId 
        ? `${API_BASE_URL}/materials/${editingId}`
        : `${API_BASE_URL}/materials`;
      
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        body
      });
      if (res.ok) {
        toast.success(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: "", stockLevel: "", unitCost: "", unit: "cành" });
        setSelectedImage(null);
        setPreview(null);
        fetchMaterials();
      } else {
        const errData = await res.json();
        toast.error(`Lỗi: ${errData.message || "Không thể lưu dữ liệu"}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối máy chủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatVND = (value: number | string) => {
    return Number(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  };

  const totalValue = materials.reduce((acc, m) => acc + (Number(m.unitCost) * m.stockLevel), 0);
  const lowStockCount = materials.filter(m => m.stockLevel < 10).length;

  return (
    <div className="max-w-[1600px] mx-auto">
      <header className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kho Nguyên Liệu</h1>
          <p className="text-slate-500 font-medium">Quản lý kho tàng hương sắc và tối ưu hóa chi phí.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", stockLevel: "", unitCost: "", unit: "cành" });
            setSelectedImage(null);
            setPreview(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 uppercase tracking-widest"
        >
          <Plus size={20} />
          Nhập Kho Mới
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         {[
           { label: "Giá Trị Tồn Kho", value: formatVND(totalValue), icon: Coins, color: "text-emerald-600", bg: "bg-emerald-50" },
           { label: "Cảnh Báo Hết Hàng", value: `${lowStockCount} Mục`, icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50", warning: lowStockCount > 0 },
           { label: "Tổng Phân Loại", value: `${materials.length} Loại`, icon: Layers, color: "text-amber-600", bg: "bg-amber-50" },
         ].map((stat, i) => (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             key={i} 
             className={`bg-white p-8 rounded-[2.5rem] border ${stat.warning ? 'border-rose-200 shadow-rose-100' : 'border-slate-200/60 shadow-slate-100'} shadow-xl group hover:border-emerald-200 transition-all`}
           >
             <div className="flex justify-between items-center mb-6">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:rotate-12 transition-transform shadow-sm`}>
                   <stat.icon size={28} />
                </div>
                {stat.warning && <div className="animate-ping w-2.5 h-2.5 rounded-full bg-rose-500" />}
             </div>
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
             <p className={`text-3xl font-black ${stat.warning ? 'text-rose-600' : 'text-slate-900'}`}>{stat.value}</p>
           </motion.div>
         ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-800">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nguyên Liệu</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tồn Kho</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Đơn Giá</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Thanh Tiền</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                   <td colSpan={5} className="py-20 text-center">
                      <Loader2 className="animate-spin text-emerald-500 mx-auto" size={32} />
                      <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Đang kiểm kê kho...</p>
                   </td>
                </tr>
              ) : materials.map((item, i) => (
                <motion.tr 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: i * 0.05 }}
                   key={item.id} 
                   className="hover:bg-emerald-50/20 transition-colors group"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-400 group-hover:scale-110 shadow-sm transition-all duration-300">
                         {item.image ? (
                           <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                         ) : (
                           <Package size={24} />
                         )}
                      </div>
                      <span className="font-bold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-xl font-black ${item.stockLevel < 10 ? 'text-rose-600' : 'text-slate-900'}`}>
                        {item.stockLevel}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">{item.unit}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                     <span className="text-lg font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{formatVND(item.unitCost)}</span>
                  </td>
                  <td className="px-10 py-8 text-center">
                     <span className="text-lg font-black text-emerald-600">{formatVND(item.stockLevel * item.unitCost)}</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-2 invisible group-hover:visible transition-all">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-2.5 bg-white border border-slate-100 hover:border-emerald-200 hover:text-emerald-600 rounded-xl transition-all shadow-sm hover:shadow-md text-slate-400"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button className="p-2.5 bg-white border border-slate-100 hover:border-rose-200 hover:text-rose-600 rounded-xl transition-all shadow-sm hover:shadow-md text-slate-400">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
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
              className="fixed inset-y-0 right-0 w-full max-w-xl bg-white z-[101] shadow-2xl overflow-y-auto"
            >
              <div className="sticky top-0 bg-white/80 backdrop-blur-xl z-10 px-10 py-8 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                    {editingId ? "Cập Nhật Vật Tư" : "Nhập Nguyên Liệu"}
                  </h2>
                  <p className="text-slate-500 font-medium text-sm">
                    {editingId ? `Đang chỉnh sửa: ${formData.name}` : "Thêm các loại hoa và vật liệu mới vào kho."}
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all text-slate-400"><X/></button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-10">
                {/* Image Upload */}
                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hình ảnh minh họa</label>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer relative">
                      {preview ? (
                        <img src={preview} className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="text-slate-300 group-hover:text-emerald-500 transition-colors" size={32} />
                      )}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-400 leading-relaxed italic">"Một tấm ảnh đẹp giúp bạn dễ dàng nhận diện nguyên liệu trong kho."</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Tên nguyên liệu</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 outline-none font-bold text-lg transition-all" placeholder="Hồng Ohara Trắng..." />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Số lượng nhập</label>
                      <div className="relative">
                        <input required type="number" value={formData.stockLevel} onChange={e => setFormData({...formData, stockLevel: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 outline-none font-black text-xl transition-all" placeholder="50" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase tracking-widest">{formData.unit}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Đơn vị tính</label>
                      <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 outline-none font-bold transition-all appearance-none">
                        <option value="cành">Cành</option>
                        <option value="bó">Bó</option>
                        <option value="hộp">Hộp</option>
                        <option value="m">Mét</option>
                        <option value="cái">Cái</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Giá nhập mỗi đơn vị (VND)</label>
                    <div className="relative">
                      <input required type="number" step="1" value={formData.unitCost} onChange={e => setFormData({...formData, unitCost: e.target.value})} className="w-full p-4 pl-10 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 outline-none font-black text-xl text-emerald-600 transition-all" placeholder="100.000" />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">đ</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <button disabled={isSubmitting} type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-emerald-600 transition-all active:scale-[0.98]">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24}/>}
                    {isSubmitting ? "Đang lưu trữ..." : editingId ? "Lưu Thay Đổi" : "Cập Nhật Vào Kho"}
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
