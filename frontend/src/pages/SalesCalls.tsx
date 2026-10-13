import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PhoneCall,
  PhoneForwarded,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Plus,
  Search,
  MessageSquare,
  Sparkles,
  Phone
} from 'lucide-react';
import { CallOutcome, Lead } from '../types';

export const SalesCalls: React.FC = () => {
  const { leads, calls, logCall } = useApp();
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [outcome, setOutcome] = useState<CallOutcome>('Interested');
  const [notes, setNotes] = useState('');
  const [nextCallDate, setNextCallDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState(8);
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');

  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];
  const leadCalls = calls.filter(c => c.leadId === selectedLead?.id);

  const outcomes: CallOutcome[] = [
    'No answer',
    'Busy',
    'Call later',
    'Interested',
    'Not interested',
    'Meeting booked',
    'Wrong number',
    'Converted'
  ];

  const handleLogCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    logCall({
      leadId: selectedLead.id,
      leadName: selectedLead.companyName,
      callerId: 'user-sales',
      callerName: 'Arjun Mehta',
      durationMinutes: Number(durationMinutes),
      outcome,
      notes: notes || `Outcome logged as: ${outcome}`,
      nextCallDate
    });
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Cold Calling Workspace</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#1F4D3A] font-bold">
              {leads.filter(l => l.stage !== 'WON' && l.stage !== 'LOST').length} Leads to Call
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Dedicated calling cockpit: Outbound tracking, call outcomes, chronological call logs, and instant conversion
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'queue' ? 'bg-white shadow-xs text-[#1F4D3A]' : 'text-stone-600'
              }`}
            >
              Calling Cockpit
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'history' ? 'bg-white shadow-xs text-[#1F4D3A]' : 'text-stone-600'
              }`}
            >
              Full History ({calls.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'queue' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Calling Queue List */}
          <div className="space-y-4">
            <div className="agency-card p-4">
              <h3 className="text-xs font-bold text-[#202522] uppercase tracking-wider mb-3">
                Prospect Calling Queue
              </h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {leads.map(lead => {
                  const isSelected = lead.id === selectedLead?.id;
                  const pastCallsCount = calls.filter(c => c.leadId === lead.id).length;

                  return (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#1F4D3A] bg-[#EBF2EE]/60 shadow-xs'
                          : 'border-[#E5E7E3] bg-[#FAF9F6] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-[#202522]">{lead.companyName}</p>
                          <p className="text-[11px] text-[#59655F]">{lead.contactPerson} · {lead.phone}</p>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#1F4D3A] font-mono font-bold border border-[#E5E7E3]">
                          {pastCallsCount} calls
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-black/5 text-[10px] text-[#8A9690]">
                        <span>Stage: {lead.stage}</span>
                        <span>Next: {lead.nextFollowUpDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Call Workspace (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {selectedLead && (
              <div className="agency-card p-6 space-y-6">
                {/* Active Prospect Details Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7E3]">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      Currently Calling
                    </span>
                    <h2 className="text-xl font-bold text-[#15382B] mt-0.5">{selectedLead.companyName}</h2>
                    <p className="text-xs text-[#59655F]">
                      {selectedLead.contactPerson} · {selectedLead.industry} · Budget: ₹{selectedLead.estimatedBudget.toLocaleString()}
                    </p>
                  </div>

                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="px-5 py-2.5 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
                  >
                    <Phone className="w-4 h-4 text-emerald-300" />
                    <span>Dial {selectedLead.phone}</span>
                  </a>
                </div>

                {/* Pitch Talking Points & Lead Notes */}
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs space-y-2">
                  <p className="font-bold text-[#1F4D3A] uppercase tracking-wider text-[11px]">
                    Pitch Guidance & Background:
                  </p>
                  <p className="text-[#59655F] leading-relaxed">
                    {selectedLead.notes || 'No prior notes logged. Emphasize short-form video reels, organic reach, and proven local customer footfall.'}
                  </p>
                </div>

                {/* Log Call Form */}
                <form onSubmit={handleLogCall} className="space-y-4">
                  <h4 className="text-xs font-bold text-[#202522] uppercase tracking-wider">Log Call Outcome</h4>

                  {/* Outcome Selectors Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {outcomes.map(oc => {
                      const isSelected = outcome === oc;
                      return (
                        <button
                          key={oc}
                          type="button"
                          onClick={() => setOutcome(oc)}
                          className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                            isSelected
                              ? 'border-[#1F4D3A] bg-[#1F4D3A] text-white shadow-xs'
                              : 'border-[#E5E7E3] bg-white text-[#59655F] hover:bg-[#FAF9F6]'
                          }`}
                        >
                          {oc}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#202522] mb-1">Duration (Minutes)</label>
                      <input
                        type="number"
                        value={durationMinutes}
                        onChange={e => setDurationMinutes(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none font-mono"
                      />
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
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#202522] mb-1">Call Notes & Discussion Summary</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Discussed pricing, sent sample reel link, client requested call back next Tuesday..."
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center gap-2 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Save Call Record to Lead History</span>
                    </button>
                  </div>
                </form>

                {/* Attached Call History for this Lead */}
                <div className="pt-4 border-t border-[#E5E7E3] space-y-3">
                  <h4 className="text-xs font-bold text-[#202522] uppercase tracking-wider">
                    Call History for {selectedLead.companyName} ({leadCalls.length})
                  </h4>

                  {leadCalls.length === 0 ? (
                    <p className="text-xs text-[#8A9690]">No calls logged yet for this lead.</p>
                  ) : (
                    <div className="space-y-2">
                      {leadCalls.map((c, idx) => (
                        <div key={c.id} className="p-3 rounded-xl border border-[#E5E7E3] bg-[#FAF9F6] text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#1F4D3A]">Call #{leadCalls.length - idx}: {c.outcome}</span>
                            <span className="text-[10px] text-[#8A9690]">{new Date(c.timestamp).toLocaleString()} ({c.durationMinutes} min)</span>
                          </div>
                          <p className="text-[#59655F]">{c.notes}</p>
                          {c.nextCallDate && (
                            <p className="text-[10px] text-emerald-700 font-semibold">Next Scheduled: {c.nextCallDate}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Full Calling History Table */
        <div className="agency-card overflow-hidden">
          <div className="p-4 border-b border-[#E5E7E3] bg-[#FAF9F6]">
            <h3 className="text-xs font-bold text-[#202522] uppercase tracking-wider">
              All Agency Call Records ({calls.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] border-b border-[#E5E7E3] text-[#59655F]">
                <tr>
                  <th className="p-3 font-semibold">Lead Company</th>
                  <th className="p-3 font-semibold">Caller</th>
                  <th className="p-3 font-semibold">Outcome</th>
                  <th className="p-3 font-semibold">Duration</th>
                  <th className="p-3 font-semibold">Notes</th>
                  <th className="p-3 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7E3]">
                {calls.map(c => (
                  <tr key={c.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="p-3 font-bold text-[#202522]">{c.leadName}</td>
                    <td className="p-3 text-[#59655F]">{c.callerName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-[#1F4D3A] font-bold">
                        {c.outcome}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{c.durationMinutes} min</td>
                    <td className="p-3 text-[#59655F] max-w-xs truncate">{c.notes}</td>
                    <td className="p-3 text-[#8A9690]">{new Date(c.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
