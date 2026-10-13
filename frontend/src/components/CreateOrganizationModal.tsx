import React, { useState } from 'react';
import {
  Building2,
  X,
  User,
  Mail,
  Shield,
  Layers,
  Sparkles,
  Check,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_PRESETS = [
  { name: 'Emerald', hex: '#0F4C3A' },
  { name: 'Indigo', hex: '#312E81' },
  { name: 'Violet', hex: '#581C87' },
  { name: 'Amber', hex: '#B45309' },
  { name: 'Crimson', hex: '#991B1B' },
  { name: 'Teal', hex: '#0F766E' },
  { name: 'Navy', hex: '#1E3A8A' },
];

export const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createNewOrganization } = useAuth();
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Enterprise AI & Automation');
  const [plan, setPlan] = useState('Enterprise Cloud Tier');
  const [selectedColor, setSelectedColor] = useState('#0F4C3A');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminTitle, setAdminTitle] = useState('Founder & CEO');
  const [departmentName, setDepartmentName] = useState('Executive Operations');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter an organization name.');
      return;
    }
    if (!adminName.trim()) {
      setError('Please enter the owner full name.');
      return;
    }
    if (!adminEmail.trim()) {
      setError('Please enter the owner work email.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createNewOrganization({
        name: name.trim(),
        industry,
        plan,
        color: selectedColor,
        tagline: `${industry} Enterprise Hub`,
        admin: {
          fullName: adminName.trim(),
          email: adminEmail.trim(),
          role: 'OWNER',
          title: adminTitle.trim() || 'Founder & CEO',
          departmentName: departmentName.trim() || 'Executive Operations',
        },
      });

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to provision organization.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Create Enterprise Organization</h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Provision a new business workspace on Supabase &amp; login as its owner
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold">
              {error}
            </div>
          )}

          {/* Section 1: Business Profile */}
          <div className="space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-stone-500" />
              Organization Details
            </h3>

            <div>
              <label className="block font-bold text-stone-900 mb-1">Organization Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Zenith Quantum Labs, AeroSpace Dynamics"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 font-medium focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-900 mb-1">Industry / Category</label>
                <input
                  type="text"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  placeholder="e.g. Robotics, Life Sciences, FinTech"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 outline-none focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-900 mb-1">Subscription Tier</label>
                <select
                  value={plan}
                  onChange={e => setPlan(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 outline-none focus:border-emerald-600 transition bg-white"
                >
                  <option value="Enterprise Cloud Tier">Enterprise Cloud Tier</option>
                  <option value="Agency Studio Pro">Agency Studio Pro</option>
                  <option value="Global Operations SaaS">Global Operations SaaS</option>
                  <option value="Institutional Tier">Institutional Tier</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-900 mb-1.5">Workspace Brand Color</label>
              <div className="flex items-center gap-2">
                {COLOR_PRESETS.map(preset => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => setSelectedColor(preset.hex)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition border-2"
                    style={{
                      backgroundColor: preset.hex,
                      borderColor: selectedColor === preset.hex ? '#000' : 'transparent',
                    }}
                    title={preset.name}
                  >
                    {selectedColor === preset.hex && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-4 space-y-3.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-500" />
              Initial Owner &amp; Login Person
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-900 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={e => setAdminName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Lin"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 font-medium outline-none focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-900 mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  placeholder="e.g. sarah@zenithquantum.io"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 outline-none focus:border-emerald-600 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-900 mb-1">Job Title</label>
                <input
                  type="text"
                  value={adminTitle}
                  onChange={e => setAdminTitle(e.target.value)}
                  placeholder="e.g. Chief Executive Officer &amp; Founder"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 outline-none focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-900 mb-1">Primary Department</label>
                <input
                  type="text"
                  value={departmentName}
                  onChange={e => setDepartmentName(e.target.value)}
                  placeholder="e.g. Research &amp; Operations"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 outline-none focus:border-emerald-600 transition"
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2.5 text-[11px]">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Upon creation, this organization will be saved in your <strong>Supabase PostgreSQL</strong> database with starter departments, projects, and tasks. You will immediately be switched to this workspace as <strong>{adminName || 'the new owner'}</strong>.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#15382B] text-white font-bold transition flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isSubmitting ? 'Provisioning...' : `Create Organization & Login as ${adminName ? adminName.split(' ')[0] : 'Owner'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
