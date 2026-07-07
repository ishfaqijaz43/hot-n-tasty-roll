import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Save, LogOut, Image, DollarSign, Tag, FileText, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MenuItem, HOT_N_TASTY_CATEGORIES } from "@/data/hotNTastyMenu";
import Carousel from "./Carousel";
import SliderControls from "./SliderControls";

interface HotNTastyAdminDashboardProps {
  items: MenuItem[];
  onSave: (updatedItems: MenuItem[]) => void;
  onLogout: () => void;
  onBannersChange?: (banners: string[]) => void;
}

export const HotNTastyAdminDashboard: React.FC<HotNTastyAdminDashboardProps> = ({ items, onSave, onLogout, onBannersChange }) => {
  const [localItems, setLocalItems] = useState<MenuItem[]>([...items]);
  const [bannerImages, setBannerImages] = useState([
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  ]);
  const [isUploading, setIsUploading] = useState<number | string | null>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "burgers",
    description: "",
    price: "",
    image: "",
  });
  const IMGBB_API_KEY = "1211a1d5daba7056d0a9eaec9502ee08";

  // Banner upload handlers
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(slideIndex);
    const toastId = toast.loading("Uploading banner image...");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success && data.data?.url) {
        const newImages = [...bannerImages];
        newImages[slideIndex] = data.data.url;
        setBannerImages(newImages);
        toast.success("Banner image uploaded successfully!", { id: toastId });
      } else {
        throw new Error(data.error?.message || "Failed to upload image");
      }
    } catch (error: any) {
      console.error("Banner upload error:", error);
      toast.error(error.message || "Failed to upload image.", { id: toastId });
    } finally {
      setIsUploading(null);
    }
  };

  // Item image upload handlers
  const handleItemImageUpload = async (itemId: string) => {
    const file = (document.querySelector(`input[type="file"][data-item-id="${itemId}"]`) as HTMLInputElement).files?.[0];
    if (!file) return;
    const toastId = toast.loading("Uploading item image...");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success && data.data?.url) {
        setLocalItems((prev) => prev.map((item) => item.id === itemId ? { ...item, image: data.data.url } : item));
        toast.success("Item image uploaded successfully!", { id: toastId });
      } else {
        throw new Error(data.error?.message || "Failed to upload image");
      }
    } catch (error: any) {
      console.error("Item image upload error:", error);
      toast.error(error.message || "Failed to upload image.", { id: toastId });
    }
  };

  // Add new item handler
  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) {
      toast.error("Please fill in at least the Name and Price fields.");
      return;
    }

    const createdItem: MenuItem = {
      id: `custom-${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      description: newItem.description || "Delicious freshly prepared item.",
      price: parseFloat(newItem.price) || 0,
      image: newItem.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    };

    setLocalItems((prev) => [createdItem, ...prev]);
    setNewItem({
      name: "",
      category: "burgers",
      description: "",
      price: "",
      image: "",
    });
    toast.success(`Added "${createdItem.name}" to the list! Click 'Save Changes' to persist.`);
  };

  // Price change handler for existing items
  const handlePriceChange = (id: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setLocalItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: numericValue } : item))
    );
  };

  // Image URL change handler for existing items
  const handleImageChange = (id: string, value: string) => {
    setLocalItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, image: value } : item))
    );
  };

  // Delete item handler
  const handleDeleteItem = (id: string) => {
    setLocalItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Save changes handler
  const handleSaveChanges = () => {
    onSave(localItems);
  };

  return (
    <div className="min-h-screen bg-[#0F0F11] text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Staff <span className="text-red-600">Admin Dashboard</span></h1>
            <p className="text-zinc-400 text-sm mt-1">Manage your Hot n Tasty Roll menu items, update prices, and add new delicious dishes.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSaveChanges} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button onClick={onLogout} className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-bold rounded-xl transition-all flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
        {/* Add New Item Form */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-600/10 rounded-lg text-red-600">
              <Plus className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Add New Menu Item</h2>
          </div>
          <form onSubmit={handleAddNewItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Item Name *
              </label>
              <input type="text" placeholder="e.g., Special Garlic Mayo Roll" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-600 text-sm" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Category
              </label>
              <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-600 text-sm">
                {HOT_N_TASTY_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name.replace(/[^a-zA-Z ]/g, "").trim()}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                Price (Rs) *
              </label>
              <input type="number" placeholder="e.g., 350" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-600 text-sm" required />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Description
              </label>
              <input type="text" placeholder="Brief description of ingredients or taste..." value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-600 text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Image className="w-3 h-3" />
                Image URL
              </label>
              <input type="url" placeholder="https://images.unsplash.com/..." value={newItem.image} onChange={(e) => setNewItem({ ...newItem, image: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-600 text-sm" />
            </div>
            <div className="md:col-span-2 lg:col-span-3 pt-2">
              <button type="submit" className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add Item to List
              </button>
            </div>
          </form>
        </div>
        {/* Banner Management Section */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-600/10 rounded-lg text-red-600">
              <Image className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Manage Homepage Banners</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Slide 1", "Slide 2", "Slide 3"].map((slide, index) => (
              <div key={index} className="flex items-center gap-2">
                <label className="text-sm font-bold text-zinc-500">{slide}</label>
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={(e) => handleBannerUpload(e, index)} className="hidden" disabled={isUploading === index} />
                  <label className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-white text-sm font-bold cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                    Upload Image
                    {isUploading === index ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Menu Items List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Current Menu Items</span>
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full font-semibold">{localItems.length} items</span>
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {localItems.map((item) => (
              <div key={item.id} className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:border-zinc-700 transition-colors">
                {/* Left: Item Info */}
                <div className="flex items-center gap-4 w-full lg:w-1/3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-zinc-800 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-zinc-500 capitalize mt-0.5">{HOT_N_TASTY_CATEGORIES.find((c) => c.id === item.category)?.name.replace(/[^a-zA-Z ]/g, "").trim() || item.category}</p>
                    <p className="text-xs text-zinc-400 line-clamp-1 mt-1">{item.description}</p>
                  </div>
                </div>
                {/* Middle: Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-1/2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Price (Rs)</span>
                    <input type="number" value={item.price} onChange={(e) => handlePriceChange(item.id, e.target.value)} className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-red-600" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Image URL</span>
                    <input type="text" value={item.image} onChange={(e) => handleImageChange(item.id, e.target.value)} className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-red-600" />
                  </div>
                </div>
                {/* Right: Actions */}
                <div className="flex items-center justify-end w-full lg:w-auto shrink-0">
                  <button onClick={() => handleDeleteItem(item.id)} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-colors border border-red-500/10" title="Delete Item">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom Save Bar */}
        <div className="sticky bottom-6 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-4 rounded-2xl flex items-center justify-between shadow-2xl">
          <span className="text-sm text-zinc-400">You have unsaved changes in your local list.</span>
          <button onClick={handleSaveChanges} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};