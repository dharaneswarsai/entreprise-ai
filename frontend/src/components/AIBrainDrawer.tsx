import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  X,
  AlertCircle,
  PlusCircle,
  Check,
  Loader2,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

interface AIBrainDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'brain';
  text: string;
  timestamp: string;
  observedFacts?: string[];
  supportingRecords?: Array<{ id: string; type: string; title: string }>;
  risks?: string[];
  recommendedActions?: string[];
  proposedAction?: any;
  actionExecuted?: boolean;
  actionableTasks?: {
    title: string;
    hook: string;
    pillar: string;
    subtasks: { title: string; category: any; employeeId: string; hours: number }[];
  };
}

export const AIBrainDrawer: React.FC<AIBrainDrawerProps> = ({ isOpen, onClose }) => {
  const { askBrain, suggestAiTaskBreakdown, addTask, projects, users } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'brain',
      text: `Hello! I am **Entreprise AI Brain** — your central enterprise operations and intelligence assistant.\n\nI continuously monitor your live database: projects, milestones, overdue work, cross-department handoffs, approvals, and team workload. How can I assist you right now?`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [executingActionId, setExecutingActionId] = useState<string | null>(null);
  const [tasksCreated, setTasksCreated] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickQuestions = [
    'Analyze our current operations and bottlenecks',
    'Which projects are at risk this week?',
    'What tasks are overdue and who owns them?',
    'What should our team prioritize today?',
    'Which approvals are waiting for executive action?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsLoading(true);

    try {
      // 1. Try Backend REST API first
      const backendAiRes = await api.sendAIChat(textToSend);

      if (backendAiRes && backendAiRes.summary) {
        const brainMsg: Message = {
          id: `b-${Date.now()}`,
          sender: 'brain',
          text: backendAiRes.summary,
          observedFacts: backendAiRes.observedFacts,
          supportingRecords: backendAiRes.supportingRecords,
          risks: backendAiRes.risks,
          recommendedActions: backendAiRes.recommendedActions,
          proposedAction: backendAiRes.proposedAction,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, brainMsg]);
        return;
      }
    } catch (err) {
      console.warn('Backend AI chat error, falling back to local engine', err);
    }

    // 2. Creative Agency Task Breakdown check
    if (
      textToSend.toLowerCase().includes('create') &&
      (textToSend.toLowerCase().includes('reel') ||
        textToSend.toLowerCase().includes('task') ||
        textToSend.toLowerCase().includes('campaign'))
    ) {
      const breakdown = suggestAiTaskBreakdown(textToSend);
      setTimeout(() => {
        const brainMsg: Message = {
          id: `b-${Date.now()}`,
          sender: 'brain',
          text: `Here is an AI-generated structured production blueprint for **"${breakdown.title}"**:\n\n**Hook:** ${breakdown.hook}\n**Content Pillar:** ${breakdown.pillar}\n\nI have drafted 4 connected tasks. Click below to confirm and push these directly into the task board.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionableTasks: breakdown,
        };
        setMessages(prev => [...prev, brainMsg]);
        setIsLoading(false);
      }, 500);
      return;
    }

    // 3. Fallback to local AppContext askBrain
    try {
      const res = await askBrain(textToSend);
      const brainMsg: Message = {
        id: `b-${Date.now()}`,
        sender: 'brain',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, brainMsg]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'brain',
          text: 'Encountered an issue reading operations records. Please check the backend connection.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteProposedAction = async (msgId: string, action: any) => {
    setExecutingActionId(action.id);
    try {
      const res = await api.executeAIAction(action);
      if (res && res.success) {
        setMessages(prev =>
          prev.map(m => (m.id === msgId ? { ...m, actionExecuted: true } : m))
        );
      }
    } catch (err) {
      console.error('Failed to execute AI action', err);
    } finally {
      setExecutingActionId(null);
    }
  };

  const handleConfirmAddTasks = (breakdown: NonNullable<Message['actionableTasks']>) => {
    const targetProject = projects[0];
    breakdown.subtasks.forEach(st => {
      const assignee = users.find(u => u.id === st.employeeId) || users[3];
      addTask({
        title: st.title,
        description: `Generated by Entreprise AI Brain for campaign: "${breakdown.title}". Hook: ${breakdown.hook}`,
        projectId: targetProject.id,
        projectName: targetProject.title,
        clientId: targetProject.clientId,
        clientName: targetProject.clientName,
        assignedEmployeeId: assignee.id,
        assignedEmployeeName: assignee.name,
        category: st.category,
        priority: 'HIGH',
        status: 'TODO',
        startDate: new Date().toISOString().split('T')[0],
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimatedHours: st.hours,
        checklist: [{ id: '1', text: 'Draft initial deliverable', completed: false }],
        attachments: [],
      });
    });
    setTasksCreated(breakdown.title);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#15382B]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl border-l border-[#E5E7E3] flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7E3] bg-[#1F4D3A] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Bot className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold tracking-tight text-white">
                  Entreprise AI Brain
                </h3>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live DB
                </span>
              </div>
              <p className="text-xs text-white/70">
                Data-Grounded Enterprise Operations Assistant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick prompt suggestions */}
        <div className="p-3 bg-[#FAF9F6] border-b border-[#E5E7E3] overflow-x-auto">
          <p className="text-[11px] font-semibold text-[#59655F] uppercase tracking-wider mb-1.5 px-1">
            Quick Operations Inquiries
          </p>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="text-xs px-2.5 py-1 rounded-full bg-white hover:bg-[#EBF2EE] border border-[#E5E7E3] hover:border-[#1F4D3A]/30 text-[#202522] font-medium text-left transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#FAF9F6]">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl p-4 text-sm ${
                  m.sender === 'user'
                    ? 'bg-[#1F4D3A] text-white rounded-tr-none'
                    : 'bg-white border border-[#E5E7E3] text-[#202522] shadow-xs rounded-tl-none'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 text-[11px] opacity-70">
                  {m.sender === 'brain' && (
                    <Sparkles className="w-3.5 h-3.5 text-[#1F4D3A]" />
                  )}
                  <span className="font-semibold">
                    {m.sender === 'brain' ? 'Entreprise AI Brain' : 'You'}
                  </span>
                  <span>·</span>
                  <span>{m.timestamp}</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed font-sans">{m.text}</div>

                {/* Grounded Observed Facts */}
                {m.observedFacts && m.observedFacts.length > 0 && (
                  <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1.5">
                    <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Observed Database Facts:
                    </div>
                    {m.observedFacts.map((fact, idx) => (
                      <div key={idx} className="text-xs text-stone-700 flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span>{fact}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Grounded Supporting Records */}
                {m.supportingRecords && m.supportingRecords.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-semibold text-stone-600 uppercase">Records:</span>
                    {m.supportingRecords.map((rec, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-stone-700 border border-stone-200"
                      >
                        [{rec.type.toUpperCase()}] {rec.id}
                      </span>
                    ))}
                  </div>
                )}

                {/* Grounded Risks & Recommendations */}
                {m.risks && m.risks.length > 0 && (
                  <div className="mt-2.5 p-2.5 bg-rose-50/70 border border-rose-200/70 rounded-xl text-xs text-rose-800 space-y-1">
                    <div className="font-bold flex items-center gap-1 text-[11px]">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                      Identified Operational Risk:
                    </div>
                    {m.risks.map((risk, idx) => (
                      <p key={idx} className="text-[11px] leading-snug">{risk}</p>
                    ))}
                  </div>
                )}

                {/* Human-in-the-Loop Action Confirmation Card */}
                {m.proposedAction && (
                  <div className="mt-3 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F4C3A] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        Human-in-the-Loop Action Proposal
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white text-stone-600 font-mono border border-stone-200">
                        Requires Confirmation
                      </span>
                    </div>

                    <p className="text-xs text-stone-800 font-medium">
                      {m.proposedAction.description}
                    </p>

                    {m.actionExecuted ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-white p-2 rounded-lg border border-emerald-200">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Action Confirmed &amp; Executed on Backend Operations Engine!</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleExecuteProposedAction(m.id, m.proposedAction)}
                        disabled={executingActionId === m.proposedAction.id}
                        className="w-full mt-2 py-2 px-3 rounded-lg bg-[#0F4C3A] hover:bg-[#155e47] text-white text-xs font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
                      >
                        {executingActionId === m.proposedAction.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Authorizing &amp; Executing...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Confirm &amp; Execute Action
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Actionable task blueprint */}
                {m.actionableTasks && (
                  <div className="mt-3 p-3 bg-[#FAF9F6] border border-[#E5E7E3] rounded-xl text-xs space-y-2">
                    <p className="font-bold text-[#1F4D3A]">Subtasks to be created:</p>
                    {m.actionableTasks.subtasks.map((st, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-white p-2 rounded border border-stone-200"
                      >
                        <span className="font-medium text-[#202522]">{st.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-mono">
                          {st.hours} hrs
                        </span>
                      </div>
                    ))}
                    {tasksCreated === m.actionableTasks.title ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
                        <Check className="w-4 h-4" />
                        <span>
                          Tasks successfully added to {projects[0].clientName} project board!
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleConfirmAddTasks(m.actionableTasks!)}
                        className="w-full mt-2 py-2 px-3 rounded-lg bg-[#1F4D3A] text-white font-semibold hover:bg-[#15382B] flex items-center justify-center gap-2 transition-colors"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Confirm &amp; Create Tasks</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#E5E7E3] rounded-2xl p-3.5 rounded-tl-none flex items-center gap-2 text-xs text-[#59655F]">
                <Loader2 className="w-4 h-4 animate-spin text-[#1F4D3A]" />
                <span>Reading live operations database &amp; analyzing records...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#E5E7E3] bg-white">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask live database or type 'Analyze current operations'..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#E5E7E3] focus:border-[#1F4D3A] focus:ring-1 focus:ring-[#1F4D3A] outline-none text-sm bg-[#FAF9F6]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-[#8A9690] mt-1.5 text-center">
            Authorized tenant records only. All consequential actions require human approval.
          </p>
        </div>
      </div>
    </div>
  );
};
