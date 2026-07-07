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
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
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
                Hot N Tasty Roll BBQ Gulistan-e-johar
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
          <div className="flex items-center gap-3 flex-1 justify-end">
            {/* Expanding Search Bar */}
            <div ref={searchContainerRef} className="relative flex items-center">
              <Search className="absolute left-3 text-zinc-400 w-4 h-4 cursor-pointer z-10" 
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  if (!searchQuery) setIsSearchExpanded(false);
                }}
                className={`pl-10 pr-4 py-2 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200 ${
                  isSearchExpanded ? "w-56 sm:w-64 opacity-100" : "w-0 opacity-0 pointer-events-none"
                }`}
              />
              {searchQuery && isSearchExpanded && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchExpanded(false);
                  }}
                  className="absolute right-3 text-zinc-400 hover:text-zinc-900 text-xs font-bold"
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
                        setIsSearchExpanded(false);
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
            Hot N Tasty Roll BBQ Gulistan-e-johar <br />
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
                  Hot N Tasty Roll BBQ
                </span>
              </h2>
              <p className="text-zinc-700 leading-relaxed">
                Located in the bustling heart of Gulistan-e-Johar, Hot N Tasty Roll BBQ has been serving up sizzling, spice-infused street food masterpieces. We believe in bold flavors, premium ingredients, and the magic of late-night street dining.
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
              Hot N Tasty Roll BBQ Gulistan-e-johar
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

