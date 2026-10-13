import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Calendar,
  Sparkles,
  Plus,
  Filter,
  Search,
  Clock,
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { ContentItem, ContentStatus, ContentType } from '../types';
import { StatusBadge } from '../components/ui/Badge';
import { QuickActionModal } from '../components/QuickActionModal';

export const Content: React.FC = () => {
  const { contentItems, updateContentStatus, clients } = useApp();
  const [selectedClientFilter, setSelectedClientFilter] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [activeView, setActiveView] = useState<'pipeline' | 'calendar'>('pipeline');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const pipelineStages: ContentStatus[] = [
    'IDEA',
    'SCRIPT',
    'DESIGN',
    'EDITING',
    'REVIEW',
    'APPROVAL',
    'SCHEDULED',
    'PUBLISHED'
  ];

  const filteredContent = contentItems.filter(c => {
    const matchesClient = selectedClientFilter === 'ALL' || c.clientId === selectedClientFilter;
    const matchesType = selectedTypeFilter === 'ALL' || c.contentType === selectedTypeFilter;
    return matchesClient && matchesType;
  });

  const handleAdvance = (item: ContentItem) => {
    const idx = pipelineStages.indexOf(item.status);
    if (idx < pipelineStages.length - 1) {
      updateContentStatus(item.id, pipelineStages[idx + 1]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Content Production Engine</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              {contentItems.length} Deliverables in Pipeline
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Full 8-stage production board: Scripting → Visual Design → 4K Editing → Approvals → Scheduled
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveView('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'pipeline' ? 'bg-white shadow-xs text-[#1F4D3A]' : 'text-stone-600'
              }`}
            >
              Production Board
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'calendar' ? 'bg-white shadow-xs text-[#1F4D3A]' : 'text-stone-600'
              }`}
            >
              Publishing Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="agency-card p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-[#59655F] font-semibold shrink-0">Client:</span>
          <select
            value={selectedClientFilter}
            onChange={e => setSelectedClientFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-[#E5E7E3] text-xs font-medium bg-white outline-none"
          >
            <option value="ALL">All Agency Clients</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.companyName}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-[#59655F] font-semibold shrink-0">Format:</span>
          {['ALL', 'Reel', 'Carousel', 'Story', 'YouTube'].map(fmt => (
            <button
              key={fmt}
              onClick={() => setSelectedTypeFilter(fmt)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                selectedTypeFilter === fmt
                  ? 'bg-[#1F4D3A] text-white'
                  : 'bg-[#FAF9F6] text-[#59655F] hover:bg-stone-100'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: PRODUCTION BOARD (KANBAN) */}
      {activeView === 'pipeline' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1400px]">
            {pipelineStages.map(stage => {
              const stageItems = filteredContent.filter(c => c.status === stage);

              return (
                <div
                  key={stage}
                  className="w-72 bg-[#FAF9F6] rounded-2xl border border-[#E5E7E3] p-3 flex flex-col shrink-0 min-h-[500px]"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E7E3]">
                    <span className="text-xs font-bold text-[#15382B] uppercase tracking-wider">
                      {stage}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-white text-[#1F4D3A] text-xs font-bold font-mono flex items-center justify-center border border-[#E5E7E3]">
                      {stageItems.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {stageItems.length === 0 ? (
                      <div className="h-20 border border-dashed border-[#E5E7E3] rounded-xl flex items-center justify-center text-[10px] text-[#8A9690]">
                        Empty stage
                      </div>
                    ) : (
                      stageItems.map(item => (
                        <div
                          key={item.id}
                          className="p-3.5 bg-white rounded-xl border border-[#E5E7E3] shadow-xs space-y-2.5 hover:border-[#1F4D3A]/40 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-[#1F4D3A] uppercase px-1.5 py-0.5 rounded bg-[#EBF2EE]">
                              {item.contentType}
                            </span>
                            <span className="text-[10px] text-[#8A9690]">{item.platform}</span>
                          </div>

                          {item.thumbnailUrl && (
                            <img
                              src={item.thumbnailUrl}
                              alt={item.title}
                              className="w-full h-28 object-cover rounded-lg border border-stone-100"
                            />
                          )}

                          <div>
                            <h4 className="text-xs font-bold text-[#202522] leading-snug">{item.title}</h4>
                            <p className="text-[11px] text-[#59655F] italic mt-1 line-clamp-2">"{item.hook}"</p>
                          </div>

                          <div className="pt-2 border-t border-[#E5E7E3] flex items-center justify-between text-[11px]">
                            <span className="text-[#59655F] font-semibold truncate max-w-[120px]">{item.clientName}</span>
                            {stage !== 'PUBLISHED' && (
                              <button
                                onClick={() => handleAdvance(item)}
                                className="px-2 py-0.5 rounded bg-[#EBF2EE] text-[#1F4D3A] hover:bg-[#D5E4DC] font-semibold text-[10px] flex items-center gap-1"
                              >
                                <span>Advance</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW 2: SCHEDULE LIST */
        <div className="agency-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#202522]">Upcoming Publishing Schedule</h3>
          <div className="space-y-3">
            {filteredContent.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-[#E5E7E3] bg-[#FAF9F6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#1F4D3A] uppercase font-mono">{item.contentType}</span>
                    <span className="text-[#8A9690]">·</span>
                    <span className="font-semibold text-[#202522]">{item.clientName}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="font-bold text-[#202522] text-sm">{item.title}</p>
                  <p className="text-[11px] text-[#59655F] mt-0.5">{item.caption}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-[#8A9690]">Target Live Date</span>
                  <p className="font-mono font-bold text-[#15382B] text-sm mt-0.5">{item.publishDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
