import React from 'react';
import { Star, ShieldCheck, ShoppingCart, GitCompare, Zap, Check, Battery, Sparkles } from 'lucide-react';

export default function ProductCatalog({ 
  products = [], 
  highlightedIds = [], 
  onAddToCart, 
  onCompare 
}) {
  return (
    <div className="w-full mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Dynamic Product Discovery</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              Synchronized With Voice
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Products highlight and filter in real-time as Agora AI mentions them
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Live Warehouse Inventory
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const isHighlighted = highlightedIds.includes(product.id) || highlightedIds.includes(product.sku);

          return (
            <div
              key={product.id}
              className={`group glass-card rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                isHighlighted
                  ? "ring-2 ring-indigo-500 border-indigo-500/80 shadow-2xl shadow-indigo-500/20 bg-slate-900/90 scale-[1.01]"
                  : "border-slate-800/80 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70"
              }`}
            >
              {/* Product Image & Badges */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Stock Badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-semibold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {product.inventory.stockCount} in stock
                  </span>
                </div>

                {/* Special Tag */}
                {product.tags.includes("upgrade-pick") && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/90 backdrop-blur-md text-[11px] font-bold text-slate-950 shadow-md">
                      <Sparkles className="w-3 h-3" />
                      VIP Upgrade Pick
                    </span>
                  </div>
                )}

                {/* Battery / Highlight Spec */}
                {product.specs?.batteryLife && (
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 text-[10px] text-slate-300">
                      <Battery className="w-3 h-3 text-sky-400" />
                      {product.specs.batteryLife}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="font-semibold text-indigo-400 uppercase tracking-wider">{product.brand}</span>
                    <div className="flex items-center space-x-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-semibold">{product.rating}</span>
                      <span className="text-slate-500 text-[10px]">({product.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-100 text-base leading-snug mb-2 group-hover:text-indigo-300 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Pricing & Actions */}
                <div>
                  <div className="flex items-baseline justify-between pt-3 border-t border-slate-800/80 mb-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-white">
                          ${product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-slate-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium">
                        Eligible for 20% OFF with TECH20
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {product.sku}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onCompare(product.sku)}
                      className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all border border-slate-700/60"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      <span>Compare</span>
                    </button>

                    <button
                      onClick={() => onAddToCart(product.sku)}
                      className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/30"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
