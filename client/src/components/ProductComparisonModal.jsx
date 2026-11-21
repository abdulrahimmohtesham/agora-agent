import React from 'react';
import { X, Check, Star, Sparkles, ShoppingBag, Battery, Radio } from 'lucide-react';

export default function ProductComparisonModal({ comparison, onClose, onAddToCart }) {
  if (!comparison || !comparison.items || comparison.items.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] glass-panel rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col bg-slate-900/95">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI-Powered Head-to-Head Comparison</h3>
              <p className="text-xs text-slate-400">Phase: DURING (Recommend & Compare)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Recommendation Banner */}
        {comparison.recommendation && (
          <div className="mx-6 mt-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 text-indigo-200 text-xs sm:text-sm leading-relaxed flex items-start space-x-3">
            <span className="text-xl">💡</span>
            <div>
              <span className="font-bold text-indigo-300 block mb-0.5">Agent Recommendation:</span>
              {comparison.recommendation}
            </div>
          </div>
        )}

        {/* Comparison Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparison.items.map((prod) => (
              <div
                key={prod.id}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 relative bg-slate-900">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm text-[11px] text-white font-mono">
                      {prod.sku}
                    </div>
                  </div>

                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                    {prod.brand}
                  </div>
                  <h4 className="font-bold text-slate-100 text-base mb-2">
                    {prod.name}
                  </h4>

                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-2xl font-black text-white">${prod.price}</span>
                    <span className="text-xs text-emerald-400 font-semibold">
                      (${(prod.price * 0.8).toFixed(2)} with TECH20)
                    </span>
                  </div>

                  {/* Specs Table */}
                  <div className="space-y-2.5 text-xs text-slate-300 mb-6 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/80">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Battery Life:</span>
                      <span className="font-semibold text-white">{prod.specs?.batteryLife || "24-30 Hours"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Noise Cancellation:</span>
                      <span className="font-semibold text-emerald-400">{prod.specs?.ancLevel || "9.5/10"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Weight:</span>
                      <span className="font-semibold text-white">{prod.specs?.weight || "250g"}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Warehouse Delivery:</span>
                      <span className="font-semibold text-sky-400">Next-Day (In Stock)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(prod.sku);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Choose {prod.name.split(" ")[0]} & Add to Cart</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
