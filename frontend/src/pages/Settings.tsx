import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  RotateCcw,
  Bell,
  Cpu,
  Building,
  CheckCircle2,
  AlertTriangle,
  User,
  Database
} from 'lucide-react';
import { SupabaseModal } from '../components/SupabaseModal';

export const Settings: React.FC = () => {
  const { automationRules, resetDemoData } = useApp();
  const { currentUser, updateCurrentUserProfile } = useAuth();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+1 (555) 019-2834');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({ name, email, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to restore the initial demo state? All local modifications will be reset to factory defaults.')) {
      resetDemoData();
      alert('Demo data has been cleanly reset to default seed!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Agency OS Settings</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              Configuration
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Security policies, automation rule execution, employee profile preferences, and demo data management
          </p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="agency-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-2xl object-cover border" />
          <div>
            <h3 className="text-sm font-bold text-[#202522]">My Employee Profile</h3>
            <p className="text-xs text-[#59655F]">{currentUser.title} · {currentUser.role} Role</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#202522] mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202522] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202522] mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
              </span>
            ) : <span />}
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white font-semibold hover:bg-[#15382B] shadow-xs"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Active Automations Engine Monitor per spec #35 */}
      <div className="agency-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#202522]">Autonomous Agency Automation Engine</h3>
            <p className="text-xs text-[#59655F]">Background event-driven rules running live inside Entreprise AI OS</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 px-2 py-0.5 rounded bg-emerald-50">
            {automationRules.filter(r => r.enabled).length} Rules Active
          </span>
        </div>

        <div className="space-y-3">
          {automationRules.map(rule => (
            <div key={rule.id} className="p-4 rounded-xl border border-[#E5E7E3] bg-[#FAF9F6] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#15382B]">TRIGGER: {rule.trigger}</span>
                <span className="text-[10px] text-[#8A9690]">Last Fired: {rule.lastFired}</span>
              </div>
              <p className="text-[#59655F]">Condition: {rule.condition}</p>
              <div className="space-y-1 pt-1 border-t border-black/5">
                <span className="font-bold text-[10px] uppercase text-[#8A9690]">Automated Actions:</span>
                {(rule.actions || (rule.action ? [rule.action] : [])).map((act: string, i: number) => (
                  <div key={i} className="flex items-center gap-1.5 text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supabase Database Connection Card */}
      <div className="agency-card p-6 border-emerald-200 bg-emerald-50/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-950">
            <Database className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold">Supabase PostgreSQL Cloud Database</h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            Multi-Tenant RLS
          </span>
        </div>
        <p className="text-xs text-[#59655F] leading-relaxed">
          Configure real-time Supabase cloud persistence for cross-device synchronization, Row-Level Security, automated backups, and scalable PostgreSQL performance.
        </p>
        <button
          onClick={() => setIsSupabaseModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Open Supabase Database Console &amp; Setup</span>
        </button>
      </div>

      {/* Demo Data Management per spec #55 */}
      <div className="agency-card p-6 border-red-200 bg-red-50/10 space-y-3">
        <div className="flex items-center gap-2 text-red-900">
          <AlertTriangle className="w-5 h-5 text-red-700" />
          <h3 className="text-sm font-bold">Demo Data Control Center</h3>
        </div>
        <p className="text-xs text-[#59655F] leading-relaxed">
          Entreprise AI OS comes pre-seeded with realistic production data for <em>Sanchari Trails</em>, <em>Murugan Family Restaurant</em>, <em>Boba Cub</em>, and <em>Artisan Home Interiors</em>. You can reset the local database back to its pristine factory state at any time.
        </p>
        <button
          onClick={handleResetData}
          className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Agency Demo Data</span>
        </button>
      </div>

      <SupabaseModal isOpen={isSupabaseModalOpen} onClose={() => setIsSupabaseModalOpen(false)} />
    </div>
  );
};
