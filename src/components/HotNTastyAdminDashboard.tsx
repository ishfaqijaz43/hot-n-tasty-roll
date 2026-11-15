import React, { useState } from "react";
import { Plus, Trash2, Save, LogOut, Image, DollarSign, Tag, FileText, Check, Upload } from "lucide-react";
import { toast } from "sonner";
import { MenuItem, HOT_N_TASTY_CATEGORIES } from "@/data/hotNTastyMenu";
import { isExclusiveDeal } from "@/utils/exclusiveDeals";

// Fetch key securely via Vite client environment variables or fallback safely
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "1211a1d5daba7056d0a9eaec9502ee08";

const directImgBBUpload = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.success && data.data?.url) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "Failed to upload image to ImgBB");
    }
  } catch (error: any) {
    console.error("ImgBB direct upload failure details:", error);
    alert("ImgBB Upload Error: " + (error?.message || error));
    throw error;
  }
};

interface HotNTastyAdminDashboardProps {
  items: MenuItem[];
  banners: string[];
  logo: string;
  exclusiveTitle: string;
  onExclusiveTitleSave: (title: string) => Promise<void>;
  onSave: (updatedItems: MenuItem[]) => Promise<MenuItem[]>;
  onLogout: () => void;
  onBannersChange?: (banners: string[]) => void;
  onLogoChange?: (logo: string) => void;
}

