import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, Truck, MapPin, X, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function OrderConfirmationModal({ order, onClose, onTrackDelivery, onInitiateReturn }) {
  if (!order) return null;

  useEffect(() => {
    // Fire confetti cannon on open
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-emerald-500/40 shadow-2xl overflow-hidden bg-slate-900/95 flex flex-col">
        
        {/* Top Celebration Header */}
        <div className="p-6 bg-gradient-to-b from-emerald-950/40 to-transparent border-b border-slate-800 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/60 inline-block mb-1">
            Phase: ACTION (Confirmed) & AFTER (Lifecycle)
          </span>

          <h3 className="text-xl font-extrabold text-white">
            Order #{order.orderId} Confirmed!
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Sandbox payment of ${order.total} processed via saved Visa ending in 4242
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Tracking Milestone Timeline */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-sky-400" />
                Live Delivery Milestone Tracker
              </span>
              <span className="font-mono text-sky-400 font-bold">{order.trackingNumber}</span>
            </div>

            <div className="relative pl-6 space-y-4 border-l border-slate-800 ml-2 text-xs">
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
                <div className="font-semibold text-white">Order Placed & Stock Reserved</div>
                <div className="text-[11px] text-slate-500">San Francisco Fulfillment Center (West-01)</div>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-sky-400 animate-ping" />
                <div className="font-semibold text-sky-300">Courier Priority Dispatch</div>
                <div className="text-[11px] text-slate-400">{order.estimatedDelivery}</div>
              </div>
            </div>
          </div>

          {/* Purchased Items */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Purchased Items
            </h4>
            <div className="space-y-2">
              {order.items?.map((item) => (
                <div
                  key={item.sku}
                  className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-900" />
                    <div>
                      <div className="font-semibold text-slate-200">{item.name}</div>
                      <div className="text-[11px] text-slate-500">SKU: {item.sku} • Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <span className="font-bold text-white">${item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-Up / After Stage Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                onTrackDelivery(order.orderId);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-300 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Voice Track Delivery</span>
            </button>

            <button
              onClick={() => {
                onInitiateReturn(order.orderId);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-purple-300 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Returns & Support Policy</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
