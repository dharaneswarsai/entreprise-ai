import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users2,
  CheckSquare,
  Clock,
  Briefcase,
  AlertTriangle,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const Team: React.FC = () => {
  const { users, tasks, projects } = useApp();

  // Internal agency employees (excluding client portal users)
  const employees = users.filter(u => u.role !== 'CLIENT');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Team Directory & Workload Capacity</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              {employees.length} Core Specialists
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Operational bandwidth & delivery health: Active tasks, queue pressure, and role distribution (anti-toxic delivery visibility)
          </p>
        </div>
      </div>

      {/* Employees Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(emp => {
          const empTasks = tasks.filter(t => t.assignedEmployeeId === emp.id);
          const activeTasks = empTasks.filter(t => t.status !== 'COMPLETED');
          const completedTasks = empTasks.filter(t => t.status === 'COMPLETED');
          const todayStr = '2026-10-13';
          const overdueTasks = empTasks.filter(t => t.deadline < todayStr && t.status !== 'COMPLETED');
          const empProjects = projects.filter(p => p.teamMemberIds.includes(emp.id));

          // Capacity calculation (e.g. 1-2 tasks = 40%, 3 tasks = 75%, >4 = 95%)
          const capacityPercent = Math.min(100, Math.round((activeTasks.length / 4) * 100));

          return (
            <div
              key={emp.id}
              className="agency-card agency-card-hover p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Employee Header */}
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-[#E5E7E3] shadow-xs"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#202522]">{emp.name}</h3>
                    <p className="text-[11px] text-[#1F4D3A] font-semibold">{emp.title}</p>
                    <span className="text-[10px] text-[#8A9690] uppercase font-bold">{emp.department}</span>
                  </div>
                </div>

                {/* Contact info */}
                <div className="mt-3 pt-3 border-t border-[#E5E7E3] space-y-1 text-[11px] text-[#59655F]">
                  <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#6F8F7D]" /> {emp.email}</p>
                  <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#6F8F7D]" /> {emp.phone}</p>
                </div>

                {/* Workload Capacity Bar per spec #30 */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#59655F]">Current Workload Capacity</span>
                    <span className={`font-mono font-bold ${capacityPercent > 80 ? 'text-amber-700' : 'text-[#1F4D3A]'}`}>
                      {capacityPercent}% ({activeTasks.length} active)
                    </span>
                  </div>
                  <div className="w-full bg-[#E5E7E3] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        capacityPercent > 80 ? 'bg-amber-600' : 'bg-[#1F4D3A]'
                      }`}
                      style={{ width: `${capacityPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Task Counts Summary */}
              <div className="pt-3 border-t border-[#E5E7E3] grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-[#FAF9F6]">
                  <span className="text-[10px] text-[#8A9690] uppercase font-bold block">Active</span>
                  <span className="font-mono font-bold text-[#202522] text-sm">{activeTasks.length}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF9F6]">
                  <span className="text-[10px] text-[#8A9690] uppercase font-bold block">Overdue</span>
                  <span className={`font-mono font-bold text-sm ${overdueTasks.length > 0 ? 'text-red-700' : 'text-stone-700'}`}>
                    {overdueTasks.length}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF9F6]">
                  <span className="text-[10px] text-[#8A9690] uppercase font-bold block">Done</span>
                  <span className="font-mono font-bold text-emerald-800 text-sm">{completedTasks.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
