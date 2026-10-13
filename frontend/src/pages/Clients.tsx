import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Users,
  Briefcase,
  DollarSign,
  Compass,
  Layers,
  FolderOpen,
  CheckSquare,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Phone,
  Mail,
  ArrowRight
} from 'lucide-react';
import { Client } from '../types';
import { StatusBadge } from '../components/ui/Badge';
import { QuickActionModal } from '../components/QuickActionModal';

export const Clients: React.FC = () => {
  const {
    clients,
    projects,
    tasks,
    contentItems,
    invoices,
    strategies,
    files,
    toggleOnboardingItem
  } = useApp();

  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'onboarding' | 'projects' | 'tasks' | 'content' | 'billing' | 'strategy'>('overview');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // Client connected data
  const clientProjects = projects.filter(p => p.clientId === selectedClient?.id);
  const clientTasks = tasks.filter(t => t.clientId === selectedClient?.id);
  const clientContent = contentItems.filter(c => c.clientId === selectedClient?.id);
  const clientInvoices = invoices.filter(i => i.clientId === selectedClient?.id);
  const clientStrategy = strategies.find(s => s.clientId === selectedClient?.id);
  const clientFiles = files.filter(f => f.clientId === selectedClient?.id);

  // Financial calculations
  const totalInvoiced = clientInvoices.reduce((a, b) => a + b.total, 0);
  const totalPaid = clientInvoices.reduce((a, b) => a + b.amountPaid, 0);
  const pendingAmount = totalInvoiced - totalPaid;

  // Onboarding progress calculation
  const completedOnboardingItems = selectedClient?.onboardingChecklist.filter(item => item.completed).length || 0;
  const totalOnboardingItems = selectedClient?.onboardingChecklist.length || 13;
  const onboardingPercent = Math.round((completedOnboardingItems / totalOnboardingItems) * 100);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Client 360 Workspace</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              {clients.length} Retained Clients
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Holistic client directory: Onboarding checklists, active contracts, strategy decks, content deliverables, and billing
          </p>
        </div>

        <button
          onClick={() => setIsQuickActionOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Main Grid: Client Selector Tabs + Client 360 Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Col: Client Selector Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#202522] uppercase tracking-wider px-1">
            Agency Accounts
          </h3>

          <div className="space-y-2">
            {clients.map(c => {
              const isSelected = c.id === selectedClient?.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedClientId(c.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#1F4D3A] bg-[#EBF2EE]/60 shadow-xs ring-1 ring-[#1F4D3A]/20'
                      : 'border-[#E5E7E3] bg-[#FAF9F6] hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-[#202522]">{c.companyName}</p>
                    <StatusBadge status={c.health} />
                  </div>
                  <p className="text-[11px] text-[#59655F] mt-0.5">{c.industry}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5 text-[11px]">
                    <span className="font-mono font-bold text-[#1F4D3A]">
                      ₹{c.monthlyRetainer.toLocaleString()}/mo
                    </span>
                    <span className="text-[10px] text-[#8A9690]">{c.location}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Client 360 Full Hub (3 cols) */}
        {selectedClient && (
          <div className="lg:col-span-3 space-y-6">
            {/* Client Master Card */}
            <div className="agency-card p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7E3]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#15382B]">{selectedClient.companyName}</h2>
                    <StatusBadge status={selectedClient.health} />
                  </div>
                  <p className="text-xs text-[#59655F] mt-0.5">
                    {selectedClient.industry} · Primary Contact: <strong>{selectedClient.contactPerson}</strong> ({selectedClient.phone})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#8A9690]">Monthly Retainer</span>
                    <p className="text-lg font-bold font-mono text-[#1F4D3A]">
                      ₹{selectedClient.monthlyRetainer.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Onboarding Banner & Progress bar per spec #13 */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E5E7E3] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#15382B]">13-Point Client Onboarding Pipeline</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#1F4D3A] font-bold">
                      {completedOnboardingItems} / {totalOnboardingItems} Done
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#1F4D3A]">{onboardingPercent}%</span>
                </div>

                <div className="w-full bg-[#E5E7E3] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1F4D3A] h-full rounded-full transition-all duration-500"
                    style={{ width: `${onboardingPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#59655F]">
                  Auto-generated upon signing. Click the <strong>Onboarding Checklist</strong> tab below to complete remaining verification steps.
                </p>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-[#E5E7E3] gap-2 overflow-x-auto pt-2">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'onboarding', label: `Onboarding (${onboardingPercent}%)` },
                  { id: 'projects', label: `Projects (${clientProjects.length})` },
                  { id: 'tasks', label: `Tasks (${clientTasks.length})` },
                  { id: 'content', label: `Content (${clientContent.length})` },
                  { id: 'billing', label: `Billing & Invoices (${clientInvoices.length})` },
                  { id: 'strategy', label: 'Strategy Decks' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#1F4D3A] text-[#1F4D3A]'
                        : 'border-transparent text-[#59655F] hover:text-[#202522]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs">
                      <span className="text-[#8A9690] uppercase font-bold text-[10px]">Contract Value</span>
                      <p className="font-mono font-bold text-base text-[#202522] mt-1">₹{selectedClient.contractValue.toLocaleString()}</p>
                      <span className="text-[10px] text-[#59655F]">Annual Retainer Value</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs">
                      <span className="text-[#8A9690] uppercase font-bold text-[10px]">Realized Billing</span>
                      <p className="font-mono font-bold text-base text-emerald-800 mt-1">₹{totalPaid.toLocaleString()}</p>
                      <span className="text-[10px] text-[#59655F]">Paid across invoices</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs">
                      <span className="text-[#8A9690] uppercase font-bold text-[10px]">Pending / Due</span>
                      <p className="font-mono font-bold text-base text-amber-800 mt-1">₹{pendingAmount.toLocaleString()}</p>
                      <span className="text-[10px] text-[#59655F]">Outstanding balance</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-[#E5E7E3] text-xs space-y-1">
                    <p className="font-bold text-[#1F4D3A] uppercase tracking-wider text-[11px]">Client Health Diagnosis:</p>
                    <p className="text-[#59655F] leading-relaxed">{selectedClient.healthReason}</p>
                  </div>

                  {/* Brand Guidelines & Palette */}
                  {selectedClient.brandColors && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#202522] uppercase tracking-wider">Brand Color Tokens & Typography</h4>
                      <div className="flex items-center gap-3">
                        {selectedClient.brandColors.map((hex, i) => (
                          <div key={i} className="flex items-center gap-2 bg-[#FAF9F6] p-2 rounded-xl border border-[#E5E7E3] text-xs font-mono">
                            <span className="w-5 h-5 rounded-lg border border-black/10 shadow-2xs" style={{ backgroundColor: hex }} />
                            <span>{hex}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ONBOARDING CHECKLIST per spec #13 */}
              {activeTab === 'onboarding' && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[#202522] uppercase tracking-wider">
                        13-Step Automated Client Intake Checklist
                      </h3>
                      <p className="text-xs text-[#59655F]">Click any item to toggle completion status</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#1F4D3A]">{onboardingPercent}% Complete</span>
                  </div>

                  <div className="space-y-2">
                    {selectedClient.onboardingChecklist.map(item => (
                      <div
                        key={item.id}
                        onClick={() => toggleOnboardingItem(selectedClient.id, item.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                          item.completed
                            ? 'bg-emerald-50/40 border-emerald-200 text-[#1F4D3A]'
                            : 'bg-white border-[#E5E7E3] text-[#202522] hover:bg-[#FAF9F6]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => {}} // handled by parent onClick
                          className="mt-0.5 w-4 h-4 rounded text-[#1F4D3A] focus:ring-[#1F4D3A]"
                        />
                        <div className="flex-1 text-xs">
                          <p className={`font-semibold ${item.completed ? 'line-through opacity-80' : ''}`}>
                            {item.id}. {item.title}
                          </p>
                          {item.notes && <p className="text-[11px] text-[#8A9690] mt-0.5">{item.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-3 pt-2">
                  {clientProjects.map(p => (
                    <div key={p.id} className="p-3.5 rounded-xl border border-[#E5E7E3] bg-[#FAF9F6] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#202522]">{p.title}</span>
                        <StatusBadge status={p.health} />
                      </div>
                      <p className="text-xs text-[#59655F]">{p.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-[#E5E7E3] text-xs">
                        <span>Budget: ₹{p.budget.toLocaleString()}</span>
                        <span>Deadline: {p.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: TASKS */}
              {activeTab === 'tasks' && (
                <div className="space-y-2 pt-2">
                  {clientTasks.map(t => (
                    <div key={t.id} className="p-3 rounded-xl border border-[#E5E7E3] bg-white flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#202522]">{t.title}</p>
                        <p className="text-[11px] text-[#59655F]">Assignee: {t.assignedEmployeeName} · Deadline: {t.deadline}</p>
                      </div>
                      <StatusBadge status={t.status} />
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: CONTENT */}
              {activeTab === 'content' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {clientContent.map(c => (
                    <div key={c.id} className="p-3 rounded-xl border border-[#E5E7E3] bg-white space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1F4D3A] uppercase">{c.contentType}</span>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="font-semibold text-[#202522]">{c.title}</p>
                      <p className="text-[11px] text-[#59655F] italic">"{c.hook}"</p>
                      <div className="pt-2 border-t border-[#E5E7E3] text-[10px] text-[#8A9690] flex justify-between">
                        <span>Platform: {c.platform}</span>
                        <span>Publish: {c.publishDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 6: BILLING */}
              {activeTab === 'billing' && (
                <div className="space-y-3 pt-2">
                  {clientInvoices.map(inv => (
                    <div key={inv.id} className="p-3 rounded-xl border border-[#E5E7E3] bg-white flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#202522]">{inv.invoiceNumber}</p>
                        <p className="text-[11px] text-[#59655F]">Issued: {inv.issuedDate} · Due: {inv.dueDate}</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <p className="font-mono font-bold text-[#202522]">₹{inv.total.toLocaleString()}</p>
                          <span className="text-[10px] text-[#8A9690]">Paid: ₹{inv.amountPaid.toLocaleString()}</span>
                        </div>
                        <StatusBadge status={inv.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 7: STRATEGY */}
              {activeTab === 'strategy' && (
                <div className="space-y-4 pt-2 text-xs">
                  {clientStrategy ? (
                    <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] space-y-3">
                      <div>
                        <span className="font-bold text-[#1F4D3A] uppercase tracking-wider text-[10px]">Brand Positioning:</span>
                        <p className="text-[#202522] mt-0.5 font-medium">{clientStrategy.brandStrategy.brandPositioning}</p>
                      </div>
                      <div>
                        <span className="font-bold text-[#1F4D3A] uppercase tracking-wider text-[10px]">Unique Selling Proposition (USP):</span>
                        <p className="text-[#202522] mt-0.5">{clientStrategy.brandStrategy.usp}</p>
                      </div>
                      <div>
                        <span className="font-bold text-[#1F4D3A] uppercase tracking-wider text-[10px]">Brand Voice:</span>
                        <p className="text-[#202522] mt-0.5">{clientStrategy.brandStrategy.brandVoice}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-stone-500">No strategy document attached yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        defaultAction="client"
      />
    </div>
  );
};
