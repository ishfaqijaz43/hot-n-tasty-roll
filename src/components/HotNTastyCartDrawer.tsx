import React, { useState, useEffect } from "react";
import { X, Plus, Minus, ArrowLeft, ArrowRight, Trash2, ShoppingBag, User, MapPin, Home, AlertCircle, PackageCheck, Clock } from "lucide-react";
import { MenuItem } from "@/data/hotNTastyMenu";
import { getCartSuggestions } from "@/utils/cartSuggestions";
import { toast } from "sonner";

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface HotNTastyCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

// Delivery areas with fees
const DELIVERY_AREAS = [
  { name: "Johar Block 1", fee: 220 },
  { name: "Johar Block 2", fee: 220 },
  { name: "Johar Block 3", fee: 220 },
  { name: "Johar Block 4", fee: 220 },
  { name: "Johar Block 5", fee: 220 },
  { name: "Johar Block 6", fee: 300 },
  { name: "Johar Block 7", fee: 300 },
  { name: "Johar Block 8", fee: 350 },
  { name: "Johar Block 9", fee: 220 },
  { name: "Johar Block 10", fee: 220 },
  { name: "Johar Block 11", fee: 220 },
  { name: "Johar Block 12", fee: 150 },
  { name: "Johar Block 13", fee: 150 },
  { name: "Johar Block 14", fee: 150 },
  { name: "Johar Block 15", fee: 150 },
  { name: "Johar Block 16", fee: 150 },
  { name: "Johar Block 17", fee: 100 },
  { name: "Johar Block 18", fee: 150 },
  { name: "Johar Block 19", fee: 150 },
  { name: "Johar Block 20", fee: 150 },
  { name: "Gulshan Block 10A", fee: 250 },
  { name: "Gulshan Block 11", fee: 250 },
  { name: "Gulshan Block 16A", fee: 150 },
  { name: "Other", fee: 0 }
];

// Helper to get current PKT (Pakistan Standard Time, UTC+5)
const getPKTTime = (): Date => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 5);
};

