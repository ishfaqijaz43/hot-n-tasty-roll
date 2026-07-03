import React, { useState, useMemo } from "react";
import {
  Flame,
  MapPin,
  Phone,
  Clock,
  Search,
  ShoppingBag,
  Plus,
  Utensils,
  Sparkles,
  Star,
  ChevronRight,
  Menu,
  X,
  Heart,
  ThumbsUp,
  ShieldCheck,
  Lock
} from "lucide-react";
import { menuItems, CATEGORIES, MenuItem } from "@/data/menu";
import { CartDrawer } from "@/components/CartDrawer";
import { LoginModal } from "@/components/LoginModal";
import { AdminDashboard } from "@/components/AdminDashboard";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { toast } from "sonner";

interface CartItem {
  item: MenuItem;
  quantity: number;
}

const Index = () => {
  // Dynamic Menu List State with LocalStorage persistence
  const [menuList, setMenuList] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem("chilli_try_fry_menu");
    return saved ? JSON.parse(saved) : menuItems;
  });

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Admin Panel States
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Filter menu items based on category and search query
  const filteredItems = useMemo(() => {
    return menuList.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuList, selectedCategory, searchQuery]);

  // Cart Handlers
  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        toast.success(`Increased quantity of ${item.name}`);
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success(`Added ${item.name} to cart!`);
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((i) => {
          if (i.item.id === itemId) {
            const newQty = i.quantity + delta;
            return { ...i, quantity: newQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0);
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.item.id === itemId);
      if (item) {
        toast.error(`Removed ${item.item.name} from cart`);
      }
      return prev.filter((i) => i.item.id !== itemId);
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  // Admin Handlers
  const handleSaveMenu = (updatedItems: MenuItem[]) => {
    setMenuList(updatedItems);
    localStorage.setItem("chilli_try_fry_menu", JSON.stringify(updatedItems));
    toast.success("Menu changes saved successfully!");
  };

  const handleLogout = () => {
    setIsAdminMode(false);
    toast.info("Logged out of Admin Panel.");
  };

  // If Admin Mode is active, render the Admin Dashboard instead of the customer view
  if (isAdminMode) {
    return (
      <AdminDashboard
        items={menuList}
        onSave={handleSaveMenu}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F11] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0F0F11]/90 backdrop-blur-md border-b border-zinc-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-red-600 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-amber-400 to-red-500 bg-clip-text text-transparent">
                CHILLI TRY FRY
              </span>
              <span className="block text-[10px] text-zinc-400 tracking-widest uppercase font-bold">
                Karachi Street Food
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("menu")}
              className="text-sm font-semibold text-zinc-300 hover:text-amber-500 transition-colors"
            >
              Our Menu
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-semibold text-zinc-300 hover:text-amber-500 transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection("location")}
              className="text-sm font-semibold text-zinc-300 hover:text-amber-500 transition-colors"
            >
              Location & Timings
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-white transition-all duration-200 hover:border-amber-500/50 group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-amber-500 transition-colors" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[11px] font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-[#0F0F11] animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0F0F11] border-b border-zinc-800 px-4 py-6 space-y-4 animate-in fade-in slide-in-from-top-5 duration-200">
            <button
              onClick={() => scrollToSection("menu")}
              className="block w-full text-left py-2 text-base font-semibold text-zinc-300 hover:text-amber-500 transition-colors"
            >
              Our Menu
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left py-2 text-base font-semibold text-zinc-300 hover:text-amber-500 transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection("location")}
              className="block w-full text-left py-2 text-base font-semibold text-zinc-300 hover:text-amber-500 transition-colors"
            >
              Location & Timings
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1920&q=80"
            alt="Sizzling street food cooking"
            className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[8000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-[#0F0F11]/80 to-transparent" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs sm:text-sm font-bold uppercase tracking-wider animate-bounce">
            <Flame className="w-4 h-4 text-red-500" />
            Kharadar's Legendary Taste
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight">
            Karachi's Ultimate <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Midnight Sizzle
            </span>
          </h1>

          <p className="text-zinc-300 text-base sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Experience the fiery, authentic street flavors of Kharadar. Sizzling BBQ, crispy broasts, loaded fries, and signature wraps crafted to satisfy your late-night cravings.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => scrollToSection("menu")}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Utensils className="w-5 h-5" />
              View Full Menu
            </button>
            <button
              onClick={() => scrollToSection("location")}
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5 text-amber-500" />
              Find Us in Kharadar
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12 border-t border-zinc-800/50">
            <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/40">
              <p className="text-2xl sm:text-3xl font-black text-amber-500">4.0 PM</p>
              <p className="text-xs text-zinc-400 mt-1">Opening Time</p>
            </div>
            <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/40">
              <p className="text-2xl sm:text-3xl font-black text-red-500">3:30 AM</p>
              <p className="text-xs text-zinc-400 mt-1">Weekend Closing</p>
            </div>
            <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/40">
              <p className="text-2xl sm:text-3xl font-black text-amber-500">100%</p>
              <p className="text-xs text-zinc-400 mt-1">Fresh & Halal</p>
            </div>
            <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/40">
              <p className="text-2xl sm:text-3xl font-black text-red-500">Fast</p>
              <p className="text-xs text-zinc-400 mt-1">WhatsApp Checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Menu Section */}
      <section id="menu" className="py-24 bg-[#0A0A0C] border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Freshly Prepared
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Explore Our Sizzling Menu
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              From spicy Arabic Shawarmas to loaded lava fries and premium burgers, we have something to satisfy every craving. Filter by category or search below.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for burgers, rolls, deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto pb-4 mb-12 gap-2.5 no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-600/20 scale-105"
                    : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/80"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Food Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/20 rounded-2xl border border-zinc-800/50">
              <p className="text-zinc-400 text-lg">No items found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-sm transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-zinc-900/40 rounded-2xl border border-zinc-800/60 overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col hover:scale-[1.02] hover:shadow-xl hover:shadow-black/40"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-3 right-3 px-3 py-1 bg-black/80 backdrop-blur-md border border-zinc-800 rounded-full text-xs font-bold text-amber-400">
                      {CATEGORIES.find((c) => c.id === item.category)?.name.replace(/[^a-zA-Z ]/g, "").trim() || item.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Price</span>
                        <span className="text-xl font-black text-white">
                          Rs {item.price}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-xs transition-all duration-200 flex items-center gap-1.5 active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-[#0F0F11] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Story */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 text-red-400 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                Our Legacy
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                The Story of <br />
                <span className="bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">
                  Chilli Try Fry
                </span>
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Nestled in the heart of Karachi's historic food hub, Kharadar, Chilli Try Fry has been serving up sizzling, spice-infused street food masterpieces. We believe in bold flavors, premium ingredients, and the magic of late-night street dining.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Our signature recipes are crafted with hand-picked local spices, fresh meats, and cooked to perfection on high-heat woks. Whether it's our legendary Arabic Shawarmas, crispy golden Golden Broasts, or loaded lava fries, every bite is a celebration of Karachi's vibrant culinary spirit.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 shrink-0">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Unmatched Taste</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Authentic local spices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-600/10 rounded-lg text-red-500 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Late Night</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Open till 3:30 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">100% Halal</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Fresh ingredients daily</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visual Collage */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden border border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=800&q=80"
                  alt="Sizzling paratha roll preparation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-1/2 aspect-video rounded-xl overflow-hidden border border-zinc-800 shadow-2xl hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
                  alt="Juicy burger"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-red-600 to-amber-500 p-6 rounded-2xl text-white shadow-xl hidden sm:block max-w-[200px]">
                <p className="text-3xl font-black">10k+</p>
                <p className="text-xs font-bold text-white/80 mt-1">Happy Karachi Foodies Served</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[#0A0A0C] border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-current" />
              Customer Reviews
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Loved by Karachiites
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Don't just take our word for it. Here is what our regular foodies from Kharadar and beyond have to say about Chilli Try Fry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-zinc-900/40 rounded-2xl border border-zinc-800/60 space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-zinc-300 text-sm italic leading-relaxed">
                "The Zinger Shawarma with Cheese is absolutely out of this world! The spices are perfectly balanced, and the garlic sauce is so rich. Best midnight spot in Kharadar!"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-amber-500">
                  AH
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Asad Hussain</h4>
                  <p className="text-xs text-zinc-500">Kharadar, Karachi</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-zinc-900/40 rounded-2xl border border-zinc-800/60 space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-zinc-300 text-sm italic leading-relaxed">
                "We ordered Deal 11 for our late-night gaming session. The loaded zinger burger and beef roll were incredibly juicy. Delivery was fast and the food arrived piping hot!"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-amber-500">
                  SF
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Sana Fatima</h4>
                  <p className="text-xs text-zinc-500">Clifton, Karachi</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-zinc-900/40 rounded-2xl border border-zinc-800/60 space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-zinc-300 text-sm italic leading-relaxed">
                "Lava Pizza Fries are a masterpiece. The cheese pull is insane and the spicy sauce has just the right kick. Highly recommend Chilli Try Fry to everyone!"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-amber-500">
                  ZK
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Zain Khan</h4>
                  <p className="text-xs text-zinc-500">DHA, Karachi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Timing Footer Section */}
      <section id="location" className="py-24 bg-[#0F0F11] border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Details */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  Visit Us
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white">
                  Where to Find Us
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base">
                  We are located in the legendary Kharadar food street, Karachi. Stop by for a sizzling hot meal straight from the wok!
                </p>
              </div>

              {/* Contact Info Cards */}
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/60">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Address</h4>
                    <p className="text-zinc-300 text-sm mt-1">
                      Paria St, near Star Medical, Kharadar Ghulam Hussain Kasim Quarters, Karachi
                    </p>
                    <span className="inline-block text-xs text-amber-500 font-semibold mt-1">
                      📍 Located in Kharadar food street
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/60">
                  <div className="p-3 bg-red-600/10 rounded-xl text-red-500 shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Operational Hours</h4>
                    <div className="text-zinc-300 text-sm mt-1 space-y-1">
                      <p className="flex justify-between gap-4">
                        <span>Monday – Thursday:</span>
                        <span className="font-semibold text-white">4:00 PM – 2:00 AM</span>
                      </p>
                      <p className="flex justify-between gap-4">
                        <span>Friday – Sunday:</span>
                        <span className="font-semibold text-amber-400">4:00 PM – 3:30 AM</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/60">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Phone / Contact</h4>
                    <p className="text-zinc-300 text-sm mt-1">
                      0331-2400434
                    </p>
                    <a
                      href="tel:03312400434"
                      className="inline-block text-xs text-emerald-500 font-semibold mt-1 hover:underline"
                    >
                      Call Now to Order
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Map Placeholder */}
            <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 flex flex-col items-center justify-center text-center p-8 space-y-4">
              {/* Decorative Map Background Pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 relative z-10">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="relative z-10 space-y-2">
                <h3 className="font-bold text-lg text-white">Kharadar Food Street</h3>
                <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                  Paria St, near Star Medical, Kharadar Ghulam Hussain Kasim Quarters, Karachi
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Paria+St,+near+Star+Medical,+Kharadar+Ghulam+Hussain+Kasim+Quarters,+Karachi"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl text-sm transition-colors border border-zinc-700 flex items-center gap-2"
              >
                Open in Google Maps
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0C] border-t border-zinc-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-amber-500 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-wider bg-gradient-to-r from-white via-amber-400 to-red-500 bg-clip-text text-transparent">
              CHILLI TRY FRY
            </span>
          </div>
          <p className="text-zinc-500 text-xs sm:text-sm max-w-md mx-auto">
            Karachi's premium street-food destination. Sizzling hot, freshly prepared, and delivered straight to your doorstep.
          </p>
          
          {/* Staff Login Link */}
          <div className="pt-2">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-amber-500 transition-colors font-semibold"
            >
              <Lock className="w-3 h-3" />
              Staff Login
            </button>
          </div>

          <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600 text-xs">
            <p>© {new Date().getFullYear()} Chilli Try Fry. All rights reserved.</p>
            <p>Designed for Karachi's ultimate food lovers.</p>
          </div>
          <MadeWithDyad />
        </div>
      </footer>

      {/* Minimalist Bottom Footer */}
      <div className="bg-[#08080A] border-t border-zinc-900/60 py-4 text-center">
        <p className="text-[11px] text-zinc-500 tracking-wide font-medium">
          © 2026 Chilli Try Fry. All Rights Reserved. | Developed by ByteCraft Solutions
        </p>
      </div>

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Staff Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsAdminMode(true)}
      />
    </div>
  );
};

export default Index;