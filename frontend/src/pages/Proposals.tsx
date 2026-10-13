import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileCheck,
  Plus,
  Printer,
  CheckCircle2,
  Trash2,
  Calendar,
  DollarSign,
  Download,
  Eye,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Proposal, ProposalItem, ProposalStatus } from '../types';
import { StatusBadge } from '../components/ui/Badge';

export const Proposals: React.FC = () => {
  const { proposals, leads, clients, createProposal, updateProposalStatus } = useApp();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Proposal Builder State
  const [companyName, setCompanyName] = useState('');
  const [clientName, setClientName] = useState('');
  const [leadId, setLeadId] = useState('');
  const [timeline, setTimeline] = useState('6-Month Retainer with Quarterly Review');
  const [paymentTerms, setPaymentTerms] = useState('50% advance on sign-off, 50% on 15th of each month');
  const [revisionPolicy, setRevisionPolicy] = useState('Up to 2 creative revision rounds per short-form asset');
  const [discountAmount, setDiscountAmount] = useState('5000');
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const [lineItems, setLineItems] = useState<ProposalItem[]>([
    { id: '1', service: 'Monthly Short-Form Reel Engine', deliverables: '12 4K Cinematic Reels + Audio Mixing', rate: 75000, quantity: 1, total: 75000 },
    { id: '2', service: 'Meta Paid Ads & Hook Variations', deliverables: '4 Performance Creative Hooks for Ad Spend', rate: 20000, quantity: 1, total: 20000 },
  ]);

  const subtotal = lineItems.reduce((acc, curr) => acc + (curr.total ?? curr.amount ?? 0), 0);
  const discount = Number(discountAmount) || 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.18); // 18% GST
  const finalAmount = taxableAmount + tax;

  const handleAddItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: String(Date.now()),
        service: 'On-Location Basecamp Shoot',
        deliverables: '1 Full-Day Production Shoot with Camera & Drone',
        rate: 25000,
        quantity: 1,
        total: 25000
      }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setLineItems(lineItems.filter(i => i.id !== id));
  };

  const handleCreateProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || lineItems.length === 0) return;

    createProposal({
      leadId: leadId || undefined,
      clientName: clientName || 'Founder',
      companyName,
      status: 'Sent',
      items: lineItems,
      subtotal,
      discount,
      tax,
      finalAmount,
      timeline,
      paymentTerms,
      revisionPolicy,
      terms: 'Standard agency service agreement applies. Assets cleared for commercial social advertising.',
      expiryDate
    });

    setIsBuilderOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Proposal Engine</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              {proposals.length} Proposals Dispatched
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Automated proposal generator: GST tax calculations, PDF/print exports, and instant client onboarding on acceptance
          </p>
        </div>

        <button
          onClick={() => setIsBuilderOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Draft Proposal</span>
        </button>
      </div>

      {/* Proposals List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proposals.map(prop => (
          <div
            key={prop.id}
            className="agency-card agency-card-hover p-5 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#8A9690]">{prop.proposalNumber}</span>
                  <h3 className="text-base font-bold text-[#202522] mt-0.5">{prop.companyName}</h3>
                  <p className="text-xs text-[#59655F]">Client: {prop.clientName}</p>
                </div>
                <StatusBadge status={prop.status} />
              </div>

              {/* Items summary */}
              <div className="space-y-1.5 my-3 pt-3 border-t border-[#E5E7E3] text-xs">
                {prop.items.map(item => (
                  <div key={item.id} className="flex justify-between text-[#59655F]">
                    <span className="truncate pr-2">{item.service}</span>
                    <span className="font-mono shrink-0">₹{(item.total ?? item.amount ?? 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#E5E7E3]">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#59655F]">Total (incl. GST 18%):</span>
                <span className="text-lg font-bold font-mono text-[#15382B]">
                  ₹{prop.finalAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedProposal(prop);
                    setIsPreviewOpen(true);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#E5E7E3] hover:bg-[#FAF9F6] text-xs font-semibold text-[#202522] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#6F8F7D]" />
                  <span>View / Print</span>
                </button>

                {prop.status !== 'Accepted' && (
                  <button
                    onClick={() => updateProposalStatus(prop.id, 'Accepted')}
                    className="py-2 px-3 rounded-xl bg-[#1F4D3A] hover:bg-[#15382B] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    title="Accepting will trigger client creation and onboarding checklist!"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Accept</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PROPOSAL BUILDER MODAL */}
      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-[#15382B]/40 backdrop-blur-sm" onClick={() => setIsBuilderOpen(false)} />
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E5E7E3] z-10 overflow-hidden my-8">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7E3] bg-[#FAF9F6]">
              <div>
                <h3 className="text-base font-bold text-[#15382B]">Agency Proposal Builder</h3>
                <p className="text-xs text-[#59655F]">Standardized scope, rate card items, and automatic tax calculation</p>
              </div>
              <button onClick={() => setIsBuilderOpen(false)} className="p-1.5 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProposalSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Client & Lead Linking */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#202522] mb-1">Company / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. Sanchari Trails or New Brand"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#202522] mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g. Rohan Roy (Founder)"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#202522] uppercase tracking-wider">Services & Deliverables</h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-semibold text-[#1F4D3A] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Service Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {lineItems.map(item => (
                    <div key={item.id} className="p-3 rounded-xl border border-[#E5E7E3] bg-[#FAF9F6] grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          value={item.service}
                          onChange={e => {
                            const val = e.target.value;
                            setLineItems(lineItems.map(li => li.id === item.id ? { ...li, service: val } : li));
                          }}
                          placeholder="Service name"
                          className="w-full px-2 py-1 rounded-lg border border-stone-200 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={item.deliverables}
                          onChange={e => {
                            const val = e.target.value;
                            setLineItems(lineItems.map(li => li.id === item.id ? { ...li, deliverables: val } : li));
                          }}
                          placeholder="Deliverables"
                          className="w-full px-2 py-1 rounded-lg border border-stone-200 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setLineItems(lineItems.map(li => li.id === item.id ? { ...li, rate: val, total: val * li.quantity } : li));
                          }}
                          className="w-full px-2 py-1 rounded-lg border border-stone-200 bg-white font-mono"
                        />
                      </div>
                      <div className="sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id || '')}
                          className="text-stone-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automatic Calculation Summary */}
              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] space-y-2 text-right">
                <div className="flex justify-between">
                  <span className="text-[#59655F]">Subtotal:</span>
                  <span className="font-mono font-bold text-[#202522]">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#59655F]">Discount (₹):</span>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={e => setDiscountAmount(e.target.value)}
                    className="w-28 px-2 py-0.5 rounded border border-stone-200 text-right font-mono"
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-[#59655F]">GST (18%):</span>
                  <span className="font-mono font-bold text-[#202522]">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E5E7E3] text-sm">
                  <span className="font-bold text-[#15382B]">Final Proposal Amount:</span>
                  <span className="font-mono font-bold text-[#15382B] text-base">₹{finalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#202522] mb-1">Timeline & Commitment</label>
                  <input
                    type="text"
                    value={timeline}
                    onChange={e => setTimeline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#202522] mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7E3]">
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7E3] text-xs font-semibold text-[#59655F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1F4D3A] text-white text-xs font-semibold hover:bg-[#15382B] transition-colors shadow-xs"
                >
                  Generate & Send Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE PROPOSAL MODAL / PREVIEW */}
      {isPreviewOpen && selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-[#15382B]/60 backdrop-blur-sm" onClick={() => setIsPreviewOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E5E7E3] z-10 overflow-hidden my-8 p-8 sm:p-12 space-y-8">
            {/* Action Bar (hidden in print) */}
            <div className="flex items-center justify-between no-print pb-4 border-b border-[#E5E7E3]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#1F4D3A] px-2 py-0.5 rounded bg-[#EBF2EE]">
                  {selectedProposal.proposalNumber}
                </span>
                <span className="text-xs text-[#59655F]">Editorial Agency PDF Layout</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-[#15382B]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button onClick={() => setIsPreviewOpen(false)} className="p-2 text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div className="space-y-8 text-[#202522]">
              {/* Letterhead */}
              <div className="flex items-start justify-between pb-6 border-b-2 border-[#1F4D3A]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#1F4D3A] text-white font-bold flex items-center justify-center">E</span>
                    <span className="text-xl font-extrabold tracking-tight text-[#15382B]">ENTREPRISE AI</span>
                  </div>
                  <p className="text-xs text-[#59655F] mt-1">Creative Operations & Digital Performance Collective</p>
                  <p className="text-[11px] text-[#8A9690]">hello@entrepriseai.agency · +91 98401 23450</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono uppercase font-bold text-[#8A9690]">Commercial Proposal</span>
                  <p className="text-lg font-bold font-mono text-[#15382B]">{selectedProposal.proposalNumber}</p>
                  <p className="text-xs text-[#59655F]">Date: {selectedProposal.createdAt}</p>
                  <p className="text-xs text-amber-800">Valid until: {selectedProposal.expiryDate}</p>
                </div>
              </div>

              {/* Prepared for */}
              <div className="grid grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8A9690] block mb-1">Prepared Exclusively For:</span>
                  <p className="text-sm font-bold text-[#15382B]">{selectedProposal.companyName}</p>
                  <p className="text-[#59655F]">Attn: {selectedProposal.clientName}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8A9690] block mb-1">Project Commitment:</span>
                  <p className="font-semibold text-[#202522]">{selectedProposal.timeline}</p>
                  <p className="text-[#59655F]">Payment terms: {selectedProposal.paymentTerms}</p>
                </div>
              </div>

              {/* Deliverables Table */}
              <div>
                <table className="w-full text-left text-xs border border-[#E5E7E3] rounded-xl overflow-hidden">
                  <thead className="bg-[#FAF9F6] border-b border-[#E5E7E3] text-[#15382B]">
                    <tr>
                      <th className="p-3 font-bold">Scope & Service</th>
                      <th className="p-3 font-bold">Deliverables Specification</th>
                      <th className="p-3 font-bold text-right">Investment (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7E3]">
                    {selectedProposal.items.map(item => (
                      <tr key={item.id}>
                        <td className="p-3 font-bold text-[#202522]">{item.service}</td>
                        <td className="p-3 text-[#59655F]">{item.deliverables}</td>
                        <td className="p-3 font-mono font-bold text-right text-[#202522]">₹{(item.total ?? item.amount ?? 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals Calculation */}
              <div className="flex justify-end">
                <div className="w-72 space-y-2 text-xs">
                  <div className="flex justify-between text-[#59655F]">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{selectedProposal.subtotal.toLocaleString()}</span>
                  </div>
                  {selectedProposal.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Agency Partner Discount:</span>
                      <span className="font-mono">- ₹{selectedProposal.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#59655F]">
                    <span>GST (18% Standard):</span>
                    <span className="font-mono">₹{selectedProposal.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-[#1F4D3A] text-sm font-bold text-[#15382B]">
                    <span>Total Investment:</span>
                    <span className="font-mono text-base">₹{selectedProposal.finalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Terms & Policies */}
              <div className="pt-6 border-t border-[#E5E7E3] text-[11px] text-[#59655F] space-y-1">
                <p className="font-bold text-[#202522]">Revision & Production Policy:</p>
                <p>{selectedProposal.revisionPolicy}</p>
                <p>{selectedProposal.terms}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
