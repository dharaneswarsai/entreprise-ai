import React, { useState, useEffect } from 'react';
import {
  Zap,
  Play,
  CheckCircle2,
  AlertTriangle,
  History,
  ArrowRight,
  Filter,
  Plus,
  Loader2,
  Bell,
  Sliders,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';

interface WorkflowDef {
  id: string;
  name: string;
  description: string;
  isActive?: boolean;
  triggerType: string;
  triggerConfig?: any;
  conditions: any[];
  actions: any[];
  executionCount: number;
  lastRunAt?: string;
}

interface WorkflowRunItem {
  id: string;
  workflowId: string;
  triggeringEvent: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  actionsAttempted: number;
  actionsCompleted: number;
  details?: any;
}

export const Workflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowDef[]>([]);
  const [runs, setRuns] = useState<WorkflowRunItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [wfData, runsData] = await Promise.all([
        api.getWorkflows(),
        api.getWorkflowRuns(),
      ]);
      if (wfData) setWorkflows(wfData);
      if (runsData) setRuns(runsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTriggerWorkflow = async (workflowId: string, wfName: string) => {
    setRunningId(workflowId);
    try {
      const res = await api.triggerWorkflow(workflowId, { manualTrigger: true });
      if (res && res.success) {
        setToastMsg(`Workflow "${wfName}" executed successfully!`);
        setTimeout(() => setToastMsg(null), 4000);
        await loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRunningId(null);
    }
  };

  const handleToggle = async (workflowId: string, current: boolean) => {
    const updated = await api.toggleWorkflow(workflowId, !current);
    if (updated) {
      setWorkflows(prev =>
        prev.map(w => (w.id === workflowId ? { ...w, isActive: !current } : w))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-[#0F4C3A] text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/30 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-medium text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#0F4C3A] border border-emerald-200">
              Operations Automation
            </span>
            <span className="text-xs text-stone-600">Enterprise Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Intelligent Workflow Automation
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Event-driven triggers, guardrails, and automated cross-department operational actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setToastMsg('Workflow builder modal ready')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0F4C3A] hover:bg-[#155e47] rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            New Workflow
          </button>
        </div>
      </div>

      {/* Active Workflows Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#0F4C3A]" />
            Configured Enterprise Automations ({workflows.length})
          </h2>
          <span className="text-xs text-stone-600">Safe execution &amp; full audit trails</span>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0F4C3A]" />
            <p className="text-sm text-stone-600 mt-2">Loading enterprise workflows...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workflows.map(wf => (
              <div
                key={wf.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-stone-100 text-stone-700 uppercase tracking-wider">
                      {wf.triggerType.replace(/_/g, ' ')}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={wf.isActive !== false}
                        onChange={() => handleToggle(wf.id, wf.isActive !== false)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0F4C3A]"></div>
                    </label>
                  </div>

                  <h3 className="font-semibold text-stone-900 text-base mb-1.5">{wf.name}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">{wf.description}</p>

                  <div className="space-y-2 mb-4 bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <div className="text-[11px] font-medium text-stone-600 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-stone-400" />
                      Actions Configured:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {wf.actions.map((act, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[11px] font-medium rounded bg-white text-stone-700 border border-stone-200 shadow-2xs"
                        >
                          {act.type.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-[11px] text-stone-600">
                    <div>Executions: <strong className="text-stone-700">{wf.executionCount}</strong></div>
                    {wf.lastRunAt && (
                      <div className="truncate max-w-[130px]">
                        Last: {new Date(wf.lastRunAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <button
                    disabled={runningId === wf.id}
                    onClick={() => handleTriggerWorkflow(wf.id, wf.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0F4C3A] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded-lg transition disabled:opacity-50"
                  >
                    {runningId === wf.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Test Run Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Execution History & Audit Run Log */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-stone-500" />
            <h2 className="text-base font-semibold text-stone-900">
              Workflow Execution Audit Log ({runs.length})
            </h2>
          </div>
          <span className="text-xs text-stone-600">Tamper-evident operational run records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-semibold">
                <th className="py-3 px-4">Run ID</th>
                <th className="py-3 px-4">Trigger Event</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions Completed</th>
                <th className="py-3 px-4">Execution Details</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {runs.map(run => (
                <tr key={run.id} className="hover:bg-stone-50/80 transition">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-stone-700">
                    {run.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-stone-900">
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                      {run.triggeringEvent}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                        run.status === 'completed' || run.status === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : run.status === 'running' || run.status === 'RUNNING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {run.status === 'completed' || run.status === 'SUCCESS' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      {run.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-700">
                    <span className="font-semibold text-stone-900">{run.actionsCompleted}</span> / {run.actionsAttempted} steps
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-stone-600 font-mono text-[11px]">
                    {typeof run.details === 'object' ? JSON.stringify(run.details) : String(run.details || '-')}
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    {run.completedAt ? new Date(run.completedAt).toLocaleTimeString() : new Date(run.startedAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
