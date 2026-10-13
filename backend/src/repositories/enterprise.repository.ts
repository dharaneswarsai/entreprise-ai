import {
  Organization,
  Department,
  Profile,
  Project,
  Task,
  Approval,
  WorkflowDefinition,
  WorkflowRun,
  OperationalInsight,
  AppNotification,
  ActivityEvent,
} from '../types';
import { getSupabaseClient, isSupabaseConfigured } from '../config/supabase';

// 4 Distinct Enterprise Businesses (Consolidated & Validated Base Template)
const DEFAULT_ORGANIZATIONS: Organization[] = [
    {
      id: 'org-apex-001',
      name: 'Apex Cloud Tech',
      slug: 'apex-cloud',
      plan: 'Enterprise Cloud Tier',
      createdAt: '2026-01-15T00:00:00Z',
    },
    {
      id: 'org-pulse-002',
      name: 'Pulse Creative Media',
      slug: 'pulse-creative',
      plan: 'Agency Studio Pro',
      createdAt: '2026-02-01T00:00:00Z',
    },
    {
      id: 'org-nexus-003',
      name: 'Nexus BioHealth',
      slug: 'nexus-biohealth',
      plan: 'Life Sciences Enterprise',
      createdAt: '2026-01-10T00:00:00Z',
    },
    {
      id: 'org-vanguard-004',
      name: 'Vanguard Global Logistics',
      slug: 'vanguard-logistics',
      plan: 'Supply Chain Operations',
      createdAt: '2026-02-15T00:00:00Z',
    },
  ];

const DEFAULT_DEPARTMENTS: Department[] = [
    // 1. Apex Cloud
    { id: 'dept-apex-ops', orgId: 'org-apex-001', name: 'Cloud Infrastructure', code: 'OPS', color: '#0F4C3A' },
    { id: 'dept-apex-eng', orgId: 'org-apex-001', name: 'Platform Engineering', code: 'ENG', color: '#1B4D3E' },
    { id: 'dept-apex-sec', orgId: 'org-apex-001', name: 'Information Security', code: 'SEC', color: '#B91C1C' },
    { id: 'dept-apex-prod', orgId: 'org-apex-001', name: 'Product Architecture', code: 'PROD', color: '#2563EB' },

    // 2. Pulse Creative
    { id: 'dept-pulse-brand', orgId: 'org-pulse-002', name: 'Brand Strategy', code: 'BRAND', color: '#D97706' },
    { id: 'dept-pulse-video', orgId: 'org-pulse-002', name: '4K Video Bays', code: 'VIDEO', color: '#7C3AED' },
    { id: 'dept-pulse-media', orgId: 'org-pulse-002', name: 'Paid Performance Media', code: 'MEDIA', color: '#059669' },
    { id: 'dept-pulse-client', orgId: 'org-pulse-002', name: 'Client Accounts', code: 'ACCT', color: '#3B82F6' },

    // 3. Nexus BioHealth
    { id: 'dept-nexus-clin', orgId: 'org-nexus-003', name: 'Clinical Trial Operations', code: 'CLIN', color: '#0284C7' },
    { id: 'dept-nexus-lab', orgId: 'org-nexus-003', name: 'Genomic Sequencing Labs', code: 'LAB', color: '#0F766E' },
    { id: 'dept-nexus-fda', orgId: 'org-nexus-003', name: 'FDA Regulatory Affairs', code: 'REG', color: '#C026D3' },
    { id: 'dept-nexus-qa', orgId: 'org-nexus-003', name: 'Bio-Safety QA', code: 'QA', color: '#4B5563' },

    // 4. Vanguard Logistics
    { id: 'dept-van-fleet', orgId: 'org-vanguard-004', name: 'Maritime & Air Freight', code: 'FREIGHT', color: '#1E3A8A' },
    { id: 'dept-van-wh', orgId: 'org-vanguard-004', name: 'Smart Warehouse Centers', code: 'WH', color: '#B45309' },
    { id: 'dept-van-cust', orgId: 'org-vanguard-004', name: 'Customs & Port Compliance', code: 'PORT', color: '#15803D' },
    { id: 'dept-van-route', orgId: 'org-vanguard-004', name: 'Cold-Chain IoT Dispatch', code: 'IOT', color: '#4338CA' },
  ];

