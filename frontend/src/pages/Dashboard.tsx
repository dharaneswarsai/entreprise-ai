import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  CheckSquare,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Layers,
  PhoneCall,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Play,
  FileCheck
} from 'lucide-react';
import { StatusBadge, PriorityBadge, LeadScoreBadge } from '../components/ui/Badge';

export const Dashboard: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const {
    clients,
    leads,
    projects,
    tasks,
    invoices,
    payments,
    contentItems,
    activityLogs,
    updateTaskStatus
  } = useApp();
  const navigate = useNavigate();

  // If user is Admin, render the Executive Agency Command View
  // If user is employee (Designer, Video, Sales, Writer, Strategist, etc.), render Personalized Employee Workspace
  if (isAdmin) {
    return <AdminDashboardView />;
  }

  return <EmployeePersonalizedDashboardView />;
};

// -------------------------------------------------------------
// 1. ADMIN EXECUTIVE COMMAND DASHBOARD
// -------------------------------------------------------------
const AdminDashboardView: React.FC = () => {
  const { clients, leads, projects, tasks, invoices, contentItems, activityLogs } = useApp();
  const navigate = useNavigate();

  // Metrics calculation
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amountPaid, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'Sent' || i.status === 'Partially Paid').reduce((sum, i) => sum + (i.total - i.amountPaid), 0);
  const overdueRevenue = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + (i.total - i.amountPaid), 0);
  
  const activeProjects = projects.filter(p => p.status === 'In Progress' || p.status === 'Review');
  const delayedProjects = projects.filter(p => p.health === 'DELAYED' || p.health === 'AT RISK');

  const todayStr = '2026-10-13';
  const tasksDueToday = tasks.filter(t => t.deadline === todayStr && t.status !== 'COMPLETED');
  const overdueTasks = tasks.filter(t => t.deadline < todayStr && t.status !== 'COMPLETED');

  const wonLeadsCount = leads.filter(l => l.stage === 'WON').length;
  const totalLeadsCount = leads.length;
  const conversionRate = totalLeadsCount > 0 ? Math.round((wonLeadsCount / totalLeadsCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Executive Agency Control</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#1F4D3A] font-bold">Live Brain</span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Real-time command center: Revenue, sales pipeline, creative production, and team workload
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/command-center')}
            className="px-3.5 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>Control Room View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Realized Revenue */}
        <div className="agency-card agency-card-hover p-4 cursor-pointer" onClick={() => navigate('/finance')}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#59655F]">Realized Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF2EE] flex items-center justify-center text-[#1F4D3A]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-[#15382B]">₹{totalRevenue.toLocaleString()}</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E7E3] text-[11px] text-[#59655F]">
            <span>Pending: ₹{pendingRevenue.toLocaleString()}</span>
            <span className="text-amber-700 font-semibold">Overdue: ₹{overdueRevenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Active Pipeline */}
        <div className="agency-card agency-card-hover p-4 cursor-pointer" onClick={() => navigate('/leads')}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#59655F]">Sales Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold font-mono text-[#202522]">{leads.length} Leads</p>
            <span className="text-xs text-emerald-700 font-bold">{conversionRate}% Won</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E7E3] text-[11px] text-[#59655F]">
            <span>Hot: {leads.filter(l => l.leadScore >= 60).length} Leads</span>
            <span>Avg: ₹{(leads.reduce((a, b) => a + b.estimatedBudget, 0) / (leads.length || 1)).toFixed(0)}</span>
          </div>
        </div>

        {/* Active Projects & Health */}
        <div className="agency-card agency-card-hover p-4 cursor-pointer" onClick={() => navigate('/projects')}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#59655F]">Projects Under Management</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#1F4D3A]">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold font-mono text-[#202522]">{activeProjects.length} Active</p>
            {delayedProjects.length > 0 && (
              <span className="text-xs text-amber-700 font-bold">⚠️ {delayedProjects.length} At Risk</span>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E7E3] text-[11px] text-[#59655F]">
            <span>Clients: {clients.length} Retained</span>
            <span className="text-emerald-700 font-semibold">{projects.filter(p => p.health === 'ON TRACK').length} On Track</span>
          </div>
        </div>

        {/* Operational Tasks */}
        <div className="agency-card agency-card-hover p-4 cursor-pointer" onClick={() => navigate('/tasks')}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#59655F]">Today's Deliverables</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-[#202522]">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold font-mono text-[#202522]">{tasksDueToday.length} Due Today</p>
            {overdueTasks.length > 0 && (
              <span className="text-xs text-red-700 font-bold animate-pulse">{overdueTasks.length} Overdue</span>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E7E3] text-[11px] text-[#59655F]">
            <span>Total Open: {tasks.filter(t => t.status !== 'COMPLETED').length}</span>
            <span className="text-emerald-700 font-semibold">Done: {tasks.filter(t => t.status === 'COMPLETED').length}</span>
          </div>
        </div>
      </div>

      {/* Critical Attention Required Bar (if delayed or overdue) */}
      {(overdueTasks.length > 0 || delayedProjects.length > 0 || overdueRevenue > 0) && (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">Attention Required Across Agency</p>
              <p className="text-xs text-amber-800 mt-0.5">
                {overdueTasks.length} task(s) overdue · {delayedProjects.length} project(s) at risk · ₹{overdueRevenue.toLocaleString()} in overdue billing.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate('/tasks')}
              className="px-3 py-1.5 rounded-lg bg-amber-200/70 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition-colors"
            >
              Review Overdue Tasks
            </button>
            <button
              onClick={() => navigate('/invoices')}
              className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-50 transition-colors"
            >
              Collect Payments
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Active Pipeline & Content Production */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Projects & Deliverables Status (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Client Projects */}
          <div className="agency-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#202522]">Live Client Retainers & Projects</h3>
                <p className="text-xs text-[#59655F]">Active workflow status and progress across retainers</p>
              </div>
              <button
                onClick={() => navigate('/projects')}
                className="text-xs font-semibold text-[#1F4D3A] hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {projects.map(proj => (
                <div
                  key={proj.id}
                  onClick={() => navigate('/projects')}
                  className="p-3.5 rounded-xl border border-[#E5E7E3] hover:border-[#1F4D3A]/40 bg-[#FAF9F6] hover:bg-white cursor-pointer transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#202522]">{proj.title}</span>
                      <p className="text-[11px] text-[#59655F]">{proj.clientName} · Budget: ₹{proj.budget.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={proj.health} />
                      <span className="text-xs font-mono font-bold text-[#202522]">{proj.progressPercent}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#E5E7E3] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        proj.health === 'DELAYED'
                          ? 'bg-red-500'
                          : proj.health === 'AT RISK'
                            ? 'bg-amber-500'
                            : 'bg-[#1F4D3A]'
                      }`}
                      style={{ width: `${proj.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#8A9690]">
                    <span>Deadline: {proj.deadline}</span>
                    <span>Priority: {proj.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Creative Content Engine Pipeline */}
          <div className="agency-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#202522]">Creative Content Production Board</h3>
                <p className="text-xs text-[#59655F]">Active short-form reels, carousels, and stories</p>
              </div>
              <button
                onClick={() => navigate('/content')}
                className="text-xs font-semibold text-[#1F4D3A] hover:underline flex items-center gap-1"
              >
                <span>Full Board</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contentItems.slice(0, 4).map(item => (
                <div
                  key={item.id}
                  onClick={() => navigate('/content')}
                  className="p-3 rounded-xl border border-[#E5E7E3] hover:border-[#1F4D3A]/40 bg-white cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#1F4D3A] uppercase tracking-wider">{item.contentType}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-xs font-bold text-[#202522] line-clamp-1">{item.title}</p>
                  <p className="text-[11px] text-[#59655F] italic line-clamp-2">"{item.hook}"</p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E7E3] text-[10px] text-[#8A9690]">
                    <span>{item.clientName}</span>
                    <span>Target: {item.publishDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Global Activity Audit & Lead CRM Quick View */}
        <div className="space-y-6">
          {/* Quick Leads Radar */}
          <div className="agency-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#202522]">Hot Leads Radar</h3>
              <button
                onClick={() => navigate('/leads')}
                className="text-xs font-semibold text-[#1F4D3A] hover:underline"
              >
                CRM Kanban →
              </button>
            </div>
            <div className="space-y-2.5">
              {leads.slice(0, 4).map(lead => (
                <div
                  key={lead.id}
                  onClick={() => navigate('/leads')}
                  className="p-2.5 rounded-xl border border-[#E5E7E3] hover:bg-[#FAF9F6] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#202522]">{lead.companyName}</span>
                    <LeadScoreBadge score={lead.leadScore} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#59655F]">
                    <span>Stage: <strong>{lead.stage}</strong></span>
                    <span className="font-mono">₹{lead.estimatedBudget.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Global Activity Audit Trail */}
          <div className="agency-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#202522]">Agency Activity Stream</h3>
              <span className="text-[10px] text-[#8A9690] uppercase font-bold">Audit Trail</span>
            </div>
            <div className="space-y-3">
              {activityLogs.slice(0, 6).map(log => (
                <div key={log.id} className="text-xs space-y-0.5 border-l-2 border-[#1F4D3A]/40 pl-3">
                  <div className="flex items-center justify-between text-[10px] text-[#8A9690]">
                    <span className="font-semibold text-[#202522]">{log.authorName}</span>
                    <span>{log.timestamp.substring(11)}</span>
                  </div>
                  <p className="text-[#59655F]">
                    {log.action}: <strong className="text-[#202522]">{log.target}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. PERSONALIZED EMPLOYEE WORKSPACE
// -------------------------------------------------------------
const EmployeePersonalizedDashboardView: React.FC = () => {
  const { currentUser } = useAuth();
  const { tasks, projects, contentItems, updateTaskStatus, notifications } = useApp();
  const navigate = useNavigate();

  // Filter tasks assigned to current employee
  const myTasks = tasks.filter(t => t.assignedEmployeeId === currentUser.id);
  const todayStr = '2026-10-13';
  const myDueToday = myTasks.filter(t => t.deadline === todayStr && t.status !== 'COMPLETED');
  const myOverdue = myTasks.filter(t => t.deadline < todayStr && t.status !== 'COMPLETED');
  const myUpcoming = myTasks.filter(t => t.deadline > todayStr && t.status !== 'COMPLETED');
  const myCompleted = myTasks.filter(t => t.status === 'COMPLETED');

  // Filter projects where employee is on team
  const myProjects = projects.filter(p => p.teamMemberIds.includes(currentUser.id));

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Header per spec #17 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7E3]">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#15382B]">
              Good morning, {currentUser.name.split(' ')[0]}.
            </h1>
            <p className="text-xs text-[#59655F] mt-0.5">
              {currentUser.title} · <strong>{currentUser.department}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(currentUser.role as any) === 'DESIGNER' && (
            <button
              onClick={() => navigate('/design')}
              className="px-3.5 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Open Design Studio</span>
            </button>
          )}
          {(currentUser.role as any) === 'VIDEO_EDITOR' && (
            <button
              onClick={() => navigate('/video')}
              className="px-3.5 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-300" />
              <span>Open Video Studio</span>
            </button>
          )}
          {(currentUser.role as any) === 'SALES' && (
            <button
              onClick={() => navigate('/sales')}
              className="px-3.5 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-300" />
              <span>Cold Calling Workspace</span>
            </button>
          )}
        </div>
      </div>

      {/* Today's Work Summary KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="agency-card p-4">
          <span className="text-xs text-[#59655F] font-semibold">Total Assigned</span>
          <p className="text-2xl font-bold font-mono text-[#202522] mt-1">{myTasks.length} Tasks</p>
          <span className="text-[11px] text-[#8A9690] mt-1 block">In your personal queue</span>
        </div>

        <div className="agency-card p-4 border-amber-200 bg-amber-50/30">
          <span className="text-xs text-amber-800 font-semibold">Due Today</span>
          <p className="text-2xl font-bold font-mono text-amber-900 mt-1">{myDueToday.length}</p>
          <span className="text-[11px] text-amber-700 mt-1 block">Target completion 6 PM</span>
        </div>

        <div className="agency-card p-4 border-red-200 bg-red-50/30">
          <span className="text-xs text-red-800 font-semibold">Overdue</span>
          <p className="text-2xl font-bold font-mono text-red-900 mt-1">{myOverdue.length}</p>
          <span className="text-[11px] text-red-700 mt-1 block">Immediate action needed</span>
        </div>

        <div className="agency-card p-4 bg-emerald-50/30 border-emerald-200">
          <span className="text-xs text-[#1F4D3A] font-semibold">Completed</span>
          <p className="text-2xl font-bold font-mono text-[#15382B] mt-1">{myCompleted.length}</p>
          <span className="text-[11px] text-[#6F8F7D] mt-1 block">Successfully delivered</span>
        </div>
      </div>

      {/* Main Employee Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Active Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="agency-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#202522]">My Action Items & Deadlines</h3>
                <p className="text-xs text-[#59655F]">Assigned specifically to you</p>
              </div>
              <button
                onClick={() => navigate('/tasks')}
                className="text-xs font-semibold text-[#1F4D3A] hover:underline"
              >
                View full task board →
              </button>
            </div>

            {myTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8A9690]">
                No active tasks assigned to you right now. Great job!
              </div>
            ) : (
              <div className="space-y-3">
                {myTasks.map(task => {
                  const isOverdue = task.deadline < todayStr && task.status !== 'COMPLETED';
                  const isDueToday = task.deadline === todayStr && task.status !== 'COMPLETED';

                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                        isOverdue
                          ? 'border-red-300 bg-red-50/20'
                          : isDueToday
                            ? 'border-amber-300 bg-amber-50/20'
                            : 'border-[#E5E7E3] bg-[#FAF9F6] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-[#202522]">{task.title}</span>
                            <PriorityBadge priority={task.priority} />
                          </div>
                          <p className="text-xs text-[#59655F] leading-relaxed">{task.description}</p>
                        </div>
                        <StatusBadge status={task.status} />
                      </div>

                      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#E5E7E3] text-xs">
                        <span className="text-[#59655F] font-semibold">{task.clientName}</span>
                        <div className="flex items-center gap-3">
                          <span className={`font-mono text-[11px] ${isOverdue ? 'text-red-700 font-bold' : isDueToday ? 'text-amber-800 font-bold' : 'text-[#8A9690]'}`}>
                            Deadline: {task.deadline} {isDueToday && '(TODAY)'} {isOverdue && '(OVERDUE)'}
                          </span>
                          {task.status !== 'COMPLETED' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'COMPLETED')}
                              className="px-2.5 py-1 rounded-lg bg-[#1F4D3A] text-white text-[11px] font-semibold hover:bg-[#15382B]"
                            >
                              Mark Done
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: My Projects & Notifications */}
        <div className="space-y-6">
          {/* My Projects */}
          <div className="agency-card p-5">
            <h3 className="text-sm font-bold text-[#202522] mb-3">My Assigned Projects</h3>
            <div className="space-y-3">
              {myProjects.map(proj => (
                <div key={proj.id} className="p-3 rounded-xl border border-[#E5E7E3] bg-[#FAF9F6] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#202522]">{proj.title}</span>
                    <span className="text-xs font-mono font-bold text-[#1F4D3A]">{proj.progressPercent}%</span>
                  </div>
                  <p className="text-[11px] text-[#59655F]">{proj.clientName} · Status: {proj.status}</p>
                  <div className="w-full bg-[#E5E7E3] h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1F4D3A] rounded-full" style={{ width: `${proj.progressPercent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Notifications */}
          <div className="agency-card p-5">
            <h3 className="text-sm font-bold text-[#202522] mb-3">Important Updates</h3>
            <div className="space-y-2.5">
              {notifications.slice(0, 4).map(notif => (
                <div key={notif.id} className="text-xs p-2.5 rounded-xl border border-[#E5E7E3] bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#202522]">{notif.title}</span>
                    <span className="text-[10px] text-[#8A9690]">{notif.timestamp.substring(11)}</span>
                  </div>
                  <p className="text-[#59655F]">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