export const HotNTastyAdminDashboard: React.FC<HotNTastyAdminDashboardProps> = ({
  items,
  banners,
  logo,
  exclusiveTitle,
  onExclusiveTitleSave,
  onSave,
  onLogout,
  onBannersChange,
  onLogoChange
}) => {
  const [localItems, setLocalItems] = useState<MenuItem[]>(() => [...items]);
  const [localBanners, setLocalBanners] = useState<string[]>(() => [...banners]);
  const [localLogo, setLocalLogo] = useState<string>(logo);
  const [localExclusiveTitle, setLocalExclusiveTitle] = useState(exclusiveTitle);
  const [newExclusive, setNewExclusive] = useState({ name: "", description: "", price: "", image: "" });
  const [uploadingExclusive, setUploadingExclusive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "burgers",
    description: "",
    price: "",
    image: "",
  });
  const [newItemImageUploaded, setNewItemImageUploaded] = useState(false);

  const handleItemImageUpload = async (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await directImgBBUpload(file);
      setLocalItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, image: url } : item))
      );
      toast.success("Item image uploaded successfully!");
    } catch (error) {
      // Handled
    }
    e.target.value = "";
  };

  const handleBannerUpload = async (slideIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await directImgBBUpload(file);
      const updatedBanners = [...localBanners];
      updatedBanners[slideIndex] = url;
      setLocalBanners(updatedBanners);

      if (onBannersChange) {
        onBannersChange(updatedBanners);
      }
      toast.success(`Slide ${slideIndex + 1} banner uploaded successfully!`);
    } catch (error) {
      // Handled
    }
    e.target.value = "";
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await directImgBBUpload(file);
      setLocalLogo(url);
      if (onLogoChange) {
        onLogoChange(url);
      }
      toast.success("Restaurant Logo updated successfully!");
    } catch (error) {
      // Handled
    }
    e.target.value = "";
  };

  const handleNewItemImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await directImgBBUpload(file);
      setNewItem({ ...newItem, image: url });
      setNewItemImageUploaded(true);
      toast.success("New item image uploaded successfully!");
    } catch (error: any) {
      alert("New Item Image Upload Failed: " + (error?.message || error));
    }
    e.target.value = "";
  };

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
    setNewItem({ name: "", category: "burgers", description: "", price: "", image: "" });
    setNewItemImageUploaded(false);
    toast.success(`Added "${createdItem.name}" to the list! Click 'Save Changes' to persist.`);
  };

  const handleExclusiveImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingExclusive(true);
    try {
      const url = await directImgBBUpload(file);
      setNewExclusive((prev) => ({ ...prev, image: url }));
      toast.success("Exclusive deal image uploaded!");
    } catch {
      // Image upload errors are already shown by the shared uploader.
    } finally {
      setUploadingExclusive(false);
      e.target.value = "";
    }
  };

  const handleAddExclusive = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(newExclusive.price);
    if (!newExclusive.name.trim() || !Number.isFinite(price) || price <= 0) {
      toast.error("Enter a deal name and a valid price greater than zero.");
      return;
    }
    const deal: MenuItem = {
      // A compact ID also works with older installations using varchar(20) IDs.
      id: `exclusive-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 4)}`,
      name: newExclusive.name.trim(),
      description: newExclusive.description.trim(),
      price,
      image: newExclusive.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
      category: "exclusive-deals",
    };
    setLocalItems((prev) => [...prev, deal]);
    setNewExclusive({ name: "", description: "", price: "", image: "" });
    toast.success(`Added ${deal.name}. Click Save Changes to publish.`);
  };

  const handlePriceChange = (id: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setLocalItems((prev) => prev.map((item) => (item.id === id ? { ...item, price: numericValue } : item)));
  };

  const handleNameChange = (id: string, value: string) => {
    setLocalItems((prev) => prev.map((item) => (item.id === id ? { ...item, name: value } : item)));
  };

  const handleDescriptionChange = (id: string, value: string) => {
    setLocalItems((prev) => prev.map((item) => (item.id === id ? { ...item, description: value } : item)));
  };

  const handleImageChange = (id: string, value: string) => {
    setLocalItems((prev) => prev.map((item) => (item.id === id ? { ...item, image: value } : item)));
  };

  const handleDeleteItem = (id: string) => {
    const itemName = localItems.find((item) => item.id === id)?.name || "this item";
    if (!window.confirm(`Remove ${itemName}? It will be deleted from the menu when you save.`)) return;
    setLocalItems((prev) => prev.filter((item) => item.id !== id));
    toast.info("Item removed from the list. Save Changes to publish deletion.");
  };

  const handleSaveChanges = async () => {
    if (isSaving) return;
    setIsSaving(true);
    let menuSaved = false;
    try {
      const savedItems = await onSave(localItems);
      // Replace temporary IDs with the BIGINT IDs generated by Supabase.
      // This prevents a second click from inserting duplicate rows.
      setLocalItems(savedItems);
      menuSaved = true;
      // Do not write to the settings table when only a menu item was edited.
      const savedTitle = exclusiveTitle.trim() || "Exclusive Deals";
      const requestedTitle = localExclusiveTitle.trim() || "Exclusive Deals";
      if (savedTitle !== requestedTitle) {
        await onExclusiveTitleSave(requestedTitle);
      }
      toast.success("Menu and Exclusive Deals changes saved!");
    } catch (error) {
      const partiallySavedItems = error && typeof error === "object" && "partiallySavedItems" in error
        ? (error as { partiallySavedItems?: MenuItem[] }).partiallySavedItems
        : undefined;
      if (partiallySavedItems) setLocalItems(partiallySavedItems);
      console.error("Admin save failed:", error);
      const message = error instanceof Error ? error.message :
        error && typeof error === "object" && "message" in error && typeof error.message === "string"
          ? error.message
          : "Database operation failed; check browser console";
      const prefix = menuSaved ? "Menu saved, but title update failed" : "Menu save failed";
      toast.error(`${prefix}: ${message}`, { duration: 15000 });
    } finally {
      setIsSaving(false);
    }
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
            <button onClick={handleSaveChanges} disabled={isSaving} className="disabled:opacity-50 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button onClick={onLogout} className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-bold rounded-xl transition-all flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>

        {/* Restaurant Logo Settings & Customization */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-600/10 rounded-lg text-red-600">
              <Upload className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Manage Restaurant Logo</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-zinc-950 p-4 border border-zinc-800 rounded-xl">
            <div className="w-20 h-20 bg-zinc-900 rounded-xl overflow-hidden shrink-0 border border-zinc-800 flex items-center justify-center">
              <img
                src={localLogo || "/logo.jpg"}
                alt="Restaurant Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/logo.jpg";
                }}
              />
            </div>
            <div className="space-y-2 flex-1 w-full">
              <label className="text-sm font-bold text-zinc-300 block">Upload New Logo (imgBB)</label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="block w-full text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg p-1.5" />
            </div>
          </div>
        </div>

        {/* Exclusive deals have their own list, but use the existing menu item table. */}
        <div className="bg-zinc-900/40 border border-red-600/30 rounded-2xl p-5 sm:p-6 space-y-6" id="admin-exclusive-deals">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-600/10 rounded-lg text-red-500"><Tag className="w-5 h-5" /></div>
              <h2 className="text-xl font-bold text-white">Manage Exclusive Deals</h2>
            </div>
            <p className="text-sm text-zinc-400 mt-2">Add, edit, or delete special offers here. They appear in a separate customer section. Use Save Changes to publish all edits.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="exclusive-title" className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Customer section title (editable)</label>
            <input id="exclusive-title" type="text" maxLength={100} value={localExclusiveTitle} onChange={(e) => setLocalExclusiveTitle(e.target.value)} placeholder="Exclusive Deals or 14th August Special" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-600" />
            <p className="text-xs text-zinc-500">Example: 14th August Special. When there are no exclusive deals, the customer section stays hidden.</p>
          </div>

          <form onSubmit={handleAddExclusive} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <h3 className="text-white font-bold md:col-span-2">Add Exclusive Deal</h3>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">Item name *</label>
              <input required type="text" value={newExclusive.name} onChange={(e) => setNewExclusive({ ...newExclusive, name: e.target.value })} placeholder="14th August Family Deal" className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">Price (Rs) *</label>
              <input required type="number" min="1" step="any" value={newExclusive.price} onChange={(e) => setNewExclusive({ ...newExclusive, price: e.target.value })} className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-zinc-400">Description</label>
              <input type="text" value={newExclusive.description} onChange={(e) => setNewExclusive({ ...newExclusive, description: e.target.value })} placeholder="What does this deal include?" className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">Image URL</label>
              <input type="url" value={newExclusive.image} onChange={(e) => setNewExclusive({ ...newExclusive, image: e.target.value })} placeholder="https://..." className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">Upload image (same ImgBB uploader)</label>
              <input type="file" accept="image/*" disabled={uploadingExclusive} onChange={handleExclusiveImageUpload} className="block w-full text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg p-2" />
              {newExclusive.image && <p className="text-xs text-emerald-400">Image selected and ready.</p>}
            </div>
            <button disabled={uploadingExclusive} type="submit" className="md:col-span-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl px-5 py-3 flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Exclusive Deal to List</button>
          </form>

          <div className="space-y-4">
            <h3 className="font-bold text-white">Current Exclusive Deals ({localItems.filter((item) => isExclusiveDeal(item)).length})</h3>
            {localItems.filter((item) => isExclusiveDeal(item)).length === 0 && (
              <p className="text-zinc-400 text-sm bg-zinc-950 border border-zinc-800 rounded-lg p-4">No exclusive deals yet. Add your first offer above, then click Save Changes.</p>
            )}
            {localItems.filter((item) => isExclusiveDeal(item)).map((item) => (
              <div key={item.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col lg:flex-row gap-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover bg-zinc-900 shrink-0" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                  <label className="space-y-1 text-xs text-zinc-400">Name
                    <input type="text" value={item.name} onChange={(e) => handleNameChange(item.id, e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm" />
                  </label>
                  <label className="space-y-1 text-xs text-zinc-400">Price (Rs)
                    <input type="number" min="0" value={item.price} onChange={(e) => handlePriceChange(item.id, e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm" />
                  </label>
                  <label className="space-y-1 text-xs text-zinc-400 sm:col-span-2">Description
                    <input type="text" value={item.description} onChange={(e) => handleDescriptionChange(item.id, e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm" />
                  </label>
                  <label className="space-y-1 text-xs text-zinc-400">Image URL
                    <input type="text" value={item.image} onChange={(e) => handleImageChange(item.id, e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm" />
                  </label>
                  <label className="space-y-1 text-xs text-zinc-400">Replace Image
                    <input type="file" accept="image/*" onChange={(e) => handleItemImageUpload(item.id, e)} className="block w-full text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg p-1.5" />
                  </label>
                </div>
                <button type="button" onClick={() => handleDeleteItem(item.id)} title="Delete exclusive deal" aria-label={`Delete ${item.name}`} className="p-2.5 self-end lg:self-start bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Item Form with Image Upload */}
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
                <Tag className="w-3 h-3" /> Item Name *
              </label>
              <input type="text" placeholder="e.g., Special Garlic Mayo Roll" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-600 text-sm" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3" /> Category
              </label>
              <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-600 text-sm">
                {HOT_N_TASTY_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name.replace(/[^a-zA-Z ]/g, "").trim()}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Price (Rs) *
              </label>
              <input type="number" placeholder="e.g., 350" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-600 text-sm" required />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3 h-3" /> Description
              </label>
              <input type="text" placeholder="Brief description..." value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-600 text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Image className="w-3 h-3" /> Image URL
              </label>
              <input type="url" placeholder="https://..." value={newItem.image} onChange={(e) => setNewItem({ ...newItem, image: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-600 text-sm" />
            </div>
            {/* Image Upload Field for Add New Product Form */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Upload className="w-3 h-3" /> Upload Image
              </label>
              <input type="file" accept="image/*" onChange={handleNewItemImageUpload} className="block w-full text-sm text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-xl p-2" />
              {newItemImageUploaded && newItem.image && (
                <div className="flex items-center gap-2 mt-1 text-emerald-500 text-xs">
                  <Check className="w-3 h-3" />
                  <span>Image Uploaded Successfully</span>
                </div>
              )}
            </div>
            <div className="md:col-span-2 lg:col-span-3 pt-2">
              <button type="submit" className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Item to List
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="space-y-3 bg-zinc-950 p-4 border border-zinc-800 rounded-xl flex flex-col justify-between">
                <div>
                  <label className="text-sm font-bold text-zinc-300 block mb-1">Slide {idx + 1} Banner</label>
                  <img
                    src={localBanners[idx]}
                    alt={`Slide ${idx + 1}`}
                    className="w-full aspect-video object-cover rounded-lg border border-zinc-800 mb-3"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <input type="file" accept="image/*" onChange={(e) => handleBannerUpload(idx, e)} className="block w-full text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg p-1.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Current Menu Items</span>
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full font-semibold">{localItems.filter((item) => !isExclusiveDeal(item)).length} items</span>
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {localItems.filter((item) => !isExclusiveDeal(item)).map((item) => (
              <div key={item.id} className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:border-zinc-700 transition-colors">
                {/* Left: Item Info */}
                <div className="flex items-center gap-4 w-full lg:w-1/4 shrink-0">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-zinc-800 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-zinc-500 capitalize mt-0.5">{HOT_N_TASTY_CATEGORIES.find((c) => c.id === item.category)?.name.replace(/[^a-zA-Z ]/g, "").trim() || item.category}</p>
                    <p className="text-xs text-zinc-400 line-clamp-1 mt-1">{item.description}</p>
                  </div>
                </div>
                {/* Middle: Inputs for Editing Name, Price, Description, Image */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:flex-1">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Item Name</span>
                    <input type="text" value={item.name} onChange={(e) => handleNameChange(item.id, e.target.value)} className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-red-600" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Price (Rs)</span>
                    <input type="number" value={item.price} onChange={(e) => handlePriceChange(item.id, e.target.value)} className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-red-600" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Description</span>
                    <input type="text" value={item.description} onChange={(e) => handleDescriptionChange(item.id, e.target.value)} className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-red-600" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Image URL</span>
                    <input type="text" value={item.image} onChange={(e) => handleImageChange(item.id, e.target.value)} className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-red-600" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Upload New Image</span>
                    <input type="file" accept="image/*" onChange={(e) => handleItemImageUpload(item.id, e)} className="block w-full text-xs text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-lg p-1.5" />
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
          <span className="text-sm text-zinc-400">Click Save Changes to publish menu, exclusive deals, and title.</span>
          <button onClick={handleSaveChanges} disabled={isSaving} className="disabled:opacity-50 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
