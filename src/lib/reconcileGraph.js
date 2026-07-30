import { computeRadialLayout } from './layoutMath';

export function reconcileGraph(prevNodes = [], prevEdges = [], schema = { nodes: [] }) {
  const newSchemaNodes = schema.nodes || [];
  const prevNodeMap = new Map(prevNodes.map(n => [n.id, n]));
  const schemaNodeMap = new Map(newSchemaNodes.map(n => [n.id, n]));

  // Compute reference radial positions for new nodes
  const layoutPositions = computeRadialLayout(newSchemaNodes);

  const reconciledNodes = [];
  const nextNodeIds = new Set();

  // 1. Brain Central Node
  const hasBrain = prevNodeMap.has('brain');
  const brainNode = {
    id: 'brain',
    type: 'brainNode',
    position: { x: 0, y: 0 },
    data: {
      label: 'AI Neural Brain',
      sublabel: `${newSchemaNodes.length} Active Nodes`,
    },
  };
  reconciledNodes.push(brainNode);
  nextNodeIds.add('brain');

  // 2. Process schema nodes
  newSchemaNodes.forEach(schemaNode => {
    const { id, key, kind, preview, parentId } = schemaNode;
    nextNodeIds.add(id);

    const prev = prevNodeMap.get(id);
    const layoutPos = layoutPositions.get(id) || { x: 100, y: 100, depth: 1 };

    if (prev) {
      // PRESERVED NODE: Keep existing position, update data in place
      const kindChanged = prev.data.kind !== kind;
      const previewChanged = prev.data.preview !== preview;
      const justUpdated = kindChanged || previewChanged;

      reconciledNodes.push({
        ...prev,
        type: 'dataNode',
        // Preserve position from previous graph state so layout does not snap!
        position: prev.position,
        data: {
          ...prev.data,
          key,
          kind,
          preview,
          parentId,
          depth: layoutPos.depth || prev.data.depth || 1,
          isNew: false,
          isRemoving: false,
          justUpdated,
        },
      });
    } else {
      // NEW NODE: Sprout dynamically using computed radial position
      // Find parent position for sprout animation reference
      const parentNode = schemaNode.parentId
        ? prevNodeMap.get(schemaNode.parentId)
        : prevNodeMap.get('brain');
      const startPos = parentNode ? { ...parentNode.position } : { x: layoutPos.x, y: layoutPos.y };

      reconciledNodes.push({
        id,
        type: 'dataNode',
        position: { x: layoutPos.x, y: layoutPos.y },
        data: {
          key,
          kind,
          preview,
          parentId,
          depth: layoutPos.depth || 1,
          isNew: true,
          isRemoving: false,
          justUpdated: false,
        },
      });
    }
  });

  // 3. Removed nodes (in prevNodes but not in new schema): mark isRemoving
  prevNodes.forEach(prevNode => {
    if (prevNode.id !== 'brain' && !schemaNodeMap.has(prevNode.id)) {
      // If node is already flagged as removing, keep it until timeout clears it
      reconciledNodes.push({
        ...prevNode,
        data: {
          ...prevNode.data,
          isRemoving: true,
        },
      });
    }
  });

  // 4. Reconcile Edges
  const reconciledEdges = [];

  reconciledNodes.forEach(node => {
    if (node.id === 'brain') return;

    const targetId = node.id;
    const sourceId = node.data.parentId || 'brain';
    const edgeId = `${sourceId}->${targetId}`;

    reconciledEdges.push({
      id: edgeId,
      source: sourceId,
      target: targetId,
      type: 'synapse',
      data: {
        isNew: node.data.isNew,
        isRemoving: node.data.isRemoving,
        depth: node.data.depth || 1,
      },
    });
  });

  return {
    nodes: reconciledNodes,
    edges: reconciledEdges,
  };
}
