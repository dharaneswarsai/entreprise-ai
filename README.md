# Entreprise AI OS — Enterprise Operations & Decision Intelligence SaaS

> **Official Hackathon Problem Statement Addressed:**  
> *"Organizations often struggle with fragmented data, disconnected workflows, repetitive manual tasks, and inefficient collaboration across departments. Design an AI-powered Enterprise AI solution that addresses a real-world business challenge by improving productivity, streamlining operations, enabling intelligent decision-making, and enhancing collaboration through automation and AI-driven insights."*

---

## 1. Product Vision & Core Promise
**Entreprise AI OS** transforms fragmented organizational operations into **one intelligent, synchronized workspace**:
- **Centralizes Operational Information**: Live Command Center synthesizing projects, tasks, approvals, and workloads.
- **Connects Cross-Department Workflows**: Engineering, Operations, Marketing, and Finance coordinated via shared data models.
- **Automates Repetitive Work**: Event-driven Intelligent Workflow Automation with execution history and auto-escalations.
- **Detects Bottlenecks**: Deterministic Decision Intelligence Radar flagging deadline risks and approval stagnations with transparent evidence.
- **Human-in-the-Loop AI Assistant**: Server-side AI provider grounded strictly in authorized enterprise records with one-click action authorization.

---

## 2. Architecture & Monorepo Structure

```
entreprise-ai/
├── frontend/                     # React 19 + Vite + TypeScript (Deployable to Vercel)
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/           # UI elements & AIBrainDrawer (Human-in-the-Loop)
│   │   ├── context/              # Auth & App state management
│   │   ├── layouts/              # DashboardLayout with permission-aware navigation
│   │   ├── pages/                # 26 Production Pages (Workflows, Insights, CRM, etc.)
│   │   ├── services/             # Centralized API service (api.ts)
│   │   └── types/                # Domain type definitions
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
├── backend/                      # Node.js + Express + TypeScript (Deployable to Render)
│   ├── src/
│   │   ├── config/               # Environment & PostgreSQL DDL schema (schema.sql)
│   │   ├── middleware/           # Tenant isolation, auth verification & error handling
│   │   ├── repositories/         # Multi-tenant persistent enterprise repository
│   │   ├── routes/               # REST endpoints (health, dashboard, tasks, AI, etc.)
│   │   ├── services/             # AI service, Workflow engine, Decision intelligence
│   │   ├── types/                # Backend domain types
│   │   ├── app.ts                # Express app factory & CORS configuration
│   │   └── server.ts             # Production server entry point (PORT: 10000)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── docs/
│   ├── ARCHITECTURE.md           # System design & security architecture
│   ├── API.md                    # Complete REST API reference
│   ├── DATABASE.md               # PostgreSQL schema & RLS policies
│   └── DEPLOYMENT.md             # Vercel & Render step-by-step guides
│
├── package.json                  # Monorepo scripts
└── README.md
```

---

## 3. Preserved Modules & Enterprise Additions

### Preserved Working Features (100% Retained)
All 24 original agency operations modules remain fully functional:
- **CRM & Leads Pipeline**: Lead board, cold calling CRM, interactive audio/notes.
- **Client 360**: Retainer health, contact directories, client portal.
- **Creative & Production**: Content board, Designer workspace, Video editor workspace.
- **Finance**: Invoices, payment reconciliation, expenses.
- **Collaboration**: Team workload boards, agency calendar, direct communications, asset library.

### New Enterprise SaaS Modules
1. **Enterprise Command Center** (`/command-center`): Live operational metrics, cross-department workload breakdown, and prioritized actions.
2. **Intelligent Workflow Automation** (`/workflows`): Event-driven triggers, condition evaluation, live test-run triggers, and tamper-evident run logs.
3. **Decision Intelligence Radar** (`/insights`): Transparent, deterministic detection of delivery vulnerabilities, workload imbalances, and approval stagnations.
4. **Data-Grounded AI Brain** (Assistant Drawer): Server-side authorized tool registry, zero-hallucination facts, and human-in-the-loop action approval cards.

---

## 4. Local Development Quickstart

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Running Both Applications

#### Terminal 1 — Backend Operations Server
```bash
cd backend
npm install
npm run dev
# Server starts on http://localhost:10000
# Verified health endpoint: http://localhost:10000/api/health
```

#### Terminal 2 — Frontend Application
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

Alternatively, from the repository root:
```bash
npm run dev:backend
npm run dev:frontend
```

---

## 5. Hackathon Live Demonstration Walkthrough

Follow this 7-step presentation script to demonstrate the platform:

### Step 1 — Problem Framing (30 seconds)
Open the app at `http://localhost:5173`. Explain that modern enterprise teams suffer from disconnected tools, manual task escalations, and ungrounded AI chat toys that cannot take safe actions.

### Step 2 — Enterprise Command Center (`/command-center`)
Highlight live operational health:
- Show **3 Active Projects**, **2 Overdue Tasks**, and **2 Pending Approvals**.
- Point to the **Engineering at 145% Capacity** workload imbalance.

### Step 3 — Decision Intelligence Radar (`/insights`)
Navigate to **Decision Insights**:
- Show the **Critical Bottleneck: OmniCloud Modernization** with exact observable evidence.
- Click **"Acknowledge"** or **"Mark Resolved"** to show instant live database updates.

### Step 4 — Conversational AI with Truth-in-Data Grounding
Click the **AI Brain** button in the top navigation bar:
- Select the prompt: *"Analyze our current operations and bottlenecks"*.
- Point out the **Observed Facts** tag, **Supporting Records** (`[PROJECT] proj-1`, `[TASK] tsk-101`), and **Risks**.
- Explain that the engine operates on real authorized tenant data rather than fabricated text.

### Step 5 — Human-in-the-Loop Action Confirmation
In the AI Brain drawer:
- Note the **Human-in-the-Loop Action Proposal Card**: *"Escalate overdue task 'Database connection pooling'..."*.
- Click **"Confirm & Execute Action"**.
- Watch the backend execute the authorized escalation, bump the task level, dispatch a notification, and log an audit event!

### Step 6 — Live Workflow Automation Execution (`/workflows`)
Navigate to **Workflows**:
- Show the active enterprise rules: *"Overdue Task Intelligent Auto-Escalation"*.
- Click **"Test Run Now"**.
- Watch the live execution finish in milliseconds and append a verifiable record to the **Execution Audit Log**!

### Step 7 — Cross-Department Impact
Navigate to **Approvals** and **Tasks** to verify that the notifications and state changes propagated across departments.

---

## 6. Deployment (Vercel + Render)

- **Frontend (Vercel)**: Point Vercel root to `frontend/`. Output directory: `dist`. Set `VITE_API_BASE_URL` to your Render service URL.
- **Backend (Render)**: Create a Web Service pointing to `backend/`. Build command: `npm install && npm run build`. Start command: `npm start`.

Full detailed deployment guide available in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
