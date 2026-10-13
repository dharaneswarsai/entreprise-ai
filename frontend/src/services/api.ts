/**
 * Entreprise AI OS - Centralized Frontend API Service
 * Handles communication with backend REST API with multi-tenant scoping
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';

class ApiService {
  private activeOrgId: string = 'org-apex-001';

  public setOrganization(orgId: string) {
    this.activeOrgId = orgId;
    try {
      localStorage.setItem('ENTREPRISE_ACTIVE_ORG_ID', orgId);
    } catch (e) {
      // ignore
    }
  }

  public getOrganizationId(): string {
    try {
      const saved = localStorage.getItem('ENTREPRISE_ACTIVE_ORG_ID');
      if (saved) return saved;
    } catch (e) {
      // ignore
    }
    return this.activeOrgId;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'x-org-id': this.getOrganizationId(),
      'Authorization': 'Bearer demo-token',
    };
  }

  // --- Health ---
  public async getHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      return await res.json();
    } catch (err) {
      return { status: 'offline' };
    }
  }

  // --- Organizations ---
  public async getOrganizations() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/organizations`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('Backend unavailable for organizations, using local fallback', err);
      return [];
    }
  }

  public async createOrganization(data: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/organizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // --- Dashboard ---
  public async getDashboardSummary() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/summary`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to load dashboard summary');
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('Backend unavailable, using fallback metrics', err);
      return null;
    }
  }

  public async getPriorities() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/priorities`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to load priorities');
      const json = await res.json();
      return json.data;
    } catch (err) {
      return [];
    }
  }

  // --- Projects ---
  public async getProjects() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`, {
        headers: this.getHeaders(),
      });
      const json = await res.json();
      return json.data;
    } catch (err) {
      return [];
    }
  }

  public async updateProject(id: string, updates: Record<string, any>) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  // --- Tasks ---
  public async getTasks() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks`, {
        headers: this.getHeaders(),
      });
      const json = await res.json();
      return json.data;
    } catch (err) {
      return [];
    }
  }

  public async updateTask(id: string, updates: Record<string, any>) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  // --- Approvals ---
  public async getApprovals() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/approvals`, {
        headers: this.getHeaders(),
      });
      const json = await res.json();
      return json.data;
    } catch (err) {
      return [];
    }
  }

  public async decideApproval(id: string, decision: 'approved' | 'rejected', notes?: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/approvals/${id}/decision`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ decision, notes }),
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  // --- Workflows ---
  public async getWorkflows() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/workflows`, {
        headers: this.getHeaders(),
      });
      const json = await res.json();
      return json.data;
    } catch (err) {
      return [];
    }
  }

  public async toggleWorkflow(id: string, isActive: boolean) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/workflows/${id}/toggle`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ isActive }),
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  public async triggerWorkflow(id: string, payload: Record<string, any> = {}) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/workflows/${id}/trigger`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  public async getWorkflowRuns(workflowId?: string) {
    try {
      const url = workflowId
        ? `${API_BASE_URL}/api/workflows/${workflowId}/runs`
        : `${API_BASE_URL}/api/workflows/runs`;
      const res = await fetch(url, {
        headers: this.getHeaders(),
      });
      const json = await res.json();
      return json.data;
    } catch (err) {
      return [];
    }
  }

  // --- Insights (Decision Intelligence) ---
  public async getInsights() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/insights`, {
        headers: this.getHeaders(),
      });
      const json = await res.json();
      return json.data;
    } catch (err) {
      return [];
    }
  }

  public async updateInsightStatus(id: string, status: 'acknowledged' | 'resolved') {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/insights/${id}/status`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ status }),
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  // --- AI Assistant & Human-In-The-Loop Execution ---
  public async sendAIChat(message: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ message }),
      });
      const json = await res.json();
      return json.data;
    } catch (err) {
      return null;
    }
  }

  public async executeAIAction(action: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/execute-action`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ action }),
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  // --- Notifications & Activity ---
  public async getNotifications() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: this.getHeaders(),
      });
      const json = await res.json();
      return json.data;
    } catch (err) {
      return [];
    }
  }

  public async getActivity() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/activity`, {
        headers: this.getHeaders(),
      });
      const json = await res.json();
      return json.data;
    } catch (err) {
      return [];
    }
  }

  // --- Supabase Integration ---
  public async getSupabaseStatus() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/supabase/status`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      return null;
    }
  }

  public async testSupabase() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/supabase/test`, {
        method: 'POST',
      });
      const json = await res.json();
      return json.data;
    } catch (err) {
      return null;
    }
  }

  public async seedSupabase() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/supabase/seed`, {
        method: 'POST',
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  public async cleanResetSupabase() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/supabase/clean-reset`, {
        method: 'POST',
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  public async getSupabaseSchema() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/supabase/schema`);
      const json = await res.json();
      return json.schemaSql || '';
    } catch (err) {
      return '';
    }
  }
}

export const api = new ApiService();
