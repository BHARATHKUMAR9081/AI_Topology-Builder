import React, { useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { BrainNode } from './BrainNode';
import { DataNode } from './DataNode';
import { SynapseEdge } from './SynapseEdge';

const nodeTypes = {
  brainNode: BrainNode,
  dataNode: DataNode,
};

const edgeTypes = {
  synapse: SynapseEdge,
};

export function TopologyCanvas({ initialNodes = [], initialEdges = [], onNodeClick }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const isFirstLoadRef = useRef(true);
  const reactFlowInstanceRef = useRef(null);

  // Synchronize incoming reconciled nodes & edges without resetting camera position
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);

    if (isFirstLoadRef.current && initialNodes.length > 0 && reactFlowInstanceRef.current) {
      setTimeout(() => {
        reactFlowInstanceRef.current?.fitView({ padding: 0.3, duration: 800 });
        isFirstLoadRef.current = false;
      }, 100);
    }
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleInit = (instance) => {
    reactFlowInstanceRef.current = instance;
    if (initialNodes.length > 0) {
      instance.fitView({ padding: 0.3, duration: 800 });
      isFirstLoadRef.current = false;
    }
  };

  return (
    <div className="relative w-full h-full bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={handleInit}
        onNodeClick={onNodeClick}
        minZoom={0.15}
        maxZoom={2.5}
        defaultEdgeOptions={{ type: 'synapse' }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant="dots" gap={24} size={1.5} color="#cbd5e1" />
        <Controls
          className="!bg-white/90 !border-slate-200 !text-slate-700 !rounded-xl shadow-lg"
          showInteractive={false}
        />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'brainNode') return '#0ea5e9';
            return '#3b82f6';
          }}
          maskColor="rgba(248, 250, 252, 0.8)"
          className="!bg-white/90 !border-slate-200 !rounded-xl overflow-hidden shadow-xl"
        />
      </ReactFlow>
    </div>
  );
}
