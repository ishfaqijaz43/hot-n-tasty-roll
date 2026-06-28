import React, { useState } from "react";
import { X, ShieldAlert, Lock } from "lucide-react";
import { toast } from "sonner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "16966") {
      setError("");
      setPin("");
      toast.success("Access Granted! Welcome to the Admin Panel.");
      onSuccess();
      onClose();
    } else {
      setError("Invalid Security Code.");
      toast.error("Access Denied: Invalid PIN");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#121215] border border-zinc-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white">Staff Authentication</h3>
              <p className="text-xs text-zinc-400">Authorized personnel only</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Secret Access PIN
            </label>
            <input
              type="password"
              placeholder="•••••"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-center text-2xl tracking-widest focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              maxLength={10}
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20 active:scale-[0.98]"
          >
            Verify & Enter
          </button>
        </form>
      </div>
    </div>
  );
};