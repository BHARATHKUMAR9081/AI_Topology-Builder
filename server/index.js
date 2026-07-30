import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Teammate Backend Endpoint Mock (serves raw payload from teammate backend)
app.get('/api/raw-topology', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    system: "production-cloud-fleet",
    servers: [
      {
        hostname: "app-server-01",
        os: "Ubuntu 22.04 LTS",
        vm: ["vm-web-1", "vm-web-2"],
        cpu: "16 Cores",
        memory: "64 GB",
        status: "active"
      },
      {
        hostname: "db-server-02",
        os: "RedHat 9",
        vm: ["vm-db-primary"],
        cpu: "32 Cores",
        memory: "128 GB",
        status: "healthy"
      }
    ],
    databases: {
      primary: {
        engine: "postgresql-v16",
        cluster_nodes: ["db-node-a", "db-node-b"],
        connection_pool: {
          active_connections: 54,
          max_connections: 200
        }
      }
    },
    services: {
      auth_service: { status: "healthy", uptime: "99.98%" },
      api_gateway: { routes: 32, rate_limit: 5000 }
    }
  });
});

const SYSTEM_PROMPT = `You are an AI Topology Architect. Your job is to convert complex JSON payloads into a clean, beautiful, well-spaced infrastructure topology graph.

OUTPUT REQUIREMENTS:
Return STRICT JSON ONLY matching this format:
{
  "nodes": [
    {
      "id": "stable-slug-id",
      "key": "display label",
      "kind": "object|array|string|number|boolean|null",
      "preview": "short value preview",
      "parentId": "id-or-null-for-root"
    }
  ]
}

STRICT RULES:
1. DO NOT include markdown formatting like \`\`\`json or any introductory text. Return ONLY raw JSON.
2. HIGH-LEVEL ARCHITECTURE TOPOLOGY:
   - Create a clean hierarchy (Max ~20-25 total nodes on graph, Max ~4 depth levels).
   - Group infrastructure components (e.g. Cluster -> Namespace -> Service / Database / Server -> Pods / VMs).
   - Expand arrays of components (e.g., if "vm" is ["vm-1", "vm-2"], create parent "vm" and child nodes "vm-1" and "vm-2").
   - Omit trivial internal primitive details (like "status: healthy" or "port: 8080") as separate nodes so the graph stays clean, spacious, and readable.
3. ID STABILITY IS CRITICAL: Create stable, deterministic slugified IDs based on property paths (e.g., "servers", "servers.app-server-01", "servers.app-server-01.vm", "servers.app-server-01.vm.vm-web-1").
4. CLEAN LABELS ONLY: "key" must contain ONLY the clean label name (e.g. "app-server-01", "vm-web-1", "Ubuntu 22.04"). DO NOT append badges like "[ARR]" or "[OBJ]" to the key name.
5. PARENT REF: Top-level properties directly under central root have parentId = null. Every child node must point to its parent node's "id".`;

app.post('/api/normalize', async (req, res) => {
  try {
    const { rawJson, previousSchema } = req.body;

    if (!rawJson) {
      return res.status(400).json({ error: 'Missing rawJson in request body' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_groq_api_key_here') {
      return res.status(503).json({
        error: 'NO_API_KEY',
        message: 'GROQ_API_KEY is not configured in server environment. Please set GROQ_API_KEY in .env file.',
      });
    }

    const userMessage = JSON.stringify({
      rawInput: rawJson,
      previousSchemaHint: previousSchema ? previousSchema.nodes?.map(n => n.id) : null,
    });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API Error:', response.status, errText);
      if (response.status === 429) {
        return res.status(429).json({
          error: 'RATE_LIMIT',
          message: 'Groq API rate limit exceeded (429 Too Many Requests).',
        });
      }
      return res.status(response.status).json({
        error: 'API_ERROR',
        message: `Groq API request failed: ${response.statusText}`,
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    const cleaned = content.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed || !Array.isArray(parsed.nodes)) {
      throw new Error('Invalid schema payload returned from AI');
    }

    return res.json(parsed);
  } catch (err) {
    console.error('Server Normalization Error:', err);
    return res.status(500).json({
      error: 'NORMALIZATION_FAILED',
      message: err.message || 'Failed to normalize topology',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Topology Builder backend proxy running on http://localhost:${PORT}`);
});
