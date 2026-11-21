import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Send, Play, Radio, VolumeX, RotateCcw, Sliders } from 'lucide-react';
import { voiceAgent } from '../services/voiceAgent';

export default function VoiceAssistantOrb({
  voiceState,
  onSendMessage,
  transcript,
  lastAgentSpeech,
  onToggleMic,
  isMicActive
}) {
  const [inputText, setInputText] = useState("");
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const canvasRef = useRef(null);

  // Grouped Shopping Journey Prompt Chips
  const promptGroups = [
    {
      category: "1. Discover",
      prompts: [
        { label: "Top Headphones", text: "Find top noise-cancelling headphones", icon: "🎧" }
      ]
    },
    {
      category: "2. Compare",
      prompts: [
        { label: "Sony XM5 vs Bose Ultra", text: "Compare Sony XM5 vs Bose QuietComfort", icon: "⚖️" }
      ]
    },
    {
      category: "3. Inventory",
      prompts: [
        { label: "SF Warehouse Stock", text: "Check inventory at San Francisco warehouse", icon: "📦" }
      ]
    },
    {
      category: "4. Buy & Discount",
      prompts: [
        { label: "Add & Save $80", text: "Add Sony XM5 and apply my VIP discount", icon: "🛒" }
      ]
    },
    {
      category: "5. Checkout",
      prompts: [
        { label: "1-Click Checkout", text: "Proceed to checkout with my saved Visa", icon: "💳" }
      ]
    },
    {
      category: "6. Follow Up",
      prompts: [
        { label: "Track Van #42", text: "Track my delivery status", icon: "🚚" },
        { label: "Pre-Approved Return", text: "How do I return my previous order?", icon: "🔄" }
      ]
    }
  ];

  // Enhanced Oscilloscope Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      let waveCount = 3;
      let baseAmplitude = 8;
      let frequency = 0.04;
      let color = "rgba(99, 102, 241, 0.4)";

      if (voiceState === "speaking") {
        baseAmplitude = 24;
        frequency = 0.08;
        color = "rgba(168, 85, 247, 0.85)";
      } else if (voiceState === "listening") {
        baseAmplitude = 18;
        frequency = 0.06;
        color = "rgba(9, 157, 253, 0.85)";
      }

      // Draw multi-layered animated frequency ribbons
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const amp = baseAmplitude * (1 - w * 0.25);
        const freqOffset = w * 0.015;
        const phaseOffset = w * 0.8;

        for (let x = 0; x < width; x += 4) {
          const y = centerY + Math.sin(x * (frequency + freqOffset) + phase + phaseOffset) * 
                    amp * Math.sin((x / width) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
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

  const handleReplayVoice = () => {
    if (lastAgentSpeech) {
      voiceAgent.speak({ text: lastAgentSpeech });
    }
  };

  const handleSpeedChange = (speed) => {
    setSpeechSpeed(speed);
    voiceAgent.speechRate = speed;
    if (lastAgentSpeech) {
      voiceAgent.speak({ text: lastAgentSpeech });
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden mb-8">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* Top Control Bar with Audio Options */}
        <div className="w-full flex items-center justify-between pb-4 mb-2 text-xs text-slate-400 border-b border-slate-800/60">
          <div className="flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span className="font-semibold text-slate-300">Agora AI Voice Gateway</span>
          </div>

          {/* Voice Speed Controls */}
          <div className="flex items-center space-x-1.5 bg-slate-900/80 px-2 py-1 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 mr-1">Speed:</span>
            {[0.9, 1.0, 1.1].map(spd => (
              <button
                key={spd}
                onClick={() => handleSpeedChange(spd)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                  speechSpeed === spd ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Central Voice Orb & Waveform Display */}
        <div className="relative w-full max-w-lg h-36 flex items-center justify-center my-2">
          
          {/* Animated Canvas Waveform */}
          <canvas
            ref={canvasRef}
            width={480}
            height={140}
            className="w-full h-full pointer-events-none"
          />

          {/* Central Interactive Mic Button */}
          <button
            onClick={onToggleMic}
            className={`absolute z-20 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              voiceState === "speaking"
                ? "bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 glow-murf scale-105"
                : voiceState === "listening"
                ? "bg-gradient-to-tr from-sky-500 via-indigo-600 to-sky-400 glow-agora scale-105"
                : "bg-slate-900 border-2 border-slate-700/80 hover:border-indigo-500/60 hover:scale-105"
            }`}
            title="Click to speak with Agora Conversational AI"
          >
            {voiceState === "speaking" ? (
              <Volume2 className="w-8 h-8 text-white animate-pulse" />
            ) : isMicActive ? (
              <Mic className="w-8 h-8 text-sky-300 animate-bounce" />
            ) : (
              <MicOff className="w-8 h-8 text-slate-400 hover:text-slate-200" />
            )}
          </button>
        </div>

        {/* Dynamic Voice State Pill */}
        <div className="mb-4">
          <span className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border shadow-sm ${
            voiceState === "speaking"
              ? "bg-purple-950/80 border-purple-500/50 text-purple-200 glow-murf"
              : voiceState === "listening"
              ? "bg-sky-950/80 border-sky-500/50 text-sky-200 glow-agora"
              : "bg-slate-900/80 border-slate-800 text-slate-400"
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              voiceState === "speaking" 
                ? "bg-purple-400 animate-ping" 
                : voiceState === "listening" 
                ? "bg-sky-400 animate-ping" 
                : "bg-slate-500"
            }`} />
            <span>
              {voiceState === "speaking"
                ? "Murf Falcon Studio Speaking • Low-Latency Audio Stream"
                : voiceState === "listening"
                ? "Agora RTC Listening to your microphone..."
                : "Agora AI Ready • Tap Mic or Click Any Shopping Journey Prompt Below"}
            </span>
          </span>
        </div>

        {/* Speech Subtitles Box with Replay Button */}
        <div className="w-full max-w-2xl min-h-[64px] flex flex-col justify-center mb-6">
          {lastAgentSpeech ? (
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-100 text-sm leading-relaxed shadow-sm text-left relative group">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-indigo-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Agora AI Assistant Response:
                </span>
                <button
                  onClick={handleReplayVoice}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-indigo-900/60 hover:bg-indigo-800 text-indigo-300 text-[11px] font-medium transition-colors"
                  title="Replay Voice Audio"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Replay Voice</span>
                </button>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">
                "{lastAgentSpeech}"
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs sm:text-sm">
              "Hi Alex! I'm your Agora AI Shopping Concierge. Tell me what you're looking for, or click any prompt below."
            </div>
          )}

          {transcript && (
            <div className="mt-2 text-xs text-sky-400 font-mono text-left pl-2">
              You asked: "{transcript}"
            </div>
          )}
        </div>

        {/* Category Grouped Shopping Prompt Chips */}
        <div className="w-full max-w-4xl mb-6">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Click Any Complete Shopping Journey Stage:
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2">
            {promptGroups.flatMap(g => g.prompts).map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(item.text)}
                className="group flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white transition-all duration-200 active:scale-95 shadow-sm"
              >
                <span className="text-sm">{item.icon}</span>
                <span className="font-bold text-indigo-400">{item.label}:</span>
                <span className="text-slate-300 group-hover:text-slate-100">{item.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Search Bar */}
        <form onSubmit={handleSubmit} className="w-full max-w-xl flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Or type a question (e.g., 'Compare Sony XM5 vs Bose Ultra')..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white transition-all shadow-lg shadow-indigo-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
