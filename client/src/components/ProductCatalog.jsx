import React, { useState } from 'react';
import { Star, ShieldCheck, ShoppingCart, GitCompare, Zap, Check, Battery, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export default function ProductCatalog({ 
  products = [], 
  highlightedIds = [], 
  onAddToCart, 
  onCompare 
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Flagships" },
    { id: "audio", label: "Noise-Cancelling Audio" },
    { id: "wearables", label: "Smartwatches & Wearables" }
  ];

  const filteredProducts = products.filter(p => {
    if (selectedCategory === "all") return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="w-full mb-12">
      
      {/* Category Filter & Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Exclusive VIP Collection
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              Live Stock Synced
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Flagship Audio & Wearables Showcase
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const isHighlighted = highlightedIds.includes(product.id) || highlightedIds.includes(product.sku);

          return (
            <div
              key={product.id}
              className={`group glass-card rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                isHighlighted
                  ? "ring-2 ring-indigo-500 border-indigo-500/80 shadow-2xl shadow-indigo-500/25 bg-slate-900/95 scale-[1.02]"
                  : "border-slate-800/80 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900/80"
              }`}
            >
              {/* Product Visual */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />

                {/* Stock Indicator Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[11px] font-bold text-emerald-400 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {product.inventory.stockCount} in stock (SF Hub)
                  </span>
                </div>

                {/* VIP Upgrade Badge */}
                {product.tags.includes("upgrade-pick") && (
                  <div className="absolute top-3.5 right-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 backdrop-blur-md text-[11px] font-black text-slate-950 shadow-lg shadow-amber-500/25">
                      <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                      Top Upgrade for XM4
                    </span>
                  </div>
                )}

                {/* Spec Tag */}
                {product.specs?.batteryLife && (
                  <div className="absolute bottom-3.5 left-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-sm border border-slate-700/60 text-[11px] text-slate-200 font-medium">
                      <Battery className="w-3.5 h-3.5 text-sky-400" />
                      {product.specs.batteryLife}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-extrabold text-indigo-400 uppercase tracking-widest">{product.brand}</span>
                    <div className="flex items-center space-x-1.5 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-bold text-white text-xs">{product.rating}</span>
                      <span className="text-slate-500 text-[11px]">({product.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-100 text-base leading-snug mb-2 group-hover:text-indigo-300 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Highlights Bullet points */}
                  <div className="space-y-1 mb-5">
                    {product.features?.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div className="pt-4 border-t border-slate-800/80">
                  <div className="flex items-baseline justify-between mb-3.5">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white">
                          ${product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-slate-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-400">
                        VIP Price: ${(product.price * 0.8).toFixed(2)} with TECH20
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {product.sku}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => onCompare(product.sku)}
                      className="flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-xs font-semibold text-slate-200 transition-all border border-slate-700/60 shadow-sm"
                    >
                      <GitCompare className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Compare</span>
                    </button>

                    <button
                      onClick={() => onAddToCart(product.sku)}
                      className="flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-95 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/30"
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
