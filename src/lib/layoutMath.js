/**
 * Radial Layout Math Engine
 * Computes concentric radial ring positions with optimal ring spacing.
 */

export function computeRadialLayout(nodes) {
  const nodeMap = new Map();
  const childrenMap = new Map();
  const rootIds = [];

  nodes.forEach(n => {
    nodeMap.set(n.id, { ...n });
    if (!n.parentId) {
      rootIds.push(n.id);
    } else {
      if (!childrenMap.has(n.parentId)) {
        childrenMap.set(n.parentId, []);
      }
      childrenMap.get(n.parentId).push(n.id);
    }
  });

  // Calculate leaf counts for proportional angular allocation
  const leafCountMap = new Map();
  function countLeaves(id) {
    const children = childrenMap.get(id) || [];
    if (children.length === 0) {
      leafCountMap.set(id, 1);
      return 1;
    }
    let total = 0;
    children.forEach(childId => {
      total += countLeaves(childId);
    });
    leafCountMap.set(id, total);
    return total;
  }

  rootIds.forEach(id => countLeaves(id));

  const positions = new Map();
  // Slightly decreased ring radius step so edges are tighter and nodes sit closer
  const totalNodesCount = nodes.length;
  const RING_RADIUS_STEP = totalNodesCount > 40 ? 255 : totalNodesCount > 20 ? 235 : 210;

  positions.set('brain', { x: 0, y: 0, depth: 0, angle: 0 });

  let currentAngle = -Math.PI / 2; // Start top
  const totalRootLeaves = rootIds.reduce((sum, id) => sum + (leafCountMap.get(id) || 1), 0);

  function layoutSubtree(id, depth, startAngle, endAngle) {
    const children = childrenMap.get(id) || [];
    const radius = depth * RING_RADIUS_STEP;

    const midAngle = (startAngle + endAngle) / 2;
    const x = Math.round(Math.cos(midAngle) * radius);
    const y = Math.round(Math.sin(midAngle) * radius);

    positions.set(id, { x, y, depth, angle: midAngle });

    if (children.length > 0) {
      const subtreeLeaves = leafCountMap.get(id) || 1;
      let childStartAngle = startAngle;

      children.forEach(childId => {
        const childLeaves = leafCountMap.get(childId) || 1;
        const sectorRatio = childLeaves / subtreeLeaves;
        const childEndAngle = childStartAngle + sectorRatio * (endAngle - startAngle);

        layoutSubtree(childId, depth + 1, childStartAngle, childEndAngle);
        childStartAngle = childEndAngle;
      });
    }
  }

  rootIds.forEach(rootId => {
    const leaves = leafCountMap.get(rootId) || 1;
    const sectorAngle = (leaves / totalRootLeaves) * (2 * Math.PI);
    const endAngle = currentAngle + sectorAngle;

    layoutSubtree(rootId, 1, currentAngle, endAngle);
    currentAngle = endAngle;
  });

  return positions;
}
