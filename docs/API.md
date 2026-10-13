# Entreprise AI OS — REST API Reference

Base URL (Local): `http://localhost:10000`  
Base URL (Render Production): `https://<your-render-service>.onrender.com`

All protected endpoints accept headers:
- `x-org-id`: Organization ID (default: `org-apex-001`)
- `Authorization`: `Bearer <token>`

---

## 1. System Health
### `GET /api/health`
Health check endpoint for Render deployment monitoring and uptime verification.
- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "service": "Entreprise AI Backend Operations Engine",
  "version": "1.0.0",
  "environment": "production",
  "uptimeSeconds": 124
}
```

---

## 2. Executive Command Center
### `GET /api/dashboard/summary`
Returns high-level operational indicators, departmental breakdowns, and team workload distribution.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "metrics": {
      "totalActiveProjects": 3,
      "projectsAtRisk": 1,
      "openTasks": 4,
      "overdueTasks": 2,
      "completedTasks": 1,
      "pendingApprovals": 2,
      "activeInsights": 3,
      "workflowRunsCount": 2
    },
    "departmentBreakdown": [...],
    "workloadDistribution": [...]
  }
}
```

### `GET /api/dashboard/priorities`
Returns immediate urgent actions (overdue tasks, pending executive approvals, at-risk projects) with clear urgency reasons.

---

## 3. Projects & Initiatives
### `GET /api/projects`
List all projects belonging to the authorized organization.

### `GET /api/projects/:id`
Retrieve details of a specific project.

### `POST /api/projects`
Create a new project.
- **Body**: `{ name, description, departmentId, status, priority, progress, startDate, dueDate, budget }`

### `PATCH /api/projects/:id`
Update an existing project.

---

## 4. Tasks & Workstreams
### `GET /api/tasks`
List tasks with optional query filters: `projectId`, `status`, `priority`, `departmentId`.

### `POST /api/tasks`
Create a task under a project and log activity.
- **Body**: `{ projectId, departmentId, title, description, assigneeId, priority, status, dueDate }`

### `PATCH /api/tasks/:id`
Update task attributes, escalation level, or status.

---

## 5. Executive Approvals
### `GET /api/approvals`
List all approval requests.

### `POST /api/approvals`
Submit a new approval request and dispatch notification.
- **Body**: `{ title, description, category, relatedProjectId, relatedTaskId, approverId }`

### `POST /api/approvals/:id/decision`
Approve or reject a request.
- **Body**: `{ decision: "approved" | "rejected", notes: "Optional reasoning" }`

---

## 6. Intelligent Workflow Automation
### `GET /api/workflows`
List all configured enterprise workflows with triggers, conditions, and actions.

### `POST /api/workflows`
Create a new workflow automation.

### `PATCH /api/workflows/:id/toggle`
Enable or disable a workflow.
- **Body**: `{ isActive: boolean }`

### `POST /api/workflows/:id/trigger`
**Live Demonstration Trigger**: Executes a workflow manually or via event payload, evaluates conditions, runs actions (e.g. task escalation, notifications), and logs an audit run.
- **Body**: `{ taskId?: string, manualTrigger?: boolean }`
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Workflow executed successfully",
  "data": {
    "workflowId": "wf-auto-escalate",
    "status": "completed",
    "actionsAttempted": 3,
    "actionsCompleted": 3,
    "details": { "taskEscalated": { "id": "tsk-101", "newEscalationLevel": 2 } }
  }
}
```

### `GET /api/workflows/runs`
Retrieve the tamper-evident audit history of all workflow executions.

---

## 7. Decision Intelligence (Insights)
### `GET /api/ai/insights`
Dynamically evaluates live projects, overdue deliverables, and stagnant approvals to return grounded operational insights.

### `POST /api/ai/insights/:id/status`
Update insight resolution status.
- **Body**: `{ status: "acknowledged" | "resolved" }`

---

## 8. Enterprise AI Assistant
### `POST /api/ai/chat`
Conversational operational query endpoint with strict tenant data grounding and human-in-the-loop action proposals.
- **Body**: `{ message: string }`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "summary": "Found 1 project(s) currently flagged as AT RISK...",
    "observedFacts": ["Project OmniCloud is scheduled for 2026-10-18 with 68% progress..."],
    "supportingRecords": [{ "id": "proj-1", "type": "project", "title": "OmniCloud Core Modernization" }],
    "risks": ["Potential deadline breach..."],
    "recommendedActions": ["Approve pending infrastructure override..."],
    "proposedAction": {
      "id": "act-prop-123",
      "actionType": "escalate_task",
      "description": "Escalate overdue task...",
      "payload": { "taskId": "tsk-101" },
      "requiresConfirmation": true
    }
  }
}
```

### `POST /api/ai/execute-action`
**Human-in-the-Loop Action Execution**: Validates permissions and executes an AI-proposed action confirmed by an authorized user.
- **Body**: `{ action: { actionType: string, payload: object } }`
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Action authorized and executed successfully",
  "data": { "executedAction": "escalate_task", "entity": { "id": "tsk-101", "escalationLevel": 3 } }
}
```

---

## 9. Notifications & Activity
### `GET /api/notifications`
Retrieve in-app notifications for the authenticated user.

### `PATCH /api/notifications/:id/read`
Mark a notification as read.

### `GET /api/activity`
Retrieve real-time cross-department operational activity log.
