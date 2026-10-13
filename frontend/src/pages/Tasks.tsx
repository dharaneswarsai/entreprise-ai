import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  Plus,
  Filter,
  Search,
  Calendar,
  Clock,
  User,
  MessageSquare,
  CheckCircle2,
  Paperclip,
  ChevronRight,
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { QuickActionModal } from '../components/QuickActionModal';

export const Tasks: React.FC = () => {
  const { tasks, updateTaskStatus, toggleTaskChecklist, addTaskComment, users, projects } = useApp();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  const taskStatuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'REVISION', 'COMPLETED'];

  const filteredTasks = tasks.filter(t => {
    const matchesAssignee = assigneeFilter === 'ALL' || t.assignedEmployeeId === assigneeFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedEmployeeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAssignee && matchesStatus && matchesSearch;
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTask) return;
    addTaskComment(selectedTask.id, 'user-admin', newComment);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Agency Task Matrix</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              {tasks.length} Total Tasks
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Connected execution board: Video cuts, design layouts, copywriting, and automated review submissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Switcher */}
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-white shadow-xs text-[#1F4D3A]' : 'text-stone-600'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-white shadow-xs text-[#1F4D3A]' : 'text-stone-600'
              }`}
            >
              Table View
            </button>
          </div>

          <button
            onClick={() => setIsQuickActionOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="agency-card p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#6F8F7D]" />
          <input
            type="text"
            placeholder="Search tasks by title, client, assignee..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs text-[#202522] placeholder-[#8A9690]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-[#59655F] font-semibold shrink-0">Assignee:</span>
          <select
            value={assigneeFilter}
            onChange={e => setAssigneeFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-[#E5E7E3] text-xs font-medium bg-white outline-none"
          >
            <option value="ALL">All Team Members</option>
            {users.filter(u => u.role !== 'CLIENT').map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1200px]">
            {taskStatuses.map(status => {
              const columnTasks = filteredTasks.filter(t => t.status === status);

              return (
                <div
                  key={status}
                  className="w-72 bg-[#FAF9F6] rounded-2xl border border-[#E5E7E3] p-3 flex flex-col shrink-0 min-h-[500px]"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E7E3]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#15382B] uppercase tracking-wider">
                        {status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="w-5 h-5 rounded-full bg-white text-[#1F4D3A] text-xs font-bold font-mono flex items-center justify-center border border-[#E5E7E3]">
                      {columnTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1 overflow-y-auto">
                    {columnTasks.length === 0 ? (
                      <div className="h-24 border border-dashed border-[#E5E7E3] rounded-xl flex items-center justify-center text-[11px] text-[#8A9690]">
                        No tasks
                      </div>
                    ) : (
                      columnTasks.map(task => {
                        const todayStr = '2026-10-13';
                        const isOverdue = task.deadline < todayStr && task.status !== 'COMPLETED';

                        return (
                          <div
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            className={`p-3 bg-white rounded-xl border hover:border-[#1F4D3A]/40 shadow-xs cursor-pointer transition-all space-y-2 group ${
                              isOverdue ? 'border-red-300 bg-red-50/20' : 'border-[#E5E7E3]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-[10px] font-mono font-bold text-[#6F8F7D] uppercase">
                                [{task.category}]
                              </span>
                              <PriorityBadge priority={task.priority} />
                            </div>

                            <p className="text-xs font-bold text-[#202522] group-hover:text-[#1F4D3A] transition-colors leading-snug">
                              {task.title}
                            </p>

                            <p className="text-[11px] text-[#59655F] line-clamp-1">{task.clientName}</p>

                            {/* Checklist Progress */}
                            {task.checklist.length > 0 && (
                              <div className="flex items-center gap-1.5 text-[10px] text-[#8A9690]">
                                <CheckSquare className="w-3.5 h-3.5" />
                                <span>
                                  {task.checklist.filter(c => c.completed).length}/{task.checklist.length} checklist items
                                </span>
                              </div>
                            )}

                            <div className="pt-2 border-t border-[#E5E7E3] flex items-center justify-between text-[11px]">
                              <span className="text-[#59655F] font-semibold truncate max-w-[120px]">
                                {task.assignedEmployeeName}
                              </span>
                              <span className={`font-mono text-[10px] ${isOverdue ? 'text-red-700 font-bold' : 'text-[#8A9690]'}`}>
                                {task.deadline}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW 2: TABLE VIEW */
        <div className="agency-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] border-b border-[#E5E7E3] text-[#15382B]">
                <tr>
                  <th className="p-3 font-bold">Task Title</th>
                  <th className="p-3 font-bold">Client / Project</th>
                  <th className="p-3 font-bold">Assignee</th>
                  <th className="p-3 font-bold">Priority</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7E3]">
                {filteredTasks.map(task => (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="hover:bg-[#FAF9F6] cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-bold text-[#202522]">{task.title}</td>
                    <td className="p-3 text-[#59655F]">{task.clientName}</td>
                    <td className="p-3 font-medium text-[#202522]">{task.assignedEmployeeName}</td>
                    <td className="p-3"><PriorityBadge priority={task.priority} /></td>
                    <td className="p-3"><StatusBadge status={task.status} /></td>
                    <td className="p-3 font-mono text-[#8A9690]">{task.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TASK DETAIL DRAWER / MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-[#15382B]/40 backdrop-blur-sm" onClick={() => setSelectedTask(null)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl border-l border-[#E5E7E3] flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7E3] bg-[#FAF9F6]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EBF2EE] text-[#1F4D3A]">
                  {selectedTask.category}
                </span>
                <PriorityBadge priority={selectedTask.priority} />
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-1.5 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
              <div>
                <h2 className="text-base font-bold text-[#15382B] leading-snug">{selectedTask.title}</h2>
                <p className="text-xs text-[#59655F] mt-1">
                  Project: <strong>{selectedTask.projectName}</strong> ({selectedTask.clientName})
                </p>
              </div>

              {/* Status Advancement Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#8A9690] uppercase tracking-wider mb-1.5">
                  Task Status
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {taskStatuses.map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        updateTaskStatus(selectedTask.id, st);
                        setSelectedTask({ ...selectedTask, status: st });
                      }}
                      className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                        selectedTask.status === st
                          ? 'border-[#1F4D3A] bg-[#1F4D3A] text-white shadow-xs'
                          : 'border-[#E5E7E3] bg-[#FAF9F6] text-[#59655F] hover:bg-stone-100'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-[10px] font-bold text-[#8A9690] uppercase tracking-wider block mb-1">Brief Description</span>
                <p className="text-[#202522] leading-relaxed p-3 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3]">
                  {selectedTask.description}
                </p>
              </div>

              {/* Specs & Dimensions if available */}
              {(selectedTask.dimensions || selectedTask.aspectRatio || selectedTask.videoDuration || selectedTask.script) && (
                <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/60 space-y-2">
                  <span className="font-bold text-[#1F4D3A] uppercase tracking-wider text-[10px]">Creative Technical Specs:</span>
                  {selectedTask.dimensions && <p><strong>Dimensions:</strong> {selectedTask.dimensions}</p>}
                  {selectedTask.aspectRatio && <p><strong>Aspect Ratio:</strong> {selectedTask.aspectRatio}</p>}
                  {selectedTask.videoDuration && <p><strong>Duration:</strong> {selectedTask.videoDuration}</p>}
                  {selectedTask.script && <p className="italic font-serif">"{selectedTask.script}"</p>}
                </div>
              )}

              {/* Interactive Checklist */}
              {selectedTask.checklist.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[#8A9690] uppercase tracking-wider block">Deliverable Sub-Checklist</span>
                  <div className="space-y-1.5">
                    {selectedTask.checklist.map(item => (
                      <div
                        key={item.id}
                        onClick={() => toggleTaskChecklist(selectedTask.id, item.id)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
                          item.completed ? 'bg-emerald-50/30 border-emerald-200 text-[#1F4D3A]' : 'bg-white border-[#E5E7E3]'
                        }`}
                      >
                        <input type="checkbox" checked={item.completed} onChange={() => {}} className="rounded text-[#1F4D3A]" />
                        <span className={item.completed ? 'line-through opacity-75' : 'font-medium'}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Stream */}
              <div className="space-y-3 pt-3 border-t border-[#E5E7E3]">
                <span className="text-[10px] font-bold text-[#8A9690] uppercase tracking-wider block">Activity & Discussion</span>
                <div className="space-y-2">
                  {selectedTask.comments.map(c => (
                    <div key={c.id} className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#8A9690]">
                        <span className="font-bold text-[#202522]">{c.authorName}</span>
                        <span>{c.timestamp}</span>
                      </div>
                      <p className="text-[#59655F] leading-relaxed">{c.content}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Leave a comment or note..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E5E7E3] outline-none text-xs"
                  />
                  <button type="submit" className="px-3.5 py-2 rounded-xl bg-[#1F4D3A] text-white font-semibold">
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        defaultAction="task"
      />
    </div>
  );
};
