import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Send, Play, Radio, VolumeX } from 'lucide-react';

export default function VoiceAssistantOrb({
  voiceState,
  onSendMessage,
  transcript,
  lastAgentSpeech,
  onToggleMic,
  isMicActive
}) {
  const [inputText, setInputText] = useState("");
  const canvasRef = useRef(null);

  // Quick Action Demo Prompts covering the complete shopping journey
  const quickPrompts = [
    { label: "1. Discover", text: "Find top noise-cancelling headphones", icon: "🎧" },
    { label: "2. Compare", text: "Compare Sony XM5 vs Bose QuietComfort", icon: "⚖️" },
    { label: "3. Stock", text: "Check inventory at San Francisco warehouse", icon: "📦" },
    { label: "4. Buy & Discount", text: "Add Sony XM5 and apply my VIP discount", icon: "🛒" },
    { label: "5. Checkout", text: "Proceed to checkout with my saved Visa", icon: "💳" },
    { label: "6. Track", text: "Track my delivery status", icon: "🚚" },
    { label: "7. Returns", text: "How do I return my previous order?", icon: "🔄" }
  ];

  // Canvas Waveform Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 42;

      // Determine wave intensity based on state
      let amplitude = 6;
      let frequency = 0.05;
      let strokeColor = "rgba(99, 102, 241, 0.4)";

      if (voiceState === "speaking") {
        amplitude = 18;
        frequency = 0.12;
        strokeColor = "rgba(168, 85, 247, 0.9)"; // Murf Neon
      } else if (voiceState === "listening") {
        amplitude = 14;
        frequency = 0.08;
        strokeColor = "rgba(9, 157, 253, 0.9)"; // Agora Cyan
      }

      // Draw concentric waveform circles
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const currentRadius = radius + i * 14 + Math.sin(phase + i) * amplitude;
        ctx.arc(centerX, centerY, Math.max(10, currentRadius), 0, Math.PI * 2);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      phase += frequency;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [voiceState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden mb-8">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* Animated Voice Orb Centerpiece */}
        <div className="relative mb-6">
          <canvas
            ref={canvasRef}
            width={240}
            height={240}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          />

          {/* Central Pulsing Interactive Button */}
          <button
            onClick={onToggleMic}
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              voiceState === "speaking"
                ? "bg-gradient-to-tr from-purple-600 to-indigo-600 glow-murf scale-105"
                : voiceState === "listening"
                ? "bg-gradient-to-tr from-sky-500 to-indigo-600 glow-agora scale-105"
                : "bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700 hover:border-indigo-500/50 hover:scale-105"
            }`}
            title="Click to Speak or Toggle Agora Voice Stream"
          >
            {voiceState === "speaking" ? (
              <Volume2 className="w-10 h-10 text-white animate-bounce" />
            ) : isMicActive ? (
              <Mic className="w-10 h-10 text-sky-300 animate-pulse" />
            ) : (
              <MicOff className="w-10 h-10 text-slate-400" />
            )}
          </button>
        </div>

        {/* Dynamic Voice State Pill */}
        <div className="mb-4">
          <span className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border shadow-sm ${
            voiceState === "speaking"
              ? "bg-purple-950/80 border-purple-500/40 text-purple-300 glow-murf"
              : voiceState === "listening"
              ? "bg-sky-950/80 border-sky-500/40 text-sky-300 glow-agora"
              : "bg-slate-900/80 border-slate-800 text-slate-400"
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              voiceState === "speaking" ? "bg-purple-400 animate-ping" : voiceState === "listening" ? "bg-sky-400 animate-ping" : "bg-slate-500"
            }`} />
            <span>
              {voiceState === "speaking"
                ? "Murf Falcon Speaking (Low-Latency Stream)"
                : voiceState === "listening"
                ? "Agora RTC Listening to your microphone..."
                : "Agora Voice Assistant Idle • Click to Speak or Pick Prompt"}
            </span>
          </span>
        </div>

        {/* Live Speech Feedback Bubbles */}
        <div className="w-full max-w-2xl min-h-[56px] flex flex-col justify-center mb-6">
          {lastAgentSpeech ? (
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-indigo-100 text-sm leading-relaxed shadow-sm">
              <span className="font-semibold text-indigo-400 mr-2">Agora AI:</span>
              "{lastAgentSpeech}"
            </div>
          ) : (
            <p className="text-slate-400 text-sm">
              "Hi Alex! Ask me to recommend headphones, compare models, check warehouse stock, or apply your VIP discount."
            </p>
          )}

          {transcript && (
            <div className="mt-2 text-xs text-sky-400 font-mono">
              You said: "{transcript}"
            </div>
          )}
        </div>

        {/* Quick Voice Prompt Pills */}
        <div className="w-full max-w-3xl mb-6">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
            Click to Simulate Customer Voice Journey:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(item.text)}
                className="group flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-indigo-200 transition-all duration-200 active:scale-95 shadow-sm"
              >
                <span>{item.icon}</span>
                <span className="font-semibold text-indigo-400">{item.label}:</span>
                <span className="text-slate-300">{item.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Fallback Bar */}
        <form onSubmit={handleSubmit} className="w-full max-w-xl flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Or type a question (e.g. 'Compare Sony XM5 vs Bose Ultra')..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-all shadow-lg shadow-indigo-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
