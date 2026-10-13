import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Zap,
  Users2
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';

export const CommandCenter: React.FC = () => {
  const { clients, leads, projects, tasks, invoices, payments, approvals, calls } = useApp();
  const navigate = useNavigate();

  // Metrics
  const realizedRevenue = invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + b.amountPaid, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'Sent' || i.status === 'Partially Paid').reduce((a, b) => a + (b.total - b.amountPaid), 0);
  const activeClients = clients.filter(c => c.health !== 'At Risk');
  const activeProjects = projects.filter(p => p.status === 'In Progress' || p.status === 'Review');

  const todayStr = '2026-10-13';
  const tasksDueToday = tasks.filter(t => t.deadline === todayStr && t.status !== 'COMPLETED');
  const overdueTasks = tasks.filter(t => t.deadline < todayStr && t.status !== 'COMPLETED');
  const pendingPayments = invoices.filter(i => i.status === 'Overdue' || i.status === 'Sent');
  const atRiskProjects = projects.filter(p => p.health === 'AT RISK' || p.health === 'DELAYED');
  const pendingApprovals = approvals.filter(a => ((a.currentStatus || a.status || '').toUpperCase().startsWith('PENDING')));

  // Pipeline stages breakdown
  const stages = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'WON'];
  const stageCounts = stages.map(st => ({
    stage: st,
    count: leads.filter(l => l.stage === st).length
  }));

  // Workload calculations
  const teamWorkload = [
    { role: 'Design', count: tasks.filter(t => t.category === 'Design' && t.status !== 'COMPLETED').length, total: 10, fill: '80%' },
    { role: 'Video Production', count: tasks.filter(t => t.category === 'Video' && t.status !== 'COMPLETED').length, total: 10, fill: '65%' },
    { role: 'Brand Strategy', count: tasks.filter(t => t.category === 'Strategy' && t.status !== 'COMPLETED').length, total: 10, fill: '50%' },
    { role: 'Sales & BD', count: leads.filter(l => l.stage !== 'WON' && l.stage !== 'LOST').length, total: 10, fill: '70%' },
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Control Room Header */}
      <div className="bg-[#15382B] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#1F4D3A] relative overflow-hidden">
        {/* Subtle background ambient ring */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-300">
                Agency Control Room · Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">ENTREPRISE AI COMMAND CENTER</h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
              High-fidelity operations snapshot: Master health, financial realization, production bottlenecks, and resource allocation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-2.5 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-stone-300">Active Clients</span>
              <p className="text-xl font-bold font-mono text-white">{activeClients.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-2.5 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-stone-300">Active Projects</span>
              <p className="text-xl font-bold font-mono text-white">{activeProjects.length}</p>
            </div>
          </div>
        </div>

        {/* Master Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div>
            <span className="text-[11px] text-stone-300 uppercase font-semibold">Realized Revenue</span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">₹{realizedRevenue.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-[11px] text-stone-300 uppercase font-semibold">Pending Billing</span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-300 mt-1">₹{pendingRevenue.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-[11px] text-stone-300 uppercase font-semibold">Deliverables Today</span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">{tasksDueToday.length} Due</p>
          </div>
          <div>
            <span className="text-[11px] text-stone-300 uppercase font-semibold">Pending Approvals</span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-amber-300 mt-1">{pendingApprovals.length} Items</p>
          </div>
        </div>
      </div>

      {/* TODAY'S OPERATIONAL RADAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="agency-card p-4 flex items-center justify-between border-l-4 border-l-[#1F4D3A]">
          <div>
            <span className="text-xs text-[#59655F] font-semibold">Tasks Due Today</span>
            <p className="text-xl font-bold font-mono text-[#202522] mt-0.5">{tasksDueToday.length} Tasks</p>
          </div>
          <Clock className="w-5 h-5 text-[#1F4D3A]" />
        </div>

        <div className="agency-card p-4 flex items-center justify-between border-l-4 border-l-blue-600">
          <div>
            <span className="text-xs text-[#59655F] font-semibold">Cold Calls Logged</span>
            <p className="text-xl font-bold font-mono text-[#202522] mt-0.5">{calls.length} Calls</p>
          </div>
          <PhoneCall className="w-5 h-5 text-blue-600" />
        </div>

        <div className="agency-card p-4 flex items-center justify-between border-l-4 border-l-emerald-600">
          <div>
            <span className="text-xs text-[#59655F] font-semibold">Creative Reviews</span>
            <p className="text-xl font-bold font-mono text-[#202522] mt-0.5">{pendingApprovals.length} Pending</p>
          </div>
          <Sparkles className="w-5 h-5 text-emerald-600" />
        </div>

        <div className="agency-card p-4 flex items-center justify-between border-l-4 border-l-purple-600">
          <div>
            <span className="text-xs text-[#59655F] font-semibold">Scheduled Releases</span>
            <p className="text-xl font-bold font-mono text-[#202522] mt-0.5">3 Content</p>
          </div>
          <Calendar className="w-5 h-5 text-purple-600" />
        </div>
      </div>

      {/* CRITICAL ATTENTION REQUIRED PANEL */}
      <div className="agency-card p-6 border-red-200 bg-red-50/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-red-700" />
            <h3 className="text-sm font-bold text-red-950 uppercase tracking-wider">
              Immediate Attention Required (Bottlenecks)
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-red-700 px-2 py-0.5 rounded bg-red-100">
            {overdueTasks.length + atRiskProjects.length + (pendingPayments.length > 0 ? 1 : 0)} Alerts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Overdue Tasks */}
          <div className="bg-white p-4 rounded-xl border border-red-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-800">⚠ Overdue Tasks ({overdueTasks.length})</span>
              <button onClick={() => navigate('/tasks')} className="text-[11px] text-red-700 hover:underline font-semibold">View →</button>
            </div>
            {overdueTasks.length === 0 ? (
              <p className="text-xs text-stone-500">None</p>
            ) : (
              <div className="space-y-1.5">
                {overdueTasks.map(t => (
                  <div key={t.id} className="text-xs border-b border-stone-100 pb-1">
                    <p className="font-semibold text-[#202522] truncate">{t.title}</p>
                    <p className="text-[10px] text-stone-500">Assignee: {t.assignedEmployeeName} · Due: {t.deadline}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* At Risk Projects */}
          <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">⚠ Projects At Risk ({atRiskProjects.length})</span>
              <button onClick={() => navigate('/projects')} className="text-[11px] text-amber-800 hover:underline font-semibold">View →</button>
            </div>
            {atRiskProjects.length === 0 ? (
              <p className="text-xs text-stone-500">All projects on track</p>
            ) : (
              <div className="space-y-1.5">
                {atRiskProjects.map(p => (
                  <div key={p.id} className="text-xs border-b border-stone-100 pb-1">
                    <p className="font-semibold text-[#202522] truncate">{p.title}</p>
                    <p className="text-[10px] text-stone-500">Status: {p.status} · Health: {p.health}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending / Overdue Invoices */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800">⚠ Pending Invoices ({pendingPayments.length})</span>
              <button onClick={() => navigate('/invoices')} className="text-[11px] text-[#1F4D3A] hover:underline font-semibold">View →</button>
            </div>
            <div className="space-y-1.5">
              {pendingPayments.map(inv => (
                <div key={inv.id} className="text-xs border-b border-stone-100 pb-1">
                  <p className="font-semibold text-[#202522] truncate">{inv.clientName} ({inv.invoiceNumber})</p>
                  <p className="text-[10px] text-stone-500">₹{(inv.total - inv.amountPaid).toLocaleString()} · Due: {inv.dueDate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SALES PIPELINE VISUAL STREAM */}
      <div className="agency-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#202522]">Sales Pipeline Velocity</h3>
            <p className="text-xs text-[#59655F]">Lead progression from inbound discovery to won client</p>
          </div>
          <button onClick={() => navigate('/leads')} className="text-xs font-semibold text-[#1F4D3A] hover:underline">
            Open Pipeline →
          </button>
        </div>

        {/* Pipeline Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {stageCounts.map(st => (
            <div key={st.stage} className="bg-[#FAF9F6] border border-[#E5E7E3] p-3 rounded-xl text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#59655F]">{st.stage.replace('_', ' ')}</span>
              <p className="text-xl font-bold font-mono text-[#1F4D3A]">{st.count}</p>
              <span className="text-[10px] text-[#8A9690] block">Active Leads</span>
            </div>
          ))}
        </div>
      </div>

      {/* TEAM WORKLOAD BALANCING */}
      <div className="agency-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#202522]">Departmental Workload & Delivery Capacity</h3>
            <p className="text-xs text-[#59655F]">Active tasks and queue pressure across creative and sales teams</p>
          </div>
          <button onClick={() => navigate('/team')} className="text-xs font-semibold text-[#1F4D3A] hover:underline">
            Manage Team →
          </button>
        </div>

        <div className="space-y-3">
          {teamWorkload.map(tw => (
            <div key={tw.role} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#202522]">{tw.role}</span>
                <span className="font-mono text-[#59655F]">{tw.count} active tasks ({tw.fill} capacity)</span>
              </div>
              <div className="w-full bg-[#E5E7E3] h-2 rounded-full overflow-hidden">
                <div className="bg-[#1F4D3A] h-full rounded-full transition-all duration-500" style={{ width: tw.fill }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
