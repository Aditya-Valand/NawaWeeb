import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react'; // Assuming you use Lucide icons

export default function VariantManager({ basePrice, onChange }) {
  // 1. The State: An array of variant objects
  const [variants, setVariants] = useState([
    { size: 'M', type: 'Ready-made', stock: 10, price: basePrice }
  ]);

  // 2. Sync with Parent whenever variants change
  useEffect(() => {
    onChange(variants);
  }, [variants, onChange]);

  // 3. Add a new empty row
  const addVariant = () => {
    setVariants([
      ...variants,
      { size: 'L', type: 'Ready-made', stock: 0, price: basePrice }
    ]);
  };

  // 4. Remove a row
  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  // 5. Handle Input Changes (The tricky part)
  const handleUpdate = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-6">
      <h3 className="text-[#E3E3E3] font-bold mb-4 flex justify-between items-center">
        <span>INVENTORY & VARIANTS</span>
        <button 
          onClick={addVariant}
          type="button"
          className="text-xs bg-[#2A9D8F] text-white px-3 py-1 rounded-full flex items-center gap-1 hover:bg-[#21867a]"
        >
          <Plus size={14} /> Add Size
        </button>
      </h3>

      <div className="space-y-3">
        {variants.map((variant, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center bg-black/20 p-3 rounded-lg">
            
            {/* SIZE */}
            <div className="col-span-2">
              <label className="text-[10px] text-gray-500 uppercase">Size</label>
              <select 
                value={variant.size}
                onChange={(e) => handleUpdate(index, 'size', e.target.value)}
                className="w-full bg-transparent text-white border-b border-white/20 focus:border-[#2A9D8F] outline-none text-sm"
              >
                {['XS','S','M','L','XL','XXL'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* TYPE */}
            <div className="col-span-4">
              <label className="text-[10px] text-gray-500 uppercase">Type</label>
              <select 
                value={variant.type}
                onChange={(e) => handleUpdate(index, 'type', e.target.value)}
                className="w-full bg-transparent text-white border-b border-white/20 focus:border-[#2A9D8F] outline-none text-sm"
              >
                <option value="Ready-made">Ready-made</option>
                <option value="Handmade">Handmade (+20%)</option>
              </select>
            </div>

            {/* STOCK */}
            <div className="col-span-3">
              <label className="text-[10px] text-gray-500 uppercase">Stock</label>
              <input 
                type="number" 
                value={variant.stock}
                onChange={(e) => handleUpdate(index, 'stock', parseInt(e.target.value))}
                className="w-full bg-transparent text-white border-b border-white/20 focus:border-[#2A9D8F] outline-none text-sm"
              />
            </div>

            {/* DELETE BUTTON */}
            <div className="col-span-1 flex justify-end">
              <button 
                type="button"
                onClick={() => removeVariant(index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}