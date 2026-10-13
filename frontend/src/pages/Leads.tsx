import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Plus,
  Filter,
  Search,
  Phone,
  Mail,
  Globe,
  ArrowRight,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  Calendar,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { LeadStage, LeadSource, Lead } from '../types';
import { StatusBadge, LeadScoreBadge } from '../components/ui/Badge';
import { QuickActionModal } from '../components/QuickActionModal';

export const Leads: React.FC = () => {
  const { leads, updateLeadStage, updateLead, logCall, createProposal } = useApp();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  // Call form state
  const [callOutcome, setCallOutcome] = useState<any>('Interested');
  const [callNotes, setCallNotes] = useState('');
  const [nextCallDate, setNextCallDate] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const pipelineStages: LeadStage[] = [
    'NEW',
    'CONTACTED',
    'INTERESTED',
    'QUALIFIED',
    'MEETING',
    'PROPOSAL_SENT',
    'NEGOTIATION',
    'WON',
  ];

  // Filtering
  const filteredLeads = leads.filter(l => {
    const matchesSource = sourceFilter === 'ALL' || l.source === sourceFilter;
    const matchesSearch =
      !searchQuery ||
      l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.industry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const handleAdvanceStage = (leadId: string, currentStage: LeadStage) => {
    const currentIndex = pipelineStages.indexOf(currentStage);
    if (currentIndex >= 0 && currentIndex < pipelineStages.length - 1) {
      updateLeadStage(leadId, pipelineStages[currentIndex + 1]);
    }
  };

  const handleLogCallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    logCall({
      leadId: selectedLead.id,
      leadName: selectedLead.companyName,
      callerId: 'user-sales',
      callerName: 'Arjun Mehta',
      durationMinutes: 10,
      outcome: callOutcome,
      notes: callNotes,
      nextCallDate
    });
    setCallNotes('');
    setIsCallModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">CRM & Sales Pipeline</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              {leads.length} Leads Total
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Omnichannel pipeline: Lead scoring, stage velocity, cold calling records, and automatic onboarding
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQuickActionOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="agency-card p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-[#6F8F7D]" />
          <input
            type="text"
            placeholder="Search leads by company, contact person, industry..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs text-[#202522] placeholder-[#8A9690]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-[#6F8F7D] shrink-0" />
          <span className="text-xs text-[#59655F] font-semibold shrink-0">Source:</span>
          {['ALL', 'Instagram', 'WhatsApp', 'Cold Call', 'LinkedIn', 'Website'].map(src => (
            <button
              key={src}
              onClick={() => setSourceFilter(src)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                sourceFilter === src
                  ? 'bg-[#1F4D3A] text-white'
                  : 'bg-[#FAF9F6] text-[#59655F] hover:bg-stone-100'
              }`}
            >
              {src}
            </button>
          ))}
        </div>
      </div>

      {/* KANBAN PIPELINE BOARD */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1200px]">
          {pipelineStages.map(stage => {
            const stageLeads = filteredLeads.filter(l => l.stage === stage);
            const totalStageValue = stageLeads.reduce((acc, curr) => acc + curr.estimatedBudget, 0);

            return (
              <div
                key={stage}
                className="w-72 bg-[#FAF9F6] rounded-2xl border border-[#E5E7E3] p-3 flex flex-col shrink-0 min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E7E3]">
                  <div>
                    <h3 className="text-xs font-bold text-[#15382B] uppercase tracking-wider">
                      {stage.replace('_', ' ')}
                    </h3>
                    <span className="text-[10px] text-[#8A9690] font-mono">
                      ₹{totalStageValue.toLocaleString()}
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-white text-[#1F4D3A] text-xs font-bold font-mono flex items-center justify-center border border-[#E5E7E3]">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Lead Cards in Column */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {stageLeads.length === 0 ? (
                    <div className="h-24 border border-dashed border-[#E5E7E3] rounded-xl flex items-center justify-center text-[11px] text-[#8A9690]">
                      No leads
                    </div>
                  ) : (
                    stageLeads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="p-3 bg-white rounded-xl border border-[#E5E7E3] hover:border-[#1F4D3A]/40 shadow-xs cursor-pointer transition-all space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <p className="text-xs font-bold text-[#202522] group-hover:text-[#1F4D3A] transition-colors">
                              {lead.companyName}
                            </p>
                            <p className="text-[10px] text-[#59655F]">{lead.contactPerson} · {lead.industry}</p>
                          </div>
                          <LeadScoreBadge score={lead.leadScore} />
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-semibold text-[#15382B]">
                            ₹{lead.estimatedBudget.toLocaleString()}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF9F6] text-[#59655F]">
                            {lead.source}
                          </span>
                        </div>

                        {/* Quick Stage advance button */}
                        {stage !== 'WON' && (
                          <div className="pt-2 border-t border-[#E5E7E3] flex items-center justify-between text-[10px]">
                            <span className="text-[#8A9690]">Next: {lead.nextFollowUpDate}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdvanceStage(lead.id, lead.stage);
                              }}
                              className="px-2 py-0.5 rounded bg-[#EBF2EE] text-[#1F4D3A] hover:bg-[#D5E4DC] font-semibold flex items-center gap-1"
                              title="Advance to next pipeline stage"
                            >
                              <span>Advance</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {stage === 'WON' && (
                          <div className="pt-2 border-t border-[#E5E7E3] flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Client Onboarding Triggered</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LEAD DETAILS DRAWER / MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-[#15382B]/40 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl border-l border-[#E5E7E3] flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7E3] bg-[#FAF9F6]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#15382B]">{selectedLead.companyName}</h2>
                  <LeadScoreBadge score={selectedLead.leadScore} />
                </div>
                <p className="text-xs text-[#59655F] mt-0.5">{selectedLead.industry} · {selectedLead.location}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-1.5 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Primary Details Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-[#FAF9F6] rounded-xl border border-[#E5E7E3] text-xs">
                <div>
                  <span className="text-[#8A9690] uppercase font-bold text-[10px]">Contact Person</span>
                  <p className="font-semibold text-[#202522] mt-0.5">{selectedLead.contactPerson}</p>
                </div>
                <div>
                  <span className="text-[#8A9690] uppercase font-bold text-[10px]">Monthly Budget</span>
                  <p className="font-mono font-bold text-[#1F4D3A] text-sm mt-0.5">₹{selectedLead.estimatedBudget.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[#8A9690] uppercase font-bold text-[10px]">Lead Source</span>
                  <p className="font-semibold text-[#202522] mt-0.5">{selectedLead.source}</p>
                </div>
                <div>
                  <span className="text-[#8A9690] uppercase font-bold text-[10px]">Current Stage</span>
                  <p className="font-semibold text-[#1F4D3A] mt-0.5">{selectedLead.stage}</p>
                </div>
              </div>

              {/* Contact Channels */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#202522] uppercase tracking-wider">Contact Channels</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                    <span className="text-[#59655F] flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#1F4D3A]" /> Phone</span>
                    <span className="font-mono font-semibold">{selectedLead.phone}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                    <span className="text-[#59655F] flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#1F4D3A]" /> Email</span>
                    <span className="font-semibold">{selectedLead.email}</span>
                  </div>
                  {selectedLead.instagram && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                      <span className="text-[#59655F] flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-pink-600" /> Instagram</span>
                      <span className="font-semibold text-pink-700">{selectedLead.instagram}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sales Notes */}
              <div>
                <h4 className="text-xs font-bold text-[#202522] uppercase tracking-wider mb-2">Sales Notes & History</h4>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-[#202522] whitespace-pre-wrap leading-relaxed">
                  {selectedLead.notes || 'No notes added.'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#E5E7E3]">
                <h4 className="text-xs font-bold text-[#202522] uppercase tracking-wider">Lead Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsCallModalOpen(true)}
                    className="py-2.5 px-3 rounded-xl bg-[#EBF2EE] text-[#1F4D3A] font-semibold text-xs hover:bg-[#D5E4DC] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Log Call Outcome</span>
                  </button>

                  {selectedLead.stage !== 'WON' ? (
                    <button
                      onClick={() => {
                        updateLeadStage(selectedLead.id, 'WON');
                        setSelectedLead(null);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-[#1F4D3A] text-white font-semibold text-xs hover:bg-[#15382B] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Convert to WON</span>
                    </button>
                  ) : (
                    <div className="py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Client Onboarded</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOG CALL OUTCOME MODAL */}
      {isCallModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#15382B]/40 backdrop-blur-sm" onClick={() => setIsCallModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#E5E7E3] z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7E3]">
              <div>
                <h3 className="text-base font-bold text-[#15382B]">Log Call with {selectedLead.companyName}</h3>
                <p className="text-xs text-[#59655F]">Cold calling outcome & next follow-up</p>
              </div>
              <button onClick={() => setIsCallModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogCallSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#202522] mb-1">Call Outcome *</label>
                <select
                  value={callOutcome}
                  onChange={e => setCallOutcome(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none bg-white"
                >
                  <option value="Interested">Interested (Advance to Qualified)</option>
                  <option value="Meeting booked">Meeting booked (Schedule Pitch)</option>
                  <option value="Call later">Call later (Busy / Tasting)</option>
                  <option value="No answer">No answer (Leave WhatsApp)</option>
                  <option value="Not interested">Not interested</option>
                  <option value="Converted">Converted (Auto WON)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202522] mb-1">Next Follow-up Call Date</label>
                <input
                  type="date"
                  value={nextCallDate}
                  onChange={e => setNextCallDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202522] mb-1">Call Notes & Objections</label>
                <textarea
                  rows={3}
                  value={callNotes}
                  onChange={e => setCallNotes(e.target.value)}
                  placeholder="Notes on budget, reel interest, timeline, next steps..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E7E3]">
                <button
                  type="button"
                  onClick={() => setIsCallModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-[#E5E7E3] text-xs font-semibold text-[#59655F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#1F4D3A] text-white text-xs font-semibold hover:bg-[#15382B]"
                >
                  Save Call Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        defaultAction="lead"
      />
    </div>
  );
};
