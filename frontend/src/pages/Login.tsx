import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  Building2,
  Users,
  CheckCircle2,
  Sparkles,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { ENTERPRISE_BUSINESSES, EnterpriseBusiness } from '../services/enterpriseTenants';

export const Login: React.FC = () => {
  const { switchBusiness, switchUser } = useAuth();
  const navigate = useNavigate();

  const [selectedBiz, setSelectedBiz] = useState<EnterpriseBusiness>(ENTERPRISE_BUSINESSES[0]);
  const [email, setEmail] = useState(selectedBiz.employees[0].email);
  const [password, setPassword] = useState(selectedBiz.employees[0].passwordHint);
  const [activeTab, setActiveTab] = useState<'quick' | 'form'>('quick');

  const handleSelectBusiness = (biz: EnterpriseBusiness) => {
    setSelectedBiz(biz);
    setEmail(biz.employees[0].email);
    setPassword(biz.employees[0].passwordHint);
  };

  const handle1ClickLogin = (bizId: string, userId: string) => {
    switchBusiness(bizId);
    switchUser(userId);
    navigate('/command-center');
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Search across all businesses for this email
    for (const b of ENTERPRISE_BUSINESSES) {
      const found = b.employees.find(emp => emp.email.toLowerCase() === email.toLowerCase());
      if (found) {
        switchBusiness(b.id);
        switchUser(found.id);
        navigate('/command-center');
        return;
      }
    }
    // Default fallback to selected business owner
    switchBusiness(selectedBiz.id);
    switchUser(selectedBiz.employees[0].id);
    navigate('/command-center');
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center space-y-2 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#0F4C3A] text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-lg border border-emerald-600/30">
          E
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#15382B]">
          Entreprise AI OS
        </h1>
        <p className="text-sm text-stone-600 max-w-lg mx-auto">
          Multi-Tenant AI-Powered Enterprise Operations SaaS Platform.
          Select an enterprise workspace or sign in as any team member.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Business Tabs (5 Diverse Enterprises) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#0F4C3A]" />
                Select Enterprise Business Workspace (5 Live Multi-Tenants):
              </span>
              <span className="text-xs text-stone-500 font-mono">Isolated Data &amp; Security</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {ENTERPRISE_BUSINESSES.map(biz => {
                const isSelected = selectedBiz.id === biz.id;
                return (
                  <button
                    key={biz.id}
                    onClick={() => handleSelectBusiness(biz)}
                    className={`flex flex-col p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#0F4C3A] bg-emerald-50/70 ring-2 ring-[#0F4C3A]/20 shadow-sm'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/80 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <div
                        className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow-2xs"
                        style={{ backgroundColor: biz.color }}
                      >
                        {biz.logoLetter}
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0F4C3A]" />}
                    </div>
                    <div className="font-bold text-stone-900 text-xs truncate leading-snug">
                      {biz.name}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate mt-0.5">
                      {biz.industry.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Business Info Banner */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-stone-900 text-base">{selectedBiz.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0F4C3A] text-white">
                  {selectedBiz.plan}
                </span>
              </div>
              <p className="text-xs text-stone-600">{selectedBiz.tagline}</p>
            </div>
            <div className="text-xs text-stone-500 font-mono bg-white px-3 py-1.5 rounded-xl border border-stone-200 shrink-0">
              Tenant ID: <strong>{selectedBiz.id}</strong>
            </div>
          </div>

          {/* Toggle between 1-Click Roster and Credentials Form */}
          <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
            <button
              onClick={() => setActiveTab('quick')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'quick'
                  ? 'bg-[#0F4C3A] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              1-Click Employee Sign-In (4 Roster Personas)
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'form'
                  ? 'bg-[#0F4C3A] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Corporate Email &amp; Password Login
            </button>
          </div>

          {/* TAB 1: 1-Click Employee Roster Login */}
          {activeTab === 'quick' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedBiz.employees.map(emp => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200 hover:border-[#0F4C3A] hover:bg-emerald-50/30 transition group bg-white shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-11 h-11 rounded-xl object-cover border border-stone-200 shadow-2xs shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-stone-900 text-xs truncate">{emp.name}</p>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold font-mono uppercase ${
                              emp.role === 'OWNER'
                                ? 'bg-amber-100 text-amber-800'
                                : emp.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-800'
                                : emp.role === 'MANAGER'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {emp.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 truncate">{emp.title}</p>
                        <p className="text-[10px] text-stone-500 font-mono truncate">{emp.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handle1ClickLogin(selectedBiz.id, emp.id)}
                      className="ml-2 px-3 py-1.5 rounded-xl bg-[#0F4C3A] group-hover:bg-[#155e47] text-white text-xs font-semibold shrink-0 shadow-xs flex items-center gap-1 transition"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Standard Corporate Login Form */}
          {activeTab === 'form' && (
            <form onSubmit={handleFormLogin} className="space-y-4 max-w-md mx-auto py-2">
              <div>
                <label className="block font-semibold text-stone-700 text-xs mb-1">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 focus:border-[#0F4C3A] outline-none text-xs bg-stone-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 text-xs mb-1">
                  Password (Demo: any password or {password})
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 focus:border-[#0F4C3A] outline-none text-xs bg-stone-50/50 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#0F4C3A] hover:bg-[#155e47] text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2"
              >
                <span>Authorize &amp; Enter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Credentials Footer */}
          <div className="pt-4 border-t border-stone-200 text-center">
            <p className="text-[11px] text-stone-500">
              Each of the 5 enterprises contains completely isolated real datasets: projects,
              deadlines, overdue tasks, pending approvals, and workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
