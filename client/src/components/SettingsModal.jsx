import React, { useState } from 'react';
import { X, Settings, Radio, Volume2, Shield, Save, Check } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, onSave, initialConfig }) {
  const [agoraAppId, setAgoraAppId] = useState(initialConfig?.agoraAppId || "");
  const [agoraCert, setAgoraCert] = useState(initialConfig?.agoraCert || "");
  const [channelName, setChannelName] = useState(initialConfig?.channelName || "shopping-concierge-channel");
  const [murfApiKey, setMurfApiKey] = useState(initialConfig?.murfApiKey || "");
  const [murfVoiceId, setMurfVoiceId] = useState(initialConfig?.murfVoiceId || "en-US-falcon");
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      agoraAppId,
      agoraCert,
      channelName,
      murfApiKey,
      murfVoiceId
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1000);
  };

  const handleLoadDemo = () => {
    setAgoraAppId("demo-agora-app-id");
    setAgoraCert("demo-agora-certificate");
    setChannelName("shopping-concierge-live");
    setMurfApiKey("demo");
    setMurfVoiceId("en-US-falcon");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-slate-700 shadow-2xl overflow-hidden bg-slate-900/95 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Agora & Murf Falcon Settings</h3>
              <p className="text-xs text-slate-400">Configure Live Credentials or Sandbox Demo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Agora RTC Section */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
              <Radio className="w-4 h-4" />
              <span>Agora RTC & Conversational AI</span>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Agora App ID</label>
              <input
                type="text"
                value={agoraAppId}
                onChange={(e) => setAgoraAppId(e.target.value)}
                placeholder="Leave blank for Sandbox or enter Agora App ID"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-sky-500 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Agora App Certificate</label>
              <input
                type="password"
                value={agoraCert}
                onChange={(e) => setAgoraCert(e.target.value)}
                placeholder="Agora App Certificate"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-sky-500 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Channel Name</label>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-sky-500 text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* Murf AI Falcon TTS Section */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
              <Volume2 className="w-4 h-4" />
              <span>Murf AI Falcon Low-Latency TTS</span>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Murf Falcon API Key</label>
              <input
                type="password"
                value={murfApiKey}
                onChange={(e) => setMurfApiKey(e.target.value)}
                placeholder="Leave blank for Sandbox or enter Murf API Key"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Falcon Voice Profile</label>
              <select
                value={murfVoiceId}
                onChange={(e) => setMurfVoiceId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-500 text-xs text-white outline-none"
              >
                <option value="en-US-falcon">en-US-falcon (Ultra-Fast Conversational Concierge)</option>
                <option value="en-US-marcus">en-US-marcus (Authoritative Tech Advisor)</option>
                <option value="en-US-natalie">en-US-natalie (Warm Premium Retail Assistant)</option>
                <option value="en-UK-hazel">en-UK-hazel (Sophisticated British Retail Guide)</option>
              </select>
            </div>
          </div>

          {/* Quick preset */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleLoadDemo}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              Reset to 1-Click Interactive Sandbox Preset
            </button>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30"
          >
            {savedNotice ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Configuration Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Apply Settings</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
