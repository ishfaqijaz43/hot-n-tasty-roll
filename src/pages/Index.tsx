import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Flame,
  MapPin,
  Phone,
  Clock,
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Utensils,
  Sparkles,
  Star,
  ChevronRight,
  Menu,
  X,
  ThumbsUp,
  ShieldCheck,
  Lock,
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

  // Banner images state - updated by admin dashboard and persisted correctly
  const [bannerImages, setBannerImages] = useState<string[]>(() => {
    const saved = localStorage.getItem("hot_n_tasty_banners");
    return saved ? JSON.parse(saved) : [
      "/WhatsApp Image 2026-07-06 at 8.30.20 PM.jpeg",
      "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
    ];
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);
  
  // Track failed logo image so we fallback gracefully
  const [logoHasError, setLogoHasError] = useState(false);

  // Search Autocomplete States
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Admin Panel States
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // AutoPlay logic for Controlled Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerImages]);

  // Synchronize localStorage in case the first slot is filled with the older default Unsplash photo
  useEffect(() => {
    setBannerImages((prev) => {
      if (prev[0]?.includes("photo-1555939594-58d7cb561ad1")) {
        const updated = [...prev];
        updated[0] = "/WhatsApp Image 2026-07-06 at 8.30.20 PM.jpeg";
        localStorage.setItem("hot_n_tasty_banners", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  }, []);

  // Calculate total cart value
  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, cartItem) => sum + cartItem.item.price * cartItem.quantity, 0);
  }, [cartItems]);

  // Filter menu items based on category and search query
  const filteredItems = useMemo(() => {
    return menuList.filter((item) => {
      const matchesCategory =
        selectedCategory.toLowerCase() === "all" || 
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      
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
    toast.success(`Added ${item.name} to cart!`);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) => {
      const updated = prev
        .map((i) => {
          if (i.item.id === itemId) {
            const newQty = i.quantity + delta;
            return { ...i, quantity: i.quantity + 1 };
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

  const handleAdminBannersChange = (newBanners: string[]) => {
    setBannerImages(newBanners);
    localStorage.setItem("hot_n_tasty_banners", JSON.stringify(newBanners));
  };

  const getItemQuantityInCart = (itemId: string) => {
    const found = cartItems.find((i) => i.item.id === itemId);
    return found ? found.quantity : 0;
  };

  if (isAdminMode) {
    return (
      <HotNTastyAdminDashboard
        items={menuList}
        banners={bannerImages}
        onSave={handleSaveMenu}
        onLogout={handleLogout}
        onBannersChange={handleAdminBannersChange}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-red-600 selection:text-white">
      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex flex-row justify-between items-center flex-nowrap gap-4">
          {/* Logo Container - Proportionally Scaled on Mobile */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-red-600 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden shadow-md sm:shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform">
              {!logoHasError ? (
                <img 
                  src="/logo.jpg" 
                  alt="Hot N Tasty Roll BBQ Gulistan-e-johar" 
                  className="w-full h-full object-cover"
                  onError={() => setLogoHasError(true)}
                />
              ) : (
                <Flame className="w-5 h-5 sm:w-7 sm:h-7 text-white animate-pulse" />
              )}
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm sm:text-lg font-black tracking-tight text-zinc-900 group-hover:text-red-600 transition-colors leading-none">
                HOT N <span className="text-red-600">TASTY</span>
              </span>
              <span className="text-[8px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5 sm:mt-1">
                Roll BBQ Johar
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 shrink-0">
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

          {/* Symmetrical Utility Icon Controls: Clean, matching, horizontal row with gap */}
          <div className="flex items-center gap-2 sm:gap-3 justify-end shrink-0">
            {/* Search Trigger Button & sliding overlay */}
            <div ref={searchContainerRef} className="relative flex items-center">
              <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="w-10 h-10 sm:w-11 sm:h-11 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-xl text-zinc-800 transition-all duration-200 hover:border-red-500/50 flex items-center justify-center shrink-0"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700 hover:text-red-600 transition-colors" />
              </button>
              
              {/* Sliding Input Box - Width restricted cleanly on tiny displays */}
              <div className={`absolute right-full mr-2 transition-all duration-300 transform origin-right ${
                isSearchExpanded ? "w-28 xs:w-36 sm:w-64 scale-100 opacity-100" : "w-0 scale-95 opacity-0 pointer-events-none"
              }`}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full pl-3 pr-8 py-2 bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-xs sm:text-sm shadow-xl"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Autocomplete Suggestions Dropdown */}
              {isSearchFocused && searchSuggestions.length > 0 && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 w-60 sm:w-64 max-h-64 overflow-y-auto">
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

            {/* Cart Button - Perfectly styled matching Search */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 sm:w-11 sm:h-11 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-xl text-zinc-800 transition-all duration-200 hover:border-red-500/50 group shrink-0 flex items-center justify-center"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-red-600 transition-colors" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-red-500 text-white text-[9px] sm:text-[10px] font-black w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border border-white animate-bounce shadow-md">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle - Perfectly styled matching Search & Cart */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-xl text-zinc-800 transition-colors shrink-0 flex items-center justify-center"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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

      {/* Hero Section with Responsive Carousel Heights & Perfect Image Filling */}
      <section id="hero" className="relative w-full aspect-video sm:aspect-none h-auto sm:h-[550px] lg:h-[650px] flex items-center justify-center overflow-hidden bg-zinc-950">
        {/* Carousel */}
        <Carousel
          images={bannerImages}
          currentSlide={currentSlide}
          className="absolute inset-0 w-full h-full z-0"
        />
        <SliderControls
          currentSlide={currentSlide}
          totalSlides={bannerImages.length}
          onChange={setCurrentSlide}
        />
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
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight">
              Explore Our Sizzling Menu
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base">
              From spicy Chicken Rolls to loaded burgers, chinese specialties, and premium BBQ plates, we have something to satisfy every craving. Filter by category or search above.
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
            {HOT_N_TASTY_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-sm border ${
                  selectedCategory.toLowerCase() === category.id.toLowerCase()
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-red-600 scale-105 shadow-md shadow-red-600/20"
                    : "bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Food Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 p-8 max-w-md mx-auto">
              <Utensils className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-zinc-800">No items found</h3>
              <p className="text-zinc-500 text-xs sm:text-sm mt-1">
                We couldn't find any menu items in this category matching your search. Please check another tab or search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredItems.map((item) => {
                const qtyInCart = getItemQuantityInCart(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:border-red-500/30"
                  >
                    {/* Item Image */}
                    <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black text-red-600 shadow-sm border border-zinc-200/50">
                        Rs. {item.price}
                      </div>
                      <span className="absolute bottom-3 left-3 bg-zinc-900/85 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-md">
                        {HOT_N_TASTY_CATEGORIES.find((c) => c.id === item.category)?.name.replace(/[^a-zA-Z ]/g, "").trim() || item.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-zinc-900 text-base sm:text-lg group-hover:text-red-600 transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-zinc-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Buy Widget */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 mt-auto">
                        <span className="text-red-600 font-black text-lg">
                          Rs. {item.price}
                        </span>

                        {qtyInCart > 0 ? (
                          <div className="flex items-center bg-red-600 text-white rounded-xl p-1 shadow-md shadow-red-600/10">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              className="p-1.5 hover:bg-red-700 rounded-lg transition-colors text-white"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-black text-white">
                              {qtyInCart}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              className="p-1.5 hover:bg-red-700 rounded-lg transition-colors text-white"
                              title="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="px-4 py-2 bg-zinc-900 hover:bg-red-600 text-white font-black text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm hover:shadow-lg active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-50 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider border border-red-100">
              <Flame className="w-3.5 h-3.5" />
              Our Legacy
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 leading-tight">
              The Story of <br />
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Hot N Tasty Roll BBQ
              </span>
            </h2>
            <p className="text-zinc-700 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
              Located in the bustling heart of Gulistan-e-Johar, Hot N Tasty Roll BBQ has been serving up sizzling, spice-infused street food masterpieces. We believe in bold flavors, premium ingredients, and the magic of late-night street dining.
            </p>
            <p className="text-zinc-600 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
              Our signature recipes are crafted with hand-picked local spices, fresh meats, and cooked to perfection on high-heat woks. Whether it's our legendary Chicken Chatni Rolls, crispy golden Broasts, or loaded burgers, every bite is a celebration of Karachi's vibrant culinary spirit.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 max-w-2xl mx-auto">
              <div className="flex flex-col items-center p-4 bg-zinc-50 border border-zinc-100 rounded-xl">
                <div className="p-2.5 bg-red-50 rounded-lg text-red-600 border border-red-100 mb-2">
                  <ThumbsUp className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-zinc-900 text-sm">Unmatched Taste</h4>
                <p className="text-xs text-zinc-500 mt-1">Authentic local spices</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-zinc-50 border border-zinc-100 rounded-xl">
                <div className="p-2.5 bg-red-50 rounded-lg text-red-600 border border-red-100 mb-2">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-zinc-900 text-sm">Late Night</h4>
                <p className="text-xs text-zinc-500 mt-1">Open till 5:00 AM</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-zinc-50 border border-zinc-100 rounded-xl">
                <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100 mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-zinc-900 text-sm">100% Halal</h4>
                <p className="text-xs text-zinc-500 mt-1">Fresh ingredients daily</p>
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
              Don't just take our word for it. Here is what our regular foodies from Gulistan-e-Johar and beyond have to say about Hot N Tasty Roll BBQ.
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
                "The Chicken Malai Boti Roll is a masterpiece. The meat is so tender it melts in your mouth. Highly recommend Hot N Tasty Roll BBQ to everyone!"
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
                        <span>Opening:</span>
                        <span className="font-semibold text-zinc-900">4:00 PM</span>
                      </p>
                      <p className="flex justify-between gap-4">
                        <span>Closing:</span>
                        <span className="font-semibold text-zinc-900">5:00 AM (Daily, PKT)</span>
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
            
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-zinc-900">
                HOT N <span className="text-red-600">TASTY</span>
              </span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                Roll BBQ Johar
              </span>
            </div>
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
            <p>© 2026 Hot N Tasty Roll BBQ Gulistan-e-johar. All Rights Reserved. | Developed by ByteCraft Solutions</p>
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

      {/* Smooth Animated Slide-up Cart Notification Bar */}
      {showCartNotification && cartItems.length > 0 && !isCartOpen && (
        <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[320px] bg-zinc-900 text-white p-4 rounded-2xl shadow-2xl border border-zinc-800 z-40 animate-in slide-in-from-bottom-10 duration-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center text-red-500 shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-white">
                Cart Total - Rs. {cartTotal}
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