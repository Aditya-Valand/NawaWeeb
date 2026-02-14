import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  PackagePlus,
  Image as ImageIcon,
  IndianRupee,
  Trash2,
  Edit3,
  RefreshCw,
  Layers,
} from "lucide-react";

export default function ProductManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: "", // Updated to match your backend 'title' requirement
    animeTag: "",
    series: "",
    priceReady: "",
    priceHandmade: "",
    images: [],
    description: "",
    fullDescription: "",
    isLimited: false,
    active: true, // Boolean (Listed/Unlisted)
    stock: 0,
  });
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

    if (!res.ok) {
      const errorData = await res.json();
      // This will tell you EXACTLY why Cloudinary is rejecting you in the console
      console.error("Cloudinary Detailed Error:", errorData);
      throw new Error("Cloudinary Upload Failed"); 
    }

    const json = await res.json();
    return json.secure_url;
  } catch (err) {
    console.error("Cloudinary Error:", err);
    return null; 
  }
};

  // 1. Fetch Inventory
  const fetchInventory = async () => {
    setFetching(true);
    try {
      const res = await axios.get("http://localhost:5000/api/products");

      console.log("RAW RESPONSE:", res.data);
      console.log("PRODUCT ARRAY:", res.data.data.products);

      setProducts(res.data.data.products);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    console.log("STATE products:", products);
  }, [products]);

  const fetchSingleProduct = async (productId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products/${productId}`,
      );

      const product = res.data.data.product;

      setEditingId(product._id);
      setFormData({
        title: product.title || "",
        animeTag: product.animeTag || "",
        series: product.series || "",
        priceReady: product.priceReady || "",
        priceHandmade: product.priceHandmade || "",
        images: (product.images || []).filter((img) => img !== null),
        description: product.description || "",
        fullDescription: product.fullDescription || "",
        isLimited: product.isLimited || false,
        active: product.active ?? true,
        stock: product.stock || 0,
      });
    } catch (err) {
      console.error("Failed to load product", err);
      alert("Product not found");
    }
  };

  useEffect(() => {
    if (id) {
      fetchSingleProduct(id);
    }
  }, [id]);

  // 2. Pricing Logic
  const handlePriceChange = (val) => {
    const ready = Number(val);
    setFormData({
      ...formData,
      priceReady: ready,
      priceHandmade: Math.floor(ready * 1.3), // Automatic +30% Craftsmanship Markup
    });
  };

  // 3. Delete Artifact
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this artifact from the Clan?",
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchInventory();
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const token = localStorage.getItem("token");
  //   const data = new FormData();

  //   Object.keys(formData).forEach((key) => {
  //     if (key !== "images") data.append(key, formData[key]);
  //   });

  //   formData.images.forEach((img) => {
  //     if (img.file) data.append("images", img.file);
  //   });

  //   try {
  //     if (editingId) {
  //       await axios.patch(
  //         `http://localhost:5000/api/products/${editingId}`,
  //         data,
  //         { headers: { Authorization: `Bearer ${token}` } },
  //       );
  //       alert("Artifact updated ⚔️");
  //     } else {
  //       await axios.post("http://localhost:5000/api/products/add", data, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       alert("Artifact manifested ⛩️");
  //     }

  //     setEditingId(null);
  //     fetchInventory();
  //   } catch (err) {
  //     alert(err.response?.data?.message || "Upload failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    // 1. Separate strings (old URLs) from objects (new files)
    const oldImages = formData.images.filter(img => typeof img === "string");
    const newImageObjects = formData.images.filter(img => img && typeof img === "object" && img.file);

    // 2. Upload and wait for results
    const uploadedResults = await Promise.all(
      newImageObjects.map(img => uploadToCloudinary(img.file))
    );

    // 3. 🛡️ FILTER out nulls immediately to prevent saving bad data
    const successfullyUploaded = uploadedResults.filter(url => url !== null);
    const finalImages = [...oldImages, ...successfullyUploaded];

    // 4. CHECK: If Cloudinary failed for all new images and no old ones exist
    if (finalImages.length === 0) {
      throw new Error("Cloudinary upload failed for all images. Please check your preset/connection.");
    }

    const payload = {
      ...formData,
      images: finalImages,
      stock: Number(formData.stock)
    };

    const url = editingId 
      ? `http://localhost:5000/api/products/${editingId}` 
      : "http://localhost:5000/api/products/add";

    await axios({
      method: editingId ? 'patch' : 'post',
      url: url,
      data: payload,
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Artifact Manifested! ⛩️");
    fetchInventory();
    navigate("/admin/products");
    
    // Reset form after success
    setFormData({ title: "", animeTag: "", series: "", priceReady: "", priceHandmade: "", images: [], description: "", fullDescription: "", isLimited: false, active: true, stock: 0 });
    setEditingId(null);

  } catch (err) {
    console.error("Submission Error:", err);
    alert(err.message || "Failed to save artifact.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="space-y-16">
      {/* SECTION 1: MANIFEST FORM */}
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

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6 bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-2">
                  Artifact Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-4 bg-bg-light rounded-2xl border-none focus:ring-2 ring-accent font-clash font-bold"
                  placeholder="e.g., Akatsuki Cloud Tee"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-2">
                  Anime Tag / Collection
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-4 bg-bg-light rounded-2xl border-none focus:ring-2 ring-accent font-clash font-bold"
                  placeholder="e.g., Uchiha / Winter Drop"
                  value={formData.animeTag}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      animeTag: e.target.value,
                      series: "Clan Drop",
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Stock Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-2">
                  Inventory Stock
                </label>
                <input
                  type="number"
                  className="w-full p-4 bg-bg-light rounded-2xl border-none focus:ring-2 ring-accent font-clash font-bold"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Number(e.target.value) })
                  }
                />
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-6 pt-8">
                {/* <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                  />
                  <div
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.active ? "bg-emerald-500" : "bg-gray-300"}`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full transition-transform ${formData.active ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Listed
                  </span>
                </label> */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, active: !formData.active })
                  }
                  className={`flex-1 py-4 rounded-2xl font-bold text-[10px] uppercase transition-all ${formData.active ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-400"}`}
                >
                  {formData.active ? "Listed" : "Unlisted"}
                </button>

                {/* <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.isLimited}
                    onChange={(e) =>
                      setFormData({ ...formData, isLimited: e.target.checked })
                    }
                  />
                  <div
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.isLimited ? "bg-amber-500" : "bg-gray-300"}`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full transition-transform ${formData.isLimited ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Limited
                  </span>
                </label> */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, isLimited: !formData.isLimited })
                  }
                  className={`flex-1 py-4 rounded-2xl font-bold text-[10px] uppercase transition-all ${formData.isLimited ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-400"}`}
                >
                  {formData.isLimited ? "Limited Drop" : "Standard"}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-2">
                Short Description
              </label>
              <input
                type="text"
                required
                className="w-full p-4 bg-bg-light rounded-2xl border-none focus:ring-2 ring-accent font-editor italic"
                placeholder="Hand-stitched floral energy..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-2">
                Full Specifications
              </label>
              <textarea
                rows="4"
                required
                className="w-full p-4 bg-bg-light rounded-2xl border-none focus:ring-2 ring-accent font-editor italic text-sm"
                placeholder="Detail the fabric, embroidery hours, and anime references..."
                value={formData.fullDescription}
                onChange={(e) =>
                  setFormData({ ...formData, fullDescription: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent mb-6">
                <IndianRupee size={14} /> Pricing Logic
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-white/40 uppercase mb-2">
                    Base Price
                  </p>
                  <input
                    type="number"
                    value={formData.priceReady}
                    required
                    className="w-full bg-white/10 border border-white/10 rounded-xl p-3 font-clash font-bold focus:outline-none focus:ring-1 ring-accent"
                    onChange={(e) => handlePriceChange(e.target.value)}
                  />
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-accent font-bold uppercase mb-1">
                    Handmade Calc
                  </p>
                  <p className="text-3xl font-black">
                    ₹{formData.priceHandmade || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-emerald-100">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {formData.images?.map((img, index) => {
                  // 🛡️ CRITICAL FIX: Skip nulls and determine source
                  if (!img) return null;
                  const src = typeof img === "string" ? img : img.preview;

                  return (
                    <div
                      key={index}
                      className="relative aspect-square rounded-2xl overflow-hidden border group"
                    >
                      <img
                        src={src}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }));
                        }}
                        className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
                {/* Upload Box */}
                <label className="aspect-square border-2 border-dashed border-primary/20 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-bg-light">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const files = Array.from(e.target.files);

                      const mapped = files.map((file) => ({
                        file,
                        preview: URL.createObjectURL(file),
                      }));

                      setFormData({
                        ...formData,
                        images: [...(formData.images || []), ...mapped],
                      });
                    }}
                  />
                  <ImageIcon className="text-primary/30" size={26} />
                </label>
              </div>

              <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest text-center">
                Upload up to 6 product images
              </p>
            </div>

            <button
              disabled={loading}
              className="w-full py-6 bg-primary text-accent rounded-full font-black text-xl uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              {loading
                ? "Manifesting..."
                : editingId
                  ? "Update Artifact"
                  : "Manifest Drop"}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: INVENTORY LIST */}
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <h3 className="text-2xl font-black text-primary uppercase flex items-center gap-3">
            <Layers className="text-accent-dark" /> Active Inventory
            <span className="text-xs bg-accent text-primary px-3 py-1 rounded-full">
              {products.length}
            </span>
          </h3>
          <button
            onClick={fetchInventory}
            className="p-2 text-primary/40 hover:text-primary transition-colors"
          >
            <RefreshCw size={18} className={fetching ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {fetching ? (
            <div className="p-20 text-center font-editor italic text-primary/20">
              Accessing scrolls...
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-6 rounded-3xl border border-emerald-100 flex items-center justify-between group hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-bg-light border border-primary/5">
                    <img
                      src={product.images?.[0]}
                      className="w-full h-full object-cover"
                      alt={product.title}
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-primary uppercase text-lg leading-tight">
                      {product.title}
                    </h4>
                    <p className="text-[10px] font-bold text-accent-dark uppercase tracking-widest">
                      {product.animeTag}
                    </p>
                    {product.isLimited && (
                      <span className="text-[8px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold uppercase">
                        Limited
                      </span>
                    )}
                    {!product.active && (
                      <span className="text-[8px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">
                        Unlisted
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] font-bold text-primary/40 mt-1 uppercase">
                    Stock: {product.stock}
                  </p>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[9px] text-primary/40 uppercase font-bold">
                      Base Price
                    </p>
                    <p className="font-black text-primary">
                      ₹{product.priceReady}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/products/${product._id}`)}
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
