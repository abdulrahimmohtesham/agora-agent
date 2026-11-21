import React, { useState, useMemo } from 'react';
import { Star, ShieldCheck, ShoppingCart, GitCompare, Zap, Check, Battery, Sparkles, Search, SlidersHorizontal, Eye, X, CheckCircle2, ArrowUpDown } from 'lucide-react';

export default function ProductCatalog({ 
  products = [], 
  highlightedIds = [], 
  onAddToCart, 
  onCompare,
  onAskAI
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const categories = [
    { id: "all", label: "All Items", count: products.length },
    { id: "Over-Ear", label: "Over-Ear Audio", count: products.filter(p => p.subcategory === "Over-Ear").length },
    { id: "Earbuds", label: "Wireless Earbuds", count: products.filter(p => p.subcategory === "Earbuds").length },
    { id: "Wearables", label: "Wearables & Rings", count: products.filter(p => p.category === "Wearables").length },
    { id: "Desk & Audio", label: "Desk Tech & Spatial", count: products.filter(p => p.category === "Desk & Audio").length }
  ];

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category filter
        if (selectedCategory !== "all") {
          const matchCat = p.category.toLowerCase() === selectedCategory.toLowerCase();
          const matchSub = p.subcategory?.toLowerCase() === selectedCategory.toLowerCase();
          if (!matchCat && !matchSub) return false;
        }

        // Live search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const haystack = `${p.name} ${p.brand} ${p.category} ${p.description} ${p.tags?.join(" ")}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        // Recommended: VIP upgrade pick first
        const aPick = a.tags.includes("upgrade-pick") ? 1 : 0;
        const bPick = b.tags.includes("upgrade-pick") ? 1 : 0;
        return bPick - aPick;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="w-full mb-12">
      
      {/* Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Flagship Catalog
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              {filteredProducts.length} Products Available
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Curated Premium Audio & Smart Tech
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized with Agora Conversational AI • Click any card for detailed specs or voice inquiries
          </p>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Search Input */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, model, spec..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400 mr-1.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer pr-1"
            >
              <option value="recommended" className="bg-slate-900">Recommended</option>
              <option value="price-low" className="bg-slate-900">Price: Low to High</option>
              <option value="price-high" className="bg-slate-900">Price: High to Low</option>
              <option value="rating" className="bg-slate-900">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/80"
            }`}
          >
            <span>{cat.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === cat.id ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-500"
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800">
          <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No matching products found</h3>
          <p className="text-xs text-slate-400 mb-4">
            Try adjusting your search query or switching categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const isHighlighted = highlightedIds.includes(product.id) || highlightedIds.includes(product.sku);

            return (
              <div
                key={product.id}
                className={`group glass-card rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isHighlighted
                    ? "ring-2 ring-indigo-500 border-indigo-500/80 shadow-2xl shadow-indigo-500/25 bg-slate-900/95 scale-[1.02]"
                    : "border-slate-800/80 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900/80"
                }`}
              >
                {/* Visual Thumbnail */}
                <div 
                  className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 cursor-pointer"
                  onClick={() => setQuickViewProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Stock Pill */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[10px] font-bold text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {product.inventory.stockCount} in stock
                    </span>
                  </div>

                  {/* Top VIP Pick Tag */}
                  {product.tags?.includes("upgrade-pick") && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/90 text-[10px] font-bold text-slate-950 shadow-sm">
                        <Sparkles className="w-3 h-3 fill-slate-950" />
                        VIP Pick
                      </span>
                    </div>
                  )}

                  {/* Quick View Overlay Trigger */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold border border-slate-700">
                      <Eye className="w-3.5 h-3.5" />
                      Quick View & Specs
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-bold text-indigo-400 uppercase tracking-wider text-[11px]">{product.brand}</span>
                      <div className="flex items-center space-x-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="font-semibold text-[11px]">{product.rating}</span>
                      </div>
                    </div>

                    <h3 
                      onClick={() => setQuickViewProduct(product)}
                      className="font-bold text-slate-100 text-sm leading-snug mb-1.5 group-hover:text-indigo-300 transition-colors cursor-pointer line-clamp-1"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    <p className="text-slate-400 text-[11px] line-clamp-2 mb-3 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing & Quick Buttons */}
                  <div className="pt-3 border-t border-slate-800/80">
                    <div className="flex items-baseline justify-between mb-2.5">
                      <div>
                        <span className="text-lg font-black text-white mr-1.5">
                          ${product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-[11px] text-slate-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        -${(product.price * 0.2).toFixed(0)} with TECH20
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => onCompare(product.sku)}
                        className="py-1.5 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-[11px] font-semibold text-slate-200 transition-all border border-slate-700/60 flex items-center justify-center space-x-1"
                      >
                        <GitCompare className="w-3 h-3 text-indigo-400" />
                        <span>Compare</span>
                      </button>

                      <button
                        onClick={() => onAddToCart(product.sku)}
                        className="py-1.5 px-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-[11px] font-bold text-white transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-1"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick View & Detailed Specs Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-slate-700 shadow-2xl overflow-hidden bg-slate-900/95 flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{quickViewProduct.brand}</span>
                <h3 className="text-base font-bold text-white">{quickViewProduct.name}</h3>
              </div>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-white">${quickViewProduct.price}</span>
                  <span className="text-xs text-emerald-400 font-semibold ml-2">
                    (${(quickViewProduct.price * 0.8).toFixed(2)} with VIP code TECH20)
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 text-xs font-bold">
                  {quickViewProduct.inventory?.stockCount} units at {quickViewProduct.inventory?.warehouse}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {quickViewProduct.description}
              </p>

              {/* Features List */}
              {quickViewProduct.features && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Features</h4>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    {quickViewProduct.features.map((feat, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs Grid */}
              {quickViewProduct.specs && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Technical Specifications</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(quickViewProduct.specs).map(([key, val]) => (
                      <div key={key} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block capitalize">{key}</span>
                        <span className="font-semibold text-slate-200">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-3 bg-slate-950/80">
              <button
                onClick={() => {
                  onAskAI(`Tell me about the ${quickViewProduct.name}`);
                  setQuickViewProduct(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-300 flex items-center justify-center space-x-1.5"
              >
                <span>🎙️ Ask Agora AI About This</span>
              </button>

              <button
                onClick={() => {
                  onAddToCart(quickViewProduct.sku);
                  setQuickViewProduct(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-indigo-600/30"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart (${quickViewProduct.price})</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
