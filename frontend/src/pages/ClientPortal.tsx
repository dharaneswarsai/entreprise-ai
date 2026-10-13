import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Calendar,
  FileCheck,
  CheckCircle2,
  Clock,
  Layers,
  Receipt,
  Download,
  FolderOpen,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { StatusBadge } from '../components/ui/Badge';

export const ClientPortal: React.FC = () => {
  const { clients, projects, contentItems, approvals, invoices, approveDeliverable } = useApp();
  const { switchUser } = useAuth();

  // Sanchari Trails as the reference client
  const client = clients.find(c => c.id === 'client-1') || clients[0];
  const clientProjects = projects.filter(p => p.clientId === client.id);
  const clientContent = contentItems.filter(c => c.clientId === client.id);
  const clientApprovals = approvals.filter(a => a.clientId === client.id && ((a.currentStatus || a.status || '').toUpperCase().startsWith('PENDING')));
  const clientInvoices = invoices.filter(i => i.clientId === client.id);

  const [activeTab, setActiveTab] = useState<'approvals' | 'calendar' | 'deliverables' | 'billing'>('approvals');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Strict Client Isolation Notice Banner */}
      <div className="bg-[#1F4D3A] text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>
            <strong>Isolated Client Portal View:</strong> Simulating external partner login for <strong>{client.companyName}</strong> ({client.contactPerson}). Internal costs and team chats are strictly hidden.
          </span>
        </div>
        <button
          onClick={() => switchUser('user-admin')}
          className="text-emerald-300 hover:text-white font-semibold underline text-right whitespace-nowrap"
        >
          Return to Agency Admin
        </button>
      </div>

      {/* Client Welcome Header */}
      <div className="agency-card p-6 sm:p-8 bg-gradient-to-br from-white to-[#FAF9F6] border-[#E5E7E3] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#1F4D3A] uppercase tracking-wider px-2 py-0.5 rounded bg-[#EBF2EE]">
              Client Partner Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15382B] mt-1.5">
              Welcome, {client.contactPerson}
            </h1>
            <p className="text-xs text-[#59655F] mt-0.5">
              {client.companyName} · Creative Retainer Partner
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#8A9690]">Account Manager</span>
              <p className="text-xs font-bold text-[#202522]">Meera Nair</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Active & Online</span>
            </div>
          </div>
        </div>

        {/* Client KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E5E7E3] text-xs">
          <div className="p-3 rounded-xl bg-white border border-[#E5E7E3]">
            <span className="text-[#8A9690] block mb-0.5">Pending Approvals</span>
            <p className="text-xl font-bold font-mono text-amber-800">{clientApprovals.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#E5E7E3]">
            <span className="text-[#8A9690] block mb-0.5">Scheduled Posts</span>
            <p className="text-xl font-bold font-mono text-[#1F4D3A]">{clientContent.filter(c => c.status === 'SCHEDULED').length}</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#E5E7E3]">
            <span className="text-[#8A9690] block mb-0.5">Active Campaigns</span>
            <p className="text-xl font-bold font-mono text-[#202522]">{clientProjects.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#E5E7E3]">
            <span className="text-[#8A9690] block mb-0.5">Retainer Status</span>
            <p className="text-sm font-bold text-emerald-800">Paid & Active</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E5E7E3] gap-2 overflow-x-auto">
        {[
          { id: 'approvals', label: `Pending Approvals (${clientApprovals.length})` },
          { id: 'calendar', label: `Publishing Calendar (${clientContent.length})` },
          { id: 'deliverables', label: 'Recent Finished Assets' },
          { id: 'billing', label: `Invoices & Receipts (${clientInvoices.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-[#1F4D3A] text-[#1F4D3A]'
                : 'border-transparent text-[#59655F] hover:text-[#202522]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PENDING CLIENT APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          {clientApprovals.length === 0 ? (
            <div className="agency-card p-12 text-center text-xs text-[#8A9690] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-bold text-[#202522] text-sm">All caught up!</p>
              <p>There are no deliverables waiting for your approval right now.</p>
            </div>
          ) : (
            clientApprovals.map(appr => {
              const latestVer = appr.versions[appr.versions.length - 1];

              return (
                <div key={appr.id} className="agency-card p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7E3]">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#1F4D3A] uppercase px-2 py-0.5 rounded bg-[#EBF2EE]">
                        Requires Your Sign-off
                      </span>
                      <h3 className="text-base font-bold text-[#15382B] mt-1">{appr.title}</h3>
                      <p className="text-xs text-[#59655F]">Version {latestVer.versionNumber} · Submitted {latestVer.submittedAt}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => approveDeliverable(appr.id, 'Approved via Client Portal')}
                        className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white text-xs font-semibold hover:bg-[#15382B] shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>1-Click Approve</span>
                      </button>
                    </div>
                  </div>

                  {latestVer.previewUrl && (
                    <img
                      src={latestVer.previewUrl}
                      alt={appr.title}
                      className="w-full h-64 object-cover rounded-xl border border-stone-200"
                    />
                  )}

                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs">
                    <span className="font-bold text-[#8A9690] text-[10px] uppercase block mb-1">
                      Creative Team Notes:
                    </span>
                    <p className="text-[#202522]">{latestVer.changeNotes}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: CONTENT CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="agency-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#202522]">Upcoming Social & Video Drops</h3>
          <div className="space-y-3">
            {clientContent.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-[#E5E7E3] bg-[#FAF9F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#1F4D3A] uppercase font-mono">[{item.contentType}]</span>
                    <span className="font-semibold text-[#202522]">{item.title}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-[#59655F] italic line-clamp-1">"{item.hook}"</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-[#8A9690]">Live Date</span>
                  <p className="font-mono font-bold text-[#15382B]">{item.publishDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DELIVERABLES */}
      {activeTab === 'deliverables' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {clientContent.filter(c => c.status === 'PUBLISHED' || c.status === 'SCHEDULED').map(c => (
            <div key={c.id} className="agency-card p-4 space-y-3 text-xs">
              {c.thumbnailUrl && (
                <img src={c.thumbnailUrl} alt={c.title} className="w-full h-36 object-cover rounded-xl" />
              )}
              <h4 className="font-bold text-[#202522]">{c.title}</h4>
              <p className="text-[#59655F] line-clamp-2">{c.caption}</p>
              <div className="pt-2 border-t border-[#E5E7E3] flex justify-between items-center text-[10px] text-[#8A9690]">
                <span>Platform: {c.platform}</span>
                <span className="text-emerald-700 font-semibold font-mono">Published</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: BILLING & INVOICES */}
      {activeTab === 'billing' && (
        <div className="agency-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] border-b border-[#E5E7E3] text-[#15382B]">
                <tr>
                  <th className="p-3 font-bold">Invoice #</th>
                  <th className="p-3 font-bold">Issued Date</th>
                  <th className="p-3 font-bold">Due Date</th>
                  <th className="p-3 font-bold text-right">Amount (INR)</th>
                  <th className="p-3 font-bold text-center">Status</th>
                  <th className="p-3 font-bold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7E3]">
                {clientInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="p-3 font-mono font-bold text-[#1F4D3A]">{inv.invoiceNumber}</td>
                    <td className="p-3 text-[#59655F]">{inv.issuedDate}</td>
                    <td className="p-3 font-mono text-[#8A9690]">{inv.dueDate}</td>
                    <td className="p-3 font-mono font-bold text-right text-[#202522]">₹{inv.total.toLocaleString()}</td>
                    <td className="p-3 text-center"><StatusBadge status={inv.status} /></td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => window.print()}
                        className="px-2.5 py-1 rounded-lg border border-[#E5E7E3] text-xs font-semibold text-[#1F4D3A] hover:bg-stone-50"
                      >
                        Download PDF
                      </button>
                    </td>
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
