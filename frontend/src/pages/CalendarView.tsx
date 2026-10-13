import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  CheckSquare,
  DollarSign,
  PhoneCall,
  Sparkles,
  Layers
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { tasks, contentItems, invoices, calls, projects } = useApp();
  const [currentMonth, setCurrentMonth] = useState('October 2026');
  const [filterType, setFilterType] = useState('ALL');

  // October 2026 calendar days simulation (Oct 1 to Oct 31, starts on Thursday)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Map events to day
  const getEventsForDay = (day: number) => {
    const dayStr = `2026-10-${String(day).padStart(2, '0')}`;

    const dayTasks = tasks.filter(t => t.deadline === dayStr).map(t => ({
      type: 'TASK',
      title: t.title,
      client: t.clientName,
      color: 'bg-emerald-100 text-[#1F4D3A] border-emerald-300'
    }));

    const dayContent = contentItems.filter(c => c.publishDate === dayStr).map(c => ({
      type: 'CONTENT',
      title: `${c.contentType}: ${c.title}`,
      client: c.clientName,
      color: 'bg-blue-100 text-blue-900 border-blue-300'
    }));

    const dayInvoices = invoices.filter(i => i.dueDate === dayStr).map(i => ({
      type: 'INVOICE',
      title: `Due: ${i.invoiceNumber} (₹${(i.total - i.amountPaid).toLocaleString()})`,
      client: i.clientName,
      color: 'bg-amber-100 text-amber-900 border-amber-300'
    }));

    const all = [...dayTasks, ...dayContent, ...dayInvoices];
    if (filterType === 'ALL') return all;
    return all.filter(e => e.type === filterType);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Unified Agency Calendar</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              October 2026
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Synchronized master timeline: Task deadlines, shoot schedules, content publishing drops, and invoice due dates
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {['ALL', 'TASK', 'CONTENT', 'INVOICE'].map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filterType === f
                  ? 'bg-[#1F4D3A] text-white shadow-xs'
                  : 'bg-white border border-[#E5E7E3] text-[#59655F] hover:bg-[#FAF9F6]'
              }`}
            >
              {f === 'ALL' ? 'All Schedules' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Month Grid */}
      <div className="agency-card overflow-hidden">
        {/* Month Navigation */}
        <div className="p-4 border-b border-[#E5E7E3] bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-[#15382B]">{currentMonth}</h3>
            <span className="text-xs text-[#8A9690]">31 Days</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-[#E5E7E3] text-[#59655F] hover:bg-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg border border-[#E5E7E3] text-[#59655F] hover:bg-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-[#E5E7E3] bg-stone-50 text-center text-xs font-bold text-[#59655F] py-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Day Cells Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-[#E5E7E3] bg-white">
          {/* Empty offset for Oct 1 (starts on Thursday = 4 empty cells) */}
          <div className="h-32 bg-[#FAF9F6]/40 p-2" />
          <div className="h-32 bg-[#FAF9F6]/40 p-2" />
          <div className="h-32 bg-[#FAF9F6]/40 p-2" />
          <div className="h-32 bg-[#FAF9F6]/40 p-2" />

          {daysInMonth.map(day => {
            const events = getEventsForDay(day);
            const isToday = day === 13;

            return (
              <div
                key={day}
                className={`min-h-[120px] p-2 transition-colors hover:bg-[#FAF9F6] ${
                  isToday ? 'bg-emerald-50/20 ring-1 ring-inset ring-[#1F4D3A]/30' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      isToday
                        ? 'bg-[#1F4D3A] text-white shadow-xs'
                        : 'text-[#202522]'
                    }`}
                  >
                    {day}
                  </span>
                  {events.length > 0 && (
                    <span className="text-[10px] font-mono font-bold text-[#8A9690]">
                      {events.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[85px]">
                  {events.map((evt, idx) => (
                    <div
                      key={idx}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium border truncate ${evt.color}`}
                      title={`${evt.title} (${evt.client})`}
                    >
                      {evt.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
