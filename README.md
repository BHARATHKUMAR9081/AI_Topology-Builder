# AI Topology Builder — Dynamic Neural Network Graph

An interactive React + Vite web application that reshapes and visualizes arbitrary/live JSON into a radial node graph with an **AI normalization layer** and **incremental topology reconciliation engine**.

![Dark Ops Center Theme](https://img.shields.io/badge/Theme-Dark%20Ops%20Center-05070b)
![ReactFlow](https://img.shields.io/badge/Graph-ReactFlow-6ee7ff)
![AI Layer](https://img.shields.io/badge/AI-Anthropic%20Claude-ff8a5c)

---

## 🌟 Key Features

1. **Central Brain Node**: A central root node with glowing pulsing cyan halos (`#6ee7ff`) connected to all top-level topology elements.
2. **Radial Concentric Layout**: Nodes fan outward in rings by depth, with subtree angular allocation proportional to leaf count.
3. **AI Normalization Layer (`src/lib/normalizeTopology.js`)**:
   - Reshapes arbitrary JSON payloads into a flat topology schema: `{ nodes: [{ id, key, kind, preview, parentId }] }`.
   - Generates **stable slug-based IDs** (`root.server`, `root.server.os`, `root.database`) so identity persists across runs.
   - Summarizes large arrays and deep structures rather than simple 1:1 key walks.
4. **Incremental Graph Reconciliation (`src/lib/reconcileGraph.js`)**:
   - Preserves existing node positions and identity without snapping or full re-layouts.
   - **Entrance Animations**: New nodes sprout and animate in with a scale + fade + glowing orange pulse (`#ff8a5c`).
   - **Update Highlights**: Changed node values trigger a brief glowing pulse.
   - **Exit Animations**: Removed nodes fade and shrink out before removal.
5. **Backend Express Proxy (`server/index.js`)**:
   - Securely proxies API requests server-side without exposing API keys to the browser client.
6. **Local Fallback Parser (`src/lib/jsonToGraph.js`)**:
   - Built-in fallback parser so the app works out-of-the-box offline or when no API key is set.
7. **Handwritten Note Preset**:
   - Pre-loaded with the infrastructure JSON structure from the handwritten photo (`server`: `os`, `vm`, `something`, `database`, `services`).

---

## 🚀 Quick Start & Setup

### 1. Configure Environment Variables
Copy `.env.example` to `.env` and add your **Groq API Key** (get a free key at [console.groq.com](https://console.groq.com)):

```bash
cp .env.example .env
```

`.env` content:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
PORT=3001
```

*(Note: If left blank, the application automatically uses the local fallback parser so the app works offline or without a key!)*


### 2. Run Backend & Frontend

Start the backend proxy server and frontend Vite application:

```bash
# Terminal 1: Backend Server (Port 3001)
npm run server

# Terminal 2: Frontend Vite Dev Server (Port 5173)
npm run dev
```

Or run `npm run build` to compile the production bundle.

---

## 🧪 Testing Live Updates

Click **"Simulate Live Updates"** in the control sidebar. The application will mutate telemetry metrics (such as active connections, uptime percentages, and VM instances) every few seconds. Watch how stable node IDs maintain their position on screen while updated metrics pulse and new nodes sprout dynamically!
