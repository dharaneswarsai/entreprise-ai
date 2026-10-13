import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Play,
  Film,
  Music,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
  Send,
  Video,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';

export const VideoWorkspace: React.FC = () => {
  const { tasks, updateTaskStatus } = useApp();
  const videoTasks = tasks.filter(t => t.category === 'Video');
  const [selectedTaskId, setSelectedTaskId] = useState<string>(videoTasks[0]?.id || '');

  const activeTask = videoTasks.find(t => t.id === selectedTaskId) || videoTasks[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Video Editor & Motion Studio</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              Video Pipeline
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Dedicated post-production bay: Aspect ratios, raw footage logs, SFX/BGM guidelines, voiceover scripts, and revision logs
          </p>
        </div>

        {activeTask && activeTask.status !== 'IN_REVIEW' && activeTask.status !== 'COMPLETED' && (
          <button
            onClick={() => updateTaskStatus(activeTask.id, 'IN_REVIEW')}
            className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Send className="w-3.5 h-3.5 text-emerald-300" />
            <span>Submit Cut for Review</span>
          </button>
        )}
      </div>

      {/* Main Video Bay Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Video Tasks Queue */}
        <div className="space-y-4">
          <div className="agency-card p-4 space-y-3">
            <h3 className="text-xs font-bold text-[#202522] uppercase tracking-wider">
              Editing Bay Queue ({videoTasks.length})
            </h3>
            <div className="space-y-2">
              {videoTasks.map(t => {
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

        {/* Right 2 Columns: Video Production Cockpit */}
        {activeTask && (
          <div className="lg:col-span-2 space-y-6">
            <div className="agency-card p-6 space-y-6">
              {/* Header */}
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

              {/* Technical Video Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs">
                  <span className="text-[#8A9690] uppercase font-bold text-[10px] block mb-1">Target Aspect Ratio</span>
                  <p className="font-mono font-bold text-[#15382B] text-sm">
                    {activeTask.aspectRatio || '9:16 Vertical Reel'}
                  </p>
                  <span className="text-[10px] text-[#8A9690]">1080 x 1920 (60fps MP4)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs">
                  <span className="text-[#8A9690] uppercase font-bold text-[10px] block mb-1">Cut Duration</span>
                  <p className="font-mono font-bold text-[#15382B] text-sm">
                    {activeTask.videoDuration || '30 - 45 Seconds'}
                  </p>
                  <span className="text-[10px] text-[#8A9690]">Fast Hook (First 2.5s)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs">
                  <span className="text-[#8A9690] uppercase font-bold text-[10px] block mb-1">Delivery Target</span>
                  <p className="font-mono font-bold text-[#15382B] text-sm">
                    {activeTask.deadline}
                  </p>
                  <span className="text-[10px] text-amber-700 font-semibold">Scheduled Publish</span>
                </div>
              </div>

              {/* Script & Voiceover Guidance */}
              {activeTask.script && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1F4D3A] uppercase tracking-wider">
                    <FileText className="w-4 h-4" />
                    <span>Script & Voiceover Track</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs font-serif italic text-[#202522] leading-relaxed">
                    {activeTask.script}
                  </div>
                </div>
              )}

              {/* Editing Instructions & Audio Pass */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#202522] uppercase tracking-wider">Editing Instructions & Color Pass</h4>
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-[#202522] leading-relaxed">
                  {activeTask.description}
                </div>
              </div>

              {/* Revision History & Client Feedback if revision requested */}
              {activeTask.feedback && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                  <span className="font-bold text-amber-900 uppercase text-[10px]">Client / Manager Revision Notes:</span>
                  <p className="text-amber-800 leading-relaxed">{activeTask.feedback}</p>
                </div>
              )}

              {/* Checklists for editor */}
              {activeTask.checklist.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#202522] uppercase tracking-wider">Render Checklist</h4>
                  <div className="space-y-1.5">
                    {activeTask.checklist.map(item => (
                      <div key={item.id} className="p-2.5 rounded-xl border border-[#E5E7E3] bg-white flex items-center gap-2 text-xs">
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${item.completed ? 'bg-emerald-600 text-white' : 'border border-stone-300'}`}>
                          {item.completed && <CheckCircle2 className="w-3 h-3" />}
                        </span>
                        <span className={item.completed ? 'line-through opacity-70' : 'font-medium'}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#E5E7E3] flex justify-between items-center text-xs">
                <span className="text-[#8A9690]">Editor: {activeTask.assignedEmployeeName}</span>
                {activeTask.status !== 'IN_REVIEW' && activeTask.status !== 'COMPLETED' && (
                  <button
                    onClick={() => updateTaskStatus(activeTask.id, 'IN_REVIEW')}
                    className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] font-semibold flex items-center gap-2"
                  >
                    <span>Submit to Internal Review</span>
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
