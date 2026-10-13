import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Target,
  Sparkles,
  Layers,
  Calendar,
  Building2,
  CheckCircle2,
  Plus,
  BookOpen,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { StrategyDoc } from '../types';

export const Strategies: React.FC = () => {
  const { strategies, clients } = useApp();
  const [selectedClientId, setSelectedClientId] = useState<string>(strategies[0]?.clientId || clients[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'brand' | 'monthly' | 'pillars'>('brand');

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const strategy = strategies.find(s => s.clientId === selectedClientId) || strategies[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Strategy & Growth Planner</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              Brand Positioning & Pillars
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Client brand architecture, content pillar matrices, target audience personas, and monthly deliverable goals
          </p>
        </div>

        {/* Client Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#59655F]">Client:</span>
          <select
            value={selectedClientId}
            onChange={e => setSelectedClientId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E5E7E3] text-xs font-semibold text-[#202522] bg-white outline-none focus:border-[#1F4D3A]"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.companyName}</option>
            ))}
          </select>
        </div>
      </div>

      {strategy ? (
        <div className="space-y-6">
          {/* Strategy Tabs */}
          <div className="flex border-b border-[#E5E7E3] gap-2 overflow-x-auto">
            {[
              { id: 'brand', label: 'Brand Strategy & Identity', icon: Compass },
              { id: 'pillars', label: 'Content Pillars & Angles', icon: Layers },
              { id: 'monthly', label: 'Monthly Deliverable Roadmap', icon: Calendar },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#1F4D3A] text-[#1F4D3A] bg-[#EBF2EE]/40'
                      : 'border-transparent text-[#59655F] hover:text-[#202522]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: BRAND STRATEGY */}
          {activeTab === 'brand' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand Positioning */}
              <div className="agency-card p-6 space-y-3">
                <div className="flex items-center gap-2 text-[#1F4D3A]">
                  <Compass className="w-5 h-5" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Brand Positioning</h3>
                </div>
                <p className="text-xs text-[#202522] leading-relaxed font-medium bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E7E3]">
                  {strategy.brandStrategy.brandPositioning}
                </p>

                <div className="pt-2">
                  <span className="text-[10px] font-bold text-[#8A9690] uppercase tracking-wider block mb-1">
                    Unique Selling Proposition (USP)
                  </span>
                  <p className="text-xs text-[#59655F] leading-relaxed">
                    {strategy.brandStrategy.usp}
                  </p>
                </div>
              </div>

              {/* Target Audience Persona */}
              <div className="agency-card p-6 space-y-3">
                <div className="flex items-center gap-2 text-[#1F4D3A]">
                  <Target className="w-5 h-5" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Target Audience Persona</h3>
                </div>
                <p className="text-xs text-[#202522] leading-relaxed font-medium bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E7E3]">
                  {strategy.brandStrategy.targetAudience}
                </p>

                <div className="pt-2">
                  <span className="text-[10px] font-bold text-[#8A9690] uppercase tracking-wider block mb-1">
                    Brand Voice & Editorial Tone
                  </span>
                  <p className="text-xs text-[#59655F] leading-relaxed">
                    {strategy.brandStrategy.brandVoice}
                  </p>
                </div>
              </div>

              {/* Competitors Matrix */}
              <div className="agency-card p-6 space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#202522] uppercase tracking-wider">
                    Direct Competitors & Market Benchmarks
                  </h3>
                  <span className="text-[10px] text-[#8A9690]">Audited by Brand Team</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {strategy.brandStrategy.competitors.map((comp, idx) => (
                    <div
                      key={idx}
                      className="px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-xs font-bold text-[#202522] flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-stone-400" />
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT PILLARS */}
          {activeTab === 'pillars' && (
            <div className="agency-card p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#202522]">Content Pillar Matrix</h3>
                <p className="text-xs text-[#59655F]">
                  Every reel, carousel, and story produced must anchor back to these core storytelling pillars
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {strategy.brandStrategy.contentPillars.map((pillar, i) => (
                  <div key={i} className="p-4 rounded-xl border border-[#E5E7E3] bg-[#FAF9F6] space-y-2">
                    <span className="text-[10px] font-mono font-bold text-[#1F4D3A] px-2 py-0.5 rounded bg-[#EBF2EE]">
                      Pillar 0{i + 1}
                    </span>
                    <h4 className="text-xs font-bold text-[#202522]">{pillar}</h4>
                    <p className="text-[11px] text-[#59655F] leading-relaxed">
                      Designed to generate viral discovery, build authority, and convert followers to booked participants.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MONTHLY ROADMAP per spec #14 */}
          {activeTab === 'monthly' && (
            <div className="space-y-4">
              {(strategy.monthlyStrategy || []).map((ms: any, idx: number) => (
                <div key={idx} className="agency-card p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E7E3]">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#1F4D3A] uppercase tracking-wider">
                        Monthly Production Blueprint
                      </span>
                      <h3 className="text-lg font-bold text-[#15382B]">{ms.month}</h3>
                    </div>
                    <div className="bg-[#EBF2EE] px-3.5 py-1.5 rounded-xl border border-[#D5E4DC]">
                      <span className="text-[10px] uppercase font-bold text-[#1F4D3A] block">Target Outcome:</span>
                      <p className="text-xs font-bold text-[#15382B]">{ms.revenueGoal}</p>
                    </div>
                  </div>

                  {/* Deliverables Targets */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-center">
                      <span className="text-[10px] uppercase font-bold text-[#8A9690]">Short-Form Reels</span>
                      <p className="text-xl font-bold font-mono text-[#1F4D3A] mt-1">{ms.targetDeliverables?.reels ?? 0}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-center">
                      <span className="text-[10px] uppercase font-bold text-[#8A9690]">Brand Posters</span>
                      <p className="text-xl font-bold font-mono text-[#1F4D3A] mt-1">{ms.targetDeliverables?.posters ?? 0}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-center">
                      <span className="text-[10px] uppercase font-bold text-[#8A9690]">Carousels</span>
                      <p className="text-xl font-bold font-mono text-[#1F4D3A] mt-1">{ms.targetDeliverables?.carousels ?? 0}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E5E7E3] text-center">
                      <span className="text-[10px] uppercase font-bold text-[#8A9690]">Daily Stories</span>
                      <p className="text-xl font-bold font-mono text-[#1F4D3A] mt-1">{ms.targetDeliverables?.stories ?? 0}</p>
                    </div>
                  </div>

                  {/* Campaigns */}
                  <div>
                    <h4 className="text-xs font-bold text-[#202522] uppercase tracking-wider mb-2">Campaign Angles</h4>
                    <div className="flex flex-wrap gap-2">
                      {(ms.campaigns || []).map((camp: any, cIdx: number) => (
                        <span key={cIdx} className="px-3 py-1.5 rounded-xl bg-stone-100 text-xs font-semibold text-[#202522]">
                          ✨ {camp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="agency-card p-12 text-center text-xs text-[#8A9690]">
          No strategy doc found for this client. Create one to establish positioning and content pillars.
        </div>
      )}
    </div>
  );
};
