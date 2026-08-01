import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Brain } from 'lucide-react';

export const BrainNode = memo(() => {
  return (
    <div className="relative flex flex-col items-center justify-center group cursor-pointer">
      {/* Outer Pulse Rings */}
      <div className="absolute inset-0 -m-8 rounded-full border-2 border-sky-400/40 animate-ping pointer-events-none" />
      <div className="absolute inset-0 -m-4 rounded-full border-2 border-sky-400/60 pointer-events-none" />

      {/* Main Massive Brain Icon (Level 0 - Largest Node on Graph) */}
      <div className="relative p-6 rounded-full bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-900 border-4 border-sky-300 shadow-[0_0_60px_rgba(14,165,233,0.85)] backdrop-blur-xl group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
        <Brain className="w-24 h-24 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.95)] animate-pulse" />
      </div>

      {/* Prominent Root Label Pill */}
      <div className="mt-3 px-6 py-2.5 rounded-full bg-slate-950 border-2 border-sky-400 shadow-2xl text-center">
        <span className="font-sans font-black text-lg text-white tracking-wider block drop-shadow-md">
          AI Neural Brain
        </span>
        <span className="font-mono text-[10px] text-sky-400 font-bold block uppercase tracking-widest">
          Root Level 0
        </span>
      </div>

      {/* Source Handles for outgoing radial edges */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-sky-400 !w-4 !h-4 !border-2 !border-white shadow-lg"
      />
      <Handle
        type="source"
        position={Position.Top}
        className="!bg-sky-400 !w-4 !h-4 !border-2 !border-white shadow-lg"
      />
    </div>
  );
});

BrainNode.displayName = 'BrainNode';
