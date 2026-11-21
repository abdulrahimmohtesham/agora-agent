import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Tag, ArrowRight, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart = [],
  discounts = [],
  onApplyDiscount,
  onCheckout,
  customer
}) {
  const [couponInput, setCouponInput] = useState("");

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = discounts.reduce((acc, d) => acc + (d.discountType === "percentage" ? (subtotal * d.discountValue / 100) : 0), 0);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApply = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    onApplyDiscount(couponInput.trim());
    setCouponInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md h-full glass-panel border-l border-slate-800 bg-slate-950/95 flex flex-col justify-between shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Your Active Cart</h3>
              <p className="text-[11px] text-slate-400">Phase: ACTION (Synchronized with Voice)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-medium">Your cart is currently empty</p>
              <p className="text-slate-600 text-xs mt-1">
                Say "Add Sony XM5 to cart" to have the agent add it for you.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.sku}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3.5"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-950"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-200 text-xs truncate mb-1">
                    {item.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-bold text-white">${item.price}</span>
                    <span className="text-slate-500">Qty: {item.quantity}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Stock Reserved
                  </span>
                </div>
              </div>
            ))
          )}

          {/* Vouchers Section */}
          {cart.length > 0 && (
            <div className="pt-2">
              <form onSubmit={handleApply} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Promo Code (e.g. TECH20)"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-xs text-white uppercase outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Apply
                </button>
              </form>

              {discounts.length > 0 && (
                <div className="space-y-1">
                  {discounts.map((d) => (
                    <div
                      key={d.code}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs"
                    >
                      <span className="flex items-center gap-1.5 font-bold">
                        <Tag className="w-3.5 h-3.5" />
                        {d.code} ({d.discountValue}% OFF)
                      </span>
                      <span>Applied</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-slate-950 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal:</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>VIP Coupon Discount:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Shipping:</span>
                <span className="text-emerald-400 font-semibold">FREE (Platinum Overnight)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-white">
                <span>Estimated Total:</span>
                <span className="text-xl font-extrabold text-indigo-400">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Customer Details Pill */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-0.5">
              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span>Shipping to:</span>
                <span>{customer?.defaultShippingAddress?.city || "San Francisco, CA"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment:</span>
                <span className="font-mono text-indigo-400">Visa •••• 4242 (1-Click)</span>
              </div>
            </div>

            <button
              onClick={() => {
                onCheckout();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-white text-sm transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Initiate Sandbox Checkout (${finalTotal.toFixed(2)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
