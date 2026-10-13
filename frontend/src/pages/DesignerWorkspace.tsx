import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Palette,
  Type,
  FileImage,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Layers,
  Copy,
  Clock,
  Send
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';

export const DesignerWorkspace: React.FC = () => {
  const { tasks, clients, updateTaskStatus, files } = useApp();
  const { currentUser } = useAuth();

  // Filter tasks that are Design category
  const designTasks = tasks.filter(t => t.category === 'Design');
  const [selectedTaskId, setSelectedTaskId] = useState<string>(designTasks[0]?.id || '');

  const activeTask = designTasks.find(t => t.id === selectedTaskId) || designTasks[0];
  const activeClient = clients.find(c => c.id === activeTask?.clientId);

  const designStages = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'REVISION', 'COMPLETED'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Visual Designer Studio</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              Creative Suite
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Dedicated workspace: Technical dimensions, typography specs, hex palette codes, copy sheets, and 1-click review dispatch
          </p>
        </div>

        {activeTask && (
          <div className="flex items-center gap-2">
            {activeTask.status !== 'IN_REVIEW' && activeTask.status !== 'COMPLETED' && (
              <button
                onClick={() => updateTaskStatus(activeTask.id, 'IN_REVIEW')}
                className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-emerald-300" />
                <span>Submit to Internal Review</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Design Tasks Queue */}
        <div className="space-y-4">
          <div className="agency-card p-4 space-y-3">
            <h3 className="text-xs font-bold text-[#202522] uppercase tracking-wider">
              Assigned Design Tasks ({designTasks.length})
            </h3>
            <div className="space-y-2">
              {designTasks.map(t => {
                const isSelected = t.id === activeTask?.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTaskId(t.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'border-[#1F4D3A] bg-[#EBF2EE]/60 shadow-xs'
                        : 'border-[#E5E7E3] bg-[#FAF9F6] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-[#202522]">{t.title}</span>
                      <PriorityBadge priority={t.priority} />
                    </div>
                    <p className="text-[11px] text-[#59655F]">{t.clientName}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <StatusBadge status={t.status} />
                      <span className="text-[#8A9690] font-mono">Due: {t.deadline}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Full Design Brief & Specs Cockpit */}
        {activeTask && (
          <div className="lg:col-span-2 space-y-6">
            <div className="agency-card p-6 space-y-6">
              {/* Task Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7E3]">
                <div>
                  <span className="text-[10px] font-bold text-[#1F4D3A] uppercase tracking-wider">
                    {activeTask.clientName} · {activeTask.projectName}
                  </span>
                  <h2 className="text-lg font-bold text-[#15382B] mt-0.5">{activeTask.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={activeTask.status} />
                  <PriorityBadge priority={activeTask.priority} />
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs">
                  <span className="text-[#8A9690] uppercase font-bold text-[10px] block mb-1">Canvas Dimensions</span>
                  <p className="font-mono font-bold text-[#15382B] text-sm">
                    {activeTask.dimensions || '1080 x 1350 px (4:5)'}
                  </p>
                  <span className="text-[10px] text-[#8A9690]">Instagram Portrait Feed</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs">
                  <span className="text-[#8A9690] uppercase font-bold text-[10px] block mb-1">Estimated Effort</span>
                  <p className="font-mono font-bold text-[#15382B] text-sm">
                    {activeTask.estimatedHours} Hours
                  </p>
                  <span className="text-[10px] text-[#8A9690]">Logged: {activeTask.actualHours} hrs</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs">
                  <span className="text-[#8A9690] uppercase font-bold text-[10px] block mb-1">Deadline</span>
                  <p className="font-mono font-bold text-[#15382B] text-sm">
                    {activeTask.deadline}
                  </p>
                  <span className="text-[10px] text-amber-700 font-semibold">Priority Delivery</span>
                </div>
              </div>

              {/* Design Brief & Copy */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#202522] uppercase tracking-wider">Creative Brief & Requirements</h4>
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs text-[#202522] leading-relaxed">
                  {activeTask.description}
                </div>
              </div>

              {/* Exact Copy Text Sheet */}
              {activeTask.copyContent && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#202522] uppercase tracking-wider">Copy Text to Place on Canvas</h4>
                    <span className="text-[10px] text-emerald-800 font-semibold">Approved by Copywriter</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-[#202522] select-all">
                    "{activeTask.copyContent}"
                  </div>
                </div>
              )}

              {/* Client Brand Kit: Colors & Typography per spec #18 */}
              {activeClient && (
                <div className="space-y-3 pt-3 border-t border-[#E5E7E3]">
                  <h4 className="text-xs font-bold text-[#202522] uppercase tracking-wider">
                    {activeClient.companyName} Brand Design Tokens
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Brand Colors */}
                    <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F4D3A]">
                        <Palette className="w-4 h-4" />
                        <span>Brand Colors</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeClient.brandColors?.map((c, i) => (
                          <div key={i} className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white border border-[#E5E7E3] text-xs font-mono">
                            <span className="w-4 h-4 rounded border border-black/10 shadow-2xs" style={{ backgroundColor: c }} />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Brand Typography */}
                    <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F4D3A]">
                        <Type className="w-4 h-4" />
                        <span>Brand Typography</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeClient.brandFonts?.map((f, i) => (
                          <span key={i} className="px-3 py-1 rounded-lg bg-white border border-[#E5E7E3] text-xs font-semibold text-[#202522]">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action: Push to Review */}
              <div className="pt-4 border-t border-[#E5E7E3] flex justify-between items-center text-xs">
                <span className="text-[#8A9690]">Status: {activeTask.status}</span>
                {activeTask.status !== 'IN_REVIEW' && activeTask.status !== 'COMPLETED' && (
                  <button
                    onClick={() => updateTaskStatus(activeTask.id, 'IN_REVIEW')}
                    className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] font-semibold flex items-center gap-2"
                  >
                    <span>Push to Internal Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
