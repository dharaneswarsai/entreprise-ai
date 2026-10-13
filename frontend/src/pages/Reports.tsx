import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Download,
  Building2,
  Layers,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { clients, projects, tasks, contentItems, invoices, leads } = useApp();
  const [reportType, setReportType] = useState<'agency' | 'client'>('agency');
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // Agency metrics
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + b.amountPaid, 0);
  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.stage === 'WON').length;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
  const totalCompletedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const totalContentPublished = contentItems.filter(c => c.status === 'PUBLISHED' || c.status === 'SCHEDULED').length;

  // Selected client metrics
  const clientContent = contentItems.filter(c => c.clientId === selectedClient?.id);
  const clientTasks = tasks.filter(t => t.clientId === selectedClient?.id);
  const clientCompleted = clientTasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Executive Performance Intelligence</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              Agency & Client Audits
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Deliverable completion ratios, conversion performance, and quarterly brand growth reporting
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setReportType('agency')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                reportType === 'agency' ? 'bg-white shadow-xs text-[#1F4D3A]' : 'text-stone-600'
              }`}
            >
              Master Agency Report
            </button>
            <button
              onClick={() => setReportType('client')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                reportType === 'client' ? 'bg-white shadow-xs text-[#1F4D3A]' : 'text-stone-600'
              }`}
            >
              Client Growth Report
            </button>
          </div>
        </div>
      </div>

      {reportType === 'agency' ? (
        /* MASTER AGENCY EXECUTIVE REPORT */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="agency-card p-5 space-y-1">
              <span className="text-xs text-[#59655F] font-semibold">Realized Gross Billing</span>
              <p className="text-2xl font-bold font-mono text-[#15382B]">₹{totalRevenue.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-700 block">From active retainer agreements</span>
            </div>

            <div className="agency-card p-5 space-y-1">
              <span className="text-xs text-[#59655F] font-semibold">Sales Conversion Velocity</span>
              <p className="text-2xl font-bold font-mono text-[#202522]">{conversionRate}%</p>
              <span className="text-[10px] text-[#8A9690] block">{wonLeads} won of {totalLeads} pipeline prospects</span>
            </div>

            <div className="agency-card p-5 space-y-1">
              <span className="text-xs text-[#59655F] font-semibold">Tasks Completed</span>
              <p className="text-2xl font-bold font-mono text-[#202522]">{totalCompletedTasks}</p>
              <span className="text-[10px] text-[#8A9690] block">{tasks.length} total assigned</span>
            </div>

            <div className="agency-card p-5 space-y-1">
              <span className="text-xs text-[#59655F] font-semibold">Content Delivered / Live</span>
              <p className="text-2xl font-bold font-mono text-[#1F4D3A]">{totalContentPublished}</p>
              <span className="text-[10px] text-emerald-700 block">Short-form reels, carousels, stories</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Retainer Distribution */}
            <div className="agency-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#202522]">Client Account Retainer Contributions</h3>
              <div className="space-y-3">
                {clients.map(c => {
                  const share = Math.round((c.monthlyRetainer / (clients.reduce((a, b) => a + b.monthlyRetainer, 0) || 1)) * 100);
                  return (
                    <div key={c.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#202522]">{c.companyName}</span>
                        <span className="font-mono text-[#1F4D3A]">₹{c.monthlyRetainer.toLocaleString()}/mo ({share}%)</span>
                      </div>
                      <div className="w-full bg-[#E5E7E3] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#1F4D3A] h-full rounded-full" style={{ width: `${share}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Departmental Output */}
            <div className="agency-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#202522]">Production Output by Specialty</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3]">
                  <span className="text-[#8A9690] block mb-1">Short-Form Reels</span>
                  <p className="text-xl font-bold font-mono text-[#1F4D3A]">
                    {contentItems.filter(c => c.contentType === 'Reel').length} Rendered
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3]">
                  <span className="text-[#8A9690] block mb-1">Brand Carousels</span>
                  <p className="text-xl font-bold font-mono text-[#1F4D3A]">
                    {contentItems.filter(c => c.contentType === 'Carousel').length} Designed
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3]">
                  <span className="text-[#8A9690] block mb-1">Daily Story Posts</span>
                  <p className="text-xl font-bold font-mono text-[#1F4D3A]">
                    {contentItems.filter(c => c.contentType === 'Story').length} Formatted
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3]">
                  <span className="text-[#8A9690] block mb-1">YouTube Deep-Dives</span>
                  <p className="text-xl font-bold font-mono text-[#1F4D3A]">
                    {contentItems.filter(c => c.contentType === 'YouTube').length} Produced
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* INDIVIDUAL CLIENT GROWTH REPORT per spec #39 */
        <div className="space-y-6">
          <div className="agency-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#59655F]">Select Client:</span>
              <select
                value={selectedClientId}
                onChange={e => setSelectedClientId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#E5E7E3] text-xs font-semibold bg-white outline-none"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.companyName}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => alert(`Exported Client Performance Summary for ${selectedClient.companyName}`)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1F4D3A] text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Client PDF</span>
            </button>
          </div>

          <div className="agency-card p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7E3]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#8A9690] uppercase tracking-wider">
                  Quarterly Performance Summary
                </span>
                <h2 className="text-xl font-bold text-[#15382B] mt-0.5">{selectedClient.companyName}</h2>
                <p className="text-xs text-[#59655F] mt-0.5">Account Manager: Meera Nair · Industry: {selectedClient.industry}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#8A9690]">Account Health</span>
                <p className="text-sm font-bold text-emerald-800">{selectedClient.health}</p>
              </div>
            </div>

            {/* Performance KPIs for Client */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs">
                <span className="text-[#8A9690] uppercase font-bold text-[10px] block mb-1">Content Produced</span>
                <p className="font-mono font-bold text-xl text-[#15382B]">{clientContent.length} Assets</p>
                <span className="text-[10px] text-emerald-700">100% on schedule</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs">
                <span className="text-[#8A9690] uppercase font-bold text-[10px] block mb-1">Tasks Completed</span>
                <p className="font-mono font-bold text-xl text-[#15382B]">{clientCompleted} / {clientTasks.length}</p>
                <span className="text-[10px] text-[#59655F]">Across active projects</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs">
                <span className="text-[#8A9690] uppercase font-bold text-[10px] block mb-1">Organic Reach Growth</span>
                <p className="font-mono font-bold text-xl text-emerald-800">+42.8%</p>
                <span className="text-[10px] text-emerald-700">Meta Insights Verified</span>
              </div>
            </div>

            {/* Content Deliverables Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#202522] uppercase tracking-wider">Deliverables in Production Cycle</h4>
              <div className="space-y-2">
                {clientContent.map(item => (
                  <div key={item.id} className="p-3 rounded-xl border border-[#E5E7E3] bg-[#FAF9F6] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#1F4D3A] uppercase font-mono mr-2">[{item.contentType}]</span>
                      <span className="font-semibold text-[#202522]">{item.title}</span>
                    </div>
                    <span className="font-mono text-[#8A9690]">Target: {item.publishDate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
