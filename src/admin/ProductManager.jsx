import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import {
  PackagePlus,
  Image as ImageIcon,
  IndianRupee,
  Trash2,
  Edit3,
  RefreshCw,
  Layers,
  Plus,
  Save,
  Box
} from "lucide-react";

// ==========================================
// 🧩 SUB-COMPONENT: VARIANT MANAGER
// ==========================================
const VariantManager = ({ variants, setVariants, basePrice }) => {
  const addVariant = () => {
    setVariants([
      ...variants,
      { 
        size: "M", 
        type: "Ready-made", 
        stock: 0, 
        price: basePrice || 0 
      }
    ]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  return (
    <div className="space-y-4 pt-4">
      {/* HEADER & ADD BUTTON */}
      <div className="flex justify-between items-end border-b border-primary/5 pb-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-2">
          Inventory Configuration
        </label>
        <button
          type="button"
          onClick={addVariant}
          className="text-xs bg-primary text-accent px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-primary/20"
        >
          <Plus size={14} strokeWidth={3} /> Add Variant
        </button>
      </div>

      {/* THE TABLE HEADER */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-primary/30">
        <div className="col-span-2">Size</div>
        <div className="col-span-4">Type</div>
        <div className="col-span-3">Stock</div>
        <div className="col-span-2">Price (₹)</div>
        <div className="col-span-1"></div>
      </div>

      {/* THE ROWS */}
      <div className="space-y-3">
        {variants.length === 0 && (
          <div className="p-8 border-2 border-dashed border-primary/10 rounded-2xl text-center">
            <p className="text-primary/40 font-bold text-sm">No inventory added yet.</p>
            <p className="text-primary/20 text-xs mt-1">Click "Add Variant" to start.</p>
          </div>
        )}
        
        {variants.map((variant, index) => (
          <div 
            key={index} 
            className="grid grid-cols-12 gap-4 items-center bg-bg-light p-3 rounded-2xl border border-transparent hover:border-primary/10 transition-all group"
          >
            {/* Size */}
            <div className="col-span-2">
              <select
                value={variant.size}
                onChange={(e) => updateVariant(index, "size", e.target.value)}
                className="w-full bg-white p-3 rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 ring-accent shadow-sm"
              >
                {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="col-span-4">
              <select
                value={variant.type}
                onChange={(e) => updateVariant(index, "type", e.target.value)}
                className="w-full bg-white p-3 rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 ring-accent shadow-sm"
              >
                <option value="Ready-made">Ready-made</option>
                <option value="Handmade">Handmade</option>
              </select>
            </div>

            {/* Stock */}
            <div className="col-span-3">
              <input
                type="number"
                value={variant.stock}
                placeholder="0"
                onChange={(e) => updateVariant(index, "stock", Number(e.target.value))}
                className="w-full bg-white p-3 rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 ring-accent shadow-sm"
              />
            </div>

            {/* Price Override */}
            <div className="col-span-2 relative">
               <input
                type="number"
                value={variant.price}
                onChange={(e) => updateVariant(index, "price", Number(e.target.value))}
                className="w-full bg-white p-3 rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 ring-accent shadow-sm pl-6"
              />
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30 text-xs font-bold">₹</span>
            </div>

            {/* Delete */}
            <div className="col-span-1 flex justify-end">
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="p-2 text-primary/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 🚀 MAIN COMPONENT
// ==========================================
export default function ProductManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 📦 STATE
  const [formData, setFormData] = useState({
    title: "",
    collection: "", 
    tags: "",       
    images: [],
    description: "",
    fullDescription: "",
    isLimited: false,
    active: true,
    basePrice: "", 
  });

  const [variants, setVariants] = useState([
    { size: "M", type: "Ready-made", stock: 10, price: 0 }
  ]);

  // --- CLOUDINARY LOGIC (Kept exactly the same) ---
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "nawaweeb");
    data.append("cloud_name", "dmvzs4yy3");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dmvzs4yy3/image/upload", {
        method: "POST",
        body: data
      });
      if (!res.ok) throw new Error("Cloudinary Upload Failed");
      const json = await res.json();
      return json.secure_url;
    } catch (err) {
      console.error("Cloudinary Error:", err);
      return null;
    }
  };

  // 1. Fetch Inventory (Aligned with Controller Response)
  const fetchInventory = async () => {
    setFetching(true);
    try {
      const res = await api.get('/products');
      // Controller returns { success: true, data: { products: [] } }
      setProducts(res.data.data?.products || []);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    } finally {
      setFetching(false);
    }
  };

  // 2. Fetch Single Product (Aligned with Controller Response)
  const fetchSingleProduct = async (productId) => {
    try {
      const res = await api.get(`/products/${productId}`);
      const product = res.data.data.product;

      setEditingId(product.id);
      
      setFormData({
        title: product.title || "",
        
        // 1. COLLECTION
        collection: product.collection || "", 
        
        // 2. TAGS (Convert Array ["Anime", "Cool"] -> String "Anime, Cool")
        tags: product.tags ? product.tags.join(", ") : "", 
        
        images: product.images || [],
        description: product.description || "",
        
        // 3. FULL DESCRIPTION (Map from DB name 'full_description')
        fullDescription: product.full_description || "", 
        
        // 4. LIMITED EDITION (Map from DB name 'is_limited_edition')
        isLimited: product.is_limited_edition || false, 
        
        active: product.is_active ?? true,
        basePrice: product.price || "", 
      });

      // Populate Variants
      if (product.product_variants) {
        setVariants(product.product_variants.map(v => ({
          id: v.id,
          size: v.size,
          type: v.type || 'Ready-made',
          stock: v.stock_quantity,     
          price: v.price || 0 
        })));
      }
    } catch (err) {
      console.error("Failed to load product", err);
    }
  };
  useEffect(() => {
    fetchInventory();
    
    // If the URL has an ID, fetch that specific product
    if (id) {
      fetchSingleProduct(id);
    } else {
      // If URL has no ID (just /admin/products), clear the form
      setEditingId(null);
      setFormData({
        title: "", collection: "", tags: "", basePrice: "", 
        images: [], description: "", fullDescription: "", 
        isLimited: false, active: true 
      });
      setVariants([{ size: "M", type: "Ready-made", stock: 0, price: 0 }]);
    }
  }, [id]); // <--- Dependency on [id] is CRITICAL
  const handleBasePriceChange = (val) => {
    setFormData({ ...formData, basePrice: val });
  };
  // 4. Submit (Aligned with Controller Expected Body)
 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. 🛡️ GET THE TOKEN (Critical Fix)
      // Assuming you store it in localStorage after login. 
      // If you use Supabase Auth directly, use: (await supabase.auth.getSession()).data.session.access_token
      const token = localStorage.getItem("token"); 

      if (!token) {
        alert("You are not logged in or your session expired. Please login again.");
        return; // Stop execution if no token
      }

      // 2. Image Upload Logic (Kept same)
      const oldImages = formData.images.filter(img => typeof img === "string");
      const newImageObjects = formData.images.filter(img => img && typeof img === "object" && img.file);
      const uploadedResults = await Promise.all(newImageObjects.map(img => uploadToCloudinary(img.file)));
      const finalImages = [...oldImages, ...uploadedResults.filter(url => url !== null)];

      if (finalImages.length === 0 && newImageObjects.length > 0) {
        throw new Error("Image upload failed.");
      }

      const generatedSlug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

      const payload = {
        title: formData.title,
        slug: generatedSlug,
        price: Number(formData.basePrice),
        images: finalImages,
        description: formData.description,
        is_active: formData.active,
        collection: formData.collection,
        tags: formData.tags.split(",").map(t => t.trim()),
        full_description: formData.fullDescription,
        is_limited_edition: formData.isLimited,
        variants: variants.map(v => ({
          id: v.id,
          size: v.size,
          type: v.type,
          stock_quantity: Number(v.stock),
          price_override: Number(v.price)
        }))
      };

      const url = editingId 
        ? `/products/${editingId}` 
        : "/products";

      const method = editingId ? 'put' : 'post';

      // 3. 🚀 SEND REQUEST - Authorization header automatically added by axios interceptor
      await api({
        method: method,
        url: url,
        data: payload
      });

      alert("Artifact Manifested! ⛩️");
      
      setFormData({ 
        title: "", collection: "", tags: "", basePrice: "", 
        images: [], description: "", fullDescription: "", 
        isLimited: false, active: true 
      });
      setVariants([{ size: "M", type: "Ready-made", stock: 0, price: 0 }]);
      setEditingId(null);
      fetchInventory();
      navigate("/admin/products");

    } catch (err) {
      console.error("Submission Error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to save artifact.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (confirm("Delete this artifact?")) {
      try {
        // 1. Get the token (Critical Step!)
        const token = localStorage.getItem("token");

        // 2. Send request with Headers
        await api.delete(`/products/${productId}`);

        alert("Artifact Deleted 🗑️");
        fetchInventory(); // Refresh the list
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete product");
      }
    }
  };

  // ==========================================
  // UI RENDER (UNCHANGED)
  // ==========================================
  return (
    <div className="space-y-16 pb-20">
      {/* HEADER */}
      <div className="space-y-10">
        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black text-primary uppercase italic tracking-tighter">
              Manifest <span className="text-accent-dark">New Artifact</span>
            </h2>
            <p className="text-primary/40 font-editor italic">
              Forge a new link between Lucknow and Tokyo.
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8 bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm">
            
            {/* 1. Basic Info */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-2">Artifact Title</label>
              <input
                type="text"
                required
                className="w-full p-4 bg-bg-light rounded-2xl border-none focus:ring-2 ring-accent font-clash font-bold text-lg"
                placeholder="e.g., Akatsuki Cloud Tee"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-2">Collection</label>
                <input
                  type="text"
                  required
                  className="w-full p-4 bg-bg-light rounded-2xl border-none focus:ring-2 ring-accent font-clash font-bold"
                  placeholder="e.g., Winter Arc"
                  value={formData.collection}
                  onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-2">Tags</label>
                <input
                  type="text"
                  className="w-full p-4 bg-bg-light rounded-2xl border-none focus:ring-2 ring-accent font-clash font-bold"
                  placeholder="e.g., Uchiha, Oversized"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-2">Short Description</label>
              <input
                type="text"
                required
                className="w-full p-4 bg-bg-light rounded-2xl border-none focus:ring-2 ring-accent font-editor italic"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-2">Full Specifications</label>
              <textarea
                rows="3"
                className="w-full p-4 bg-bg-light rounded-2xl border-none focus:ring-2 ring-accent font-editor italic text-sm"
                value={formData.fullDescription}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              />
            </div>

            {/* 2. VARIANT MANAGER */}
            <hr className="border-primary/5" />
            <VariantManager 
              variants={variants} 
              setVariants={setVariants} 
              basePrice={formData.basePrice} 
            />
            
            {/* 3. Toggles */}
            <div className="flex gap-4 pt-4">
               <button
                  type="button"
                  onClick={() => setFormData({ ...formData, active: !formData.active })}
                  className={`flex-1 py-4 rounded-2xl font-bold text-[10px] uppercase transition-all ${formData.active ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-gray-100 text-gray-400"}`}
                >
                  {formData.active ? "Status: Active" : "Status: Hidden"}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isLimited: !formData.isLimited })}
                  className={`flex-1 py-4 rounded-2xl font-bold text-[10px] uppercase transition-all ${formData.isLimited ? "bg-amber-500 text-white shadow-lg shadow-amber-200" : "bg-gray-100 text-gray-400"}`}
                >
                  {formData.isLimited ? "Limited Edition" : "Standard Drop"}
                </button>
            </div>
          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <div className="space-y-6">
            
            {/* Base Price Card */}
            <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent mb-6">
                <IndianRupee size={14} /> Pricing Logic
              </h4>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase">Base Price (Default)</label>
                <input
                  type="number"
                  value={formData.basePrice}
                  required
                  placeholder="0"
                  className="w-full bg-white/10 border border-white/10 rounded-xl p-4 font-clash font-bold focus:outline-none focus:ring-1 ring-accent text-3xl"
                  onChange={(e) => handleBasePriceChange(e.target.value)}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-emerald-100">
               <div className="grid grid-cols-3 gap-3 mb-4">
                  {formData.images?.map((img, index) => {
                    if (!img) return null;
                    const src = typeof img === "string" ? img : img.preview;
                    return (
                      <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border group">
                        <img src={src} className="w-full h-full object-cover" alt="" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                          className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                        >✕</button>
                      </div>
                    );
                  })}
                  <label className="aspect-square border-2 border-dashed border-primary/20 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-bg-light transition-colors">
                    <input
                      type="file" multiple accept="image/*" hidden
                      onChange={(e) => {
                        const files = Array.from(e.target.files).map(file => ({ file, preview: URL.createObjectURL(file) }));
                        setFormData({ ...formData, images: [...formData.images, ...files] });
                      }}
                    />
                    <ImageIcon className="text-primary/30" size={26} />
                  </label>
               </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-6 bg-primary text-accent rounded-full font-black text-xl uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Save />}
              {editingId ? "Update Artifact" : "Manifest Drop"}
            </button>
          </div>
        </form>
      </div>

      {/* INVENTORY LIST */}
      <div className="space-y-6 pt-10 border-t border-primary/5">
        <h3 className="text-2xl font-black text-primary uppercase flex items-center gap-3">
          <Layers className="text-accent-dark" /> Active Inventory
        </h3>
        <div className="grid grid-cols-1 gap-4">
           {products.map((product) => (
             <div key={product.id} className="bg-white p-4 rounded-3xl border border-emerald-100 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden">
                      <img src={product.images?.[0]} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h4 className="font-bold text-primary">{product.title}</h4>
                      <p className="text-xs text-primary/50">{product.collection}</p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => navigate(`/admin/products/${product.id}`)} className="p-2 hover:bg-gray-100 rounded-lg"><Edit3 size={16}/></button>
                   <button onClick={() => handleDelete(product.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}