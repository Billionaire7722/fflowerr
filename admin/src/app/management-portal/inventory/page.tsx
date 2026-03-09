"use client";

import AdminLayout from "@/components/AdminLayout";
import { 
  Package, 
  Trash2, 
  Edit3, 
  Plus,
  AlertTriangle
} from "lucide-react";

const MATERIALS = [
  { id: 1, name: "Hoa Hồng Đỏ Cao Cấp", stock: 120, cost: 2.50, unit: "nhánh" },
  { id: 2, name: "Giấy Gói Lụa", stock: 15, cost: 1.20, unit: "cuộn", lowStock: true },
  { id: 3, name: "Ruy Băng Satin (Vàng)", stock: 8, cost: 0.80, unit: "m", lowStock: true },
  { id: 4, name: "Hoa Ly Trắng", stock: 45, cost: 3.00, unit: "nhánh" },
];

export default function InventoryPage() {
  return (
    <AdminLayout>
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Kho Hàng & Nguyên Liệu</h1>
          <p className="text-slate-500">Theo dõi chi phí nguyên liệu và mức tồn kho.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
          <Plus size={20} />
          Thêm Nguyên Liệu
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-slate-500 text-sm font-medium mb-1">Giá Trị Tồn Kho</p>
           <p className="text-2xl font-bold text-slate-800">$1,450.00</p>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-amber-500">
           <p className="text-slate-500 text-sm font-medium mb-1">Cảnh Báo Sắp Hết</p>
           <p className="text-2xl font-bold text-amber-600">2 Mục</p>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-slate-500 text-sm font-medium mb-1">Chi Phí Hàng Tháng</p>
           <p className="text-2xl font-bold text-slate-800">$320.45</p>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tên Nguyên Liệu</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Mức Tồn Kho</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Đơn Giá</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MATERIALS.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                       <Package size={20} />
                    </div>
                    <span className="font-bold text-slate-800">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${item.lowStock ? 'text-amber-600' : 'text-slate-700'}`}>
                      {item.stock} {item.unit}
                    </span>
                    {item.lowStock && <AlertTriangle size={14} className="text-amber-500" />}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-600">${item.cost.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-slate-400">
                      <Edit3 size={18} />
                    </button>
                    <button className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-slate-400">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
