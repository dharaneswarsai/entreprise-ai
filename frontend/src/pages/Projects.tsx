import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Plus,
  Users,
  Calendar,
  DollarSign,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Clock,
  Filter
} from 'lucide-react';
import { Project, ProjectHealth, ProjectStatus } from '../types';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { QuickActionModal } from '../components/QuickActionModal';

export const Projects: React.FC = () => {
  const { projects, tasks, clients, users, updateProject } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const filteredProjects = projects.filter(p => {
    if (statusFilter === 'ALL') return true;
    return p.status === statusFilter || p.health === statusFilter;
  });

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const projectTasks = tasks.filter(t => t.projectId === selectedProject?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Project Operations Hub</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              {projects.length} Total Projects
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Cross-functional campaign delivery: Health scoring (On Track, At Risk, Delayed), budget utilization, and task boards
          </p>
        </div>

        <button
          onClick={() => setIsQuickActionOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Project</span>
        </button>
      </div>

      {/* Status Filter Bar */}
      <div className="agency-card p-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-[#59655F] font-semibold">Filter:</span>
        {['ALL', 'In Progress', 'Review', 'ON TRACK', 'AT RISK', 'DELAYED'].map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === f
                ? 'bg-[#1F4D3A] text-white'
                : 'bg-[#FAF9F6] text-[#59655F] hover:bg-stone-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map(proj => {
          const completedTasksCount = tasks.filter(t => t.projectId === proj.id && t.status === 'COMPLETED').length;
          const totalTasksCount = tasks.filter(t => t.projectId === proj.id).length;

          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className="agency-card agency-card-hover p-6 flex flex-col justify-between space-y-4 cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#8A9690] uppercase tracking-wider">{proj.clientName}</span>
                    <h3 className="text-base font-bold text-[#202522] mt-0.5">{proj.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <StatusBadge status={proj.health} />
                    <PriorityBadge priority={proj.priority} />
                  </div>
                </div>

                <p className="text-xs text-[#59655F] line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#59655F]">Delivery Progress</span>
                    <span className="font-mono font-bold text-[#1F4D3A]">{proj.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-[#E5E7E3] h-2 rounded-full overflow-hidden">
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
                </div>
              </div>

              {/* Footer info */}
              <div className="pt-3 border-t border-[#E5E7E3] flex flex-wrap items-center justify-between text-xs text-[#59655F]">
                <div className="flex items-center gap-3">
                  <span>Budget: <strong className="text-[#202522]">₹{proj.budget.toLocaleString()}</strong></span>
                  <span>Tasks: <strong>{completedTasksCount}/{totalTasksCount}</strong></span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-[#8A9690]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Due: {proj.deadline}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        defaultAction="project"
      />
    </div>
  );
};
