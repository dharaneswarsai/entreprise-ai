# Entreprise AI OS — Database & Supabase Persistence Guide

## 1. Overview
The **Entreprise AI OS** data architecture is engineered for multi-tenant enterprise operations with high-throughput isolation, real-time telemetry, and resilient dual-mode persistence:

1. **Production Supabase PostgreSQL**: Fully persistent cloud database powered by PostgreSQL 15, Row-Level Security (RLS) policies, and performance indexes defined in `backend/src/config/schema.sql`.
2. **Resilient In-Memory Failover**: When Supabase credentials are not yet configured or during temporary offline intervals, the system automatically falls back to an in-memory cache pre-seeded with all 5 enterprise businesses (`Apex Cloud Tech`, `Pulse Creative Media`, `Nexus BioHealth`, `Vanguard Logistics`, and `FinEdge Capital`) with zero downtime and zero crashes.

---

## 2. Quick Setup Guide (3 Minutes)

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create or open a project.
2. Under **Project Settings &rarr; API**, locate:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **anon / public key**
   - **service_role key** (keep secret; used by backend)

---

### Step 2: Run the Database Migration
1. In your Supabase dashboard, navigate to **SQL Editor** &rarr; **New query**.
2. Copy the contents of [`backend/src/config/schema.sql`](file:///c:/Users/Dharaneswar/entreprise%20ai/backend/src/config/schema.sql) and paste them into the SQL editor.
3. Click **Run** (or `Ctrl+Enter` / `Cmd+Enter`).
   > This creates all 11 enterprise tables, creates performance indexes, configures RLS policies, and inserts seed data for the 5 distinct enterprise businesses.

---

### Step 3: Configure Environment Variables

#### Backend Configuration: `backend/.env`
Open [`backend/.env`](file:///c:/Users/Dharaneswar/entreprise%20ai/backend/.env) and set your Supabase credentials:
```env
# Supabase PostgreSQL Configuration
SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
```

#### Frontend Configuration: `frontend/.env`
Open [`frontend/.env`](file:///c:/Users/Dharaneswar/entreprise%20ai/frontend/.env) and set:
```env
VITE_API_BASE_URL=http://localhost:10000
VITE_SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```

---

## 3. Verifying the Connection & Seeding

### Option A: Via the Web Application UI (Recommended)
1. Start the app:
   ```bash
   npm run dev
   ```
2. In the top navigation bar header, look for the **Database / Supabase** badge.
3. Click the badge to open the interactive **Supabase Database Console**:
   - **Test Ping**: Verifies live connectivity and displays latency in milliseconds.
   - **Seed Data to Supabase**: 1-click button to synchronize and seed all 5 enterprise businesses, departments, users, projects, tasks, and workflows directly to your Supabase tables.
   - **Quick Setup Guide**: Step-by-step instructions.
   - **SQL Schema Migration**: 1-click button to copy the schema SQL to clipboard.

### Option B: Via Command Line CLI Seeder
You can also seed or re-seed Supabase anytime via the terminal:
```bash
npm run seed:supabase
```
Or directly from the backend directory:
```bash
npm --prefix backend run seed:supabase
```

---

## 4. API Endpoints for Database Diagnostics

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health reporting `database: { type, configured, mode }` |
| `GET` | `/api/supabase/status` | Connection status, latency, and live table record counts |
| `POST` | `/api/supabase/test` | Triggers an immediate connection ping against Supabase |
| `POST` | `/api/supabase/seed` | Programmatically populates all tables with enterprise datasets |
| `GET` | `/api/supabase/schema` | Serves the raw `schema.sql` migration file for easy UI copying |

---

## 5. Relational Schema & Tables Reference

| Table | Description | Primary Key | Key Relationships |
| :--- | :--- | :--- | :--- |
| `organizations` | Tenant accounts and enterprise tier definitions | `id VARCHAR(255)` | Multi-tenant root entity |
| `departments` | Organizational functional business units (Ops, Eng, Security, Product) | `id VARCHAR(255)` | `org_id -> organizations(id)` |
| `profiles` | User profiles with role-based access (`owner`, `admin`, `manager`, `member`) | `id VARCHAR(255)` | `org_id`, `department_id` |
| `projects` | Operational initiatives with milestone dates, budgets, and progress | `id VARCHAR(255)` | `org_id`, `department_id`, `owner_id` |
| `tasks` | Actionable work units with escalation levels, priority, and deadlines | `id VARCHAR(255)` | `org_id`, `project_id`, `assignee_id` |
| `approvals` | Governance records for budget overrides, deliverables, and signoffs | `id VARCHAR(255)` | `org_id`, `requester_id`, `approver_id` |
| `workflows` | Workflow definitions with triggers, conditions, and action sequences | `id VARCHAR(255)` | `org_id` |
| `workflow_runs` | Audit logs of automated workflow executions | `id VARCHAR(255)` | `org_id`, `workflow_id` |
| `operational_insights` | Decision Intelligence findings with severity and recommended action | `id VARCHAR(255)` | `org_id` |
| `notifications` | In-app alerts for assignments, escalations, and approvals | `id VARCHAR(255)` | `org_id`, `user_id` |
| `activity_events` | Tamper-evident timeline of cross-department operations | `id VARCHAR(255)` | `org_id` |
