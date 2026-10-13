import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileCheck,
  CheckCircle2,
  RotateCcw,
  Clock,
  Layers,
  Sparkles,
  MessageSquare,
  Eye,
  AlertCircle,
  X
} from 'lucide-react';
import { ApprovalItem } from '../types';
import { StatusBadge } from '../components/ui/Badge';

export const Approvals: React.FC = () => {
  const { approvals, approveDeliverable, requestRevision } = useApp();
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(approvals[0] || null);
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);

  const handleRequestRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApproval || !revisionFeedback.trim()) return;
    requestRevision(selectedApproval.id, revisionFeedback);
    setRevisionFeedback('');
    setIsRevisionModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Creative Approval Center</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              {approvals.length} Approval Threads
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Quality control hub: Full Version 1 → Version 2 → Version 3 revision audit trails, client feedback logs, and automated scheduling
          </p>
        </div>
      </div>

      {/* Main Grid: Approval Queue & Version History Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Approvals List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#202522] uppercase tracking-wider px-1">
            Review Queue
          </h3>

          <div className="space-y-2">
            {approvals.map(appr => {
              const isSelected = appr.id === selectedApproval?.id;
              const latestVer = appr.versions[appr.versions.length - 1];

              return (
                <div
                  key={appr.id}
                  onClick={() => setSelectedApproval(appr)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'border-[#1F4D3A] bg-[#EBF2EE]/60 shadow-xs ring-1 ring-[#1F4D3A]/20'
                      : 'border-[#E5E7E3] bg-[#FAF9F6] hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#1F4D3A] uppercase px-1.5 py-0.5 rounded bg-white border border-[#E5E7E3]">
                      {appr.type}
                    </span>
                    <StatusBadge status={appr.currentStatus || 'Pending Internal'} />
                  </div>

                  <h4 className="text-xs font-bold text-[#202522] leading-snug">{appr.title}</h4>
                  <p className="text-[11px] text-[#59655F]">{appr.clientName}</p>

                  <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[10px] text-[#8A9690]">
                    <span>Latest: Version {latestVer.versionNumber}</span>
                    <span>{latestVer.submittedAt.substring(0, 10)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Selected Deliverable Version History & Actions */}
        {selectedApproval && (
          <div className="lg:col-span-2 space-y-6">
            <div className="agency-card p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7E3]">
                <div>
                  <span className="text-[10px] font-bold text-[#8A9690] uppercase tracking-wider">
                    {selectedApproval.clientName} · {selectedApproval.type}
                  </span>
                  <h2 className="text-lg font-bold text-[#15382B] mt-0.5">{selectedApproval.title}</h2>
                </div>
                <StatusBadge status={selectedApproval.currentStatus || 'Pending Internal'} />
              </div>

              {/* Action Buttons for Reviewer */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E5E7E3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#202522] block">Sign-off Decision</span>
                  <p className="text-[11px] text-[#59655F]">
                    Approve to release to scheduling, or request creative revisions.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRevisionModalOpen(true)}
                    className="px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold hover:bg-amber-100 flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Request Revision</span>
                  </button>

                  <button
                    onClick={() => approveDeliverable(selectedApproval.id)}
                    className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white text-xs font-semibold hover:bg-[#15382B] flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Approve Deliverable</span>
                  </button>
                </div>
              </div>

              {/* Version History Timeline (Never delete past versions!) per spec #22 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#202522] uppercase tracking-wider">
                    Version Audit History ({selectedApproval.versions.length} Iterations)
                  </h3>
                  <span className="text-[10px] text-[#8A9690]">All versions permanently archived</span>
                </div>

                <div className="space-y-3">
                  {selectedApproval.versions.map((ver, idx) => (
                    <div
                      key={ver.versionNumber}
                      className="p-4 rounded-xl border border-[#E5E7E3] bg-white space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold px-2 py-0.5 rounded bg-[#FAF9F6] text-[#1F4D3A] border border-[#E5E7E3]">
                            Version {ver.versionNumber}
                          </span>
                          <span className="text-[#59655F]">Submitted by {ver.submittedBy}</span>
                        </div>
                        <StatusBadge status={ver.status || 'Pending Internal'} />
                      </div>

                      <div className="text-xs text-[#202522] bg-[#FAF9F6] p-3 rounded-lg border border-[#E5E7E3]">
                        <span className="font-bold text-[#8A9690] text-[10px] uppercase block mb-0.5">Submission Notes:</span>
                        <p>{ver.changeNotes}</p>
                      </div>

                      {/* Reviewer Feedback Log */}
                      {ver.reviewerFeedback && (
                        <div className="text-xs p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 space-y-0.5">
                          <div className="flex items-center justify-between text-[10px] text-amber-800 font-bold">
                            <span>Reviewer Feedback Log</span>
                            <span>{ver.reviewedAt}</span>
                          </div>
                          <p>{ver.reviewerFeedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* REQUEST REVISION MODAL */}
      {isRevisionModalOpen && selectedApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#15382B]/40 backdrop-blur-sm" onClick={() => setIsRevisionModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#E5E7E3] z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7E3]">
              <div>
                <h3 className="text-base font-bold text-[#15382B]">Request Revision</h3>
                <p className="text-xs text-[#59655F]">{selectedApproval.title}</p>
              </div>
              <button onClick={() => setIsRevisionModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestRevisionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#202522] mb-1">Specific Feedback & Change Notes *</label>
                <textarea
                  required
                  rows={4}
                  value={revisionFeedback}
                  onChange={e => setRevisionFeedback(e.target.value)}
                  placeholder="Detail the exact timestamp, audio trim, typo fix, or color adjustment required..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E7E3]">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-[#E5E7E3] text-[#59655F] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 shadow-xs"
                >
                  Dispatch Revision Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
