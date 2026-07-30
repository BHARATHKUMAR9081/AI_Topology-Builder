import React, { memo } from 'react';
import { getStraightPath } from '@xyflow/react';

export const SynapseEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data = {},
}) => {
  // Use getStraightPath for clean straight connection lines
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const { isNew, isRemoving, depth = 1 } = data;
  const baseOpacity = Math.max(0.4, 0.95 - depth * 0.08);

  let strokeColor = '#0ea5e9'; // Sky Blue
  if (isNew) strokeColor = '#f97316';
  if (isRemoving) strokeColor = '#ef4444';

  return (
    <g className="react-flow__edge-synapse transition-all duration-500">
      {/* Background Soft Glow Path */}
      <path
        id={`${id}-glow`}
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={isNew ? 4 : 3}
        strokeOpacity={baseOpacity * 0.2}
      />

      {/* Main Straight Dashed Line */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.8}
        strokeDasharray="5 5"
        strokeOpacity={baseOpacity}
        style={{
          animation: 'dash 14s linear infinite',
        }}
      />

      {/* Floating Synapse Pulse Particle Along Straight Line */}
      <circle r="2.5" fill={strokeColor} className="shadow-sm">
        <animateMotion dur={`${2.5 + depth * 0.5}s`} repeatCount="indefinite" path={edgePath} />
      </circle>
    </g>
  );
});

SynapseEdge.displayName = 'SynapseEdge';
