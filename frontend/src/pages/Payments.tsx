import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  Briefcase
} from 'lucide-react';
import { StatusBadge } from '../components/ui/Badge';

export const Payments: React.FC = () => {
  const { payments, markPaymentPaid } = useApp();

  const totalPaid = payments.filter(p => p.status === 'PAID').reduce((a, b) => a + b.amount, 0);
  const totalPending = payments.filter(p => p.status === 'PENDING').reduce((a, b) => a + b.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'OVERDUE').reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Project Payment Milestones</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              Milestone Tracking
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Advance, milestone, and final delivery tranche tracking across client contracts
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="agency-card p-4">
          <span className="text-xs font-semibold text-[#59655F]">Realized Payments (Paid)</span>
          <p className="text-2xl font-bold font-mono text-emerald-800 mt-1">₹{totalPaid.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-700 block mt-1">Cleared to agency account</span>
        </div>

        <div className="agency-card p-4">
          <span className="text-xs font-semibold text-[#59655F]">Pending Milestones</span>
          <p className="text-2xl font-bold font-mono text-[#202522] mt-1">₹{totalPending.toLocaleString()}</p>
          <span className="text-[10px] text-[#8A9690] block mt-1">Awaiting delivery sign-off</span>
        </div>

        <div className="agency-card p-4 border-red-200 bg-red-50/20">
          <span className="text-xs font-semibold text-red-800">Overdue Milestones</span>
          <p className="text-2xl font-bold font-mono text-red-900 mt-1">₹{totalOverdue.toLocaleString()}</p>
          <span className="text-[10px] text-red-700 block mt-1">Follow-up notification sent</span>
        </div>
      </div>

      {/* Payment Tranches List */}
      <div className="agency-card overflow-hidden">
        <div className="p-4 border-b border-[#E5E7E3] bg-[#FAF9F6]">
          <h3 className="text-xs font-bold text-[#202522] uppercase tracking-wider">
            All Contract Payment Tranches ({payments.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F6] border-b border-[#E5E7E3] text-[#15382B]">
              <tr>
                <th className="p-3 font-bold">Project / Tranche Title</th>
                <th className="p-3 font-bold">Client</th>
                <th className="p-3 font-bold">Due Date</th>
                <th className="p-3 font-bold text-right">Tranche Amount</th>
                <th className="p-3 font-bold text-center">Status</th>
                <th className="p-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7E3]">
              {payments.map(pay => (
                <tr key={pay.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-[#202522]">{pay.title}</p>
                    <p className="text-[10px] text-[#59655F]">{pay.projectName}</p>
                  </td>
                  <td className="p-3 font-semibold text-[#202522]">{pay.clientName}</td>
                  <td className="p-3 font-mono text-[#8A9690]">{pay.dueDate}</td>
                  <td className="p-3 font-mono font-bold text-right text-[#202522]">₹{pay.amount.toLocaleString()}</td>
                  <td className="p-3 text-center"><StatusBadge status={pay.status} /></td>
                  <td className="p-3 text-right">
                    {pay.status !== 'PAID' ? (
                      <button
                        onClick={() => markPaymentPaid(pay.id)}
                        className="px-3 py-1 rounded-lg bg-[#1F4D3A] text-white hover:bg-[#15382B] font-semibold text-xs transition-colors"
                      >
                        Record Payment
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-mono font-semibold">
                        {pay.transactionRef || 'NEFT Cleared'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
