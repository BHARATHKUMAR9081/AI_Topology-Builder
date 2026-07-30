import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Activity,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Check,
  Link2,
  Brain,
  Info,
  Globe,
  RefreshCw,
  Cpu,
  FileCode,
  ChevronDown
} from 'lucide-react';
import { resolveIcon } from '../lib/icons';

export function Sidebar({
  backendEndpoint,
  setBackendEndpoint,
  onFetchAndBuild,
  onNormalizeCustomJson,
  isLiveSimulating,
  setIsLiveSimulating,
  status,
  notice,
  error,
  nodeCount,
  edgeCount,
  isAiNormalized,
  selectedNode,
  onClearSelectedNode,
  allNodes = [],
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCustomJsonInput, setShowCustomJsonInput] = useState(false);
  const [customJsonString, setCustomJsonString] = useState('');

  // Node details calculation when a component node is clicked
  const nodeData = selectedNode?.data || {};
  const isBrain = selectedNode?.type === 'brainNode';
  const nodeKey = isBrain ? 'AI Neural Brain' : nodeData.key || 'Node';
  const nodeParentId = isBrain ? null : nodeData.parentId;
  const nodeDepth = isBrain ? 0 : nodeData.depth || 1;

  const IconComponent = selectedNode ? (isBrain ? Brain : resolveIcon(nodeKey, nodeData.kind)) : Info;
  const childrenNodes = selectedNode ? allNodes.filter(n => n.data?.parentId === selectedNode.id) : [];
  const parentNode = nodeParentId ? allNodes.find(n => n.id === nodeParentId) : null;

  const handleCopyNodeInfo = () => {
    if (!selectedNode) return;
    const payload = {
      id: selectedNode.id,
      name: nodeKey,
      parentId: nodeParentId,
      depth: nodeDepth,
      childCount: childrenNodes.length,
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative flex flex-col h-full bg-[#070a12] border-r-2 border-sky-500/80 shadow-2xl transition-all duration-300 z-20 ${isCollapsed ? 'w-14' : 'w-[370px]'}`}>
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-6 z-30 p-1.5 rounded-full bg-[#070a12] border-2 border-sky-400 text-sky-400 hover:text-white hover:bg-sky-600 shadow-lg transition-all cursor-pointer"
        title={isCollapsed ? 'Expand Control Panel' : 'Collapse Panel'}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {isCollapsed ? (
        <div className="flex flex-col items-center py-6 gap-6 text-slate-400">
          <div className="p-2 rounded-xl bg-sky-950/80 border border-sky-500/50 text-sky-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col gap-4 text-xs font-mono items-center font-bold text-sky-300">
            <span title="Node Count">{nodeCount}N</span>
            <span title="Edge Count">{edgeCount}E</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full p-4 overflow-y-auto custom-scrollbar gap-4 text-slate-100">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500 text-slate-950 shadow-[0_0_15px_rgba(14,165,233,0.5)] font-bold">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="font-sans font-extrabold text-sm text-white tracking-wide">
                  AI Topology Builder
                </h1>
                <p className="font-mono text-[10px] text-sky-400 font-semibold flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-sky-400 inline" /> Groq AI Pipeline
                </p>
              </div>
            </div>

            {/* AI Status Badge */}
            <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-sky-950 text-sky-300 border border-sky-500/60 shadow-[0_0_10px_rgba(14,165,233,0.3)]">
              {isAiNormalized ? 'AI Reshaped' : 'Backend Ready'}
            </span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-2">
            <div className="px-3 py-2 rounded-xl bg-[#030509] border border-slate-800 flex items-center justify-between">
              <span className="font-mono text-[11px] text-slate-400">Total Nodes</span>
              <span className="font-mono font-bold text-xs text-sky-400">{nodeCount}</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-[#030509] border border-slate-800 flex items-center justify-between">
              <span className="font-mono text-[11px] text-slate-400">Edges</span>
              <span className="font-mono font-bold text-xs text-purple-400">{edgeCount}</span>
            </div>
          </div>

          {/* Teammate Backend Endpoint Config */}
          <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#030509] border border-slate-800">
            <label className="font-sans font-semibold text-xs text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                Backend API Endpoint
              </span>
            </label>
            <input
              type="text"
              value={backendEndpoint}
              onChange={(e) => setBackendEndpoint(e.target.value)}
              placeholder="/api/raw-topology"
              className="w-full px-3 py-2 rounded-xl bg-[#070a12] border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <p className="font-sans text-[10px] text-slate-400 leading-tight">
              Fetches JSON from backend API, passes payload to Groq AI LLM, and builds topology.
            </p>

            <button
              onClick={() => onFetchAndBuild(backendEndpoint)}
              disabled={status === 'normalizing'}
              className="w-full py-2.5 mt-1 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-sans font-extrabold text-xs uppercase tracking-wider shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${status === 'normalizing' ? 'animate-spin' : ''}`} />
              Fetch Backend API & AI Reshape
            </button>
          </div>

          {/* Optional Custom Test JSON Toggle */}
          <div className="flex flex-col rounded-2xl bg-[#030509] border border-slate-800 overflow-hidden">
            <button
              onClick={() => setShowCustomJsonInput(!showCustomJsonInput)}
              className="px-3 py-2.5 flex items-center justify-between text-xs font-sans font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-purple-400" />
                Paste Custom Test JSON
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCustomJsonInput ? 'rotate-180' : ''}`} />
            </button>

            {showCustomJsonInput && (
              <div className="p-3 pt-0 flex flex-col gap-2 border-t border-slate-800/80">
                <textarea
                  value={customJsonString}
                  onChange={(e) => setCustomJsonString(e.target.value)}
                  placeholder='{"servers": [{"name": "srv-01", "vm": ["vm-1", "vm-2"]}]}'
                  spellCheck="false"
                  className="w-full h-32 p-2.5 rounded-xl bg-[#070a12] border border-slate-800 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-purple-500 resize-none custom-scrollbar"
                />
                <button
                  onClick={() => onNormalizeCustomJson(customJsonString)}
                  disabled={status === 'normalizing' || !customJsonString.trim()}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-sans font-bold text-xs uppercase tracking-wider shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Render Custom Test JSON
                </button>
              </div>
            )}
          </div>

          {/* Status & Error Messages */}
          {status === 'normalizing' && (
            <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-500/50 flex items-center gap-2 text-sky-200 text-xs font-medium animate-pulse">
              <Activity className="w-4 h-4 animate-spin shrink-0 text-sky-400" />
              <span>Groq AI Reshaping Payload...</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/60 flex flex-col gap-1 text-rose-200 text-xs shadow-lg">
              <div className="flex items-center gap-2 font-semibold text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Backend / AI Error</span>
              </div>
              <p className="font-mono text-[11px] text-rose-200/90 leading-normal">{error}</p>
            </div>
          )}

          {notice && !error && status !== 'normalizing' && (
            <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/50 flex items-start gap-2 text-amber-200 text-[11px]">
              <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>{notice}</span>
            </div>
          )}

          {/* Live Telemetry Simulation Toggle */}
          <button
            onClick={() => setIsLiveSimulating(!isLiveSimulating)}
            className={`w-full py-2.5 rounded-xl border font-sans font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isLiveSimulating
                ? 'bg-orange-600 border-orange-500 text-white shadow-lg animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isLiveSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5 text-white" />
                Stop Live Telemetry Simulation
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-sky-400" />
                Simulate Live Backend Updates
              </>
            )}
          </button>

          {/* Selected Component Node Details Inspector */}
          <div className="flex flex-col gap-3 pt-3 border-t border-slate-800 flex-1">
            <span className="font-sans font-semibold text-xs text-slate-300 flex items-center justify-between">
              <span>Component Inspector</span>
              <span className="text-[10px] font-mono text-sky-400">Click Node to View</span>
            </span>

            {selectedNode ? (
              <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-[#030509] border-2 border-sky-500 shadow-xl">
                {/* Selected Node Card Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/40">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-sans font-bold text-sm text-white truncate">
                        {nodeKey}
                      </h2>
                      <span className="font-mono text-[10px] text-sky-400 uppercase font-semibold">
                        ID: {selectedNode.id}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onClearSelectedNode}
                    className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    title="Deselect Node"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Depth Metadata */}
                <div className="px-3 py-1.5 rounded-xl bg-[#070a12] border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Radial Depth Level:</span>
                  <span className="text-sky-400 font-bold">Level {nodeDepth}</span>
                </div>

                {/* Hierarchy Connections */}
                <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-[#070a12] border border-slate-800">
                  <span className="font-sans font-semibold text-xs text-white flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-purple-400" />
                    Hierarchy Connections
                  </span>

                  <div className="flex items-center justify-between text-xs font-mono py-0.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Parent Component:</span>
                    <span className="text-sky-400 font-bold">
                      {parentNode ? parentNode.data?.key || parentNode.id : (nodeParentId || 'Root / Brain')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono py-0.5">
                    <span className="text-slate-400">Connected Children:</span>
                    <span className="text-emerald-400 font-bold">
                      {childrenNodes.length} node{childrenNodes.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>

                {/* Children List */}
                {childrenNodes.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <label className="font-sans font-semibold text-xs text-slate-300">
                      Direct Child Nodes ({childrenNodes.length})
                    </label>
                    <div className="flex flex-col gap-1 max-h-40 overflow-y-auto custom-scrollbar">
                      {childrenNodes.map(child => (
                        <div
                          key={child.id}
                          className="p-2 rounded-xl bg-[#070a12] border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0 shadow-[0_0_8px_#0ea5e9]" />
                            <span className="font-sans font-bold text-white truncate">{child.data?.key || child.id}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Copy Details Button */}
                <button
                  onClick={handleCopyNodeInfo}
                  className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-sans font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      Copied Details!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-white" />
                      Copy Node Details
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500 gap-2 bg-[#030509] rounded-2xl border border-slate-800">
                <Info className="w-6 h-6 text-sky-500/60 animate-bounce" />
                <p className="font-sans text-xs text-slate-400">
                  Click any node component on the canvas to inspect its details right here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