const DEFAULT_PROFILES: Profile[] = [
    // 1. Apex Cloud Tech Users
    { id: 'usr-apex-1', orgId: 'org-apex-001', email: 'alex.rivers@apexcloud.io', fullName: 'Alex Rivers', role: 'owner', departmentId: 'dept-apex-ops', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: 'usr-apex-2', orgId: 'org-apex-001', email: 'marcus.chen@apexcloud.io', fullName: 'Marcus Chen', role: 'admin', departmentId: 'dept-apex-eng', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: 'usr-apex-3', orgId: 'org-apex-001', email: 'elena.rostova@apexcloud.io', fullName: 'Elena Rostova', role: 'manager', departmentId: 'dept-apex-sec', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    { id: 'usr-apex-4', orgId: 'org-apex-001', email: 'tariq.mansoor@apexcloud.io', fullName: 'Tariq Mansoor', role: 'member', departmentId: 'dept-apex-prod', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },

    // 2. Pulse Creative Media Users
    { id: 'usr-pulse-1', orgId: 'org-pulse-002', email: 'chloe.dupont@pulsecreative.co', fullName: 'Chloe Dupont', role: 'owner', departmentId: 'dept-pulse-brand', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    { id: 'usr-pulse-2', orgId: 'org-pulse-002', email: 'leo.santiago@pulsecreative.co', fullName: 'Leo Santiago', role: 'admin', departmentId: 'dept-pulse-video', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
    { id: 'usr-pulse-3', orgId: 'org-pulse-002', email: 'maya.lin@pulsecreative.co', fullName: 'Maya Lin', role: 'manager', departmentId: 'dept-pulse-media', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
    { id: 'usr-pulse-4', orgId: 'org-pulse-002', email: 'samuel.vance@pulsecreative.co', fullName: 'Samuel Vance', role: 'member', departmentId: 'dept-pulse-client', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },

    // 3. Nexus BioHealth Users
    { id: 'usr-nexus-1', orgId: 'org-nexus-003', email: 'sarah.jenkins@nexusbio.org', fullName: 'Dr. Sarah Jenkins', role: 'owner', departmentId: 'dept-nexus-clin', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    { id: 'usr-nexus-2', orgId: 'org-nexus-003', email: 'rajesh.patel@nexusbio.org', fullName: 'Dr. Rajesh Patel', role: 'admin', departmentId: 'dept-nexus-lab', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: 'usr-nexus-3', orgId: 'org-nexus-003', email: 'claire.beauchamp@nexusbio.org', fullName: 'Claire Beauchamp', role: 'manager', departmentId: 'dept-nexus-fda', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
    { id: 'usr-nexus-4', orgId: 'org-nexus-003', email: 'klaus.weber@nexusbio.org', fullName: 'Klaus Weber', role: 'member', departmentId: 'dept-nexus-qa', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },

    // 4. Vanguard Logistics Users
    { id: 'usr-van-1', orgId: 'org-vanguard-004', email: 'victor.kovacs@vanguardfreight.com', fullName: 'Victor Kovacs', role: 'owner', departmentId: 'dept-van-fleet', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
    { id: 'usr-van-2', orgId: 'org-vanguard-004', email: 'ananya.sharma@vanguardfreight.com', fullName: 'Ananya Sharma', role: 'admin', departmentId: 'dept-van-wh', avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150' },
    { id: 'usr-van-3', orgId: 'org-vanguard-004', email: 'diego.morales@vanguardfreight.com', fullName: 'Diego Morales', role: 'manager', departmentId: 'dept-van-cust', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
    { id: 'usr-van-4', orgId: 'org-vanguard-004', email: 'fatima.zahra@vanguardfreight.com', fullName: 'Fatima Zahra', role: 'member', departmentId: 'dept-van-route', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
  ];

const DEFAULT_PROJECTS: Project[] = [
    // 1. Apex Cloud Projects
    { id: 'proj-apex-1', orgId: 'org-apex-001', name: 'Multi-Region Kubernetes Edge Gateway', description: 'Deploy zero-latency reverse proxy across Tokyo, Frankfurt and Virginia clusters.', ownerId: 'usr-apex-2', departmentId: 'dept-apex-eng', status: 'at_risk', priority: 'urgent', progress: 64, startDate: '2026-09-01', dueDate: '2026-10-18', budget: 240000 },
    { id: 'proj-apex-2', orgId: 'org-apex-001', name: 'SOC2 Type II Continuous Compliance Suite', description: 'Automated policy enforcement and audit artifact capture.', ownerId: 'usr-apex-3', departmentId: 'dept-apex-sec', status: 'active', priority: 'high', progress: 85, startDate: '2026-08-15', dueDate: '2026-11-01', budget: 95000 },
    { id: 'proj-apex-3', orgId: 'org-apex-001', name: 'WASM Edge Worker Streaming Pipeline', description: 'Real-time telemetry event processor running on edge points-of-presence.', ownerId: 'usr-apex-1', departmentId: 'dept-apex-ops', status: 'active', priority: 'medium', progress: 40, startDate: '2026-09-15', dueDate: '2026-12-01', budget: 180000 },

    // 2. Pulse Creative Projects
    { id: 'proj-pulse-1', orgId: 'org-pulse-002', name: 'Sanchari Luxury Trails Global Campaign', description: 'Omnichannel brand film, 4K documentary reels, and airport billboard takeover.', ownerId: 'usr-pulse-1', departmentId: 'dept-pulse-brand', status: 'active', priority: 'high', progress: 78, startDate: '2026-09-10', dueDate: '2026-10-25', budget: 180000 },
    { id: 'proj-pulse-2', orgId: 'org-pulse-002', name: 'Nordic Peak Energy Drink Brand Relaunch', description: 'High-energy 3D packaging visuals and influencer micro-campaign.', ownerId: 'usr-pulse-2', departmentId: 'dept-pulse-video', status: 'at_risk', priority: 'urgent', progress: 50, startDate: '2026-09-20', dueDate: '2026-10-17', budget: 85000 },

    // 3. Nexus BioHealth Projects
    { id: 'proj-nexus-1', orgId: 'org-nexus-003', name: 'Phase III Oncology Gene Therapy Protocol', description: 'Automated patient biomarker registry and cohort titration logs.', ownerId: 'usr-nexus-1', departmentId: 'dept-nexus-clin', status: 'at_risk', priority: 'urgent', progress: 72, startDate: '2026-07-01', dueDate: '2026-10-20', budget: 850000 },
    { id: 'proj-nexus-2', orgId: 'org-nexus-003', name: 'High-Throughput Robotic Pipetting Calibration', description: 'Zero-contamination verification for Illumina NovaSeq 6000 rigs.', ownerId: 'usr-nexus-2', departmentId: 'dept-nexus-lab', status: 'active', priority: 'high', progress: 91, startDate: '2026-08-01', dueDate: '2026-11-15', budget: 320000 },

    // 4. Vanguard Logistics Projects
    { id: 'proj-van-1', orgId: 'org-vanguard-004', name: 'Trans-Pacific Maritime Route Optimization', description: 'Predictive fuel optimization and port congestion avoidance.', ownerId: 'usr-van-1', departmentId: 'dept-van-fleet', status: 'active', priority: 'high', progress: 88, startDate: '2026-08-10', dueDate: '2026-10-31', budget: 450000 },
    { id: 'proj-van-2', orgId: 'org-vanguard-004', name: 'Rotterdam Port Cold-Chain IoT Sensor Rollout', description: 'Automated temperature alert triggers for pharmaceutical vaccine containers.', ownerId: 'usr-van-3', departmentId: 'dept-van-route', status: 'at_risk', priority: 'urgent', progress: 58, startDate: '2026-09-05', dueDate: '2026-10-19', budget: 190000 },
  ];

const DEFAULT_TASKS: Task[] = [
    // Apex Cloud Tasks
    { id: 'tsk-apex-1', orgId: 'org-apex-001', projectId: 'proj-apex-1', departmentId: 'dept-apex-eng', title: 'Failover testing on Frankfurt node cluster', description: 'Simulate 500k rps spike and verify circuit breakers.', assigneeId: 'usr-apex-2', creatorId: 'usr-apex-1', status: 'in_progress', priority: 'urgent', dueDate: '2026-10-11', isOverdue: true, escalationLevel: 1 },
    { id: 'tsk-apex-2', orgId: 'org-apex-001', projectId: 'proj-apex-1', departmentId: 'dept-apex-sec', title: 'TLS 1.3 mTLS Certificate Authority rotation', description: 'Automated Vault token rotation across 48 microservices.', assigneeId: 'usr-apex-3', creatorId: 'usr-apex-1', status: 'review', priority: 'high', dueDate: '2026-10-12', isOverdue: true, escalationLevel: 2 },
    { id: 'tsk-apex-3', orgId: 'org-apex-001', projectId: 'proj-apex-2', departmentId: 'dept-apex-prod', title: 'Export AWS CloudTrail evidence for Q3 SOC2', description: 'Automated evidence bundle compilation.', assigneeId: 'usr-apex-4', creatorId: 'usr-apex-3', status: 'done', priority: 'medium', dueDate: '2026-10-08', isOverdue: false, escalationLevel: 0 },

    // Pulse Creative Tasks
    { id: 'tsk-pulse-1', orgId: 'org-pulse-002', projectId: 'proj-pulse-1', departmentId: 'dept-pulse-video', title: 'Color Grade 60s International Brand Spot', description: 'DaVinci Resolve HDR master delivery for theater screening.', assigneeId: 'usr-pulse-2', creatorId: 'usr-pulse-1', status: 'review', priority: 'high', dueDate: '2026-10-15', isOverdue: false, escalationLevel: 0 },
    { id: 'tsk-pulse-2', orgId: 'org-pulse-002', projectId: 'proj-pulse-2', departmentId: 'dept-pulse-brand', title: 'Nordic Peak 3D Can Render Signoff', description: 'Cinema4D render with condensation pass for billboard spec.', assigneeId: 'usr-pulse-3', creatorId: 'usr-pulse-2', status: 'in_progress', priority: 'urgent', dueDate: '2026-10-10', isOverdue: true, escalationLevel: 2 },

    // Nexus BioHealth Tasks
    { id: 'tsk-nexus-1', orgId: 'org-nexus-003', projectId: 'proj-nexus-1', departmentId: 'dept-nexus-clin', title: 'FDA Adverse Event Cohort 4 Reconciliation', description: 'Verify no grade 3 toxicity events in double-blind sample.', assigneeId: 'usr-nexus-2', creatorId: 'usr-nexus-1', status: 'in_progress', priority: 'urgent', dueDate: '2026-10-11', isOverdue: true, escalationLevel: 1 },
    { id: 'tsk-nexus-2', orgId: 'org-nexus-003', projectId: 'proj-nexus-2', departmentId: 'dept-nexus-lab', title: 'NovaSeq Flowcell UV Decontamination Protocol', description: 'Quarterly cleanroom biosafety certificate renewal.', assigneeId: 'usr-nexus-3', creatorId: 'usr-nexus-2', status: 'done', priority: 'high', dueDate: '2026-10-09', isOverdue: false, escalationLevel: 0 },

    // Vanguard Logistics Tasks
    { id: 'tsk-van-1', orgId: 'org-vanguard-004', projectId: 'proj-van-2', departmentId: 'dept-van-route', title: 'Re-calibrate 120 temperature IoT gateways', description: 'Container battery telemetry alert for deep freeze cargo.', assigneeId: 'usr-van-3', creatorId: 'usr-van-1', status: 'blocked', priority: 'urgent', dueDate: '2026-10-12', isOverdue: true, escalationLevel: 2 },
    { id: 'tsk-van-2', orgId: 'org-vanguard-004', projectId: 'proj-van-1', departmentId: 'dept-van-fleet', title: 'Bunker fuel hedging contract renewal', description: 'Lock in Q4 marine gas oil rate with Singapore refinery.', assigneeId: 'usr-van-2', creatorId: 'usr-van-1', status: 'done', priority: 'medium', dueDate: '2026-10-07', isOverdue: false, escalationLevel: 0 },
  ];

const DEFAULT_APPROVALS: Approval[] = [
    // Apex Cloud Approvals (All reference existing projects and tasks)
    { id: 'appr-apex-1', orgId: 'org-apex-001', title: 'Supplemental AWS DirectConnect 100Gbps Pipeline ($28,000)', description: 'Dedicated low-latency cross-connect for Frankfurt failover cluster.', category: 'financial', requesterId: 'usr-apex-2', approverId: 'usr-apex-1', relatedProjectId: 'proj-apex-1', relatedTaskId: 'tsk-apex-1', status: 'pending', submittedAt: '2026-10-11T14:30:00Z' },
    
    // Pulse Creative Approvals
    { id: 'appr-pulse-1', orgId: 'org-pulse-002', title: 'International Airport Billboard Media Buy ($65,000)', description: 'Prime terminal LED reservation for Sanchari Trails campaign.', category: 'campaign', requesterId: 'usr-pulse-3', approverId: 'usr-pulse-1', relatedProjectId: 'proj-pulse-1', relatedTaskId: 'tsk-pulse-1', status: 'pending', submittedAt: '2026-10-12T10:15:00Z' },

    // Nexus BioHealth Approvals
    { id: 'appr-nexus-1', orgId: 'org-nexus-003', title: 'External IRB Human Subject Protocol Amendment #04', description: 'Expedited approval to expand Phase III trial cohort by 150 patients.', category: 'operational', requesterId: 'usr-nexus-2', approverId: 'usr-nexus-1', relatedProjectId: 'proj-nexus-1', relatedTaskId: 'tsk-nexus-1', status: 'pending', submittedAt: '2026-10-11T09:00:00Z' },

    // Vanguard Logistics Approvals
    { id: 'appr-van-1', orgId: 'org-vanguard-004', title: 'Emergency Feeder Vessel Chartering ($110,000)', description: 'Bypass Long Beach port backlog via Oakland marine terminal.', category: 'financial', requesterId: 'usr-van-2', approverId: 'usr-van-1', relatedProjectId: 'proj-van-1', relatedTaskId: 'tsk-van-2', status: 'pending', submittedAt: '2026-10-12T16:00:00Z' },
  ];

const DEFAULT_WORKFLOWS: WorkflowDefinition[] = [
    {
      id: 'wf-apex-1',
      orgId: 'org-apex-001',
      name: 'Critical Infrastructure Auto-Escalation',
      description: 'When cloud tasks are overdue >24h, elevate priority to Urgent and ping VP Engineering.',
      isActive: true,
      triggerType: 'task_overdue',
      conditions: [{ field: 'priority', operator: 'in', value: ['high', 'urgent'] }],
      actions: [
        { type: 'escalate_task', config: { incrementLevel: 1 } },
        { type: 'send_notification', config: { message: 'Cloud task escalated automatically.' } },
        { type: 'record_activity', config: { actionName: 'INFRA_AUTO_ESCALATION' } },
      ],
      executionCount: 19,
      lastRunAt: '2026-10-13T09:15:00Z',
      createdAt: '2026-09-01T00:00:00Z',
    },
    {
      id: 'wf-pulse-1',
      orgId: 'org-pulse-002',
      name: 'Creative Asset Deadline & Render Alert',
      description: 'Auto-notify Creative Director when video review reaches 48h before broadcast.',
      isActive: true,
      triggerType: 'task_overdue',
      conditions: [{ field: 'priority', operator: 'in', value: ['high', 'urgent'] }],
      actions: [
        { type: 'escalate_task', config: { incrementLevel: 1 } },
        { type: 'send_notification', config: { message: 'Video render milestone auto-escalated.' } },
      ],
      executionCount: 8,
      lastRunAt: '2026-10-12T15:30:00Z',
      createdAt: '2026-09-01T00:00:00Z',
    },
    {
      id: 'wf-nexus-1',
      orgId: 'org-nexus-003',
      name: 'Clinical Trial FDA Compliance Guard',
      description: 'Flag protocol deviation immediately to Chief Medical Officer with priority audit trail.',
      isActive: true,
      triggerType: 'task_overdue',
      conditions: [{ field: 'priority', operator: 'equals', value: 'urgent' }],
      actions: [
        { type: 'escalate_task', config: { incrementLevel: 1 } },
        { type: 'send_notification', config: { message: 'Trial regulatory action item escalated.' } },
      ],
      executionCount: 12,
      lastRunAt: '2026-10-13T07:45:00Z',
      createdAt: '2026-09-01T00:00:00Z',
    },
    {
      id: 'wf-van-1',
      orgId: 'org-vanguard-004',
      name: 'Cold-Chain IoT Temperature Deviation Escalation',
      description: 'Trigger maritime dispatch rerouting if sensor batteries or temperature drop below threshold.',
      isActive: true,
      triggerType: 'task_overdue',
      conditions: [{ field: 'priority', operator: 'equals', value: 'urgent' }],
      actions: [
        { type: 'escalate_task', config: { incrementLevel: 1 } },
        { type: 'send_notification', config: { message: 'Port container cold-chain alert dispatched.' } },
      ],
      executionCount: 22,
      lastRunAt: '2026-10-13T08:10:00Z',
      createdAt: '2026-09-01T00:00:00Z',
    },
  ];

const DEFAULT_WORKFLOW_RUNS: WorkflowRun[] = [
    {
      id: 'run-apex-1',
      orgId: 'org-apex-001',
      workflowId: 'wf-apex-1',
      triggeringEvent: 'task_overdue:tsk-apex-1',
      status: 'completed',
      startedAt: '2026-10-13T09:14:58Z',
      completedAt: '2026-10-13T09:15:00Z',
      actionsAttempted: 3,
      actionsCompleted: 3,
      details: { taskId: 'tsk-apex-1', newLevel: 1, notificationSent: true },
    },
    {
      id: 'run-pulse-1',
      orgId: 'org-pulse-002',
      workflowId: 'wf-pulse-1',
      triggeringEvent: 'task_overdue:tsk-pulse-2',
      status: 'completed',
      startedAt: '2026-10-12T15:29:58Z',
      completedAt: '2026-10-12T15:30:00Z',
      actionsAttempted: 2,
      actionsCompleted: 2,
      details: { taskId: 'tsk-pulse-2', newLevel: 2, notificationSent: true },
    },
    {
      id: 'run-nexus-1',
      orgId: 'org-nexus-003',
      workflowId: 'wf-nexus-1',
      triggeringEvent: 'task_overdue:tsk-nexus-1',
      status: 'completed',
      startedAt: '2026-10-13T07:44:58Z',
      completedAt: '2026-10-13T07:45:00Z',
      actionsAttempted: 2,
      actionsCompleted: 2,
      details: { taskId: 'tsk-nexus-1', newLevel: 1, notificationSent: true },
    },
    {
      id: 'run-van-1',
      orgId: 'org-vanguard-004',
      workflowId: 'wf-van-1',
      triggeringEvent: 'task_overdue:tsk-van-1',
      status: 'completed',
      startedAt: '2026-10-13T08:09:58Z',
      completedAt: '2026-10-13T08:10:00Z',
      actionsAttempted: 2,
      actionsCompleted: 2,
      details: { taskId: 'tsk-van-1', newLevel: 2, notificationSent: true },
    },
  ];

const DEFAULT_INSIGHTS: OperationalInsight[] = [
    {
      id: 'ins-apex-1',
      orgId: 'org-apex-001',
      title: 'Infrastructure Delivery Bottleneck: Kubernetes Edge Gateway',
      severity: 'critical',
      description: 'Frankfurt failover cluster is scheduled for Oct 18 delivery with 2 overdue blocking microservice tasks.',
      evidence: ['Task tsk-apex-1 is overdue by 2 days', 'Approval appr-apex-1 ($28k) pending review'],
      recommendedAction: 'Authorize AWS DirectConnect budget and assign Elena Rostova to unblock failover tests.',
      suggestedOwner: 'Alex Rivers (CTO)',
      status: 'new',
      createdAt: '2026-10-13T08:00:00Z',
      updatedAt: '2026-10-13T08:00:00Z',
    },
    {
      id: 'ins-pulse-1',
      orgId: 'org-pulse-002',
      title: 'Video Bay Render Backlog: Nordic Peak 3D Campaign',
      severity: 'high',
      description: 'Task tsk-pulse-2 render pipeline behind schedule by 72 hours for theater master cut.',
      evidence: ['Task tsk-pulse-2 flagged at Escalation Level 2', 'Delivery deadline in 4 days'],
      recommendedAction: 'Allocate secondary GPU render farm nodes and expedite approval appr-pulse-1.',
      suggestedOwner: 'Chloe Dupont',
      status: 'new',
      createdAt: '2026-10-12T16:00:00Z',
      updatedAt: '2026-10-12T16:00:00Z',
    },
    {
      id: 'ins-nexus-1',
      orgId: 'org-nexus-003',
      title: 'Phase III Trial Cohort Reconciliation Delayed',
      severity: 'high',
      description: 'Adverse event tracking reconciliation overdue for FDA reporting window.',
      evidence: ['Task tsk-nexus-1 overdue by 24h', 'IRB protocol amendment pending CMO signature'],
      recommendedAction: 'Approve IRB Protocol Amendment #04 and assign Dr. Patel to clinical data signoff.',
      suggestedOwner: 'Dr. Sarah Jenkins',
      status: 'new',
      createdAt: '2026-10-13T07:00:00Z',
      updatedAt: '2026-10-13T07:00:00Z',
    },
    {
      id: 'ins-van-1',
      orgId: 'org-vanguard-004',
      title: 'Rotterdam Port Cold-Chain IoT Telemetry Alert',
      severity: 'critical',
      description: '120 refrigerated vaccine containers experiencing gateway battery degradation.',
      evidence: ['Task tsk-van-1 flagged as blocked', 'Ocean arrival scheduled in 48 hours'],
      recommendedAction: 'Dispatch emergency Rotterdam port technician crew and approve Oakland feeder charter.',
      suggestedOwner: 'Victor Kovacs',
      status: 'new',
      createdAt: '2026-10-13T08:00:00Z',
      updatedAt: '2026-10-13T08:00:00Z',
    },
  ];

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
    { id: 'notif-apex-1', orgId: 'org-apex-001', userId: 'usr-apex-1', title: 'Automated Task Escalation', message: 'Task tsk-apex-1 escalated to Level 1 by workflow engine.', type: 'urgent', isRead: false, createdAt: '2026-10-13T09:15:00Z' },
    { id: 'notif-pulse-1', orgId: 'org-pulse-002', userId: 'usr-pulse-1', title: 'Billboard Media Signoff', message: 'Airport prime LED purchase order pending your review.', type: 'warning', isRead: false, createdAt: '2026-10-12T10:15:00Z' },
    { id: 'notif-nexus-1', orgId: 'org-nexus-003', userId: 'usr-nexus-1', title: 'IRB Amendment Submission', message: 'Cohort 4 expansion documentation ready for CMO signature.', type: 'warning', isRead: false, createdAt: '2026-10-11T09:00:00Z' },
    { id: 'notif-van-1', orgId: 'org-vanguard-004', userId: 'usr-van-1', title: 'Container Cold-Chain Alert', message: 'Rotterdam terminal sensor alert triggered emergency protocol.', type: 'urgent', isRead: false, createdAt: '2026-10-13T08:10:00Z' },
  ];

const DEFAULT_ACTIVITIES: ActivityEvent[] = [
    { id: 'act-apex-1', orgId: 'org-apex-001', userName: 'Workflow Engine', action: 'AUTO_ESCALATED', target: 'Task: Frankfurt failover testing to Level 1', department: 'Platform Engineering', timestamp: '2026-10-13T09:15:00Z' },
    { id: 'act-pulse-1', orgId: 'org-pulse-002', userName: 'Leo Santiago', action: 'REQUESTED_APPROVAL', target: 'Airport Billboard Media Buy ($65,000)', department: '4K Video Bays', timestamp: '2026-10-12T10:15:00Z' },
    { id: 'act-nexus-1', orgId: 'org-nexus-003', userName: 'Dr. Sarah Jenkins', action: 'SUBMITTED_PROTOCOL', target: 'FDA Protocol Amendment #04', department: 'Clinical Trial Operations', timestamp: '2026-10-11T09:00:00Z' },
    { id: 'act-van-1', orgId: 'org-vanguard-004', userName: 'Diego Morales', action: 'ALERT_TRIGGERED', target: 'Rotterdam Port Cold-Chain Telemetry', department: 'Cold-Chain IoT Dispatch', timestamp: '2026-10-13T08:10:00Z' },
];

export class EnterpriseRepository {
  private static instance: EnterpriseRepository;

  public organizations: Organization[] = JSON.parse(JSON.stringify(DEFAULT_ORGANIZATIONS));
  public departments: Department[] = JSON.parse(JSON.stringify(DEFAULT_DEPARTMENTS));
  public profiles: Profile[] = JSON.parse(JSON.stringify(DEFAULT_PROFILES));
  public projects: Project[] = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
  public tasks: Task[] = JSON.parse(JSON.stringify(DEFAULT_TASKS));
  public approvals: Approval[] = JSON.parse(JSON.stringify(DEFAULT_APPROVALS));
  public workflows: WorkflowDefinition[] = JSON.parse(JSON.stringify(DEFAULT_WORKFLOWS));
  public workflowRuns: WorkflowRun[] = JSON.parse(JSON.stringify(DEFAULT_WORKFLOW_RUNS));
  public operationalInsights: OperationalInsight[] = JSON.parse(JSON.stringify(DEFAULT_INSIGHTS));
  public notifications: AppNotification[] = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS));
  public activityEvents: ActivityEvent[] = JSON.parse(JSON.stringify(DEFAULT_ACTIVITIES));

  public restoreDefaults(): void {
    this.organizations = JSON.parse(JSON.stringify(DEFAULT_ORGANIZATIONS));
    this.departments = JSON.parse(JSON.stringify(DEFAULT_DEPARTMENTS));
    this.profiles = JSON.parse(JSON.stringify(DEFAULT_PROFILES));
    this.projects = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
    this.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
    this.approvals = JSON.parse(JSON.stringify(DEFAULT_APPROVALS));
    this.workflows = JSON.parse(JSON.stringify(DEFAULT_WORKFLOWS));
    this.workflowRuns = JSON.parse(JSON.stringify(DEFAULT_WORKFLOW_RUNS));
    this.operationalInsights = JSON.parse(JSON.stringify(DEFAULT_INSIGHTS));
    this.notifications = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS));
    this.activityEvents = JSON.parse(JSON.stringify(DEFAULT_ACTIVITIES));
  }

  public static getInstance(): EnterpriseRepository {
    if (!EnterpriseRepository.instance) {
      EnterpriseRepository.instance = new EnterpriseRepository();
      if (isSupabaseConfigured()) {
        EnterpriseRepository.instance.initSupabase().catch(err => {
          console.warn('[Supabase] Initial background sync note:', err.message);
        });
      }
    }
    return EnterpriseRepository.instance;
  }

  // --- Organizations ---
  public getOrganizations(): Organization[] {
    return this.organizations;
  }

  public getOrganizationById(id: string): Organization | undefined {
    return this.organizations.find(o => o.id === id);
  }

  /**
   * Creates a new organization with initial department, admin user profile, starter project & task
   */
  public async createOrganization(data: {
    name: string;
    slug?: string;
    plan?: string;
    industry?: string;
    color?: string;
    admin: {
      fullName: string;
      email: string;
      role?: string;
      departmentName?: string;
      title?: string;
    };
  }): Promise<{ organization: Organization; department: Department; profile: Profile }> {
    const orgId = `org-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newOrg: Organization = {
      id: orgId,
      name: data.name,
      slug: slug || `org-${Date.now()}`,
      plan: data.plan || 'Enterprise Tier',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.organizations.push(newOrg);

    // Default Department
    const deptId = `dept-${Date.now().toString(36)}-1`;
    const newDept: Department = {
      id: deptId,
      orgId: orgId,
      name: data.admin.departmentName || 'Operations & Leadership',
      code: 'OPS',
      color: data.color || '#0F4C3A',
    };
    this.departments.push(newDept);

    // Initial Admin Profile
    const usrId = `usr-${Date.now().toString(36)}-1`;
    const newProfile: Profile = {
      id: usrId,
      orgId: orgId,
      email: data.admin.email,
      fullName: data.admin.fullName,
      role: data.admin.role || 'owner',
      departmentId: deptId,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      createdAt: new Date().toISOString(),
    };
    this.profiles.push(newProfile);

    // Starter Project
    const projId = `proj-${Date.now().toString(36)}-1`;
    const newProj: Project = {
      id: projId,
      orgId: orgId,
      name: `${data.name} Operations Launchpad`,
      description: 'Initial operational initiative and enterprise onboarding milestone.',
      ownerId: usrId,
      departmentId: deptId,
      status: 'active',
      priority: 'high',
      progress: 25,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      budget: 50000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.push(newProj);

    // Starter Task
    const tskId = `tsk-${Date.now().toString(36)}-1`;
    const newTask: Task = {
      id: tskId,
      orgId: orgId,
      projectId: projId,
      departmentId: deptId,
      title: 'Complete Enterprise Workspace Setup',
      description: `Welcome ${data.admin.fullName}! Configure team roles, invite departments, and set up automated workflows.`,
      assigneeId: usrId,
      creatorId: usrId,
      status: 'in_progress',
      priority: 'urgent',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      isOverdue: false,
      escalationLevel: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);

    // Starter Activity
    const actId = `act-${Date.now().toString(36)}-1`;
    const newAct: ActivityEvent = {
      id: actId,
      orgId: orgId,
      userName: data.admin.fullName,
      action: 'ORGANIZATION_CREATED',
      target: data.name,
      department: newDept.name,
      timestamp: new Date().toISOString(),
    };
    this.activityEvents.push(newAct);

    // Starter Notification
    const notifId = `notif-${Date.now().toString(36)}-1`;
    const newNotif: AppNotification = {
      id: notifId,
      orgId: orgId,
      userId: usrId,
      title: 'Welcome to your new Enterprise Workspace!',
      message: `${data.name} has been provisioned on Supabase PostgreSQL.`,
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.push(newNotif);

    // Asynchronously persist to Supabase if configured
    if (isSupabaseConfigured()) {
      const sb = getSupabaseClient();
      if (sb) {
        try {
          await sb.from('organizations').insert({
            id: newOrg.id,
            name: newOrg.name,
            slug: newOrg.slug,
            plan: newOrg.plan,
            created_at: newOrg.createdAt,
            updated_at: newOrg.updatedAt,
          });

          await sb.from('departments').insert({
            id: newDept.id,
            org_id: newDept.orgId,
            name: newDept.name,
            code: newDept.code,
            color: newDept.color,
          });

          await sb.from('profiles').insert({
            id: newProfile.id,
            org_id: newProfile.orgId,
            email: newProfile.email,
            full_name: newProfile.fullName,
            role: newProfile.role,
            department_id: newProfile.departmentId,
            avatar_url: newProfile.avatarUrl,
            created_at: newProfile.createdAt,
          });

          await sb.from('projects').insert({
            id: newProj.id,
            org_id: newProj.orgId,
            department_id: newProj.departmentId,
            name: newProj.name,
            description: newProj.description,
            owner_id: newProj.ownerId,
            status: newProj.status,
            priority: newProj.priority,
            progress: newProj.progress,
            start_date: newProj.startDate,
            due_date: newProj.dueDate,
            budget: newProj.budget,
          });

          await sb.from('tasks').insert({
            id: newTask.id,
            org_id: newTask.orgId,
            project_id: newTask.projectId,
            department_id: newTask.departmentId,
            title: newTask.title,
            description: newTask.description,
            assignee_id: newTask.assigneeId,
            creator_id: newTask.creatorId,
            status: newTask.status,
            priority: newTask.priority,
            due_date: newTask.dueDate,
            is_overdue: newTask.isOverdue,
            escalation_level: newTask.escalationLevel,
          });

          await sb.from('activity_events').insert({
            id: newAct.id,
            org_id: newAct.orgId,
            user_name: newAct.userName,
            action: newAct.action,
            target: newAct.target,
            department: newAct.department,
            timestamp: newAct.timestamp,
          });

          await sb.from('notifications').insert({
            id: newNotif.id,
            org_id: newNotif.orgId,
            user_id: newNotif.userId,
            title: newNotif.title,
            message: newNotif.message,
            type: newNotif.type,
            is_read: false,
          });
        } catch (e: any) {
          console.warn('[Supabase] Error persisting new organization:', e.message);
        }
      }
    }

    return { organization: newOrg, department: newDept, profile: newProfile };
  }

  public getDepartments(orgId: string): Department[] {
    return this.departments.filter(d => d.orgId === orgId);
  }

  public getProfiles(orgId: string): Profile[] {
    return this.profiles.filter(p => p.orgId === orgId);
  }

  // --- Projects ---
  public getProjects(orgId: string): Project[] {
    return this.projects.filter(p => p.orgId === orgId);
  }

  public getProjectById(orgId: string, id: string): Project | undefined {
    return this.projects.find(p => p.orgId === orgId && p.id === id);
  }

  public createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const newProj: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.push(newProj);

    if (isSupabaseConfigured()) {
      const sb = getSupabaseClient();
      if (sb) {
        sb.from('projects')
          .insert({
            id: newProj.id,
            org_id: newProj.orgId,
            department_id: newProj.departmentId || null,
            name: newProj.name,
            description: newProj.description || '',
            owner_id: newProj.ownerId || null,
            status: newProj.status || 'active',
            priority: newProj.priority || 'medium',
            progress: newProj.progress || 0,
            start_date: newProj.startDate || null,
            due_date: newProj.dueDate || null,
            budget: newProj.budget || 0,
          })
          .then(({ error }) => {
            if (error) console.warn('[Supabase] Project insert error:', error.message);
          });
      }
    }

    return newProj;
  }

  public updateProject(orgId: string, id: string, updates: Partial<Project>): Project | undefined {
    const index = this.projects.findIndex(p => p.orgId === orgId && p.id === id);
    if (index === -1) return undefined;
    this.projects[index] = { ...this.projects[index], ...updates, updatedAt: new Date().toISOString() };

    if (isSupabaseConfigured()) {
      const sb = getSupabaseClient();
      if (sb) {
        const payload: any = {};
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.priority !== undefined) payload.priority = updates.priority;
        if (updates.progress !== undefined) payload.progress = updates.progress;
        if (updates.dueDate !== undefined) payload.due_date = updates.dueDate;
        if (updates.budget !== undefined) payload.budget = updates.budget;
        payload.updated_at = new Date().toISOString();

        sb.from('projects')
          .update(payload)
          .eq('id', id)
          .then(({ error }) => {
            if (error) console.warn('[Supabase] Project update error:', error.message);
          });
      }
    }

    return this.projects[index];
  }

  // --- Tasks ---
  public getTasks(orgId: string): Task[] {
    return this.tasks.filter(t => t.orgId === orgId);
  }

  public getTaskById(orgId: string, id: string): Task | undefined {
    return this.tasks.find(t => t.orgId === orgId && t.id === id);
  }

  public createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isOverdue' | 'escalationLevel'>): Task {
    const newTask: Task = {
      ...task,
      id: `tsk-${Date.now()}`,
      isOverdue: false,
      escalationLevel: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);

    if (isSupabaseConfigured()) {
      const sb = getSupabaseClient();
      if (sb) {
        sb.from('tasks')
          .insert({
            id: newTask.id,
            org_id: newTask.orgId,
            project_id: newTask.projectId,
            department_id: newTask.departmentId || null,
            title: newTask.title,
            description: newTask.description || '',
            assignee_id: newTask.assigneeId || null,
            creator_id: newTask.creatorId || null,
            status: newTask.status || 'todo',
            priority: newTask.priority || 'medium',
            due_date: newTask.dueDate || null,
            is_overdue: newTask.isOverdue || false,
            escalation_level: newTask.escalationLevel || 0,
          })
          .then(({ error }) => {
            if (error) console.warn('[Supabase] Task insert error:', error.message);
          });
      }
    }

    return newTask;
  }

  public updateTask(orgId: string, id: string, updates: Partial<Task>): Task | undefined {
    const index = this.tasks.findIndex(t => t.orgId === orgId && t.id === id);
    if (index === -1) return undefined;
    this.tasks[index] = { ...this.tasks[index], ...updates, updatedAt: new Date().toISOString() };

    if (isSupabaseConfigured()) {
      const sb = getSupabaseClient();
      if (sb) {
        const payload: any = {};
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.priority !== undefined) payload.priority = updates.priority;
        if (updates.dueDate !== undefined) payload.due_date = updates.dueDate;
        if (updates.isOverdue !== undefined) payload.is_overdue = updates.isOverdue;
        if (updates.escalationLevel !== undefined) payload.escalation_level = updates.escalationLevel;
        payload.updated_at = new Date().toISOString();

        sb.from('tasks')
          .update(payload)
          .eq('id', id)
          .then(({ error }) => {
            if (error) console.warn('[Supabase] Task update error:', error.message);
          });
      }
    }

    return this.tasks[index];
  }

  // --- Approvals ---
  public getApprovals(orgId: string): Approval[] {
    return this.approvals.filter(a => a.orgId === orgId);
  }

  public createApproval(approval: Omit<Approval, 'id' | 'submittedAt' | 'status'>): Approval {
    const newApproval: Approval = {
      ...approval,
      id: `appr-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    this.approvals.push(newApproval);

    if (isSupabaseConfigured()) {
      const sb = getSupabaseClient();
      if (sb) {
        sb.from('approvals')
          .insert({
            id: newApproval.id,
            org_id: newApproval.orgId,
            title: newApproval.title,
            description: newApproval.description || '',
            category: newApproval.category || 'operational',
            requester_id: newApproval.requesterId || null,
            approver_id: newApproval.approverId || null,
            related_task_id: newApproval.relatedTaskId || null,
            related_project_id: newApproval.relatedProjectId || null,
            status: newApproval.status || 'pending',
            decision_notes: newApproval.decisionNotes || null,
            submitted_at: newApproval.submittedAt,
          })
          .then(({ error }) => {
            if (error) console.warn('[Supabase] Approval insert error:', error.message);
          });
      }
    }

    return newApproval;
  }

  public decideApproval(orgId: string, id: string, decision: 'approved' | 'rejected', notes?: string): Approval | undefined {
    const appr = this.approvals.find(a => a.orgId === orgId && a.id === id);
    if (!appr) return undefined;
    appr.status = decision;
    appr.decisionNotes = notes || (decision === 'approved' ? 'Approved by administrator.' : 'Rejected.');
    appr.decidedAt = new Date().toISOString();

    if (isSupabaseConfigured()) {
      const sb = getSupabaseClient();
      if (sb) {
        sb.from('approvals')
          .update({
            status: decision,
            decision_notes: appr.decisionNotes,
            decided_at: appr.decidedAt,
          })
          .eq('id', id)
          .then(({ error }) => {
            if (error) console.warn('[Supabase] Approval decision update error:', error.message);
          });
      }
    }

    return appr;
  }

  // --- Workflows ---
  public getWorkflows(orgId: string): WorkflowDefinition[] {
    return this.workflows.filter(w => w.orgId === orgId);
  }

  public getWorkflowById(orgId: string, id: string): WorkflowDefinition | undefined {
    return this.workflows.find(w => w.orgId === orgId && w.id === id);
  }

  public getWorkflowRuns(orgId: string, workflowId?: string): WorkflowRun[] {
    return this.workflowRuns.filter(r => r.orgId === orgId && (!workflowId || r.workflowId === workflowId));
  }

  public createWorkflowRun(run: Omit<WorkflowRun, 'id' | 'startedAt'>): WorkflowRun {
    const newRun: WorkflowRun = {
      ...run,
      id: `run-${Date.now()}`,
      startedAt: new Date().toISOString(),
    };
    this.workflowRuns.unshift(newRun);

    if (isSupabaseConfigured()) {
      const sb = getSupabaseClient();
      if (sb) {
        sb.from('workflow_runs')
          .insert({
            id: newRun.id,
            org_id: newRun.orgId,
            workflow_id: newRun.workflowId,
            triggering_event: newRun.triggeringEvent,
            status: newRun.status,
            started_at: newRun.startedAt,
            completed_at: newRun.completedAt || null,
            actions_attempted: newRun.actionsAttempted || 0,
            actions_completed: newRun.actionsCompleted || 0,
            details: newRun.details || {},
          })
          .then(({ error }) => {
            if (error) console.warn('[Supabase] Workflow run insert error:', error.message);
          });
      }
    }

    return newRun;
  }

  // --- Insights ---
  public getInsights(orgId: string): OperationalInsight[] {
    return this.operationalInsights.filter(i => i.orgId === orgId);
  }

  public updateInsightStatus(orgId: string, id: string, status: 'acknowledged' | 'resolved'): OperationalInsight | undefined {
    const insight = this.operationalInsights.find(i => i.orgId === orgId && i.id === id);
    if (!insight) return undefined;
    insight.status = status;
    insight.updatedAt = new Date().toISOString();

    if (isSupabaseConfigured()) {
      const sb = getSupabaseClient();
      if (sb) {
        sb.from('operational_insights')
          .update({
            status,
            updated_at: insight.updatedAt,
          })
          .eq('id', id)
          .then(({ error }) => {
            if (error) console.warn('[Supabase] Insight update error:', error.message);
          });
      }
    }

    return insight;
  }

  // --- Notifications ---
  public getNotifications(orgId: string, userId?: string): AppNotification[] {
    return this.notifications.filter(n => n.orgId === orgId && (!userId || n.userId === userId));
  }

  public markNotificationAsRead(orgId: string, id: string): AppNotification | undefined {
    const notif = this.notifications.find(n => n.orgId === orgId && n.id === id);
    if (notif) {
      notif.isRead = true;
      if (isSupabaseConfigured()) {
        const sb = getSupabaseClient();
        if (sb) {
          sb.from('notifications')
            .update({ is_read: true })
            .eq('id', id)
            .then(({ error }) => {
              if (error) console.warn('[Supabase] Notification update error:', error.message);
            });
        }
      }
    }
    return notif;
  }

  public addNotification(notification: Omit<AppNotification, 'id' | 'createdAt'>): AppNotification {
    const newNotif: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);

    if (isSupabaseConfigured()) {
      const sb = getSupabaseClient();
      if (sb) {
        sb.from('notifications')
          .insert({
            id: newNotif.id,
            org_id: newNotif.orgId,
            user_id: newNotif.userId,
            title: newNotif.title,
            message: newNotif.message,
            type: newNotif.type,
            entity_type: newNotif.entityType || null,
            entity_id: newNotif.entityId || null,
            is_read: false,
          })
          .then(({ error }) => {
            if (error) console.warn('[Supabase] Notification insert error:', error.message);
          });
      }
    }

    return newNotif;
  }

  // --- Activity ---
  public getActivity(orgId: string): ActivityEvent[] {
    return this.activityEvents.filter(a => a.orgId === orgId);
  }

  public addActivity(event: Omit<ActivityEvent, 'id' | 'timestamp'>): ActivityEvent {
    const newEvent: ActivityEvent = {
      ...event,
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.activityEvents.unshift(newEvent);

    if (isSupabaseConfigured()) {
      const sb = getSupabaseClient();
      if (sb) {
        sb.from('activity_events')
          .insert({
            id: newEvent.id,
            org_id: newEvent.orgId,
            user_name: newEvent.userName || 'System',
            action: newEvent.action,
            target: newEvent.target,
            department: newEvent.department || null,
            timestamp: newEvent.timestamp,
          })
          .then(({ error }) => {
            if (error) console.warn('[Supabase] Activity insert error:', error.message);
          });
      }
    }

    return newEvent;
  }

  /**
   * Loads all live tables from Supabase PostgreSQL database into repository memory cache
   */
  public async initSupabase(): Promise<void> {
    if (!isSupabaseConfigured()) return;
    const sb = getSupabaseClient();
    if (!sb) return;

    try {
      const { data: orgs, error } = await sb.from('organizations').select('*');
      if (error) {
        console.warn('[Supabase] Query notice (schema may need initialization):', error.message);
        return;
      }

      if (!orgs || orgs.length === 0) {
        console.log('[Supabase] Organizations table empty. Auto-seeding initial enterprise datasets into Supabase...');
        await this.seedSupabase();
        return;
      }

      // Populate organizations
      this.organizations = orgs.map((o: any) => ({
        id: o.id,
        name: o.name,
        slug: o.slug,
        plan: o.plan,
        createdAt: o.created_at,
        updatedAt: o.updated_at,
      }));

      // Departments
      const { data: depts } = await sb.from('departments').select('*');
      if (depts && depts.length > 0) {
        this.departments = depts.map((d: any) => ({
          id: d.id,
          orgId: d.org_id,
          name: d.name,
          code: d.code,
          leadId: d.lead_id,
          color: d.color,
        }));
      }

      // Profiles
      const { data: profs } = await sb.from('profiles').select('*');
      if (profs && profs.length > 0) {
        this.profiles = profs.map((p: any) => ({
          id: p.id,
          orgId: p.org_id,
          email: p.email,
          fullName: p.full_name,
          role: p.role,
          departmentId: p.department_id,
          avatarUrl: p.avatar_url,
          createdAt: p.created_at,
        }));
      }

      // Projects
      const { data: projs } = await sb.from('projects').select('*');
      if (projs && projs.length > 0) {
        this.projects = projs.map((p: any) => ({
          id: p.id,
          orgId: p.org_id,
          departmentId: p.department_id,
          name: p.name,
          description: p.description,
          ownerId: p.owner_id,
          status: p.status,
          priority: p.priority,
          progress: p.progress,
          startDate: p.start_date,
          dueDate: p.due_date,
          budget: Number(p.budget) || 0,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }));
      }

      // Tasks
      const { data: tsks } = await sb.from('tasks').select('*');
      if (tsks && tsks.length > 0) {
        this.tasks = tsks.map((t: any) => ({
          id: t.id,
          orgId: t.org_id,
          projectId: t.project_id,
          departmentId: t.department_id,
          title: t.title,
          description: t.description,
          assigneeId: t.assignee_id,
          creatorId: t.creator_id,
          status: t.status,
          priority: t.priority,
          dueDate: t.due_date,
          isOverdue: t.is_overdue,
          escalationLevel: t.escalation_level,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
        }));
      }

      // Approvals
      const { data: apprs } = await sb.from('approvals').select('*');
      if (apprs && apprs.length > 0) {
        this.approvals = apprs.map((a: any) => ({
          id: a.id,
          orgId: a.org_id,
          title: a.title,
          description: a.description,
          category: a.category,
          requesterId: a.requester_id,
          approverId: a.approver_id,
          relatedTaskId: a.related_task_id,
          relatedProjectId: a.related_project_id,
          status: a.status,
          decisionNotes: a.decision_notes,
          submittedAt: a.submitted_at,
          decidedAt: a.decided_at,
        }));
      }

      // Workflows
      const { data: wfs } = await sb.from('workflows').select('*');
      if (wfs && wfs.length > 0) {
        this.workflows = wfs.map((w: any) => ({
          id: w.id,
          orgId: w.org_id,
          name: w.name,
          description: w.description,
          isActive: w.is_active,
          triggerType: w.trigger_type,
          triggerConfig: w.trigger_config,
          conditions: w.conditions,
          actions: w.actions,
          executionCount: w.execution_count,
          lastRunAt: w.last_run_at,
          createdAt: w.created_at,
        }));
      }

      // Insights
      const { data: ins } = await sb.from('operational_insights').select('*');
      if (ins && ins.length > 0) {
        this.operationalInsights = ins.map((i: any) => ({
          id: i.id,
          orgId: i.org_id,
          title: i.title,
          severity: i.severity,
          description: i.description,
          evidence: i.evidence,
          recommendedAction: i.recommended_action,
          suggestedOwner: i.suggested_owner,
          status: i.status,
          createdAt: i.created_at,
          updatedAt: i.updated_at,
        }));
      }

      // Notifications
      const { data: notifs } = await sb.from('notifications').select('*');
      if (notifs && notifs.length > 0) {
        this.notifications = notifs.map((n: any) => ({
          id: n.id,
          orgId: n.org_id,
          userId: n.user_id,
          title: n.title,
          message: n.message,
          type: n.type,
          entityType: n.entity_type,
          entityId: n.entity_id,
          isRead: n.is_read,
          createdAt: n.created_at,
        }));
      }

      // Activity Events
      const { data: acts } = await sb.from('activity_events').select('*');
      if (acts && acts.length > 0) {
        this.activityEvents = acts.map((ev: any) => ({
          id: ev.id,
          orgId: ev.org_id,
          userName: ev.user_name,
          action: ev.action,
          target: ev.target,
          department: ev.department,
          timestamp: ev.timestamp,
        }));
      }

      console.log(`[Supabase] Live database sync active: ${this.organizations.length} organizations, ${this.projects.length} projects, ${this.tasks.length} tasks ready.`);
    } catch (err: any) {
      console.warn('[Supabase] Sync fallback to local memory state:', err.message);
    }
  }

  /**
   * Completely clears existing database tables and seeds the 4 distinct enterprise businesses
   */
  public async resetAndSeedDatabase(): Promise<{ deleted: boolean; inserted: Record<string, number> }> {
    const sb = getSupabaseClient();
    if (sb && isSupabaseConfigured()) {
      console.log('[Supabase Reset] Completely removing all existing rows in reverse dependency order...');
      // 1. Delete dependents first to prevent foreign key constraint violations
      await sb.from('activity_events').delete().neq('id', 'keep_none');
      await sb.from('notifications').delete().neq('id', 'keep_none');
      await sb.from('operational_insights').delete().neq('id', 'keep_none');
      await sb.from('workflow_runs').delete().neq('id', 'keep_none');
      await sb.from('workflows').delete().neq('id', 'keep_none');
      await sb.from('approvals').delete().neq('id', 'keep_none');
      await sb.from('tasks').delete().neq('id', 'keep_none');
      await sb.from('projects').delete().neq('id', 'keep_none');
      await sb.from('profiles').delete().neq('id', 'keep_none');
      await sb.from('departments').delete().neq('id', 'keep_none');
      await sb.from('organizations').delete().neq('id', 'keep_none');
      console.log('[Supabase Reset] All tables emptied cleanly.');
    }

    // Restore pristine 4 businesses dataset in memory before seeding
    this.restoreDefaults();

    // Now seed pristine 4 businesses
    const result = await this.seedSupabase();
    await this.initSupabase();
    return { deleted: true, ...result };
  }

  /**
   * Seeds all initial 4 enterprise businesses directly into Supabase tables
   */
  public async seedSupabase(): Promise<{ inserted: Record<string, number> }> {
    const sb = getSupabaseClient();
    if (!sb) throw new Error('Supabase client is not available or credentials missing');

    // 1. Organizations
    const { error: orgErr } = await sb.from('organizations').upsert(
      this.organizations.map(o => ({
        id: o.id,
        name: o.name,
        slug: o.slug,
        plan: o.plan,
        created_at: o.createdAt,
      })),
      { onConflict: 'id' }
    );
    if (orgErr) console.warn('[Supabase Seed] Organizations:', orgErr.message);

    // 2. Departments
    const { error: deptErr } = await sb.from('departments').upsert(
      this.departments.map(d => ({
        id: d.id,
        org_id: d.orgId,
        name: d.name,
        code: d.code,
        lead_id: d.leadId || null,
        color: d.color || '#0F4C3A',
      })),
      { onConflict: 'id' }
    );
    if (deptErr) console.warn('[Supabase Seed] Departments:', deptErr.message);

    // 3. Profiles
    const { error: profErr } = await sb.from('profiles').upsert(
      this.profiles.map(p => ({
        id: p.id,
        org_id: p.orgId,
        email: p.email,
        full_name: p.fullName,
        role: p.role,
        department_id: p.departmentId || null,
        avatar_url: p.avatarUrl || null,
      })),
      { onConflict: 'id' }
    );
    if (profErr) console.warn('[Supabase Seed] Profiles:', profErr.message);

    // 4. Projects
    const { error: projErr } = await sb.from('projects').upsert(
      this.projects.map(p => ({
        id: p.id,
        org_id: p.orgId,
        department_id: p.departmentId || null,
        name: p.name,
        description: p.description || '',
        owner_id: p.ownerId || null,
        status: p.status,
        priority: p.priority,
        progress: p.progress || 0,
        start_date: p.startDate || null,
        due_date: p.dueDate || null,
        budget: p.budget || 0,
      })),
      { onConflict: 'id' }
    );
    if (projErr) console.warn('[Supabase Seed] Projects:', projErr.message);

    // 5. Tasks
    const { error: taskErr } = await sb.from('tasks').upsert(
      this.tasks.map(t => ({
        id: t.id,
        org_id: t.orgId,
        project_id: t.projectId,
        department_id: t.departmentId || null,
        title: t.title,
        description: t.description || '',
        assignee_id: t.assigneeId || null,
        creator_id: t.creatorId || null,
        status: t.status,
        priority: t.priority,
        due_date: t.dueDate || null,
        is_overdue: t.isOverdue || false,
        escalation_level: t.escalationLevel || 0,
      })),
      { onConflict: 'id' }
    );
    if (taskErr) console.warn('[Supabase Seed] Tasks:', taskErr.message);

    // 6. Approvals
    const { error: apprErr } = await sb.from('approvals').upsert(
      this.approvals.map(a => ({
        id: a.id,
        org_id: a.orgId,
        title: a.title,
        description: a.description || '',
        category: a.category,
        requester_id: a.requesterId || null,
        approver_id: a.approverId || null,
        related_task_id: a.relatedTaskId || null,
        related_project_id: a.relatedProjectId || null,
        status: a.status,
        decision_notes: a.decisionNotes || null,
        submitted_at: a.submittedAt,
        decided_at: a.decidedAt || null,
      })),
      { onConflict: 'id' }
    );
    if (apprErr) console.warn('[Supabase Seed] Approvals:', apprErr.message);

    // 7. Workflows
    const { error: wfErr } = await sb.from('workflows').upsert(
      this.workflows.map(w => ({
        id: w.id,
        org_id: w.orgId,
        name: w.name,
        description: w.description,
        is_active: w.isActive ?? true,
        trigger_type: w.triggerType,
        trigger_config: w.triggerConfig || {},
        conditions: w.conditions || [],
        actions: w.actions || [],
        execution_count: w.executionCount || 0,
        last_run_at: w.lastRunAt || null,
        created_at: w.createdAt,
      })),
      { onConflict: 'id' }
    );
    if (wfErr) console.warn('[Supabase Seed] Workflows:', wfErr.message);

    // 8. Workflow Runs
    const { error: runErr } = await sb.from('workflow_runs').upsert(
      this.workflowRuns.map(r => ({
        id: r.id,
        org_id: r.orgId,
        workflow_id: r.workflowId,
        triggering_event: r.triggeringEvent,
        status: r.status,
        started_at: r.startedAt,
        completed_at: r.completedAt || null,
        actions_attempted: r.actionsAttempted || 0,
        actions_completed: r.actionsCompleted || 0,
        details: r.details || {},
      })),
      { onConflict: 'id' }
    );
    if (runErr) console.warn('[Supabase Seed] Workflow Runs:', runErr.message);

    // 9. Insights
    const { error: insErr } = await sb.from('operational_insights').upsert(
      this.operationalInsights.map(i => ({
        id: i.id,
        org_id: i.orgId,
        title: i.title,
        severity: i.severity,
        description: i.description,
        evidence: i.evidence || [],
        recommended_action: i.recommendedAction,
        suggested_owner: i.suggestedOwner || null,
        status: i.status,
        created_at: i.createdAt,
        updated_at: i.updatedAt,
      })),
      { onConflict: 'id' }
    );
    if (insErr) console.warn('[Supabase Seed] Insights:', insErr.message);

    // 10. Notifications
    const { error: notifErr } = await sb.from('notifications').upsert(
      this.notifications.map(n => ({
        id: n.id,
        org_id: n.orgId,
        user_id: n.userId,
        title: n.title,
        message: n.message,
        type: n.type,
        entity_type: n.entityType || null,
        entity_id: n.entityId || null,
        is_read: n.isRead || false,
        created_at: n.createdAt,
      })),
      { onConflict: 'id' }
    );
    if (notifErr) console.warn('[Supabase Seed] Notifications:', notifErr.message);

    // 11. Activity Events
    const { error: actErr } = await sb.from('activity_events').upsert(
      this.activityEvents.map(ev => ({
        id: ev.id,
        org_id: ev.orgId,
        user_name: ev.userName || 'System',
        action: ev.action,
        target: ev.target,
        department: ev.department || null,
        timestamp: ev.timestamp,
      })),
      { onConflict: 'id' }
    );
    if (actErr) console.warn('[Supabase Seed] Activity:', actErr.message);

    return {
      inserted: {
        organizations: this.organizations.length,
        departments: this.departments.length,
        profiles: this.profiles.length,
        projects: this.projects.length,
        tasks: this.tasks.length,
        approvals: this.approvals.length,
        workflows: this.workflows.length,
        workflowRuns: this.workflowRuns.length,
        insights: this.operationalInsights.length,
        notifications: this.notifications.length,
        activityEvents: this.activityEvents.length,
      },
    };
  }
}
