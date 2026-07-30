import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Activity,
  Link2,
  Brain
} from 'lucide-react';
import { resolveIcon } from '../lib/icons';

export function NodeDetailsDrawer({ node, onClose, allNodes = [] }) {
  const [copied, setCopied] = useState(false);

  if (!node) return null;

  const data = node.data || {};
  const isBrain = node.type === 'brainNode';

  const key = isBrain ? 'AI Neural Brain' : data.key || 'Node';
  const preview = isBrain ? 'Central Topology Core' : data.preview;
  const parentId = isBrain ? null : data.parentId;
  const depth = isBrain ? 0 : data.depth || 1;

  const IconComponent = isBrain ? Brain : resolveIcon(key, data.kind);

  // Find direct child nodes
  const children = allNodes.filter(n => n.data?.parentId === node.id);
  // Find parent node
  const parentNode = parentId ? allNodes.find(n => n.id === parentId) : null;

  const handleCopyJson = () => {
    const detailsPayload = {
      id: node.id,
      name: key,
      preview,
      parentId,
      depth,
      childCount: children.length,
    };
    navigator.clipboard.writeText(JSON.stringify(detailsPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute right-4 top-4 bottom-4 w-96 z-30 flex flex-col bg-white/95 border border-slate-200/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 shadow-xs">
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-sans font-bold text-sm text-slate-900 truncate tracking-wide">
              {key}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-[10px] text-sky-600 font-semibold uppercase">
                ID: {node.id}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
          title="Close Details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Content Body */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
        {/* Depth Metadata Grid */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-medium">
            Radial Depth Level
          </span>
          <span className="font-mono text-xs font-bold text-sky-600">
            Level {depth}
          </span>
        </div>

        {/* Value Preview Block (only if preview text exists and is not object summary) */}
        {preview && !preview.includes('field') && !preview.includes('item') && (
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-semibold text-xs text-slate-700 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              Value Information
            </label>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 break-all leading-relaxed max-h-36 overflow-y-auto custom-scrollbar">
              {String(preview)}
            </div>
          </div>
        )}

        {/* Hierarchy Context */}
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="font-sans font-semibold text-xs text-slate-700 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-purple-600" />
            Hierarchy Connections
          </span>

          {/* Parent Info */}
          <div className="flex items-center justify-between text-xs font-mono py-1 border-b border-slate-200">
            <span className="text-slate-500">Parent Component:</span>
            <span className="text-sky-600 font-bold">
              {parentNode ? parentNode.data?.key || parentNode.id : (parentId || 'Root / Brain')}
            </span>
          </div>

          {/* Children Count */}
          <div className="flex items-center justify-between text-xs font-mono py-1">
            <span className="text-slate-500">Connected Children:</span>
            <span className="text-emerald-600 font-bold">{children.length} node{children.length === 1 ? '' : 's'}</span>
          </div>
        </div>

        {/* Connected Child Nodes List */}
        {children.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-semibold text-xs text-slate-700">
              Connected Children ({children.length})
            </label>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto custom-scrollbar">
              {children.map(child => (
                <div
                  key={child.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                    <span className="font-sans font-bold text-slate-800 truncate">{child.data?.key || child.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex gap-2">
        <button
          onClick={handleCopyJson}
          className="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-sans font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              Copied Details!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-white" />
              Copy Component Info
            </>
          )}
        </button>
      </div>
    </div>
  );
}
