import React, { useState, useMemo, useRef, useEffect } from "react";
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
  ThumbsUp,
  ShieldCheck,
  Lock,
  Wifi,
  Smile,
  Coffee,
  ArrowRight
} from "lucide-react";
import { defaultHotNTastyMenuItems, HOT_N_TASTY_CATEGORIES, MenuItem } from "@/data/hotNTastyMenu";
import { HotNTastyCartDrawer } from "@/components/HotNTastyCartDrawer";
import { LoginModal } from "@/components/LoginModal";
import { HotNTastyAdminDashboard } from "@/components/HotNTastyAdminDashboard";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { toast } from "sonner";
import Carousel from "@/components/Carousel";
import SliderControls from "@/components/SliderControls";

interface CartItem {
  item: MenuItem;
  quantity: number;
}

const Index = () => {
  // Dynamic Menu List State with LocalStorage persistence
  const [menuList, setMenuList] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem("hot_n_tasty_menu");
    return saved ? JSON.parse(saved) : defaultHotNTastyMenuItems;
  });

  // Banner images state - will be updated by admin dashboard
  const [bannerImages, setBannerImages] = useState([
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);

  // Search Autocomplete States
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Admin Panel States
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Calculate total cart value
  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, cartItem) => sum + cartItem.item.price * cartItem.quantity, 0);
  }, [cartItems]);

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

  // Autocomplete suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return menuList
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [menuList, searchQuery]);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cart Handlers
  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    setShowCartNotification(true);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) => {
      const updated = prev
        .map((i) => {
          if (i.item.id === itemId) {
            const newQty = i.quantity + delta;
            return { ...i, quantity: newQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0);
      
      if (updated.length === 0) {
        setShowCartNotification(false);
      }
      return updated;
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => i.item.id !== itemId);
      if (updated.length === 0) {
        setShowCartNotification(false);
      }
      return updated;
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    setShowCartNotification(false);
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
    localStorage.setItem("hot_n_tasty_menu", JSON.stringify(updatedItems));
    toast.success("Menu changes saved successfully!");
  };

  const handleLogout = () => {
    setIsAdminMode(false);
    toast.info("Logged out of Admin Panel.");
  };

  // Admin Dashboard Banner Handler - FIXED to prevent state overwrite
  const handleAdminBannersChange = (newBanners: string[]) => {
    // Prevent immediate re-fetch or revert by using functional update
    setBannerImages((prev) => {
      // Only update if the new banners are actually different
      if (JSON.stringify(prev) !== JSON.stringify(newBanners)) {
        return newBanners;
      }
      return prev;
    });
  };

  // If Admin Mode is active, render the Admin Dashboard instead of the customer view
  if (isAdminMode) {
    return (
      <HotNTastyAdminDashboard
        items={menuList}
        onSave={handleSaveMenu}
        onLogout={handleLogout}
        onBannersChange={handleAdminBannersChange}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-red-600 selection:text-white">
      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-red-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-black tracking-wider bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                HOT N TASTY ROLL
              </span>
              <span className="block text-[10px] text-gray-500 tracking-widest uppercase font-bold">
                Gulistan-e-Johar, Karachi
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 shrink-0">
            <button
              onClick={() => scrollToSection("menu")}
              className="text-sm font-bold text-zinc-700 hover:text-red-600 transition-colors"
            >
              Our Menu
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-bold text-zinc-700 hover:text-red-600 transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection("location")}
              className="text-sm font-bold text-zinc-700 hover:text-red-600 transition-colors"
            >
              Location & Timings
            </button>
          </nav>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-3 flex-1 justify-end max-w-md">
            {/* Relocated Search Bar with Autocomplete */}
            <div ref={searchContainerRef} className="relative w-full max-w-[240px] sm:max-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-9 pr-8 py-2 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-xs sm:text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 text-xs font-bold"
                >
                  ✕
                </button>
              )}

              {/* Autocomplete Suggestions Dropdown */}
              {isSearchFocused && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-64 overflow-y-auto">
                  {searchSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onMouseDown={() => {
                        setSearchQuery(suggestion.name);
                        setIsSearchFocused(false);
                        scrollToSection("menu");
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-zinc-50 text-xs sm:text-sm text-zinc-800 font-bold transition-colors border-b border-zinc-100 last:border-0 block"
                    >
                      <span className="break-words block leading-tight">
                        {suggestion.name} - Rs. {suggestion.price}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-xl text-zinc-800 transition-all duration-200 hover:border-red-500/50 group shrink-0"
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-red-600 transition-colors" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-md">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-xl text-zinc-800 transition-colors shrink-0"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-zinc-200 px-4 py-6 space-y-4 animate-in fade-in slide-in-from-top-5 duration-200">
            <button
              onClick={() => scrollToSection("menu")}
              className="block w-full text-left py-2 text-base font-bold text-zinc-700 hover:text-red-600 transition-colors"
            >
              Our Menu
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left py-2 text-base font-bold text-zinc-700 hover:text-red-600 transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection("location")}
              className="block w-full text-left py-2 text-base font-bold text-zinc-700 hover:text-red-600 transition-colors"
            >
              Location & Timings
            </button>
          </div>
        )}
      </header>

      {/* Hero Section with Carousel */}
      <section id="hero" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-16 bg-white">
        {/* Carousel */}
        <Carousel
          images={bannerImages}
          autoPlay={true}
          interval={5000}
          className="absolute inset-0 z-0"
        />
        <SliderControls
          currentSlide={currentSlide}
          totalSlides={bannerImages.length}
          onChange={setCurrentSlide}
        />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center space-y-8">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-zinc-900 leading-tight">
            Hot n Tasty Roll <br />
            <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-800 bg-clip-text text-transparent">
              "Bringing Out The Best !!!"
            </span>
          </h1>

          <p className="text-zinc-600 text-base sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Experience the ultimate taste of Gulistan-e-Johar. Sizzling hot paratha rolls, crispy zingers, juicy burgers, and premium BBQ plates crafted to perfection.
          </p>

          {/* Category Navigation */}
          <div className="pt-8 max-w-5xl mx-auto">
            <div className="text-center mb-4">
              <span className="text-xs font-black text-red-600 uppercase tracking-widest">Select a Category to Browse</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {HOT_N_TASTY_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    scrollToSection("menu");
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-sm border ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-red-600 scale-105"
                      : "bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => scrollToSection("menu")}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Utensils className="w-5 h-5" />
              Order Now
            </button>
            <button
              onClick={() => scrollToSection("location")}
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5 text-red-600" />
              Find Us in Johar
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Menu Section */}
      <section id="menu" className="py-24 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider border border-red-100">
              <Sparkles className="w-3.5 h-3.5" />
              Freshly Prepared
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900">
              Explore Our Sizzling Menu
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base">
              From spicy Chicken Rolls to loaded burgers and premium BBQ plates, we have something to satisfy every craving. Filter by category or search above.
            </p>
          </div>

          {/* Food Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200 shadow-sm">
              <p className="text-zinc-500 text-lg">No items found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-red-500/50 transition-all duration-300 flex flex-col hover:scale-[1.02] hover:shadow-xl shadow-sm"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md border border-zinc-200 rounded-full text-xs font-bold text-red-600 shadow-sm">
                      {HOT_N_TASTY_CATEGORIES.find((c) => c.id === item.category)?.name.replace(/[^a-zA-Z ]/g, "").trim() || item.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-zinc-900 group-hover:text-red-600 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-zinc-600 text-sm line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Price</span>
                        <span className="text-xl font-black text-red-600">
                          Rs {item.price}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
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
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-50 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Story */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider border border-red-100">
                <Flame className="w-3.5 h-3.5" />
                Our Legacy
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 leading-tight">
                The Story of <br />
                <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Hot n Tasty Roll
                </span>
              </h2>
              <p className="text-zinc-700 leading-relaxed">
                Located in the bustling heart of Gulistan-e-Johar, Hot n Tasty Roll has been serving up sizzling, spice-infused street food masterpieces. We believe in bold flavors, premium ingredients, and the magic of late-night street dining.
              </p>
              <p className="text-zinc-600 leading-relaxed">
                Our signature recipes are crafted with hand-picked local spices, fresh meats, and cooked to perfection on high-heat woks. Whether it's our legendary Chicken Chatni Rolls, crispy golden Broasts, or loaded burgers, every bite is a celebration of Karachi's vibrant culinary spirit.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-50 rounded-lg text-red-600 shrink-0 border border-red-100">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">Unmatched Taste</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Authentic local spices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-50 rounded-lg text-red-600 shrink-0 border border-red-100">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">Late Night</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Open till 3:30 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 shrink-0 border border-emerald-100">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">100% Halal</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Fresh ingredients daily</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visual Collage */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden border border-zinc-200 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=800&q=80"
                  alt="Sizzling paratha roll preparation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-1/2 aspect-video rounded-xl overflow-hidden border border-zinc-200 shadow-2xl hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
                  alt="Juicy burger"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-red-600 to-red-500 p-6 rounded-2xl text-white shadow-xl hidden sm:block max-w-[200px]">
                <p className="text-3xl font-black">1,032+</p>
                <p className="text-xs font-bold text-white/80 mt-1">Happy Google Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider border border-red-100">
              <Star className="w-3.5 h-3.5 fill-current" />
              Customer Reviews
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900">
              Loved by Karachiites
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base">
              Don't just take our word for it. Here is what our regular foodies from Gulistan-e-Johar and beyond have to say about Hot n Tasty Roll.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-red-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-zinc-700 text-sm italic leading-relaxed">
                "The Chicken Garlic Mayo Roll is absolutely out of this world! The paratha is so crispy and the garlic mayo is incredibly rich. Best midnight spot in Johar!"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center font-bold text-red-600 border border-red-100">
                  AH
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Asad Hussain</h4>
                  <p className="text-xs text-zinc-500">Gulistan-e-Johar, Karachi</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-red-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-zinc-700 text-sm italic leading-relaxed">
                "We ordered Festival Deal 1 for our late-night gaming session. The rolls were incredibly juicy and flavorful. Delivery was fast and the food arrived piping hot!"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center font-bold text-red-600 border border-red-100">
                  SF
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Sana Fatima</h4>
                  <p className="text-xs text-zinc-500">Block 13, Karachi</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-red-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-zinc-700 text-sm italic leading-relaxed">
                "The Chicken Malai Boti Roll is a masterpiece. The meat is so tender it melts in your mouth. Highly recommend Hot n Tasty Roll to everyone!"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center font-bold text-red-600 border border-red-100">
                  ZK
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Zain Khan</h4>
                  <p className="text-xs text-zinc-500">Block 17, Karachi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Timing Footer Section */}
      <section id="location" className="py-24 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Details */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider border border-red-100">
                  <MapPin className="w-3.5 h-3.5" />
                  Visit Us
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-zinc-900">
                  Where to Find Us
                </h2>
                <p className="text-zinc-600 text-sm sm:text-base">
                  We are located in the legendary Noman Grand City, Block 17, Gulistan-e-Johar, Karachi. Stop by for a sizzling hot meal straight from the wok!
                </p>
              </div>

              {/* Contact Info Cards */}
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200 shadow-sm">
                  <div className="p-3 bg-red-50 rounded-xl text-red-600 shrink-0 border border-red-100">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">Address</h4>
                    <p className="text-zinc-700 text-sm mt-1">
                      Noman Grand City, Block 17, Gulistan-e-Johar, Karachi
                    </p>
                    <span className="inline-block text-xs text-red-600 font-semibold mt-1">
                      📍 Located in Gulistan-e-Johar
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200 shadow-sm">
                  <div className="p-3 bg-red-50 rounded-xl text-red-600 shrink-0 border border-red-100">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">Operational Hours</h4>
                    <div className="text-zinc-700 text-sm mt-1 space-y-1">
                      <p className="flex justify-between gap-4">
                        <span>Open Daily:</span>
                        <span className="font-semibold text-zinc-900">4:00 PM – 3:30 AM</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200 shadow-sm">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0 border border-emerald-100">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">Phone / Contact</h4>
                    <p className="text-zinc-700 text-sm mt-1">
                      +92 300 3919005 <br />
                      03332229876
                    </p>
                    <div className="flex gap-3 mt-1">
                      <a
                        href="tel:+923003919005"
                        className="text-xs text-emerald-600 font-semibold hover:underline"
                      >
                        Call +92 300 3919005
                      </a>
                      <span className="text-zinc-300">|</span>
                      <a
                        href="tel:03332229876"
                        className="text-xs text-emerald-600 font-semibold hover:underline"
                      >
                        Call 03332229876
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Map Placeholder */}
            <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center text-center p-8 space-y-4 shadow-sm">
              {/* Decorative Map Background Pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 relative z-10 border border-red-100">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="relative z-10 space-y-2">
                <h3 className="font-bold text-lg text-zinc-900">Noman Grand City</h3>
                <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                  Block 17, Gulistan-e-Johar, Karachi
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Noman+Grand+City,+Block+17,+Gulistan-e-Johar,+Karachi"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 px-6 py-2.5 bg-white hover:bg-zinc-100 text-zinc-800 font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-sm"
              >
                Open in Google Maps
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-500 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-wider bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              HOT N TASTY ROLL
            </span>
          </div>
          <p className="text-zinc-500 text-xs sm:text-sm max-w-md mx-auto">
            Gulistan-e-Johar's premium street-food destination. Sizzling hot, freshly prepared, and delivered straight to your doorstep.
          </p>
          
          {/* Staff Login Link */}
          <div className="pt-2">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-600 transition-colors font-semibold"
            >
              <Lock className="w-3 h-3" />
              Staff Login
            </button>
          </div>

          <div className="border-t border-zinc-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-xs">
            <p>© 2026 Hot n Tasty Roll. All Rights Reserved. | Developed by ByteCraft Solutions</p>
            <p>Designed for Karachi's ultimate food lovers.</p>
          </div>
          <MadeWithDyad />
        </div>
      </footer>

      {/* Shopping Cart Drawer */}
      <HotNTastyCartDrawer
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

      {/* Smooth Animated Slide-up Cart Notification Bar - Shows Cumulative Total */}
      {showCartNotification && cartItems.length > 0 && !isCartOpen && (
        <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[320px] bg-zinc-900 text-white p-4 rounded-2xl shadow-2xl border border-zinc-800 z-40 animate-in slide-in-from-bottom-10 duration-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center text-red-500 shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-white">
                Cart Total Updated - Rs. {cartTotal}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end w-auto shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-red-600/20"
            >
              Checkout
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;