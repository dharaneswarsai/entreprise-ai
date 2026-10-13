import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Brain,
  ShieldAlert,
  Clock,
  UserCheck,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { api } from '../services/api';

interface InsightItem {
  id: string;
  title: string;
  severity: string;
  description: string;
  evidence: string[];
  recommendedAction: string;
  suggestedOwner?: string;
  status: string;
  createdAt: string;
}

export const Insights: React.FC = () => {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const data = await api.getInsights();
      if (data) setInsights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const handleStatusChange = async (id: string, status: 'acknowledged' | 'resolved') => {
    try {
      const updated = await api.updateInsightStatus(id, status);
      if (updated) {
        setActionSuccess(`Insight marked as ${status.toUpperCase()}`);
        setTimeout(() => setActionSuccess(null), 3000);
        await loadInsights();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5" /> CRITICAL BOTTLENECK
          </span>
        );
      case 'high':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" /> HIGH RISK
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Info className="w-3.5 h-3.5" /> ATTENTION REQUIRED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {actionSuccess && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-[#0F4C3A] text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/30 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-medium text-sm">{actionSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#0F4C3A] border border-emerald-200">
              Decision Intelligence
            </span>
            <span className="text-xs text-stone-600">Deterministic Operational Radar</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Operational Insights &amp; Bottlenecks
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Data-grounded explanations, cross-department bottleneck detection, and recommended decisions.
          </p>
        </div>

        <button
          onClick={loadInsights}
          className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Radar
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
            Critical Bottlenecks
          </div>
          <div className="text-3xl font-bold text-rose-600">
            {insights.filter(i => i.severity.toLowerCase() === 'critical' && i.status !== 'resolved').length}
          </div>
          <p className="text-xs text-stone-600 mt-1">Directly impacting milestones</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
            High Risk Signals
          </div>
          <div className="text-3xl font-bold text-amber-600">
            {insights.filter(i => i.severity.toLowerCase() === 'high' && i.status !== 'resolved').length}
          </div>
          <p className="text-xs text-stone-600 mt-1">Approaching SLA thresholds</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
            Resolved Insights
          </div>
          <div className="text-3xl font-bold text-emerald-600">
            {insights.filter(i => i.status === 'resolved').length}
          </div>
          <p className="text-xs text-stone-600 mt-1">Mitigated by enterprise operations</p>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0F4C3A]" />
            <p className="text-sm text-stone-600 mt-2">Evaluating operations radar...</p>
          </div>
        ) : insights.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-stone-900">All Operations Clear</h3>
            <p className="text-sm text-stone-600 mt-1">No active operational bottlenecks detected.</p>
          </div>
        ) : (
          insights.map(insight => (
            <div
              key={insight.id}
              className={`bg-white rounded-2xl border p-6 shadow-sm transition ${
                insight.status === 'resolved'
                  ? 'border-stone-200 opacity-60 bg-stone-50/50'
                  : insight.severity.toLowerCase() === 'critical'
                  ? 'border-rose-300 ring-1 ring-rose-200/50'
                  : 'border-stone-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  {getSeverityBadge(insight.severity)}
                  <span className="text-xs text-stone-600 font-mono">ID: {insight.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-stone-600">
                    Status:{' '}
                    <strong className="text-stone-800 uppercase text-[11px]">
                      {insight.status}
                    </strong>
                  </span>
                  {insight.status !== 'resolved' && (
                    <div className="flex items-center gap-2 ml-2">
                      {insight.status !== 'acknowledged' && (
                        <button
                          onClick={() => handleStatusChange(insight.id, 'acknowledged')}
                          className="px-3 py-1 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(insight.id, 'resolved')}
                        className="px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h2 className="text-lg font-bold text-stone-900 mb-2">{insight.title}</h2>
              <p className="text-sm text-stone-700 leading-relaxed mb-4">{insight.description}</p>

              {/* Underlying Records / Evidence */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 mb-4">
                <div className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-stone-500" />
                  Observable Factual Evidence:
                </div>
                <ul className="space-y-1.5">
                  {insight.evidence.map((ev, idx) => (
                    <li key={idx} className="text-xs text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-stone-100">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-[#0F4C3A] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Recommended Action:
                  </div>
                  <p className="text-xs text-stone-800 font-medium">
                    {insight.recommendedAction}
                  </p>
                </div>

                {insight.suggestedOwner && (
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 bg-stone-100 px-3 py-1.5 rounded-xl text-xs text-stone-700">
                    <UserCheck className="w-3.5 h-3.5 text-stone-500" />
                    <span>Owner: <strong>{insight.suggestedOwner}</strong></span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
