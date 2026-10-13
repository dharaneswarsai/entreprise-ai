import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Phone,
  Mail,
  Share2,
  Users,
  Building2,
  Calendar,
  Send,
  Plus,
  Clock,
  Sparkles
} from 'lucide-react';
import { Communication, CommunicationChannel } from '../types';

export const Communications: React.FC = () => {
  const { communications, addCommunication, clients, leads } = useApp();
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // New Communication Form
  const [entityType, setEntityType] = useState<'CLIENT' | 'LEAD'>('CLIENT');
  const [entityId, setEntityId] = useState(clients[0]?.id || '');
  const [channel, setChannel] = useState<CommunicationChannel>('WhatsApp');
  const [summary, setSummary] = useState('');
  const [details, setDetails] = useState('');

  const filteredComms = communications.filter(c => {
    if (channelFilter === 'ALL') return true;
    return c.channel === channelFilter;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary) return;

    const entityName = entityType === 'CLIENT'
      ? (clients.find(c => c.id === entityId)?.companyName || 'Client')
      : (leads.find(l => l.id === entityId)?.companyName || 'Lead');

    addCommunication({
      entityType,
      entityId,
      entityName,
      channel,
      direction: 'OUTBOUND',
      authorName: 'Agency Team',
      summary,
      details
    });

    setSummary('');
    setDetails('');
    setIsLogModalOpen(false);
  };

  const getChannelIcon = (ch: CommunicationChannel) => {
    switch (ch) {
      case 'WhatsApp': return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'Email': return <Mail className="w-4 h-4 text-blue-600" />;
      case 'Instagram': return <Share2 className="w-4 h-4 text-pink-600" />;
      case 'Call': return <Phone className="w-4 h-4 text-amber-600" />;
      case 'Meeting': return <Calendar className="w-4 h-4 text-purple-600" />;
      default: return <MessageSquare className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7E3]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15382B]">Omnichannel Communications Hub</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3A] font-bold">
              Timeline Feed
            </span>
          </div>
          <p className="text-xs text-[#59655F] mt-0.5">
            Single activity stream: WhatsApp notes, emails, phone updates, meeting summaries, and client feedback
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Activity / Message</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="agency-card p-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-[#59655F] font-semibold">Filter Channel:</span>
        {['ALL', 'WhatsApp', 'Email', 'Call', 'Meeting', 'Instagram'].map(ch => (
          <button
            key={ch}
            onClick={() => setChannelFilter(ch)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              channelFilter === ch
                ? 'bg-[#1F4D3A] text-white'
                : 'bg-[#FAF9F6] text-[#59655F] hover:bg-stone-100'
            }`}
          >
            {ch}
          </button>
        ))}
      </div>

      {/* Chronological Activity Feed per spec #10 */}
      <div className="agency-card p-6 space-y-6">
        <h3 className="text-xs font-bold text-[#202522] uppercase tracking-wider">
          Chronological Communications Timeline ({filteredComms.length})
        </h3>

        <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E5E7E3]">
          {filteredComms.map((comm, idx) => (
            <div key={comm.id} className="relative flex items-start gap-4 pl-1">
              <div className="w-7 h-7 rounded-full bg-white border border-[#E5E7E3] flex items-center justify-center shrink-0 z-10 shadow-2xs">
                {getChannelIcon(comm.channel)}
              </div>

              <div className="flex-1 p-4 rounded-xl border border-[#E5E7E3] bg-[#FAF9F6] space-y-1.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#15382B]">{comm.entityName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-stone-600 border border-stone-200">
                      {comm.entityType}
                    </span>
                    <span className="text-[#8A9690]">via {comm.channel}</span>
                  </div>
                  <span className="font-mono text-[#8A9690]">{comm.date}</span>
                </div>

                <p className="font-semibold text-[#202522] text-sm leading-snug">{comm.summary}</p>
                {comm.details && (
                  <p className="text-[#59655F] leading-relaxed pt-1 border-t border-black/5">
                    {comm.details}
                  </p>
                )}

                <div className="text-[10px] text-[#8A9690] pt-1">
                  Logged by: <strong>{comm.authorName}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOG MODAL */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#15382B]/40 backdrop-blur-sm" onClick={() => setIsLogModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#E5E7E3] z-10 space-y-4">
            <h3 className="text-base font-bold text-[#15382B]">Log Communication Activity</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#202522] mb-1">Entity Type</label>
                  <select
                    value={entityType}
                    onChange={e => {
                      const t = e.target.value as any;
                      setEntityType(t);
                      setEntityId(t === 'CLIENT' ? (clients[0]?.id || '') : (leads[0]?.id || ''));
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] bg-white"
                  >
                    <option value="CLIENT">Client</option>
                    <option value="LEAD">Lead</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#202522] mb-1">Channel</label>
                  <select
                    value={channel}
                    onChange={e => setChannel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] bg-white"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                    <option value="Call">Call</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Instagram">Instagram DM</option>
                    <option value="Internal Note">Internal Note</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#202522] mb-1">Target Account *</label>
                <select
                  value={entityId}
                  onChange={e => setEntityId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] bg-white"
                >
                  {entityType === 'CLIENT'
                    ? clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)
                    : leads.map(l => <option key={l.id} value={l.id}>{l.companyName}</option>)
                  }
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#202522] mb-1">Summary Headline *</label>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  placeholder="e.g. Founder called confirming Diwali festival shoot date"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#202522] mb-1">Detailed Discussion Notes</label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder="Specific requirements, next steps, or link to file..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E7E3]">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-[#E5E7E3] text-[#59655F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#1F4D3A] text-white font-semibold hover:bg-[#15382B]"
                >
                  Save to Timeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
