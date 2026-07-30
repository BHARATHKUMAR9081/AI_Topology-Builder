import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { resolveIcon } from '../lib/icons';

export const DataNode = memo(({ data }) => {
  const { key, kind, isNew, justUpdated, isRemoving } = data;
  const IconComponent = resolveIcon(key, kind);

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
        className="!bg-sky-500 !w-3.5 !h-3.5 !border-2 !border-white shadow-md"
      />

      {/* Prominent Floating Brand Logo Icon (80px x 80px) */}
      <div className={`relative flex items-center justify-center p-1.5 ${animClass}`}>
        <IconComponent className="w-20 h-20 drop-shadow-xl" />
      </div>

      {/* Prominent, Ultra-Legible Text Label Pill (16px bold) */}
      <div className="mt-2 px-5 py-1.5 rounded-full bg-slate-900 border-2 border-slate-800 shadow-2xl text-center max-w-[230px] truncate">
        <span className="font-sans font-extrabold text-base text-white tracking-wide truncate block drop-shadow-md">
          {key}
        </span>
      </div>

      {/* Source handle for children */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-sky-500 !w-3.5 !h-3.5 !border-2 !border-white shadow-md"
      />
    </div>
  );
});

DataNode.displayName = 'DataNode';
