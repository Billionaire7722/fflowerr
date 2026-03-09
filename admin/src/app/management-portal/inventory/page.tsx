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
  { id: 1, name: "Premium Red Roses", stock: 120, cost: 2.50, unit: "stems" },
  { id: 2, name: "Silk Wrapping Paper", stock: 15, cost: 1.20, unit: "rolls", lowStock: true },
  { id: 3, name: "Satin Ribbons (Gold)", stock: 8, cost: 0.80, unit: "m", lowStock: true },
  { id: 4, name: "White Lilies", stock: 45, cost: 3.00, unit: "stems" },
];

export default function InventoryPage() {
  return (
    <AdminLayout>
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Inventory & Materials</h1>
          <p className="text-slate-500">Monitor raw material costs and stock levels.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
          <Plus size={20} />
          Add Material
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-slate-500 text-sm font-medium mb-1">Stock Value</p>
           <p className="text-2xl font-bold text-slate-800">$1,450.00</p>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-amber-500">
           <p className="text-slate-500 text-sm font-medium mb-1">Low Stock Alerts</p>
           <p className="text-2xl font-bold text-amber-600">2 Items</p>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-slate-500 text-sm font-medium mb-1">Monthly Cost</p>
           <p className="text-2xl font-bold text-slate-800">$320.45</p>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Material Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Stock Level</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Unit Cost</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Actions</th>
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
