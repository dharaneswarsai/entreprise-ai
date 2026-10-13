import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Receipt,
  Plus,
  Printer,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  X
} from 'lucide-react';
import { Invoice, InvoiceStatus } from '../types';
import { StatusBadge } from '../components/ui/Badge';

export const Invoices: React.FC = () => {
  const { invoices, updateInvoiceStatus, addInvoice, clients, projects } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  // New Invoice Form
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [description, setDescription] = useState('Monthly Retainer Fee');
  const [amount, setAmount] = useState('75000');
  const [dueDate, setNextDueDate] = useState(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const c = clients.find(cl => cl.id === clientId) || clients[0];
    const sub = Number(amount) || 0;
    const tax = Math.round(sub * 0.18);
    const total = sub + tax;

    addInvoice({
      clientId: c.id,
      clientName: c.companyName,
      items: [{ id: '1', description, amount: sub, quantity: 1 }],
      subtotal: sub,
      tax,
      discount: 0,
      total,
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'Sent',
      amountPaid: 0
    });
    setIsBuilderOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Client Invoicing System</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              {invoices.length} Invoices
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            GST compliance invoicing: Advance billing, overdue tracking, printable tax invoices, and payment receipts
          </p>
        </div>

        <button
          onClick={() => setIsBuilderOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Invoice</span>
        </button>
      </div>

      {/* Invoices Table */}
      <div className="agency-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F6] border-b border-[#E5E7E3] text-[#15382B]">
              <tr>
                <th className="p-3 font-bold">Invoice #</th>
                <th className="p-3 font-bold">Client Company</th>
                <th className="p-3 font-bold">Issued Date</th>
                <th className="p-3 font-bold">Due Date</th>
                <th className="p-3 font-bold text-right">Total (INR)</th>
                <th className="p-3 font-bold text-center">Status</th>
                <th className="p-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7E3]">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="p-3 font-mono font-bold text-[#1F4D3A]">{inv.invoiceNumber}</td>
                  <td className="p-3 font-semibold text-[#202522]">{inv.clientName}</td>
                  <td className="p-3 text-[#59655F]">{inv.issuedDate}</td>
                  <td className="p-3 font-mono text-[#8A9690]">{inv.dueDate}</td>
                  <td className="p-3 font-mono font-bold text-right text-[#202522]">₹{inv.total.toLocaleString()}</td>
                  <td className="p-3 text-center"><StatusBadge status={inv.status} /></td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setIsPreviewOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-[#E5E7E3] hover:bg-stone-100 text-xs font-semibold text-[#202522] flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>

                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => updateInvoiceStatus(inv.id, 'Paid')}
                          className="px-2.5 py-1 rounded-lg bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVOICE BUILDER MODAL */}
      {isBuilderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#15382B]/40 backdrop-blur-sm" onClick={() => setIsBuilderOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#E5E7E3] z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7E3]">
              <h3 className="text-base font-bold text-[#15382B]">Create New Invoice</h3>
              <button onClick={() => setIsBuilderOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#202522] mb-1">Client *</label>
                <select
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none bg-white"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#202522] mb-1">Service / Description *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#202522] mb-1">Base Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#202522] mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setNextDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E7E3]">
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-[#E5E7E3] text-[#59655F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#1F4D3A] text-white font-semibold hover:bg-[#15382B]"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE INVOICE MODAL */}
      {isPreviewOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-[#15382B]/60 backdrop-blur-sm" onClick={() => setIsPreviewOpen(false)} />
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E5E7E3] z-10 overflow-hidden my-8 p-8 sm:p-12 space-y-8">
            <div className="flex items-center justify-between no-print pb-4 border-b border-[#E5E7E3]">
              <span className="text-xs font-mono font-bold text-[#1F4D3A] px-2 py-0.5 rounded bg-[#EBF2EE]">
                TAX INVOICE · {selectedInvoice.invoiceNumber}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button onClick={() => setIsPreviewOpen(false)} className="p-2 text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-8 text-[#202522]">
              <div className="flex items-start justify-between pb-6 border-b-2 border-[#1F4D3A]">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#15382B]">ENTREPRISE AI</h2>
                  <p className="text-xs text-[#59655F]">Creative & Digital Operations Private Limited</p>
                  <p className="text-[11px] text-[#8A9690]">GSTIN: 33AAACE9840M1Z5 · Chennai & Bangalore</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono uppercase font-bold text-[#8A9690]">Tax Invoice</span>
                  <p className="text-xl font-bold font-mono text-[#15382B]">{selectedInvoice.invoiceNumber}</p>
                  <p className="text-xs text-[#59655F]">Date: {selectedInvoice.issuedDate}</p>
                  <p className="text-xs text-amber-800">Due: {selectedInvoice.dueDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8A9690] block mb-1">Billed To:</span>
                  <p className="text-sm font-bold text-[#15382B]">{selectedInvoice.clientName}</p>
                  <p className="text-[#59655F]">Attn: Accounts Department</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#8A9690] block mb-1">Payment Status:</span>
                  <StatusBadge status={selectedInvoice.status} />
                </div>
              </div>

              <table className="w-full text-left text-xs border border-[#E5E7E3] rounded-xl overflow-hidden">
                <thead className="bg-[#FAF9F6] border-b border-[#E5E7E3] text-[#15382B]">
                  <tr>
                    <th className="p-3 font-bold">Item Description</th>
                    <th className="p-3 font-bold text-center">Qty</th>
                    <th className="p-3 font-bold text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7E3]">
                  {selectedInvoice.items.map(i => (
                    <tr key={i.id}>
                      <td className="p-3 font-medium text-[#202522]">{i.description}</td>
                      <td className="p-3 text-center">{i.quantity}</td>
                      <td className="p-3 font-mono font-bold text-right text-[#202522]">₹{i.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-[#59655F]">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{selectedInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#59655F]">
                    <span>GST (18%):</span>
                    <span className="font-mono">₹{selectedInvoice.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-[#1F4D3A] text-sm font-bold text-[#15382B]">
                    <span>Total Amount:</span>
                    <span className="font-mono text-base">₹{selectedInvoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E5E7E3] text-[11px] text-[#59655F] space-y-1">
                <p className="font-bold text-[#202522]">Bank Transfer Details:</p>
                <p>Bank: HDFC Bank · Account: 5020008492019 · IFSC: HDFC0001234</p>
                <p>Beneficiary: Entreprise AI Operations Agency</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
