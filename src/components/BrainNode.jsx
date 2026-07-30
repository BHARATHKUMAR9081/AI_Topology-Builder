import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Brain } from '../lib/icons';

export const BrainNode = memo(({ data }) => {
  return (
    <div className="relative group cursor-pointer">
      {/* Outer Pulsing Halo Rings */}
      <div className="absolute -inset-5 rounded-full bg-sky-500/30 blur-2xl animate-pulse pointer-events-none" />
      <div className="absolute -inset-3 rounded-full border-2 border-sky-400/50 animate-ping opacity-40 pointer-events-none" style={{ animationDuration: '3s' }} />

      {/* Main Circular Node Core */}
      <div className="relative flex flex-col items-center justify-center w-26 h-26 rounded-full bg-[#090d16] border-3 border-sky-400 shadow-[0_0_35px_rgba(14,165,233,0.6)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_50px_rgba(14,165,233,0.8)]">
        <Brain className="w-11 h-11 text-sky-400 drop-shadow-[0_0_12px_rgba(14,165,233,0.8)] animate-pulse" />
        <span className="mt-1 font-mono text-[9px] uppercase tracking-wider text-sky-300 font-extrabold">
          ROOT
        </span>
      </div>

      {/* Title & Sublabel Pill below */}
      <div className="absolute top-30 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
        <div className="px-3.5 py-1.5 rounded-full bg-[#090d16] border border-sky-400/80 shadow-xl backdrop-blur-md">
          <div className="font-sans font-bold text-xs text-white tracking-wide">
            {data.label || 'AI Neural Brain'}
          </div>
          {data.sublabel && (
            <div className="font-mono text-[10px] text-sky-400 font-semibold">
              {data.sublabel}
            </div>
          )}
        </div>
      </div>

      {/* Handles for ReactFlow connections */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="!bg-sky-400 !w-2.5 !h-2.5 !border-0 opacity-0"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!bg-sky-400 !w-2.5 !h-2.5 !border-0 opacity-0"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!bg-sky-400 !w-2.5 !h-2.5 !border-0 opacity-0"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="!bg-sky-400 !w-2.5 !h-2.5 !border-0 opacity-0"
      />
    </div>
  );
});

BrainNode.displayName = 'BrainNode';
