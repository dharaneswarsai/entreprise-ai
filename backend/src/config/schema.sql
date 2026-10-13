-- =========================================================================
-- ENTREPRISE AI OS - ENTERPRISE OPERATIONS DATABASE SCHEMA (Supabase / PostgreSQL)
-- Multi-tenant enterprise schema with Row Level Security (RLS) support
-- Compatible with PostgreSQL 13+, Supabase Cloud, and self-hosted Supabase
-- =========================================================================

-- Enable pgcrypto extension for gen_random_uuid() if available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Organizations (Tenants)
CREATE TABLE IF NOT EXISTS organizations (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'enterprise',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Departments
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    org_id VARCHAR(255) REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    lead_id VARCHAR(255),
    color VARCHAR(30) DEFAULT '#0F4C3A',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. User Profiles & Organization Membership
CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    org_id VARCHAR(255) REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member', -- 'owner' | 'admin' | 'manager' | 'member'
    department_id VARCHAR(255) REFERENCES departments(id) ON DELETE SET NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Projects
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    org_id VARCHAR(255) REFERENCES organizations(id) ON DELETE CASCADE,
    department_id VARCHAR(255) REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id VARCHAR(255) REFERENCES profiles(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'planning' | 'active' | 'at_risk' | 'completed' | 'on_hold'
    priority VARCHAR(50) DEFAULT 'medium', -- 'low' | 'medium' | 'high' | 'urgent'
    progress INTEGER DEFAULT 0,
    start_date DATE,
    due_date DATE,
    budget NUMERIC(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    org_id VARCHAR(255) REFERENCES organizations(id) ON DELETE CASCADE,
    project_id VARCHAR(255) REFERENCES projects(id) ON DELETE CASCADE,
    department_id VARCHAR(255) REFERENCES departments(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assignee_id VARCHAR(255) REFERENCES profiles(id) ON DELETE SET NULL,
    creator_id VARCHAR(255) REFERENCES profiles(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'todo', -- 'todo' | 'in_progress' | 'review' | 'done' | 'blocked'
    priority VARCHAR(50) DEFAULT 'medium', -- 'low' | 'medium' | 'high' | 'urgent'
    due_date DATE,
    is_overdue BOOLEAN DEFAULT FALSE,
    escalation_level INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Approvals & Governance
CREATE TABLE IF NOT EXISTS approvals (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    org_id VARCHAR(255) REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'operational', -- 'financial' | 'deliverable' | 'campaign' | 'operational'
    requester_id VARCHAR(255) REFERENCES profiles(id) ON DELETE SET NULL,
    approver_id VARCHAR(255) REFERENCES profiles(id) ON DELETE SET NULL,
    related_task_id VARCHAR(255) REFERENCES tasks(id) ON DELETE SET NULL,
    related_project_id VARCHAR(255) REFERENCES projects(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
    decision_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    decided_at TIMESTAMP WITH TIME ZONE
);

-- 7. Workflows & Autonomous Automation
CREATE TABLE IF NOT EXISTS workflows (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    org_id VARCHAR(255) REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    trigger_type VARCHAR(100) NOT NULL,
    trigger_config JSONB DEFAULT '{}',
    conditions JSONB DEFAULT '[]',
    actions JSONB DEFAULT '[]',
    execution_count INTEGER DEFAULT 0,
    last_run_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Workflow Runs & Audit Trails
CREATE TABLE IF NOT EXISTS workflow_runs (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    org_id VARCHAR(255) REFERENCES organizations(id) ON DELETE CASCADE,
    workflow_id VARCHAR(255) REFERENCES workflows(id) ON DELETE CASCADE,
    triggering_event VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'running', -- 'running' | 'completed' | 'failed'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    actions_attempted INTEGER DEFAULT 0,
    actions_completed INTEGER DEFAULT 0,
    details JSONB DEFAULT '{}'
);

-- 9. Operational Insights (Decision Intelligence Engine)
CREATE TABLE IF NOT EXISTS operational_insights (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    org_id VARCHAR(255) REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(50) DEFAULT 'medium', -- 'low' | 'medium' | 'high' | 'critical'
    description TEXT NOT NULL,
    evidence TEXT[] DEFAULT '{}',
    recommended_action TEXT NOT NULL,
    suggested_owner VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new', -- 'new' | 'acknowledged' | 'resolved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. In-App Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    org_id VARCHAR(255) REFERENCES organizations(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- 'info' | 'warning' | 'urgent' | 'success'
    entity_type VARCHAR(50),
    entity_id VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Activity Events (Audit Stream)
CREATE TABLE IF NOT EXISTS activity_events (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    org_id VARCHAR(255) REFERENCES organizations(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;

-- Permissive service policies (service role has full access; public anon read/write enabled for demo/testing)
DROP POLICY IF EXISTS "Public access organizations" ON organizations;
CREATE POLICY "Public access organizations" ON organizations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access departments" ON departments;
CREATE POLICY "Public access departments" ON departments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access profiles" ON profiles;
CREATE POLICY "Public access profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access projects" ON projects;
CREATE POLICY "Public access projects" ON projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access tasks" ON tasks;
CREATE POLICY "Public access tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access approvals" ON approvals;
CREATE POLICY "Public access approvals" ON approvals FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access workflows" ON workflows;
CREATE POLICY "Public access workflows" ON workflows FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access workflow_runs" ON workflow_runs;
CREATE POLICY "Public access workflow_runs" ON workflow_runs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access operational_insights" ON operational_insights;
CREATE POLICY "Public access operational_insights" ON operational_insights FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access notifications" ON notifications;
CREATE POLICY "Public access notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access activity_events" ON activity_events;
CREATE POLICY "Public access activity_events" ON activity_events FOR ALL USING (true) WITH CHECK (true);

-- =========================================================================
-- PERFORMANCE INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_tasks_org_status ON tasks(org_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_projects_org_status ON projects(org_id, status);
CREATE INDEX IF NOT EXISTS idx_approvals_org_status ON approvals(org_id, status);
CREATE INDEX IF NOT EXISTS idx_workflows_org_active ON workflows(org_id, is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_activity_org_time ON activity_events(org_id, timestamp DESC);

-- =========================================================================
-- SEED DATA: 4 DISTINCT ENTERPRISE BUSINESSES
-- =========================================================================
INSERT INTO organizations (id, name, slug, plan)
VALUES 
  ('org-apex-001', 'Apex Cloud Tech', 'apex-cloud', 'Enterprise Cloud Tier'),
  ('org-pulse-002', 'Pulse Creative Media', 'pulse-creative', 'Agency Studio Pro'),
  ('org-nexus-003', 'Nexus BioHealth', 'nexus-biohealth', 'Life Sciences Enterprise'),
  ('org-vanguard-004', 'Vanguard Global Logistics', 'vanguard-logistics', 'Supply Chain Operations')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, plan = EXCLUDED.plan;

-- 1. Apex Cloud Tech
INSERT INTO departments (id, org_id, name, code, color)
VALUES
  ('dept-apex-ops', 'org-apex-001', 'Cloud Infrastructure', 'OPS', '#0F4C3A'),
  ('dept-apex-eng', 'org-apex-001', 'Platform Engineering', 'ENG', '#1B4D3E'),
  ('dept-apex-sec', 'org-apex-001', 'Information Security', 'SEC', '#B91C1C'),
  ('dept-apex-prod', 'org-apex-001', 'Product Architecture', 'PROD', '#2563EB')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, org_id, email, full_name, role, department_id, avatar_url)
VALUES
  ('usr-apex-1', 'org-apex-001', 'alex.rivers@apexcloud.io', 'Alex Rivers', 'owner', 'dept-apex-ops', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
  ('usr-apex-2', 'org-apex-001', 'marcus.chen@apexcloud.io', 'Marcus Chen', 'admin', 'dept-apex-eng', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
  ('usr-apex-3', 'org-apex-001', 'elena.rostova@apexcloud.io', 'Elena Rostova', 'manager', 'dept-apex-sec', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
  ('usr-apex-4', 'org-apex-001', 'tariq.mansoor@apexcloud.io', 'Tariq Mansoor', 'member', 'dept-apex-prod', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150')
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, org_id, name, description, owner_id, department_id, status, priority, progress, start_date, due_date, budget)
VALUES
  ('proj-apex-1', 'org-apex-001', 'Multi-Region Kubernetes Edge Gateway', 'Deploy zero-latency reverse proxy across Tokyo, Frankfurt and Virginia clusters.', 'usr-apex-2', 'dept-apex-eng', 'at_risk', 'urgent', 64, '2026-09-01', '2026-10-18', 240000),
  ('proj-apex-2', 'org-apex-001', 'SOC2 Type II Continuous Compliance Suite', 'Automated policy enforcement and audit artifact capture.', 'usr-apex-3', 'dept-apex-sec', 'active', 'high', 85, '2026-08-15', '2026-11-01', 95000),
  ('proj-apex-3', 'org-apex-001', 'WASM Edge Worker Streaming Pipeline', 'Real-time telemetry event processor running on edge points-of-presence.', 'usr-apex-1', 'dept-apex-ops', 'active', 'medium', 40, '2026-09-15', '2026-12-01', 180000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, org_id, project_id, department_id, title, description, assignee_id, creator_id, status, priority, due_date, escalation_level)
VALUES
  ('tsk-apex-1', 'org-apex-001', 'proj-apex-1', 'dept-apex-eng', 'Failover testing on Frankfurt node cluster', 'Simulate 500k rps spike and verify circuit breakers.', 'usr-apex-2', 'usr-apex-1', 'in_progress', 'urgent', '2026-10-11', 1),
  ('tsk-apex-2', 'org-apex-001', 'proj-apex-1', 'dept-apex-sec', 'TLS 1.3 mTLS Certificate Authority rotation', 'Automated Vault token rotation across 48 microservices.', 'usr-apex-3', 'usr-apex-1', 'review', 'high', '2026-10-12', 2),
  ('tsk-apex-3', 'org-apex-001', 'proj-apex-2', 'dept-apex-prod', 'Export AWS CloudTrail evidence for Q3 SOC2', 'Automated evidence bundle compilation.', 'usr-apex-4', 'usr-apex-3', 'done', 'medium', '2026-10-08', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO approvals (id, org_id, title, description, category, requester_id, approver_id, related_project_id, related_task_id, status, submitted_at)
VALUES
  ('appr-apex-1', 'org-apex-001', 'Supplemental AWS DirectConnect 100Gbps Pipeline ($28,000)', 'Dedicated low-latency cross-connect for Frankfurt failover cluster.', 'financial', 'usr-apex-2', 'usr-apex-1', 'proj-apex-1', 'tsk-apex-1', 'pending', '2026-10-11T14:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- 2. Pulse Creative Media
INSERT INTO departments (id, org_id, name, code, color)
VALUES
  ('dept-pulse-brand', 'org-pulse-002', 'Brand Strategy', 'BRAND', '#D97706'),
  ('dept-pulse-video', 'org-pulse-002', '4K Video Bays', 'VIDEO', '#7C3AED'),
  ('dept-pulse-media', 'org-pulse-002', 'Paid Performance Media', 'MEDIA', '#059669'),
  ('dept-pulse-client', 'org-pulse-002', 'Client Accounts', 'ACCT', '#3B82F6')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, org_id, email, full_name, role, department_id, avatar_url)
VALUES
  ('usr-pulse-1', 'org-pulse-002', 'chloe.dupont@pulsecreative.co', 'Chloe Dupont', 'owner', 'dept-pulse-brand', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'),
  ('usr-pulse-2', 'org-pulse-002', 'leo.santiago@pulsecreative.co', 'Leo Santiago', 'admin', 'dept-pulse-video', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'),
  ('usr-pulse-3', 'org-pulse-002', 'maya.lin@pulsecreative.co', 'Maya Lin', 'manager', 'dept-pulse-media', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'),
  ('usr-pulse-4', 'org-pulse-002', 'samuel.vance@pulsecreative.co', 'Samuel Vance', 'member', 'dept-pulse-client', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150')
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, org_id, name, description, owner_id, department_id, status, priority, progress, start_date, due_date, budget)
VALUES
  ('proj-pulse-1', 'org-pulse-002', 'Sanchari Luxury Trails Global Campaign', 'Omnichannel brand film, 4K documentary reels, and airport billboard takeover.', 'usr-pulse-1', 'dept-pulse-brand', 'active', 'high', 78, '2026-09-10', '2026-10-25', 180000),
  ('proj-pulse-2', 'org-pulse-002', 'Nordic Peak Energy Drink Brand Relaunch', 'High-energy 3D packaging visuals and influencer micro-campaign.', 'usr-pulse-2', 'dept-pulse-video', 'at_risk', 'urgent', 50, '2026-09-20', '2026-10-17', 85000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, org_id, project_id, department_id, title, description, assignee_id, creator_id, status, priority, due_date, escalation_level)
VALUES
  ('tsk-pulse-1', 'org-pulse-002', 'proj-pulse-1', 'dept-pulse-video', 'Color Grade 60s International Brand Spot', 'DaVinci Resolve HDR master delivery for theater screening.', 'usr-pulse-2', 'usr-pulse-1', 'review', 'high', '2026-10-15', 0),
  ('tsk-pulse-2', 'org-pulse-002', 'proj-pulse-2', 'dept-pulse-brand', 'Nordic Peak 3D Can Render Signoff', 'Cinema4D render with condensation pass for billboard spec.', 'usr-pulse-3', 'usr-pulse-2', 'in_progress', 'urgent', '2026-10-10', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO approvals (id, org_id, title, description, category, requester_id, approver_id, related_project_id, related_task_id, status, submitted_at)
VALUES
  ('appr-pulse-1', 'org-pulse-002', 'International Airport Billboard Media Buy ($65,000)', 'Prime terminal LED reservation for Sanchari Trails campaign.', 'campaign', 'usr-pulse-3', 'usr-pulse-1', 'proj-pulse-1', 'tsk-pulse-1', 'pending', '2026-10-12T10:15:00Z')
ON CONFLICT (id) DO NOTHING;

-- 3. Nexus BioHealth
INSERT INTO departments (id, org_id, name, code, color)
VALUES
  ('dept-nexus-clin', 'org-nexus-003', 'Clinical Trial Operations', 'CLIN', '#0284C7'),
  ('dept-nexus-lab', 'org-nexus-003', 'Genomic Sequencing Labs', 'LAB', '#0F766E'),
  ('dept-nexus-fda', 'org-nexus-003', 'FDA Regulatory Affairs', 'REG', '#C026D3'),
  ('dept-nexus-qa', 'org-nexus-003', 'Bio-Safety QA', 'QA', '#4B5563')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, org_id, email, full_name, role, department_id, avatar_url)
VALUES
  ('usr-nexus-1', 'org-nexus-003', 'sarah.jenkins@nexusbio.org', 'Dr. Sarah Jenkins', 'owner', 'dept-nexus-clin', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
  ('usr-nexus-2', 'org-nexus-003', 'rajesh.patel@nexusbio.org', 'Dr. Rajesh Patel', 'admin', 'dept-nexus-lab', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
  ('usr-nexus-3', 'org-nexus-003', 'claire.beauchamp@nexusbio.org', 'Claire Beauchamp', 'manager', 'dept-nexus-fda', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),
  ('usr-nexus-4', 'org-nexus-003', 'klaus.weber@nexusbio.org', 'Klaus Weber', 'member', 'dept-nexus-qa', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150')
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, org_id, name, description, owner_id, department_id, status, priority, progress, start_date, due_date, budget)
VALUES
  ('proj-nexus-1', 'org-nexus-003', 'Phase III Oncology Gene Therapy Protocol', 'Automated patient biomarker registry and cohort titration logs.', 'usr-nexus-1', 'dept-nexus-clin', 'at_risk', 'urgent', 72, '2026-07-01', '2026-10-20', 850000),
  ('proj-nexus-2', 'org-nexus-003', 'High-Throughput Robotic Pipetting Calibration', 'Zero-contamination verification for Illumina NovaSeq 6000 rigs.', 'usr-nexus-2', 'dept-nexus-lab', 'active', 'high', 91, '2026-08-01', '2026-11-15', 320000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, org_id, project_id, department_id, title, description, assignee_id, creator_id, status, priority, due_date, escalation_level)
VALUES
  ('tsk-nexus-1', 'org-nexus-003', 'proj-nexus-1', 'dept-nexus-clin', 'FDA Adverse Event Cohort 4 Reconciliation', 'Verify no grade 3 toxicity events in double-blind sample.', 'usr-nexus-2', 'usr-nexus-1', 'in_progress', 'urgent', '2026-10-11', 1),
  ('tsk-nexus-2', 'org-nexus-003', 'proj-nexus-2', 'dept-nexus-lab', 'NovaSeq Flowcell UV Decontamination Protocol', 'Quarterly cleanroom biosafety certificate renewal.', 'usr-nexus-3', 'usr-nexus-2', 'done', 'high', '2026-10-09', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO approvals (id, org_id, title, description, category, requester_id, approver_id, related_project_id, related_task_id, status, submitted_at)
VALUES
  ('appr-nexus-1', 'org-nexus-003', 'External IRB Human Subject Protocol Amendment #04', 'Expedited approval to expand Phase III trial cohort by 150 patients.', 'operational', 'usr-nexus-2', 'usr-nexus-1', 'proj-nexus-1', 'tsk-nexus-1', 'pending', '2026-10-11T09:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- 4. Vanguard Global Logistics
INSERT INTO departments (id, org_id, name, code, color)
VALUES
  ('dept-van-fleet', 'org-vanguard-004', 'Maritime & Air Freight', 'FREIGHT', '#1E3A8A'),
  ('dept-van-wh', 'org-vanguard-004', 'Smart Warehouse Centers', 'WH', '#B45309'),
  ('dept-van-cust', 'org-vanguard-004', 'Customs & Port Compliance', 'PORT', '#15803D'),
  ('dept-van-route', 'org-vanguard-004', 'Cold-Chain IoT Dispatch', 'IOT', '#4338CA')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, org_id, email, full_name, role, department_id, avatar_url)
VALUES
  ('usr-van-1', 'org-vanguard-004', 'victor.kovacs@vanguardfreight.com', 'Victor Kovacs', 'owner', 'dept-van-fleet', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'),
  ('usr-van-2', 'org-vanguard-004', 'ananya.sharma@vanguardfreight.com', 'Ananya Sharma', 'admin', 'dept-van-wh', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150'),
  ('usr-van-3', 'org-vanguard-004', 'diego.morales@vanguardfreight.com', 'Diego Morales', 'manager', 'dept-van-cust', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
  ('usr-van-4', 'org-vanguard-004', 'fatima.zahra@vanguardfreight.com', 'Fatima Zahra', 'member', 'dept-van-route', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150')
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, org_id, name, description, owner_id, department_id, status, priority, progress, start_date, due_date, budget)
VALUES
  ('proj-van-1', 'org-vanguard-004', 'Trans-Pacific Maritime Route Optimization', 'Predictive fuel optimization and port congestion avoidance.', 'usr-van-1', 'dept-van-fleet', 'active', 'high', 88, '2026-08-10', '2026-10-31', 450000),
  ('proj-van-2', 'org-vanguard-004', 'Rotterdam Port Cold-Chain IoT Sensor Rollout', 'Automated temperature alert triggers for pharmaceutical vaccine containers.', 'usr-van-3', 'dept-van-route', 'at_risk', 'urgent', 58, '2026-09-05', '2026-10-19', 190000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, org_id, project_id, department_id, title, description, assignee_id, creator_id, status, priority, due_date, escalation_level)
VALUES
  ('tsk-van-1', 'org-vanguard-004', 'proj-van-2', 'dept-van-route', 'Re-calibrate 120 temperature IoT gateways', 'Container battery telemetry alert for deep freeze cargo.', 'usr-van-3', 'usr-van-1', 'blocked', 'urgent', '2026-10-12', 2),
  ('tsk-van-2', 'org-vanguard-004', 'proj-van-1', 'dept-van-fleet', 'Bunker fuel hedging contract renewal', 'Lock in Q4 marine gas oil rate with Singapore refinery.', 'usr-van-2', 'usr-van-1', 'done', 'medium', '2026-10-07', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO approvals (id, org_id, title, description, category, requester_id, approver_id, related_project_id, related_task_id, status, submitted_at)
VALUES
  ('appr-van-1', 'org-vanguard-004', 'Emergency Feeder Vessel Chartering ($110,000)', 'Bypass Long Beach port backlog via Oakland marine terminal.', 'financial', 'usr-van-2', 'usr-van-1', 'proj-van-1', 'tsk-van-2', 'pending', '2026-10-12T16:00:00Z')
ON CONFLICT (id) DO NOTHING;