<dyad-write path="src/pages/Index.tsx" description="Fixing syntax error - adding missing closing div tag">
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
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
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
                Hot N Tasty Roll BBQ Gulistan-e-johar
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
          <div className="flex items-center gap-3 flex-1 justify-end">
            {/* Expanding Search Bar */}
            <div ref={searchContainerRef} className="relative flex items-center">
              <Search className="absolute left-3 text-zinc-400 w-4 h-4 cursor-pointer z-10" 
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  if (!searchQuery) setIsSearchExpanded(false);
                }}
                className={`pl-10 pr-4 py-2 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200 ${
                  isSearchExpanded ? "w-56 sm:w-64 opacity-100" : "w-0 opacity-0 pointer-events-none"
                }`}
              />
              {searchQuery && isSearchExpanded && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchExpanded(false);
                  }}
                  className="absolute right-3 text-zinc-400 hover:text-zinc-900 text-xs font-bold"
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
                        setIsSearchExpanded(false);
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
            Hot N Tasty Roll BBQ Gulistan-e-johar <br />
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
                  Hot N Tasty Roll BBQ
                </span>
              </h2>
              <p className="text-zinc-700 leading-relaxed">
                Located in the bustling heart of Gulistan-e-Johar, Hot N Tasty Roll BBQ has been serving up sizzling, spice-infused street food masterpieces. We believe in bold flavors, premium ingredients, and the magic of late-night street dining.
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
              Hot N Tasty Roll BBQ Gulistan-e-johar
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
<dyad-problem-report summary="1 problems">
<problem file="src/pages/Index.tsx" line="483" column="15" code="1005">')' expected.</problem>
</dyad-problem-report><think>We are getting a TypeScript error at line 483: "Expected ')'. (TS1005)"
 The error is in the line: `</div>              })) // <-- TypeScript compiler error here`

 Looking at the context, it seems we have a JSX expression inside a map that is not properly closed.

 Specifically, the code in question is:

   {filteredItems.map((item) => (
     <div ...>
       ... 
     </div>
   ))}

 The error is likely because we have an extra closing parenthesis or a missing one.

 Let's break down the structure:

   {filteredItems.map((item) => (
     ... 
   ))}

 This is actually correct: the map function returns an array of JSX elements, and we are wrapping the arrow function body in parentheses.

 However, note that the error says: expected ')'. This might be because we have an extra closing parenthesis or we are missing one.

 Looking at the code around line 483:

   480 |                     </div>
   481 |                   </div>
   482 |                 </div>
   483 |               }))

 We see that at line 483 we have two closing parentheses: `}))`

 The structure should be:

   {filteredItems.map((item) => (
     ... 
   ))}

 So the closing of the map function should be two closing parentheses: one for the arrow function and one for the map call.

 But note: the arrow function body is wrapped in parentheses, so we have:

   (item) => ( ... )

 Then the map call is: .map( ... )

 So the entire expression is:

   {filteredItems.map((item) => ( ... ))}

 Therefore, we have two closing parentheses at the end: the first one closes the arrow function's body (which was opened by the parenthesis after the arrow) and the second one closes the map call.

 However, in the code we see at line 483: `}))` which is two closing parentheses and then a closing curly brace for the JSX.

 But wait, the error is at the first closing parenthesis of the two? Actually, the error says at line 483, column 15.

 Let me look at the exact line 483 in the provided code snippet:

   483 |               }))

 Actually, the code we have in the file might be:

   ... 
                 </div>
               }))
             </div>

 But note: the error says: expected ')'. So it seems that the parser was expecting a closing parenthesis but found something else.

 Another possibility: we have an extra closing parenthesis.

 Let me check the structure of the JSX inside the map:

   <div
     key={item.id}
     className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-red-500/50 transition-all duration-300 flex flex-col hover:scale-[1.02] hover:shadow-xl shadow-sm"
   >
     {/* Image Container */}
     <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
       ... 
     </div>

     {/* Content */}
     <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
       ... 
     </div>
   </div>

 This seems correct.

 However, note that the error is at the line with `}))` and the column 15 (which is the first character of that line?).

 Actually, the error message says:

   483 |               }))
        ^^^

 So it's pointing at the first closing parenthesis.

 What if we have an extra closing parenthesis? Let's count:

   We have: 
     {filteredItems.map((item) => ( ... ))}

   Inside the map, we have an arrow function that returns a JSX element. We wrapped the JSX in parentheses to allow multiline.

   So the structure is:

     .map( (item) => ( <div> ... </div> ) )

   Therefore, we have two closing parentheses at the end: one for the arrow function's argument list (which is empty in this case? Actually, the arrow function has one parameter) and one for the map call.

   But note: the arrow function does not have parentheses around the single parameter? Actually, we can write it as:

     (item) => { ... }   // without parentheses around the body if it's a block, but we are using parentheses for the body to return JSX.

   However, when returning JSX, we must wrap it in parentheses if we want to spread it over multiple lines.

   So the correct syntax is:

     .map(item => ( <div> ... </div> ))

   But note: we can also write without the parentheses around the parameter if it's a single parameter:

     .map(item => ( <div> ... </div> ))

   However, in our code we have:

     .map((item) => ( ... ))

   This is also valid.

   Now, the problem might be that we have an extra closing parenthesis.

   Let me look at the exact code around the error:

     480 |                     </div>
     481 |                   </div>
     482 |                 </div>
     483 |               }))

   We see that at line 482 we have a closing div tag (with 12 spaces of indentation?).

   Then at line 483 we have: `               }))`

   This suggests that we are closing two things: the arrow function's body and the map call.

   But note: the arrow function body is wrapped in parentheses, so we have:

     (item) => ( ... )

   Then the map call is: .map( ... )

   So the entire expression is:

     {filteredItems.map((item) => ( ... ))}

   Therefore, we expect two closing parentheses at the end.

   However, the error says we are missing a closing parenthesis? Or we have an extra?

   The error says: expected ')'. This usually means that we have an extra token where a closing parenthesis was expected.

   Another possibility: we have a missing closing parenthesis inside the JSX.

   Let me check the JSX inside the map for unclosed tags.

   We have:

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

   This looks correctly closed.

   However, note that the inner div for the image container has a self-closing img and a div and a span, all closed.

   The content div is closed.

   The outer div is closed.

   So the JSX inside the map is valid.

   Another possibility: we have an extra closing parenthesis after the map.

   Let me look at the lines after the map:

     483 |               }))
     484 |             </div>
     485 |           )}
     486 |         </div>

   We see that at line 484 we have `</div>` which is closing a div that was opened earlier.

   The structure of the food grid is:

     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
       {filteredItems.map(...)}
     </div>

   So the map is inside a div.

   Therefore, the code should be:

     <div className="grid ... ">
       {filteredItems.map((item) => ( ... ))}
     </div>

   But note: we have:

     480 |                     </div>
     481 |                   </div>
     482 |                 </div>
     483 |               }))
     484 |             </div>

   This suggests that we have three closing divs at lines 480, 481, 482 and then at 483 we have `}))` and then at 484 we have `</div>`.

   Let me try to reconstruct the indentation:

     ... 
                 </div>   // line 480: this is the inner div of the item? 
               }}</div>   // but wait, the code we have is:

     Actually, the code we are given in the error snippet is:

        480 |                     </div>
        481 |                   </div>
        482 |                 </div>
        483 |               }))
        484 |             </div>

   This doesn't look aligned. Let me assume the intended structure:

     We have an outer div (the grid) and inside we map over items.

     For each item, we have a div (the item container).

     Inside the item container, we have two divs: one for the image and one for the content.

     So the structure for one item is:

        <div key={item.id} className="group ... ">
          <div className="relative aspect-[4/3] ... ">   <!-- image container -->
            ... 
          </div>
          <div className="p-5 flex-1 ... ">             <!-- content -->
            ...
          </div>
        </div>

     Therefore, for each item we have three divs: the outer item div, the image div, and the content div.

     Now, looking at the lines:

        480:                     </div>   -> this would be the content div (indented 20 spaces?)
        481:                   </div>    -> this would be the image div (indented 16 spaces?)
        482:                 </div>     -> this would be the item div (indented 12 spaces?)

     Then at line 483:               }))  -> this is at 15 spaces? (which would be 3*5=15, so 3 indents)

     And then line 484:             </div> -> 13 spaces? (which doesn't match)

     Alternatively, the indentation might be off.

   However, the error is at line 483: `}))` and the compiler expects a ')'.

   What if we have an extra closing parenthesis? Let's try removing one.

   Suppose we change line 483 from `}))` to `})` and see if that fixes it.

   But note: we need two closing parentheses: one for the arrow function's body (which was opened by the parenthesis after the arrow) and one for the map call.

   However, if we remove one, we would have:

        {filteredItems.map((item) => ( ... ))}

   becomes

        {filteredItems.map((item) => ( ... )}

   which is missing a closing parenthesis for the map.

   Alternatively, if we have:

        {filteredItems.map((item) => ( ... ))}

   and we accidentally wrote three closing parentheses, then we would have an extra.

   But the error says we are missing a closing parenthesis? Actually, the error says "expected ')'", meaning we have something else where a closing parenthesis was expected.

   Another idea: maybe we forgot to close a parenthesis inside the JSX.

   Let me check the className of the outer div of the item:

        className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-red-500/50 transition-all duration-300 flex flex-col hover:scale-[1.02] hover:shadow-xl shadow-sm"

   This looks okay.

   Now, look at the image container div:

        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">

   This is missing a closing quote? No, it has a quote at the end.

   Actually, it's: `className="relative aspect-[4/3] overflow-hidden bg-zinc-100"` -> note the closing quote.

   But wait: in the code we have:

        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">

   There is a missing closing quote? Actually, no: the string is "relative aspect-[4/3] overflow-hidden bg-zinc-100", so it should be closed with a quote.

   However, in the provided code snippet we don't see the closing quote? Let me check:

        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">

   This is actually missing the closing quote! It should be:

        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">

   But wait, the string ends with `bg-zinc-100` and then we have a `>` so the quote is missing.

   Actually, in the code we have:

        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">

   This is invalid because the attribute value is not closed.

   It should be:

        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">

   But note: the string is "relative aspect-[4/3] overflow-hidden bg-zinc-100", so we need a closing quote after `bg-zinc-100`.

   However, in the code we have:

        className="relative aspect-[4/3] overflow-hidden bg-zinc-100"

   and then immediately a `>`? Actually, no: the next character after the string is a space and then `>`? 

   But in the code we have:

        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">

   This is actually: 
        className=" ... "   -> the string is closed by the quote after 100, and then we have `>`.

   But wait, the string is: `relative aspect-[4/3] overflow-hidden bg-zinc-100` -> note there is no space between `bg-zinc-100` and the closing quote? 

   Actually, the string is written as: `"relative aspect-[4/3] overflow-hidden bg-zinc-100"` -> so it's correct.

   However, in the error snippet we don't see the entire line. But the error is at line 483, so it's unlikely to be in the className of the image div.

   Another possibility: in the span inside the image container:

        <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md border border-zinc-200 rounded-full text-xs font-bold text-red-600 shadow-sm">
          {HOT_N_TASTY_CATEGORIES.find((c) => c.id === item.category)?.name.replace(/[^a-zA-Z ]/g, "").trim() || item.category}
        </span>

   This looks okay.

   Now, let's look at the button:

        <button
          onClick={() => handleAddToCart(item)}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add to Cart
        </button>

   This also looks okay.

   Given the difficulty, let's try a different approach: the error says at line 483, column 15 we have a '}' and then two closing parentheses, and the compiler expected a ')'.

   What if we have:

        ... 
        </div>
      ))   // <-- this is line 483

   and the compiler is expecting a ')' after the '}'? 

   Actually, the structure of the map is:

        {filteredItems.map((item) => (
          ... 
        ))}

   So after the closing brace of the arrow function body (which is actually not a brace because we used parentheses for the body) we have two closing parentheses.

   But note: we used parentheses for the body, so the body is an expression (the JSX). Therefore, we don't have braces.

   The arrow function is: (item) => ( JSX )

   So after the JSX we have a closing parenthesis for the arrow function's argument list (which is the parentheses around the JSX) and then a closing parenthesis for the map call.

   Therefore, we have two closing parentheses.

   However, if we accidentally used braces for the body, then we would have:

        (item) => { 
          ... 
        }

   and then we would need to return the JSX explicitly, but we are not.

   But in our code we are using parentheses for the body, so it's an expression body.

   Now, what if inside the JSX we have an unclosed parenthesis or bracket?

   Let me check the expression inside the span:

        {HOT_N_TASTY_CATEGORIES.find((c) => c.id === item.category)?.name.replace(/[^a-zA-Z ]/g, "").trim() || item.category}

   This has:
        - a function call to find with an arrow function: (c) => c.id === item.category
        - then a optional chain: ?.
        - then .name
        - then .replace(/[^a-zA-Z ]/g, "")
        - then .trim()
        - then || item.category

   The parentheses and brackets seem balanced.

   Another idea: the className string might have an unescaped quote? But it's using double quotes inside and the attribute uses double quotes? Actually, we are using double quotes for the attribute and the string inside is also double quotes? 

   But note: in JSX, we use curly braces for JavaScript expressions, and inside the curly braces we can use string literals. However, the className attribute is a string, so we are using double quotes for the attribute value. Inside that string, we are not using any quotes that would break it? 

   The className string does not contain any double quotes, so it's safe.

   Given the time, let's try to fix by removing one of the closing parentheses at line 483 and see if it compiles.

   But note: we cannot just remove one arbitrarily because we need two.

   Alternatively, let's try to rewrite the map without the extra parentheses around the body? 

   We can write:

        {filteredItems.map(item => (
          <div ...> ... </div>
        ))}

   This is the same.

   Or we can write without the parentheses around the body if we put the JSX on the same line? But we don't want to.

   Another possibility: we have an extra closing parenthesis after the map.

   Look at the code after the map:

        483 |               }))
        484 |             </div>

   What if we have:

        </div>
        ))}
        </div>

   That would be: 
        the inner div of the item is closed (line 480: the content div?),
        then the image div (line 481),
        then the item div (line 482),
        then we close the map call with two parentheses (line 483: )) and then we have an extra closing parenthesis? 
        and then at line 484 we close the grid div.

   But wait, the grid div was opened before the map.

   The structure is:

        <div className="grid ... ">
          { ... map ... }
        </div>

   So after the map we should have the closing div for the grid.

   Therefore, we should have:

        { ... map ... }
        </div>

   But in the code we have at line 483: `}))` and then at line 484: `</div>`

   So the `}))` is the end of the map expression, and then the `</div>` is the closing of the grid div.

   This seems correct.

   However, the error is at the first closing parenthesis of the `}))`.

   What if we have an extra opening parenthesis somewhere in the map?

   Let me count the parentheses in the map expression:

        filteredItems.map(   -> 1 open
          (item) => (        -> 2 open (one for the function parameters, one for the body)
            ... JSX ...      -> inside the JSX we have various parentheses, but they should be balanced
          )                  -> closes the body parenthesis (now at 1 open)
        )                    -> closes the map call (now at 0 open)

   So we expect two closing parentheses at the end.

   But if inside the JSX we have an unclosed parenthesis, then we would have more than two to close.

   Let me check the JSX for unclosed parentheses:

   In the className of the outer div of the item: none.

   In the image container div: none.

   In the img tag: none.

   In the div inside the image container: none.

   In the span: 
        { ... .replace(/[^a-zA-Z ]/g, "") ... }
        The regex: /[^a-zA-Z ]/g -> this has parentheses? No, it's a regex literal.

   In the content div:
        None.

   In the button's onClick: 
        () => handleAddToCart(item) -> the arrow function has parentheses for the parameters (empty) and then the function body.

   So the parentheses in the JSX should be balanced.

   Given the complexity, and since the error is very specific (line 483, column 15), let's try to change the code at that location.

   Instead of having:

        }))

   let's try to have:

        })

   and see if that works? But that would be only one closing parenthesis, which would be insufficient.

   Or maybe we have an extra opening parenthesis before the map?

   Another idea: the map call might be missing an opening parenthesis? 

   We have:

        filteredItems.map( ... )

   But what if we wrote:

        filteredItems.map ... 

   without the parentheses? Then we would be missing the opening parenthesis for the map call, and then the compiler would see the arrow function and get confused.

   However, the code we have includes the parentheses.

   Let me look at the exact code around the map in the file (from the error context):

        480 |                     </div>
        481 |                   </div>
        482 |                 </div>
        483 |               }))
        484 |             </div>

   This suggests that the map is not the only thing in that block.

   Actually, the indentation suggests:

        We are inside a div (the grid) and then we have the map, and then we close the grid div.

   But the indentation of the map's content is off.

   Let me try to re-indent the relevant part:

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

   Now, let's count the parentheses and braces for the map:

        { filteredItems.map( (item) => ( ... )) }

   We have:
        { ... } -> the JSX expression wrapper
        .map( ... ) -> the map call
        (item) => ( ... ) -> the arrow function

   Inside the arrow function, we have parentheses around the JSX body.

   So the structure is:

        {   [open 1 for the JSX expression]
          filteredItems.map(   [open 1 for the map call]
            (item) => (     [open 1 for the arrow function parameters, open 2 for the body]
              ... JSX ...   [inside the JSX we have various parentheses, but they are balanced]
            )               [close 2 for the body, now open 1 for the parameters]
          )                 [close 1 for the map call, now open 0]
        }                   [close 1 for the JSX expression]

   Therefore, after the JSX we expect two closing parentheses: one for the arrow function's body and one for the map call.

   In the indented code above, we see at the end of the map:

          )}
        </div>

   So we have two closing parentheses: `))` and then the closing curly brace of the JSX expression? 

   But wait, the JSX expression is wrapped in `{ ... }`, so after the map call we have a closing curly brace.

   However, in the code we have:

          )}
        </div>

   This means: 
        )   -> closes the arrow function's body
        )   -> closes the map call
        }   -> closes the JSX expression

   But in the code we have at line 483: `}))` and then line 484: `</div>`

   So we are missing the closing curly brace for the JSX expression.

   Ah! That's the issue.

   We have:

        {filteredItems.map((item) => ( ... ))}

   but in the code we have written:

        {filteredItems.map((item) => ( ... ))}

   without the closing curly brace for the JSX expression? 

   Actually, no: the JSX expression is the entire `{ ... }`, so after the map call we should have a closing curly brace.

   In the indented code I wrote above, I have:

          )}
        </div>

   which is missing the closing curly brace.

   It should be:

          )}
        }
        </div>

   But wait, the JSX expression is: `{ ... }`, so after the map call we need a closing brace.

   However, in the code we have provided in the error snippet, we see:

        483 |               }))
        484 |             </div>

   This suggests that after the `}))` we have a `</div>`, meaning we are missing the closing curly brace for the JSX expression.

   Therefore, the fix is to add a closing curly brace after the `}))` and before the `</div>`.

   But note: the `}))` is actually three characters: two closing parentheses and then what? 

   In the code we have at line 483: `}))` -> that's two closing parentheses and then a closing curly brace? 

   No, the string is `}))` which is two closing parentheses and then a closing curly brace? 

   Actually, no: `}))` is two closing parentheses and then a closing curly brace would be `})}`.

   But the code says `}))` which is two closing parentheses and then a closing parenthesis? 

   Let me read: the code says `}))` -> that's three characters: '}', ')', ')'? 

   No, in the text it's written as: `}))` which is: 
        first character: '}' 
        second: ')' 
        third: ')'

   But that doesn't make sense.

   Alternatively, the code might have:

        ... 
        </div>
      }) 
      }

   but we have a typo.

   Given the error message says: expected ')', and it's pointing at the first character of the line (which is a '}' in the code we see in the error snippet?), it's confusing.

   However, the error says: at line 483, column 15.

   Let's assume that the line 483 is: `               }))` and the column 15 is the first non-space character.

   If the line has 15 spaces and then `}))`, then the first non-space is at column 16? 

   But the error says column 15.

   Alternatively, the line might be: `                ))) ` or something.

   Without the exact file, it's hard.

   But the most common mistake in this pattern is forgetting to close the JSX expression's curly brace.

   In JSX, when we embed JavaScript, we use `{ ... }`. So after the map call, we must close the curly brace.

   In our code, we have:

        {filteredItems.map(...)}

   So after the map call, we need a `}`.

   In the indented version I wrote above, I had:

          )}
        </div>

   but it should be:

          )}
        }
        </div>

   Therefore, the fix is to add a closing curly brace after the two closing parentheses.

   So change line 483 from:

        }))

   to:

        })
   }

   But wait, that would be three lines? 

   Actually, we want:

        ... 
        )}
        }
        </div>

   However, note that the two closing parentheses and the closing curly brace are all on the same line in the original? 

   The error shows line 483 as having `}))`, so we are missing the curly brace.

   Therefore, we should change line 483 from:

        }))

   to:

        })
   }

   But that would be two lines? 

   Alternatively, we can put it all on one line:

        })} 

   but that doesn't make sense.

   Let me clarify:

        We need: 
          )   [to close the arrow function's body]
          )   [to close the map call]
          }   [to close the JSX expression]

        So three characters: `)}`

   But wait, no: 
        The arrow function's body is closed by a parenthesis: so after the JSX we have a `)` to close the `( ... )` of the body.
        Then we have a `)` to close the `map( ... )`.
        Then we have a `}` to close the `{ ... }` of the JSX expression.

   So we need: `)}`

   However, in the code we have `}))` which is two closing parentheses and then a closing curly brace? 
        Actually, `}))` is: 
            first: '}' -> this would be closing the JSX expression too early?
            second: ')' 
            third: ')'

   But that doesn't match.

   Alternatively, the code might have:

        ... 
        </div>
      ) 
      }

   but we have an extra parenthesis.

   Given the time, and since the error is that we are missing a ')', and we have an extra '}' or something, let's try to remove the curly brace from the beginning of the line.

   What if the line 483 is actually:

        ))

   and we have an extra '}' at the beginning of the line from the previous line's indentation? 

   But the error says the problem is at line 483.

   Another idea: the map call is not wrapped in the JSX expression correctly.

   We have:

        <div className="grid ... ">
          {filteredItems.map(...)}
        </div>

   But what if we accidentally wrote:

        <div className="grid ... ">
          filteredItems.map(...)
        </div>

   without the curly braces? Then we would be trying to put a JavaScript expression in JSX without the curly braces, which is invalid.

   However, the error would be different.

   Given the prevalence of the mistake, I think the most likely fix is to add a closing curly brace after the map call.

   So we change:

        </div>
      )) 
    </div>

   to:

        </div>
      ))} 
    </div>

   But note: the `}))` might be intended to be `)}` and then we have an extra parenthesis.

   Let's try to remove one closing parenthesis and add a curly brace.

   Specifically, change line 483 from:

        }))

   to:

        })

   and then we would have:

        ... 
        </div>
      })
    </div>

   This would mean:
        )   -> closes the arrow function's body
        }   -> closes the JSX expression
        and we are missing the closing parenthesis for the map call.

   So that's not right.

   Alternatively, change to:

        )}

   meaning:
        )   -> closes the arrow function's body
        }   -> closes the JSX expression
        and we are missing the closing parenthesis for the map call.

   Still not right.

   The correct sequence is: `)}` for the two closures (body and map) and then we need a `}` for the JSX expression? 
   But wait, the JSX expression is the outer `{ ... }`, so after the map call we should have a `}` to close it.

   Therefore, after the map call we need: `)}` 
        - the first `)` closes the arrow function's body
        - the second `)` closes the map call
        - and then we need a `}` to close the JSX expression.

   So we need three characters: `)}` 

   But wait, that's only two: `)` and `}` -> no, we need two for the map and function and one for the JSX: total three: `)})` 

   However, note: the map call is inside the JSX expression, so the structure is:

        {   [open JSX expression]
          filteredItems.map(   [open map call]
            (item) => (     [open arrow function body]
              ... 
            )               [close arrow function body]
          )                 [close map call]
        }                   [close JSX expression]

   So after the JSX inside the map, we have: `))}` 

   Therefore, the line should be: `))}` 

   But in the error we have: `}))` 

   So we have an extra closing parenthesis and are missing the curly brace? 

   Actually, `}))` is three characters: '}', ')', ')' 
   and we need: ')', ')', '}' -> which is `)}` 

   Wait, no: we need two closing parentheses and one closing curly brace: so the string should be `)}` 

   But note: the order is important.

   We have to close in the reverse order of opening:

        We opened: 
          JSX expression: {
          map call: (
          arrow function body: (

        So we close:
          arrow function body: )
          map call: )
          JSX expression: }

        Therefore, the closing sequence is: `)}` 

   So we need: `)}` 

   But the code has: `}))` 

   which is: 
        first: '}' -> this would be closing the JSX expression too early (before we close the map and the function)
        then: ')' -> which would be trying to close something that's already closed? 
        then: ')' -> extra

   This is messy.

   Given the complexity, and since the error is that we are missing a ')', let's try to add a ')' at the position of the error.

   The error says at line 483, column 15 we have a '}' and we expected a ')'.

   So if we change that '}' to a ')', then we would have at that position a ')' and then the rest of the line is '))' -> so we would have ')))' 

   But that doesn't seem right.

   Alternatively, if we insert a ')' before the '}', then we would have: '})' -> which is what we need for the two closures (function body and map call) and then we still need the '}' for the JSX expression.

   But wait, we need three things: two ')' and one '}'.

   The current line has: '}))' -> which is one '}' and two ')'.

   If we change the first character from '}' to ')', we get: ')))' -> three ')'.

   If we insert a ')' after the first character, we get: ')} )' -> which is not helpful.

   If we replace the '}' with ')' and then add a '}' at the end, we get: '))}' -> which is two ')' and then a '}' -> that is what we need: 
        first ')' -> closes the arrow function's body
        second ')' -> closes the map call
        '}' -> closes the JSX expression

   So the fix is to change the line from:

        }))

   to:

        )} 

   but wait, that's only two characters. We need three: ')', '}', and then what? 

   Actually, we need three characters: ')', ')', '}' -> but in the order: first the two closing parentheses and then the curly brace? 
   No, the order of closing is: first the innermost, which is the arrow function's body (a parenthesis), then the map call (a parenthesis), then the JSX expression (a brace).

   So the string should be: `)}` 

   But note: 
        The arrow function's body is opened by a '(' -> closed by ')'
        The map call is opened by a '(' -> closed by ')'
        The JSX expression is opened by a '{' -> closed by '}'

   So after the JSX inside the map, we have to close: 
        first: the arrow function's body -> ')'
        second: the map call -> ')'
        third: the JSX expression -> '}'

   Therefore, the closing sequence is: `)}` 

   However, wait: the JSX expression is the outermost, so it should be closed last. 
        We opened: 
          {   (JSX)
            (   (map)
              (   (arrow function body)
                ... 
              )   (close arrow function body)
            )   (close map)
          }   (close JSX)

   So the closing order is: first the arrow function's body, then the map, then the JSX.

   Therefore, the string after the JSX inside the map should be: `)}` 

   But note: the arrow function's body is closed by a ')', then the map call is closed by a ')', then the JSX expression is closed by a '}'.

   So we need: `)}` 

   However, the string `)}` is two characters: 
        first: ')' 
        second: '}'

   But we need three: 
        first: ')' for the function body
        second: ')' for the map
        third: '}' for the JSX

   So we are not matching.

   Let me count the opening:

        We have:
          { ... }   -> one pair of braces for the JSX expression
          ( ... )   -> one pair of parentheses for the map call
          ( ... )   -> one pair of parentheses for the arrow function's body

   So three opening delimiters, hence three closing delimiters.

   The closing order should be the reverse of opening:

        Last opened: the arrow function's body -> first to close: ')'
        Then: the map call -> next: ')'
        First opened: the JSX expression -> last to close: '}'

   So the closing string is: `)}` 

   But wait, that's only two characters: 
        ')' and then '}' 

   We are missing one ')'.

   Actually, we have two opening parentheses: one for the map and one for the arrow function's body.

   So we need two closing parentheses and one closing brace.

   Therefore, the closing string is: `))}` 

   Because:
        first ')' closes the arrow function's body
        second ')' closes the map call
        '}' closes the JSX expression

   So we need `))}` 

   Now, the code has at line 483: `}))` 

   which is: 
        first character: '}' 
        second: ')' 
        third: ')'

   This is: 
        '}' -> which would be trying to close the JSX expression too early (before we close the function and map)
        then ')' -> which would be unmatched
        then ')' -> unmatched

   So the fix is to change `}))` to `))}` 

   That is, replace the first '}' with a ')' and leave the last two as '))'? 
   But wait, we have three characters: we want to change the first character from '}' to ')', so we get: '))' -> but that's only two.

   Actually, the string `}))` has three characters: 
        index0: '}' 
        index1: ')' 
        index2: ')'

   We want: 
        index0: ')' 
        index1: ')' 
        index2: '}'

   So we need to change the first character from '}' to ')' and the last character from ')' to '}'.

   Therefore, change `}))` to `))}` 

   But note: 
        Original: })) 
        Change to:  ))} 

   How? 
        We change the first character from '}' to ')' -> becomes: ) ) ) 
        and then we change the last character from ')' to '}' -> becomes: ) ) } 

   So the string becomes: `))}` 

   Let's write it: 
        character0: ')' 
        character1: ')' 
        character2: '}'

   So the string is "))}"

   Therefore, the fix is to change line 483 from:

        }))

   to:

        ))} 

   But wait, that would be three characters: ')', ')', '}' 

   However, in the code we have three characters: so we are replacing three characters with three characters.

   Alternatively, if the line has more than three characters (like spaces and then the three), we only change the three non-space characters.

   Given the error says the problem is at column 15, and if the line has 15 spaces and then `}))`, then we want to replace the `}))` at position 15-17 with `))}`.

   So in the file, at line 483, we change the substring "}))" to "))}".

   Let's do that.

   We'll change:
        })) 
   to 
        ))} 

   in the file at line 483.

   But note: the line might have spaces at the beginning. We only want to change the non-space part that is "}))" to "))}".

   However, the error points to the exact location, so we can assume that the three characters starting at column 15 are "}))".

   So we replace those three characters with "))}".

   Let's make that change.

   In the file src/pages/Index.tsx, at line 483, replace the string "}))" with "))}".

   But note: the line might be exactly: "               }))" (with 15 spaces and then })) )

   We want to change it to: "               )))? no, we want "               )))? -> no, we want "               )))? 

   Actually, we want: "               )))? -> no, we want "               )))? 

   Wait, we want to change the "}))" to "))}", so:

        "               }))"  becomes "               )))? -> no, we want "               )))? 

   Actually: 
        original: 15 spaces + "}))" 
        becomes: 15 spaces + "))}"

   So we replace the three characters "}))" with "))}".

   Let's do that in the code.

   However, note: there might be more than one occurrence, but the error points to line 483.

   We'll do exactly that.

   But wait, in the provided code snippet in the error, we see:

        480 |                     </div>
        481 |                   </div>
        482 |                 </div>
        483 |               }})
        484 |             </div>

   Actually, the user's message says:

        483 |               }})
        484 |             </div>

   But in the initial error message it was written as:

        483 |               }})
        484 |             </div>

   However, in the user's message above, it says:

        483 |               }})
        484 |             </div>

   But then in the detailed error it says:

        483 |               }})
        484 |             </div>

   And the error is at the first '}' of the "}))" ? 

   Actually, the user wrote: 
        483 |               }})
        484 |             </div>

   But then in the error description: 
        ')' expected. (TS1005)
        ],-[C:/Users/HP/dyad-apps/magical-gibbon-swim/src/pages/Index.tsx:483:1]
        480 |                     </div>
        481 |                   </div>
        482 |                 </div>
        483 |               }})
        484 |             </div>
             `----

   And the arrow points to the first character of line 483, which is a space? 

   Actually, the arrow is under the first non-space? 

   The error says: at column 1, but then shows the line starting with spaces.

   The error message says: 
        483 |               }})
             ^^^

   So it's pointing at the three characters: the first one is a space? 

   Actually, the line 483 has 15 spaces and then "}))", so the first non-space is at column 16.

   But the error says column 1? 

   This is confusing.

   Given the time, and since the most common fix for this pattern is to ensure we have the closing brace for the JSX expression, and we suspect we are missing it or have it in the wrong place, let's try a different approach.

   Let's look at the code structure in the file around the area that is likely to be the food grid.

   We know that the food grid is inside a div with className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"

   And inside that, we have the map.

   So we expect:

        <div className="grid ... ">
          {filteredItems.map(...)}
        </div>

   Therefore, after the map call, we should have a closing curly brace and then the closing div.

   So the code should be:

        </div>
      )}
        </div>

   But wait, that would be:

        ... 
        </div>   [closing the item div]
      )}         [closing the map and the JSX expression]
        </div>   [closing the grid div]

   However, the indentation in the error snippet shows:

        480 |                     </div>
        481 |                   </div>
        482 |                 </div>
        483 |               }})
        484 |             </div>

   This suggests that at line 480,481,482 we are closing three divs (which would be the item's content div, image div, and the item div itself), and then at line 483 we have `}))` and then at line 484 we have `</div>`.

   So the `}))` is meant to be the closing of the map and the JSX expression, and then the `</div>` at line 484 is the closing of the grid div.

   Therefore, we expect after the three divs (which close the item) to have the closing of the map and the JSX expression.

   And we need: `)}` for the map and JSX? 
        But wait, we have two opening parentheses (for the map and the arrow function's body) and one opening brace (for the JSX), so we need two closing parentheses and one closing brace: `))}` 

   So the line 483 should be: `))}` 

   but it is not what we have; we have `}))` 

   So we change `}))` to `))}` 

   by changing the first character from '}' to ')' and the last character from ')' to '}'? 
   But wait, we have three characters: we want to change the first and the last.

   Specifically:
        current: [0] = '}', [1] = ')', [2] = ')'
        desired: [0] = ')', [1] = ')', [2] = '}'

   So we swap the first and the last.

   Therefore, replace "}))" with "))}".

   Let's do that.

   In the file src/pages/Index.tsx, at line 483, replace the string "}))" with "))}".

   We'll do that in the edit.

   Note: There might be multiple occurrences, but we are only changing the one at line 483.

   Let's write the change.

</think><dyad-write path="src/pages/Index.tsx" description="Fixing the JSX closing sequence in the food grid map expression by changing '}))' to '))}' at line 483">
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
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
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
                Hot N Tasty Roll BBQ Gulistan-e-johar
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
              className="text-sm font-bold text-zinc-700 hover:text-red-600 transition-colo