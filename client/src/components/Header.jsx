import React from 'react';
import { Radio, Mic, ShoppingBag, User, Settings, Volume2, Sparkles, ShieldCheck } from 'lucide-react';

export default function Header({ 
  agoraStatus, 
  cartCount, 
  onOpenCart, 
  onOpenProfile, 
  onOpenSettings,
  customer 
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-purple-500 shadow-lg shadow-indigo-500/25">
            <Radio className="w-5 h-5 text-white animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                ShopAgora AI
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                PS41
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              End-to-End Conversational Commerce • Agora RTC + Murf Falcon
            </p>
          </div>
        </div>

        {/* Real-time Status Pills */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Agora RTC Pill */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span className="text-slate-400">Agora RTC:</span>
            <span className="text-sky-400 font-semibold flex items-center gap-1">
              {agoraStatus.isConnected ? (agoraStatus.isDemo ? "Active (Sandbox)" : "Live Channel") : "Ready"}
            </span>
          </div>

          {/* Murf Falcon Pill */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400">Murf Falcon:</span>
            <span className="text-purple-400 font-semibold">Low-Latency TTS</span>
          </div>

          {/* VIP Badge */}
          {customer && (
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="font-medium">{customer.tier}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Customer Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all text-xs font-medium"
            title="Customer Profile & Past Purchases"
          >
            <User className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Alex Morgan</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 transition-all"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] font-bold shadow-lg shadow-indigo-500/50 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
            title="Agora & Murf Credentials Configuration"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
}
