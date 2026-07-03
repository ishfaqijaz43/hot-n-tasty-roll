import React, { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, User, MapPin, Home, AlertCircle } from "lucide-react";
import { MenuItem } from "@/data/menu";

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

const AREAS = [
  "Kharadar",
  "Mithadar",
  "Lyari",
  "Tower",
  "Garden",
  "Clifton",
  "Saddar",
  "Other"
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
    0
  );

  const isFormValid = customerName.trim() !== "" && selectedArea !== "" && deliveryAddress.trim() !== "";

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    if (!isFormValid) {
      setShowWarning(true);
      return;
    }

    setShowWarning(false);

    // Format the WhatsApp message exactly as requested:
    // *NEW DELIVERY ORDER*
    // -------------------------
    // *Name:* [Customer Name]
    // *Area:* [Selected Area]
    // *Address:* [Complete Address]
    // -------------------------
    // *ORDER DETAILS:*
    // - [Item 1] x [Qty] (Rs. [Price])
    // - [Item 2] x [Qty] (Rs. [Price])
    // -------------------------
    // *Total Bill:* Rs. [Total Amount]

    const itemsText = cartItems
      .map(
        (cartItem) =>
          `- ${cartItem.item.name} x ${cartItem.quantity} (Rs. ${cartItem.item.price * cartItem.quantity})`
      )
      .join("\n");

    const message = `*NEW DELIVERY ORDER*\n-------------------------\n*Name:* ${customerName.trim()}\n*Area:* ${selectedArea}\n*Address:* ${deliveryAddress.trim()}\n-------------------------\n*ORDER DETAILS:*\n${itemsText}\n-------------------------\n*Total Bill:* Rs. ${subtotal}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/923312400434?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#0F0F11] border-l border-zinc-800 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Your Order</h3>
              <p className="text-xs text-zinc-400">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"} selected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-600">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white font-medium">Your cart is empty</p>
                <p className="text-sm text-zinc-500 mt-1">
                  Add some delicious items from our menu to get started!
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-full text-sm transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((cartItem) => (
                <div
                  key={cartItem.item.id}
                  className="flex gap-4 p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/60 hover:border-zinc-800 transition-colors"
                >
                  <img
                    src={cartItem.item.image}
                    alt={cartItem.item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-zinc-800"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-semibold text-white text-sm truncate">
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
                      <span className="text-amber-500 font-bold text-sm">
                        Rs {cartItem.item.price * cartItem.quantity}
                      </span>
                      <div className="flex items-center bg-zinc-800 rounded-lg p-1 border border-zinc-700">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.item.id, -1)}
                          className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-white">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.item.id, 1)}
                          className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 space-y-4 max-h-[60%] overflow-y-auto">
            {/* Delivery Details Form */}
            <div className="space-y-3 border-b border-zinc-800 pb-4">
              <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                Delivery Details
              </h4>
              
              {/* Customer Name */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-500" /> Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (showWarning) setShowWarning(false);
                  }}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Select Area */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" /> Select Area *
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => {
                    setSelectedArea(e.target.value);
                    if (showWarning) setShowWarning(false);
                  }}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Area --</option>
                  {AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              {/* Complete Address */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-zinc-500" /> Complete Delivery Address *
                </label>
                <textarea
                  placeholder="House/Apartment No, Street, Landmark..."
                  value={deliveryAddress}
                  onChange={(e) => {
                    setDeliveryAddress(e.target.value);
                    if (showWarning) setShowWarning(false);
                  }}
                  rows={2}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Subtotal</span>
                <span>Rs {subtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Delivery</span>
                <span className="text-emerald-500 font-medium">Calculated on call</span>
              </div>
              <div className="border-t border-zinc-800 my-2 pt-2 flex justify-between text-white font-bold text-lg">
                <span>Total Bill</span>
                <span className="text-amber-500">Rs {subtotal}</span>
              </div>
            </div>

            {/* Validation Warning */}
            {showWarning && !isFormValid && (
              <div className="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Please fill in all delivery details before placing your order.</span>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                onClick={handleWhatsAppCheckout}
                className={`w-full py-3.5 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.98] ${
                  isFormValid
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