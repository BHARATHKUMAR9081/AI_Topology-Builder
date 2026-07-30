/**
 * Local Fallback Parser for JSON Topology
 * Expands key components into graph nodes with controlled depth (~5 levels) and leaf spacing.
 */

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[\s\W_]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'node';
}

export function jsonToGraph(rawJson) {
  const nodes = [];
  let parsed;

  if (typeof rawJson === 'string') {
    try {
      parsed = JSON.parse(rawJson);
    } catch (e) {
      throw new Error(`JSON Syntax Error: ${e.message}`);
    }
  } else {
    parsed = rawJson;
  }

  const MAX_DEPTH = 5;
  const MAX_CHILDREN = 14;

  function traverse(data, key = 'Root', parentId = null, path = 'root', depth = 0) {
    if (depth > MAX_DEPTH) return;

    const id = path;
    const isObject = typeof data === 'object' && data !== null && !Array.isArray(data);
    const isArray = Array.isArray(data);

    // 1. Emit Node for this Component Key
    nodes.push({
      id,
      key: String(key),
      kind: isObject ? 'object' : isArray ? 'array' : typeof data,
      preview: isObject || isArray ? '' : String(data),
      parentId,
      depth,
    });

    // 2. Expand Children
    if (isObject) {
      const keys = Object.keys(data).slice(0, MAX_CHILDREN);
      keys.forEach(k => {
        const childPath = `${id}.${slugify(k)}`;
        traverse(data[k], k, id, childPath, depth + 1);
      });
    } else if (isArray) {
      // EXPAND ARRAY: Create individual child nodes for array elements
      const items = data.slice(0, MAX_CHILDREN);
      items.forEach((item, index) => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          const itemLabel = item.name || item.hostname || item.id || item.type || `Item ${index + 1}`;
          const childPath = `${id}.${slugify(itemLabel)}_${index}`;
          traverse(item, itemLabel, id, childPath, depth + 1);
        } else {
          const itemLabel = String(item);
          const childPath = `${id}.${slugify(itemLabel)}_${index}`;
          nodes.push({
            id: childPath,
            key: itemLabel,
            kind: typeof item,
            preview: String(item),
            parentId: id,
            depth: depth + 1,
          });
        }
      });
    }
  }

  // Handle top-level payload
  if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
    const keys = Object.keys(parsed).slice(0, MAX_CHILDREN);
    keys.forEach(k => {
      traverse(parsed[k], k, null, slugify(k), 1);
    });
  } else {
    traverse(parsed, 'Root', null, 'root', 1);
  }

  return { nodes };
}
