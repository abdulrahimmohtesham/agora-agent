import React, { useState } from 'react';
import { UserCheck, Compass, GitCompare, Zap, PackageCheck, Terminal, ChevronDown, ChevronUp, CheckCircle2, Clock } from 'lucide-react';

export default function AgentWorkflowTracker({ currentPhase, toolLogs = [] }) {
  const [showLogs, setShowLogs] = useState(false);

  const stages = [
    {
      id: "BEFORE",
      name: "1. Before",
      title: "Context Retrieval",
      desc: "Profile, XM4 history, vouchers",
      icon: UserCheck,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "DURING_DISCOVER",
      name: "2. Discover",
      title: "Product Search",
      desc: "Catalog semantic querying",
      icon: Compass,
      color: "from-indigo-500 to-blue-500"
    },
    {
      id: "DURING_RECOMMEND",
      name: "3. Recommend",
      title: "Compare & Advise",
      desc: "Sony XM5 vs Bose Ultra matrix",
      icon: GitCompare,
      color: "from-purple-500 to-indigo-500"
    },
    {
      id: "ACTION",
      name: "4. Execute",
      title: "Action & Checkout",
      desc: "Stock check, TECH20, sandbox card",
      icon: Zap,
      color: "from-amber-500 to-orange-500"
    },
    {
      id: "AFTER",
      name: "5. Follow Up",
      title: "Tracking & Returns",
      desc: "Courier milestones, RMA label",
      icon: PackageCheck,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  // Helper to determine stage state
  const getStageState = (stageId) => {
    if (currentPhase === stageId || (currentPhase === "ACTION_CONFIRMED" && stageId === "ACTION") || (currentPhase === "AFTER_TRACK" && stageId === "AFTER")) {
      return "active";
    }
    // Simple progression mapping
    const order = ["BEFORE", "DURING_DISCOVER", "DURING_RECOMMEND", "ACTION", "AFTER"];
    const currentIndex = order.indexOf(currentPhase?.split("_")[0] || "BEFORE");
    const stageIndex = order.indexOf(stageId.split("_")[0]);
    if (currentIndex > stageIndex) return "completed";
    return "pending";
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl mb-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            PS41 Agentic Workflow Pipeline
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            E2E Conversational Journey
          </span>
        </div>

        <button
          onClick={() => setShowLogs(!showLogs)}
          className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Agent Tool Call Inspector ({toolLogs.length})</span>
          {showLogs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 5 Stages Pipeline Stepper */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4">
        {stages.map((stage, idx) => {
          const state = getStageState(stage.id);
          const Icon = stage.icon;
          const isActive = state === "active";
          const isDone = state === "completed";

          return (
            <div
              key={stage.id}
              className={`relative p-3 rounded-xl border transition-all duration-300 ${
                isActive 
                  ? "bg-slate-900/90 border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40" 
                  : isDone
                  ? "bg-slate-950/60 border-slate-800/80 text-slate-300"
                  : "bg-slate-950/30 border-slate-800/40 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {stage.name}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isActive ? (
                  <Clock className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                ) : null}
              </div>

              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${stage.color} text-white shadow-sm`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {stage.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {stage.desc}
                  </div>
                </div>
              </div>

              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
              )}
            </div>
          );
        })}
      </div>

      {/* Expandable Tool Call Log Inspector */}
      {showLogs && (
        <div className="mt-4 p-3 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-[11px] max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-900 mb-2">
            <span className="font-semibold text-indigo-400">Agentic Tool Calling Execution Traces</span>
            <span className="text-[10px]">Real-Time Server Dispatch</span>
          </div>
          {toolLogs.length === 0 ? (
            <div className="text-slate-500 py-2 text-center">
              No tool calls recorded yet. Say or click a prompt below to trigger the agent workflow!
            </div>
          ) : (
            <div className="space-y-2">
              {toolLogs.map((log, index) => (
                <div key={index} className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span className="text-emerald-400 font-bold">▶ Tool: {log.tool}</span>
                    <span className="text-xs px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                      {log.phase}
                    </span>
                  </div>
                  <pre className="text-slate-400 text-[10px] overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(log.output, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
