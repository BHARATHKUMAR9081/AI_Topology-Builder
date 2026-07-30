import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchAndNormalizeTopology, normalizeTopology } from './lib/normalizeTopology';
import { reconcileGraph } from './lib/reconcileGraph';
import { TopologyCanvas } from './components/TopologyCanvas';
import { Sidebar } from './components/Sidebar';

export default function App() {
  // Teammate Backend Endpoint configuration (default: /api/raw-topology)
  const [backendEndpoint, setBackendEndpoint] = useState('/api/raw-topology');

  const [schema, setSchema] = useState({ nodes: [] });
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const [selectedNode, setSelectedNode] = useState(null);

  const [status, setStatus] = useState('ready');
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);
  const [isAiNormalized, setIsAiNormalized] = useState(false);
  const [isLiveSimulating, setIsLiveSimulating] = useState(false);

  // Refs to maintain graph state for reconciliation
  const currentNodesRef = useRef(nodes);
  const currentEdgesRef = useRef(edges);
  const currentSchemaRef = useRef(schema);

  useEffect(() => {
    currentNodesRef.current = nodes;
    currentEdgesRef.current = edges;
    currentSchemaRef.current = schema;
  }, [nodes, edges, schema]);

  // Main Pipeline A: Fetch JSON from Backend API -> Groq AI Normalization -> Graph Reconciliation
  const fetchAndBuildTopology = useCallback(async (endpointUrl = backendEndpoint) => {
    setStatus('normalizing');
    setError(null);

    try {
      // 1. Fetch JSON from Backend API & Normalize via Groq AI
      const res = await fetchAndNormalizeTopology(endpointUrl, currentSchemaRef.current);

      setIsAiNormalized(res.isAiNormalized);
      setNotice(res.notice || null);

      const newSchema = { nodes: res.nodes };
      setSchema(newSchema);

      // 2. Incremental Graph Reconciliation (preserves node positions & identity)
      const { nodes: nextNodes, edges: nextEdges } = reconcileGraph(
        currentNodesRef.current,
        currentEdgesRef.current,
        newSchema
      );

      setNodes(nextNodes);
      setEdges(nextEdges);
      setStatus('ready');

      // Schedule removal cleanup for exiting nodes
      setTimeout(() => {
        setNodes(prev => prev.filter(n => !n.data?.isRemoving));
        setEdges(prev => prev.filter(e => !e.data?.isRemoving));
      }, 700);

    } catch (err) {
      console.error('Topology generation error:', err);
      setError(err.message || 'Failed to fetch backend JSON or build AI topology');
      setStatus('ready');
    }
  }, [backendEndpoint]);

  // Pipeline B: Custom JSON payload normalization
  const handleNormalizeCustomJson = useCallback(async (customJsonInput) => {
    if (!customJsonInput || customJsonInput.trim() === '') return;
    setStatus('normalizing');
    setError(null);

    try {
      const res = await normalizeTopology(customJsonInput, currentSchemaRef.current);

      setIsAiNormalized(res.isAiNormalized);
      setNotice(res.notice || null);

      const newSchema = { nodes: res.nodes };
      setSchema(newSchema);

      const { nodes: nextNodes, edges: nextEdges } = reconcileGraph(
        currentNodesRef.current,
        currentEdgesRef.current,
        newSchema
      );

      setNodes(nextNodes);
      setEdges(nextEdges);
      setStatus('ready');

      setTimeout(() => {
        setNodes(prev => prev.filter(n => !n.data?.isRemoving));
        setEdges(prev => prev.filter(e => !e.data?.isRemoving));
      }, 700);

    } catch (err) {
      console.error('Custom JSON normalization error:', err);
      setError(err.message || 'Failed to normalize custom JSON');
      setStatus('ready');
    }
  }, []);

  // Run initial fetch on mount
  useEffect(() => {
    fetchAndBuildTopology(backendEndpoint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live Telemetry Simulation Effect
  useEffect(() => {
    let intervalId = null;

    if (isLiveSimulating) {
      intervalId = setInterval(() => {
        fetchAndBuildTopology(backendEndpoint);
      }, 7000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLiveSimulating, backendEndpoint, fetchAndBuildTopology]);

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden font-sans select-none">
      {/* Teammate Backend Fetch & Node Inspector Sidebar (Left Panel) */}
      <Sidebar
        backendEndpoint={backendEndpoint}
        setBackendEndpoint={setBackendEndpoint}
        onFetchAndBuild={fetchAndBuildTopology}
        onNormalizeCustomJson={handleNormalizeCustomJson}
        isLiveSimulating={isLiveSimulating}
        setIsLiveSimulating={setIsLiveSimulating}
        status={status}
        notice={notice}
        error={error}
        nodeCount={nodes.length}
        edgeCount={edges.length}
        isAiNormalized={isAiNormalized}
        selectedNode={selectedNode}
        onClearSelectedNode={() => setSelectedNode(null)}
        allNodes={nodes}
      />

      {/* Main Interactive Radial Canvas */}
      <main className="flex-1 h-full relative">
        <TopologyCanvas
          initialNodes={nodes}
          initialEdges={edges}
          onNodeClick={(event, node) => setSelectedNode(node)}
        />
        
      </main>
    </div>
  );
}
