export type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'MEMBER' | 'CLIENT' | 'owner' | 'admin' | 'manager' | 'member';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Department {
  id: string;
  orgId?: string;
  organizationId?: string;
  name: string;
  code: string;
  leadId?: string;
  color?: string;
}

export interface Profile {
  id: string;
  orgId?: string;
  organizationId?: string;
  departmentId?: string;
  departmentName?: string;
  fullName: string;
  name?: string;
  email: string;
  role: string;
  avatar?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export type ProjectHealth = 'ON TRACK' | 'AT RISK' | 'DELAYED' | 'on_track' | 'at_risk' | 'delayed';
export type ProjectStatus = 'planning' | 'active' | 'at_risk' | 'completed' | 'on_hold' | 'cancelled' | string;

export interface Project {
  id: string;
  orgId?: string;
  organizationId?: string;
  name: string;
  title?: string;
  description?: string;
  ownerId?: string;
  departmentId?: string;
  departmentName?: string;
  status: ProjectStatus;
  priority: string;
  progress?: number;
  progressPercent?: number;
  startDate?: string;
  dueDate?: string;
  deadline?: string;
  budget?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'blocked' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | string;
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent' | 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | string;

export interface Task {
  id: string;
  orgId?: string;
  organizationId?: string;
  projectId: string;
  projectName?: string;
  departmentId?: string;
  title: string;
  description?: string;
  assigneeId?: string;
  assignedEmployeeName?: string;
  creatorId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  deadline?: string;
  isOverdue?: boolean;
  escalationLevel?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'PENDING' | 'APPROVED' | 'REJECTED' | string;

export interface Approval {
  id: string;
  orgId?: string;
  organizationId?: string;
  title: string;
  description?: string;
  category: string;
  requesterId?: string;
  requesterName?: string;
  approverId?: string;
  reviewerName?: string;
  relatedProjectId?: string;
  relatedTaskId?: string;
  status: ApprovalStatus;
  decisionNotes?: string;
  submittedAt: string;
  decidedAt?: string;
}

export interface WorkflowCondition {
  field: string;
  operator: string;
  value: any;
}

export interface WorkflowAction {
  type: string;
  config?: Record<string, any>;
  params?: Record<string, any>;
}

export interface WorkflowDefinition {
  id: string;
  orgId?: string;
  organizationId?: string;
  name: string;
  description: string;
  isActive?: boolean;
  enabled?: boolean;
  triggerType: string;
  triggerConfig?: Record<string, any>;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  executionCount: number;
  lastRunAt?: string;
  createdAt: string;
}

export interface WorkflowRun {
  id: string;
  orgId?: string;
  organizationId?: string;
  workflowId: string;
  workflowName?: string;
  triggeringEvent: string;
  status: 'running' | 'completed' | 'failed' | 'RUNNING' | 'SUCCESS' | 'FAILED' | string;
  startedAt: string;
  completedAt?: string;
  actionsAttempted: number;
  actionsCompleted: number;
  details?: any;
}

export type InsightSeverity = 'low' | 'medium' | 'high' | 'critical' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;
export type InsightStatus = 'new' | 'acknowledged' | 'resolved' | 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED' | string;

export interface OperationalInsight {
  id: string;
  orgId?: string;
  organizationId?: string;
  title: string;
  severity: InsightSeverity;
  description: string;
  evidence: string[];
  recommendedAction: string;
  suggestedOwner?: string;
  status: InsightStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  orgId?: string;
  organizationId?: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  entityType?: string;
  entityId?: string;
  isRead?: boolean;
  read?: boolean;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  orgId?: string;
  organizationId?: string;
  userName?: string;
  authorName?: string;
  action: string;
  target: string;
  department?: string;
  timestamp: string;
}

export interface AIProposedAction {
  id: string;
  actionType: string;
  description: string;
  targetEntity: string;
  entityId?: string;
  payload: Record<string, any>;
  requiresConfirmation: boolean;
}
