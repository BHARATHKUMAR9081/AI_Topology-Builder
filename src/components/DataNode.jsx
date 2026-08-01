import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { resolveIcon } from '../lib/icons';

export const DataNode = memo(({ data }) => {
  const { key, kind, depth = 1, isNew, justUpdated, isRemoving } = data;
  const IconComponent = resolveIcon(key, kind);

  // Dynamic Level-Based Sizing: Size decreases proportionally as radial level depth increases
  let logoSize = 'w-20 h-20'; // Level 1 (80px x 80px)
  let textStyle = 'text-base font-extrabold px-5 py-1.5 max-w-[230px]';

  if (depth === 2) {
    logoSize = 'w-16 h-16'; // Level 2 (64px x 64px)
    textStyle = 'text-sm font-bold px-4 py-1 max-w-[190px]';
  } else if (depth === 3) {
    logoSize = 'w-12 h-12'; // Level 3 (48px x 48px)
    textStyle = 'text-xs font-bold px-3 py-1 max-w-[160px]';
  } else if (depth >= 4) {
    logoSize = 'w-10 h-10'; // Level 4+ (40px x 40px)
    textStyle = 'text-[11px] font-semibold px-2.5 py-0.5 max-w-[140px]';
  }

  // Smooth hover and state animations
  let animClass = 'transition-all duration-300 ease-out transform-gpu';
  if (isNew) {
    animClass += ' animate-node-entrance drop-shadow-[0_0_30px_rgba(249,115,22,0.9)] scale-110';
  } else if (justUpdated) {
    animClass += ' animate-node-update drop-shadow-[0_0_30px_rgba(14,165,233,0.95)] scale-105';
  } else if (isRemoving) {
    animClass += ' opacity-0 scale-50 -translate-y-4 filter blur-sm';
  } else {
    animClass += ' hover:scale-115 hover:drop-shadow-[0_12px_24px_rgba(0,0,0,0.3)]';
  }

  return (
    <div className="relative flex flex-col items-center justify-center group cursor-pointer">
      {/* Target handle facing parent */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-sky-500 !w-3 !h-3 !border-2 !border-white shadow-md"
      />

      {/* Floating Brand Logo Icon (Size scaled by radial depth level) */}
      <div className={`relative flex items-center justify-center p-1 ${animClass}`}>
        <IconComponent className={`${logoSize} drop-shadow-xl`} />
      </div>

      {/* Text Label Pill (Typography scaled by radial depth level) */}
      <div className={`mt-1.5 rounded-full bg-slate-900 border-2 border-slate-800 shadow-2xl text-center truncate ${textStyle}`}>
        <span className="font-sans text-white tracking-wide truncate block drop-shadow-md">
          {key}
        </span>
      </div>

      {/* Source handle for children */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-sky-500 !w-3 !h-3 !border-2 !border-white shadow-md"
      />
    </div>
  );
});

DataNode.displayName = 'DataNode';
