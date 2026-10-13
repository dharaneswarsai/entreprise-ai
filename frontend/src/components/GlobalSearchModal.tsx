import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Briefcase, CheckSquare, Users, FileText, Video, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { clients, leads, projects, tasks, contentItems, invoices } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedClients = q ? clients.filter(c => c.companyName.toLowerCase().includes(q) || c.contactPerson.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q)) : [];
  const matchedLeads = q ? leads.filter(l => l.companyName.toLowerCase().includes(q) || l.contactPerson.toLowerCase().includes(q) || l.serviceInterested.toLowerCase().includes(q)) : [];
  const matchedProjects = q ? projects.filter(p => p.title.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q)) : [];
  const matchedTasks = q ? tasks.filter(t => t.title.toLowerCase().includes(q) || t.assignedEmployeeName.toLowerCase().includes(q)) : [];
  const matchedContent = q ? contentItems.filter(c => c.title.toLowerCase().includes(q) || c.hook.toLowerCase().includes(q)) : [];
  const matchedInvoices = q ? invoices.filter(i => i.invoiceNumber.toLowerCase().includes(q) || i.clientName.toLowerCase().includes(q)) : [];

  const totalResults = matchedClients.length + matchedLeads.length + matchedProjects.length + matchedTasks.length + matchedContent.length + matchedInvoices.length;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-[#15382B]/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E7E3] overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input */}
        <div className="flex items-center px-5 py-4 border-b border-[#E5E7E3] bg-[#FAF9F6]">
          <Search className="w-5 h-5 text-[#6F8F7D] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search agency OS: clients, leads, projects, tasks, invoices... (Press ESC to close)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none outline-none text-[#202522] placeholder-[#8A9690] text-sm md:text-base font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-stone-400 hover:text-stone-700">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-6">
          {!query && (
            <div className="text-center py-10">
              <p className="text-sm text-[#59655F]">Type to search everything across the agency central brain</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['Sanchari', 'Reel', 'Biryani', 'Overdue', 'Proposal', 'Halloween'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 text-xs rounded-full bg-[#EBF2EE] text-[#1F4D3A] hover:bg-[#D5E4DC] font-medium transition-colors"
                  >
                    "{tag}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="text-center py-12 text-[#8A9690]">
              <p className="text-base font-medium">No results found for "{query}"</p>
              <p className="text-xs mt-1">Try searching by client name, employee, task title, or invoice ID</p>
            </div>
          )}

          {/* Matched Clients */}
          {matchedClients.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F4D3A] uppercase tracking-wider mb-2 px-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Clients ({matchedClients.length})</span>
              </div>
              <div className="space-y-1">
                {matchedClients.map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect('/clients')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF9F6] border border-transparent hover:border-[#E5E7E3] cursor-pointer group transition-all"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#202522]">{c.companyName}</p>
                      <p className="text-xs text-[#59655F]">{c.industry} · {c.contactPerson} · Retainer: ₹{c.monthlyRetainer.toLocaleString()}/mo</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#1F4D3A] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Leads */}
          {matchedLeads.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F4D3A] uppercase tracking-wider mb-2 px-2">
                <Users className="w-3.5 h-3.5" />
                <span>Leads & CRM ({matchedLeads.length})</span>
              </div>
              <div className="space-y-1">
                {matchedLeads.map(l => (
                  <div
                    key={l.id}
                    onClick={() => handleSelect('/leads')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF9F6] border border-transparent hover:border-[#E5E7E3] cursor-pointer group transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#202522]">{l.companyName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-[#1F4D3A] font-bold">Score: {l.leadScore}</span>
                      </div>
                      <p className="text-xs text-[#59655F]">Stage: {l.stage} · Budget: ₹{l.estimatedBudget.toLocaleString()}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#1F4D3A] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Projects */}
          {matchedProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F4D3A] uppercase tracking-wider mb-2 px-2">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Projects ({matchedProjects.length})</span>
              </div>
              <div className="space-y-1">
                {matchedProjects.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect('/projects')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF9F6] border border-transparent hover:border-[#E5E7E3] cursor-pointer group transition-all"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#202522]">{p.title}</p>
                      <p className="text-xs text-[#59655F]">{p.clientName} · Status: {p.status} ({p.progressPercent}%)</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#1F4D3A] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Tasks */}
          {matchedTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F4D3A] uppercase tracking-wider mb-2 px-2">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Tasks ({matchedTasks.length})</span>
              </div>
              <div className="space-y-1">
                {matchedTasks.map(t => (
                  <div
                    key={t.id}
                    onClick={() => handleSelect('/tasks')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF9F6] border border-transparent hover:border-[#E5E7E3] cursor-pointer group transition-all"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#202522]">{t.title}</p>
                      <p className="text-xs text-[#59655F]">{t.clientName} · Assigned to: {t.assignedEmployeeName} · Deadline: {t.deadline}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#1F4D3A] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Content */}
          {matchedContent.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F4D3A] uppercase tracking-wider mb-2 px-2">
                <Video className="w-3.5 h-3.5" />
                <span>Content & Creative ({matchedContent.length})</span>
              </div>
              <div className="space-y-1">
                {matchedContent.map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect('/content')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF9F6] border border-transparent hover:border-[#E5E7E3] cursor-pointer group transition-all"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#202522]">{c.title} [{c.contentType}]</p>
                      <p className="text-xs text-[#59655F]">{c.clientName} · Status: {c.status} · Target: {c.publishDate}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#1F4D3A] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Invoices */}
          {matchedInvoices.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F4D3A] uppercase tracking-wider mb-2 px-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Invoices ({matchedInvoices.length})</span>
              </div>
              <div className="space-y-1">
                {matchedInvoices.map(inv => (
                  <div
                    key={inv.id}
                    onClick={() => handleSelect('/invoices')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF9F6] border border-transparent hover:border-[#E5E7E3] cursor-pointer group transition-all"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#202522]">{inv.invoiceNumber} — {inv.clientName}</p>
                      <p className="text-xs text-[#59655F]">Total: ₹{inv.total.toLocaleString()} · Status: {inv.status} · Due: {inv.dueDate}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#1F4D3A] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