export const HotNTastyCartDrawer: React.FC<HotNTastyCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  menuItems,
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("pickup");
  const [selectedArea, setSelectedArea] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  // Two full-height screens on mobile. Desktop retains the original split cart + form layout.
  const [mobileStep, setMobileStep] = useState<"cart" | "checkout">("cart");

  useEffect(() => {
    if (!isOpen) setMobileStep("cart");
  }, [isOpen]);

  useEffect(() => {
    if (cartItems.length === 0) setMobileStep("cart");
  }, [cartItems.length]);
  const suggestions = React.useMemo(() => getCartSuggestions(cartItems, menuItems, 5), [cartItems, menuItems]);

  // Live Timer states
  const [pktNow, setPktNow] = useState<Date>(getPKTTime());

  // Update PKT timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setPktNow(getPKTTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine delivery availability & countdown values
  // Active window: 6:00 PM (18:00) to 3:30 AM (03:30) PKT
  const deliveryStatus = React.useMemo(() => {
    const hours = pktNow.getHours();
    const minutes = pktNow.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    const startMinutes = 18 * 60; // 6:00 PM
    const endMinutes = 3 * 60 + 30; // 3:30 AM

    const isAvailable = totalMinutes >= startMinutes || totalMinutes < endMinutes;

    let countdownText = "";
    if (isAvailable) {
      // Countdown until 3:30 AM PKT
      const target = new Date(pktNow);
      target.setHours(3, 30, 0, 0);
      if (totalMinutes >= startMinutes) {
        // If it's currently evening before midnight, target is 3:30 AM tomorrow
        target.setDate(target.getDate() + 1);
      }
      const diffMs = target.getTime() - pktNow.getTime();
      const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
      const h = Math.floor(diffSecs / 3600).toString().padStart(2, "0");
      const m = Math.floor((diffSecs % 3600) / 60).toString().padStart(2, "0");
      const s = (diffSecs % 60).toString().padStart(2, "0");
      countdownText = `${h}:${m}:${s}`;
    } else {
      // Countdown until 6:00 PM PKT
      const target = new Date(pktNow);
      target.setHours(18, 0, 0, 0);
      const diffMs = target.getTime() - pktNow.getTime();
      const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
      const h = Math.floor(diffSecs / 3600).toString().padStart(2, "0");
      const m = Math.floor((diffSecs % 3600) / 60).toString().padStart(2, "0");
      const s = (diffSecs % 60).toString().padStart(2, "0");
      countdownText = `${h}:${m}:${s}`;
    }

    return {
      isAvailable,
      countdownText
    };
  }, [pktNow]);

  // Adjust order type if delivery is not available
  useEffect(() => {
    if (!deliveryStatus.isAvailable && orderType === "delivery") {
      setOrderType("pickup");
    }
  }, [deliveryStatus.isAvailable, orderType]);

  const subtotal = cartItems.reduce(
    (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
    0
  );

  // Calculate delivery fee
  const getDeliveryFee = () => {
    if (orderType === "pickup") return 0;
    if (!selectedArea) return 0;
    const area = DELIVERY_AREAS.find(a => a.name === selectedArea);
    return area ? area.fee : 0;
  };

  const deliveryFee = getDeliveryFee();
  const grandTotal = subtotal + deliveryFee;
  const isAreaOther = selectedArea === "Other";

  const isFormValid = () => {
    if (orderType === "pickup") {
      return customerName.trim() !== "";
    }
    // For delivery, check fields and also verify time window is active
    return deliveryStatus.isAvailable && customerName.trim() !== "" && selectedArea !== "" && deliveryAddress.trim() !== "";
  };

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    if (!isFormValid()) {
      setShowWarning(true);
      return;
    }

    setShowWarning(false);

    // Format the WhatsApp message
    const orderTypeText = orderType === "pickup" ? "PICKUP" : "DELIVERY";
    const deliveryFeeText = orderType === "pickup" 
      ? "Rs. 0" 
      : isAreaOther 
        ? "Calculate on Call" 
        : `Rs. ${deliveryFee}`;

    const itemsText = cartItems
      .map(
        (cartItem) =>
          `- ${cartItem.item.name} x ${cartItem.quantity} (Rs. ${cartItem.item.price * cartItem.quantity})`
      )
      .join("\n");

    let message = `*NEW ORDER*\n-------------------------\n*Order Type:* ${orderTypeText}\n*Name:* ${customerName.trim()}`;
    
    if (orderType === "delivery") {
      message += `\n*Area:* ${selectedArea}\n*Address:* ${deliveryAddress.trim()}`;
    }
    
    message += `\n-------------------------\n*ITEMS ORDERED:*\n${itemsText}\n-------------------------\n*Subtotal:* Rs. ${subtotal}\n*Delivery Fee:* ${deliveryFeeText}\n-------------------------`;
    
    if (orderType === "pickup") {
      message += `\n*Total Bill:* Rs. ${subtotal}`;
    } else if (isAreaOther) {
      message += `\n*Total Bill:* Rs. ${subtotal} + Delivery (Calculate on Call)`;
    } else {
      message += `\n*Total Bill:* Rs. ${grandTotal}`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/923003919005?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen h-[100dvh] w-full sm:w-[450px] bg-[#0F0F11] border-l border-zinc-800 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col overflow-hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile uses two separate screens, never two competing scroll panels. */}
        <div className="shrink-0 px-4 py-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between gap-2 bg-zinc-900/50 pt-[max(1rem,env(safe-area-inset-top))] sm:pt-6">
          <div className="flex items-center gap-3 min-w-0">
            {mobileStep === "checkout" && (
              <button
                type="button"
                onClick={() => setMobileStep("cart")}
                className="sm:hidden p-2 -ml-1 rounded-lg text-zinc-200 hover:bg-zinc-800"
                aria-label="Back to cart review"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="p-2.5 bg-red-600/10 rounded-xl text-red-600 shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-lg text-white tracking-tight">
                <span className="sm:hidden">{mobileStep === "cart" ? "Your Cart" : "Checkout"}</span>
                <span className="hidden sm:inline">Your Cart</span>
              </h3>
              <p className="text-xs text-zinc-400">
                <span className="sm:hidden">
                  {mobileStep === "cart"
                    ? `${cartItems.length} ${cartItems.length === 1 ? "item" : "items"} · Step 1 of 2`
                    : "Pickup or delivery · Step 2 of 2"}
                </span>
                <span className="hidden sm:inline">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"} selected
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Screen 1: selected items + related add-ons. On desktop it remains the original left/upper panel. */}
        <div
          className={`${mobileStep === "checkout" ? "hidden sm:block" : "block"} flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4`}
          aria-label="Cart items and suggested add-ons"
        >
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-600">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white font-bold">Your cart is empty</p>
                <p className="text-sm text-zinc-500 mt-1 max-w-xs mx-auto">
                  Add some delicious rolls, burgers, or deals to satisfy your cravings!
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((cartItem) => (
                <div
                  key={cartItem.item.id}
                  className="flex gap-4 p-3 bg-zinc-900/30 rounded-xl border border-zinc-800/50 hover:border-zinc-800 transition-colors"
                >
                  <img
                    src={cartItem.item.image}
                    alt={cartItem.item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-zinc-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-white text-sm truncate">
                          {cartItem.item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(cartItem.item.id)}
                          className="text-zinc-500 hover:text-red-500 transition-colors p-0.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                        {cartItem.item.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-red-500 font-black text-sm">
                        Rs {cartItem.item.price * cartItem.quantity}
                      </span>
                      <div className="flex items-center bg-zinc-950 rounded-lg p-1 border border-zinc-800">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.item.id, -1)}
                          className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-white">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.item.id, 1)}
                          className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Suggestions share the cart-review screen on mobile; no checkout form obscures them. */}
              {suggestions.length > 0 && (
                <section aria-labelledby="cart-suggestions-title" className="mt-6 border-t border-zinc-800 pt-5">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <h4 id="cart-suggestions-title" className="text-sm font-black text-white">
                        Complete your meal
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1">
                        You may also like these add-ons
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-full shrink-0">
                      Recommended
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pb-3 sm:flex sm:overflow-x-auto sm:snap-x sm:snap-mandatory" aria-label="Suggested menu items">
                    {suggestions.map((item) => {
                      const alreadyInCart = cartItems.some(({ item: selected }) => selected.id === item.id);
                      return (
                        <article key={item.id} className="min-w-0 w-full sm:w-[150px] sm:min-w-[150px] sm:snap-start rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/70 flex flex-col">
                          <img src={item.image || "/logo.jpg"} alt={item.name} loading="lazy" className="w-full h-24 object-cover bg-zinc-800" />
                          <div className="p-2.5 flex flex-col flex-1 gap-2">
                            <div className="flex-1">
                              <h5 className="text-xs font-bold text-white line-clamp-2 min-h-[2rem]" title={item.name}>{item.name}</h5>
                              <p className="text-red-400 font-black text-xs mt-1">Rs {item.price}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                onAddToCart(item);
                                toast.success(`${item.name} added to cart`);
                              }}
                              className="w-full flex items-center justify-center gap-1 bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold text-xs py-2 rounded-lg transition"
                              aria-label={`Add ${item.name} to cart`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                              {alreadyInCart ? "Add one more" : "Add"}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>

        {/* Mobile cart-review action stays at the bottom while the products and add-ons scroll freely. */}
        {cartItems.length > 0 && mobileStep === "cart" && (
          <div className="sm:hidden shrink-0 border-t border-zinc-800 bg-[#18181b] px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_28px_rgba(0,0,0,0.45)]">
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-zinc-400">Subtotal ({cartItems.reduce((count, selected) => count + selected.quantity, 0)} items)</span>
              <span className="font-black text-white">Rs {subtotal}</span>
            </div>
            <button
              type="button"
              onClick={() => { setShowWarning(false); setMobileStep("checkout"); }}
              className="w-full rounded-xl bg-red-600 hover:bg-red-500 text-white font-black py-3.5 flex justify-center items-center gap-2 active:scale-[0.99] transition"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClearCart}
              className="w-full mt-2 text-xs text-zinc-500 hover:text-zinc-300 py-1"
            >
              Clear All Items
            </button>
          </div>
        )}

        {/* Screen 2: pickup/delivery and WhatsApp checkout. Desktop retains its original form. */}
        {cartItems.length > 0 && (
          <div
            className={`${mobileStep === "cart" ? "hidden sm:block" : "block"} flex-1 min-h-0 sm:flex-none p-4 sm:p-6 border-t border-zinc-800 bg-zinc-900/90 space-y-4 overflow-y-auto overscroll-contain sm:max-h-[65%] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6`}
            aria-label="Checkout details"
          >
            <div className="sm:hidden flex items-center justify-between gap-3 rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-3">
              <div>
                <p className="text-xs text-zinc-400">Review your order</p>
                <p className="font-bold text-white text-sm">{cartItems.reduce((count, selected) => count + selected.quantity, 0)} items · Rs {subtotal}</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileStep("cart")}
                className="text-xs font-bold text-red-400 px-3 py-2 rounded-lg border border-red-500/30 hover:bg-red-500/10"
              >
                Edit cart
              </button>
            </div>
            {/* Order Type Toggle */}
            <div className="space-y-3 border-b border-zinc-800 pb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-red-500 uppercase tracking-wider">
                  Order Type
                </h4>
                {/* Dynamic Delivery Window Countdown Banner */}
                <div className="flex items-center gap-1 text-[10px] bg-zinc-950 px-2.5 py-1 rounded-full border border-zinc-800 font-bold">
                  <Clock className="w-3 h-3 text-red-500 animate-pulse" />
                  {deliveryStatus.isAvailable ? (
                    <span className="text-emerald-500">
                      Ends In: <span className="font-mono">{deliveryStatus.countdownText}</span>
                    </span>
                  ) : (
                    <span className="text-red-400">
                      Opens In: <span className="font-mono">{deliveryStatus.countdownText}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Warnings and interactive toggle */}
              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1">
                <button
                  onClick={() => setOrderType("pickup")}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    orderType === "pickup"
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <PackageCheck className="w-4 h-4" />
                  Pickup
                </button>
                <button
                  onClick={() => {
                    if (deliveryStatus.isAvailable) {
                      setOrderType("delivery");
                    }
                  }}
                  disabled={!deliveryStatus.isAvailable}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    !deliveryStatus.isAvailable
                      ? "opacity-40 cursor-not-allowed text-zinc-600"
                      : orderType === "delivery"
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                  title={!deliveryStatus.isAvailable ? "Delivery starts at 6:00 PM PKT" : "Order Delivery"}
                >
                  <MapPin className="w-4 h-4" />
                  Delivery
                </button>
              </div>

              {/* OUTSIDE delivery window warning message block */}
              {!deliveryStatus.isAvailable && (
                <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-red-400">Delivery service is currently closed.</p>
                    <p className="text-[11px] leading-relaxed text-zinc-400">
                      Delivery hours are daily from <span className="text-red-300 font-bold">6:00 PM to 3:30 AM PKT</span>. You can still order via Pickup!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Details Form - Only show for Delivery */}
            {orderType === "delivery" && deliveryStatus.isAvailable && (
              <div className="space-y-3 border-b border-zinc-800 pb-4">
                <h4 className="text-xs font-black text-red-500 uppercase tracking-wider">
                  Delivery Details
                </h4>
                
                {/* Customer Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-500" /> Customer Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (showWarning) setShowWarning(false);
                    }}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-red-600"
                  />
                </div>

                {/* Select Area */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" /> Select Delivery Area *
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => {
                      setSelectedArea(e.target.value);
                      if (showWarning) setShowWarning(false);
                    }}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-red-600"
                  >
                    <option value="">-- Choose Area --</option>
                    {DELIVERY_AREAS.map((area) => (
                      <option key={area.name} value={area.name}>
                        {area.name} {area.fee > 0 && area.name !== "Other" ? `(Rs. ${area.fee})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Complete Address */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-zinc-500" /> Complete Delivery Address *
                  </label>
                  <textarea
                    placeholder="House/Apartment No, Street, Block, Landmark..."
                    value={deliveryAddress}
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value);
                      if (showWarning) setShowWarning(false);
                    }}
                    rows={2}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-red-600 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Pickup Customer Name */}
            {orderType === "pickup" && (
              <div className="space-y-3 border-b border-zinc-800 pb-4">
                <h4 className="text-xs font-black text-red-500 uppercase tracking-wider">
                  Customer Details
                </h4>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-500" /> Customer Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (showWarning) setShowWarning(false);
                    }}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Subtotal</span>
                <span className="font-bold text-white">Rs {subtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Delivery Fee</span>
                <span className={`font-bold ${orderType === "pickup" ? "text-emerald-500" : "text-white"}`}>
                  {orderType === "pickup" ? "Rs 0" : isAreaOther ? "Calculate on Call" : `Rs ${deliveryFee}`}
                </span>
              </div>
              <div className="border-t border-zinc-800 my-2 pt-2 flex justify-between text-white font-black text-lg">
                <span>Grand Total</span>
                <span className="text-red-500">
                  {orderType === "pickup" || isAreaOther ? `Rs ${subtotal}` : `Rs ${grandTotal}`}
                </span>
              </div>
            </div>

            {/* Validation Warning */}
            {showWarning && !isFormValid() && (
              <div className="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Please fill in all required fields before placing your order.</span>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                onClick={handleWhatsAppCheckout}
                className={`w-full py-3.5 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.98] ${
                  isFormValid()
                    ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20 hover:shadow-emerald-900/40"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
                }`}
              >
                {/* Custom SVG WhatsApp Icon */}
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966C16.528 2.024 14.062.997 11.43.997c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.47 3.387 1.357 4.881l-.994 3.63 3.734-.956zm11.517-5.6c-.293-.144-1.73-.841-1.997-.937-.266-.097-.46-.144-.652.144-.192.288-.741.937-.909 1.129-.168.192-.336.216-.629.072-.293-.144-1.237-.449-2.355-1.433-.87-.764-1.457-1.709-1.628-1.997-.17-.288-.018-.443.124-.585.129-.127.293-.336.44-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.652-1.544-.893-2.12-.233-.565-.472-.487-.652-.496-.168-.008-.36-.01-.552-.01-.192 0-.504.072-.768.36-.264.288-1.008.96-1.008 2.352 0 1.392 1.032 2.736 1.176 2.928.144.192 2.032 3.056 4.92 4.288.687.293 1.224.468 1.643.599.69.216 1.319.186 1.816.113.554-.082 1.73-.696 1.973-1.368.243-.672.243-1.248.171-1.368-.072-.12-.264-.192-.556-.336z" />
                </svg>
                Place Order via WhatsApp
              </button>
              <button
                onClick={onClearCart}
                className="w-full py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors text-center"
              >
                Clear All Items
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};