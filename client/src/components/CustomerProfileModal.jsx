import React from 'react';
import { X, User, Sparkles, ShoppingBag, Tag, MapPin, CreditCard, Clock, Award } from 'lucide-react';

export default function CustomerProfileModal({ isOpen, onClose, customer }) {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] glass-panel rounded-3xl border border-slate-700 shadow-2xl overflow-hidden bg-slate-900/95 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">{customer.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  {customer.tier}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Phase: BEFORE • Context retrieved automatically by Agora Conversational AI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Preferences Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Customer Preferences & Brand Affinity
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Favorite Brands</span>
                <span className="text-slate-200 font-semibold">{customer.preferences?.favoriteBrands?.join(", ")}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Price Tier</span>
                <span className="text-slate-200 font-semibold">{customer.preferences?.priceAffinity}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Cashback Perk</span>
                <span className="text-emerald-400 font-semibold">{customer.cashbackRate} Automatic</span>
              </div>
            </div>
          </div>

          {/* Past Purchase History */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Past Purchases (Why Agent Recommends XM5)</span>
              <Clock className="w-3.5 h-3.5 text-slate-500" />
            </h4>
            <div className="space-y-2">
              {customer.purchaseHistory?.map((p) => (
                <div
                  key={p.orderId}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-200">{p.productName}</div>
                    <div className="text-[11px] text-slate-500">
                      Order: {p.orderId} • Purchased: {p.date} • ${p.price}
                    </div>
                    {p.upgradeNotes && (
                      <div className="mt-1 text-[11px] text-indigo-400 flex items-center gap-1 font-medium">
                        <Sparkles className="w-3 h-3" />
                        {p.upgradeNotes}
                      </div>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 text-[10px] font-semibold">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Offers & Discounts */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Available Personal Offers & Vouchers
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {customer.availableOffers?.map((offer) => (
                <div
                  key={offer.code}
                  className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-indigo-300 font-mono flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-indigo-400" />
                      {offer.code}
                    </div>
                    <div className="text-[11px] text-slate-400">{offer.description}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold whitespace-nowrap">
                    {offer.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Address & Payment */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center space-x-2 text-slate-400">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{customer.defaultShippingAddress?.street}, {customer.defaultShippingAddress?.city}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Saved {customer.savedPaymentMethod?.type} •••• {customer.savedPaymentMethod?.last4}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
