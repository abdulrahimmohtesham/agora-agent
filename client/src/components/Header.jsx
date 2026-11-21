import React from 'react';
import { Radio, Mic, ShoppingBag, User, Settings, Volume2, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function Header({ 
  agoraStatus, 
  cartCount, 
  onOpenCart, 
  onOpenProfile, 
  onOpenSettings,
  customer 
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-2xl">
      
      {/* Top VIP Member Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-950 to-purple-950 border-b border-indigo-500/20 px-4 py-1.5 text-center text-[11px] text-slate-300 flex items-center justify-center gap-3">
        <span className="flex items-center gap-1 text-amber-400 font-semibold">
          <Sparkles className="w-3 h-3 fill-amber-400" />
          Platinum VIP Concierge Active
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="hidden sm:inline text-slate-400">
          Logged in as <strong className="text-white">Alex Morgan</strong> (5% Automatic Cashback • 2,450 Points)
        </span>
        <span className="text-slate-600 hidden md:inline">•</span>
        <span className="text-emerald-400 font-mono font-medium hidden md:inline">
          Voucher TECH20 Unlocked (-$80)
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-purple-600 shadow-xl shadow-indigo-600/30">
            <Radio className="w-5 h-5 text-white animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 shadow-sm" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                AURA <span className="font-light text-slate-400 text-sm">| ShopAgora</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-bold uppercase tracking-wider">
                PS41 Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
              Real-Time Voice Commerce • Agora RTC & Murf Falcon TTS
            </p>
          </div>
        </div>

        {/* Real-time Status Badges */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Agora RTC Pill */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs shadow-sm">
            <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span className="text-slate-400">Agora RTC:</span>
            <span className="text-sky-400 font-semibold">
              {agoraStatus.isConnected ? (agoraStatus.isDemo ? "Sandbox Channel (24ms)" : "Live Production") : "Ready"}
            </span>
          </div>

          {/* Murf Falcon Pill */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs shadow-sm">
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400">Murf Falcon:</span>
            <span className="text-purple-400 font-semibold">Low-Latency Studio</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Customer Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800/80 transition-all text-xs font-semibold shadow-sm"
            title="Customer Profile & Past Purchases"
          >
            <div className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
              AM
            </div>
            <span className="hidden sm:inline">Alex Morgan</span>
            <span className="hidden md:inline px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px]">
              VIP
            </span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 transition-all shadow-sm"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] font-bold shadow-lg shadow-indigo-500/50 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all shadow-sm"
            title="Voice & Agora Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
