import { jsonToGraph } from './jsonToGraph';

/**
 * Normalizes raw JSON payload directly via Groq LLM (/api/normalize).
 */
export async function normalizeTopology(rawJson, previousSchema = null) {
  let parsedJson;
  if (typeof rawJson === 'string') {
    try {
      parsedJson = JSON.parse(rawJson);
    } catch (e) {
      throw new Error(`Invalid JSON Input: ${e.message}`);
    }
  } else {
    parsedJson = rawJson;
  }

  try {
    const response = await fetch('/api/normalize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rawJson: parsedJson,
        previousSchema,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 429) {
      console.warn('Groq API Rate Limit (429) reached. Using local fallback.');
      const fallbackResult = jsonToGraph(parsedJson);
      return {
        nodes: fallbackResult.nodes,
        rawJson: parsedJson,
        isAiNormalized: false,
        notice: 'Groq Rate Limit hit (429) — using local parser for continuous rendering.',
      };
    }

    if (!response.ok) {
      if (data.error === 'NO_API_KEY') {
        const fallbackResult = jsonToGraph(parsedJson);
        return {
          nodes: fallbackResult.nodes,
          rawJson: parsedJson,
          isAiNormalized: false,
          notice: 'GROQ_API_KEY is missing in .env file — using local parser fallback.',
        };
      }
      throw new Error(data.message || `AI Normalization failed with status ${response.status}`);
    }

    if (!data || !Array.isArray(data.nodes)) {
      throw new Error('Invalid topology schema returned from AI model.');
    }

    return {
      nodes: data.nodes,
      rawJson: parsedJson,
      isAiNormalized: true,
    };
  } catch (err) {
    console.warn('AI API Unavailable. Falling back to local topology builder:', err);
    const fallbackResult = jsonToGraph(parsedJson);
    return {
      nodes: fallbackResult.nodes,
      rawJson: parsedJson,
      isAiNormalized: false,
      notice: err.message || 'Used local parser fallback due to network error.',
    };
  }
}

/**
 * Fetches raw JSON from teammate's backend API endpoint,
 * then sends it to Groq LLM (/api/normalize) to dynamically reshape into a topology graph.
 */
export async function fetchAndNormalizeTopology(backendUrl = '/api/raw-topology', previousSchema = null) {
  let rawJson;
  try {
    const rawRes = await fetch(backendUrl);
    if (!rawRes.ok) {
      throw new Error(`Failed to fetch backend JSON from ${backendUrl}: ${rawRes.statusText}`);
    }
    rawJson = await rawRes.json();
  } catch (err) {
    throw new Error(`Backend Connection Error: ${err.message}. Make sure teammate backend endpoint is running.`);
  }

  return normalizeTopology(rawJson, previousSchema);
}
