import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Building2,
  Calendar,
  X
} from 'lucide-react';
import { Expense, ExpenseCategory } from '../types';

export const Finance: React.FC = () => {
  const { invoices, expenses, addExpense, clients, projects } = useApp();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // New expense form
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('Software');
  const [expenseAmount, setExpenseAmount] = useState('15000');
  const [paidTo, setPaidTo] = useState('Vendor');

  // Master Financial Equations per spec #28:
  // Revenue - Expenses = Profit
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + b.amountPaid, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'Sent' || i.status === 'Partially Paid').reduce((a, b) => a + (b.total - b.amountPaid), 0);
  const overdueRevenue = invoices.filter(i => i.status === 'Overdue').reduce((a, b) => a + (b.total - b.amountPaid), 0);
  const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  // Expense breakdown by category
  const categories: ExpenseCategory[] = ['Software', 'Salaries', 'Freelancers', 'Advertising', 'Equipment', 'Travel', 'Production', 'Office'];
  const categoryTotals = categories.map(cat => ({
    category: cat,
    amount: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  })).filter(c => c.amount > 0);

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;

    addExpense({
      title: expenseTitle,
      category: expenseCategory,
      amount: Number(expenseAmount) || 0,
      date: new Date().toISOString().split('T')[0],
      paidTo: paidTo || 'Vendor'
    });

    setExpenseTitle('');
    setIsExpenseModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Agency Financial Dashboard</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#1F4D3A] font-bold">
              P&L Overview
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Executive fiscal command: Revenue − Operating Expenses = Net Agency Profit
          </p>
        </div>

        <button
          onClick={() => setIsExpenseModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Primary Financial Overview Grid per spec #28 & #29 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Realized Revenue */}
        <div className="agency-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#59655F]">Realized Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1F4D3A] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-[#15382B]">₹{totalRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-[#8A9690] block">Gross paid client invoices</span>
        </div>

        {/* Total Expenses */}
        <div className="agency-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#59655F]">Operating Expenses</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-[#202522] flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-red-900">₹{totalExpenses.toLocaleString()}</p>
          <span className="text-[11px] text-[#8A9690] block">Software, gear, rentals & payroll</span>
        </div>

        {/* Net Profit */}
        <div className="agency-card p-5 space-y-2 bg-[#EBF2EE]/30 border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1F4D3A]">Net Operating Profit</span>
            <div className="w-8 h-8 rounded-lg bg-[#1F4D3A] text-white flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-300" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-[#15382B]">₹{netProfit.toLocaleString()}</p>
          <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800">
            <span>Profit Margin:</span>
            <span>{profitMargin}%</span>
          </div>
        </div>

        {/* Pending & Overdue */}
        <div className="agency-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#59655F]">Outstanding Receivables</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-amber-900">₹{pendingRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-red-700 font-semibold block">Overdue: ₹{overdueRevenue.toLocaleString()}</span>
        </div>
      </div>

      {/* Main Grid: Client-wise Revenue Breakdown & Expense Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client-wise Revenue & Contracts */}
        <div className="agency-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#202522]">Client Revenue Contribution</h3>
          <div className="space-y-3">
            {clients.map(c => {
              const clientInvs = invoices.filter(i => i.clientId === c.id);
              const clientPaid = clientInvs.reduce((a, b) => a + b.amountPaid, 0);

              return (
                <div key={c.id} className="p-3.5 rounded-xl border border-[#E5E7E3] bg-[#FAF9F6] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#202522]">{c.companyName}</span>
                    <span className="text-xs font-mono font-bold text-[#1F4D3A]">
                      Retainer: ₹{c.monthlyRetainer.toLocaleString()}/mo
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#59655F]">
                    <span>Realized Billing: ₹{clientPaid.toLocaleString()}</span>
                    <span>Annual Contract: ₹{c.contractValue.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operating Expenses Log */}
        <div className="agency-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#202522]">Operating Expenses ({expenses.length})</h3>
            <span className="text-xs font-mono font-bold text-red-800">
              Total: ₹{totalExpenses.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto">
            {expenses.map(exp => (
              <div
                key={exp.id}
                className="p-3 rounded-xl border border-[#E5E7E3] bg-white flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#202522]">{exp.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-semibold">
                      {exp.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8A9690] mt-0.5">Paid to: {exp.paidTo} · {exp.date}</p>
                </div>
                <span className="font-mono font-bold text-red-900 text-sm">
                  - ₹{exp.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECORD EXPENSE MODAL */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#15382B]/40 backdrop-blur-sm" onClick={() => setIsExpenseModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#E5E7E3] z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7E3]">
              <h3 className="text-base font-bold text-[#15382B]">Log Agency Expense</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#202522] mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  value={expenseTitle}
                  onChange={e => setExpenseTitle(e.target.value)}
                  placeholder="e.g. Cinema Camera Rental, Adobe Seats, Freelancer"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#202522] mb-1">Category</label>
                  <select
                    value={expenseCategory}
                    onChange={e => setExpenseCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none bg-white"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#202522] mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={expenseAmount}
                    onChange={e => setExpenseAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#202522] mb-1">Paid To / Vendor</label>
                <input
                  type="text"
                  value={paidTo}
                  onChange={e => setPaidTo(e.target.value)}
                  placeholder="e.g. CineRentals or Adobe Systems"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E7E3]">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-[#E5E7E3] text-[#59655F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#1F4D3A] text-white font-semibold hover:bg-[#15382B]"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
