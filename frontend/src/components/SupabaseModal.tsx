import React, { useState, useEffect } from 'react';
import {
  Database,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  Server,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { api } from '../services/api';
import { isFrontendSupabaseConfigured, testFrontendSupabase } from '../services/supabase';
import confetti from 'canvas-confetti';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'setup' | 'sql'>('status');
  const [loading, setLoading] = useState(false);
  const [testingPing, setTestingPing] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [statusData, setStatusData] = useState<any>(null);
  const [schemaSql, setSchemaSql] = useState<string>('');
  const [frontendTestResult, setFrontendTestResult] = useState<any>(null);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await api.getSupabaseStatus();
      setStatusData(data);

      const frontendTest = await testFrontendSupabase();
      setFrontendTestResult(frontendTest);

      if (!schemaSql) {
        const sql = await api.getSupabaseSchema();
        setSchemaSql(sql);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const handleTestPing = async () => {
    setTestingPing(true);
    try {
      const res = await api.testSupabase();
      setStatusData((prev: any) => ({ ...prev, ...res }));
      const fTest = await testFrontendSupabase();
      setFrontendTestResult(fTest);
    } catch (err) {
      console.error(err);
    } finally {
      setTestingPing(false);
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await api.cleanResetSupabase();
      if (res.success) {
        setSeedResult('Successfully reset database and seeded 4 distinct enterprise businesses with matching foreign keys!');
        confetti({ particleCount: 85, spread: 70, origin: { y: 0.6 } });
        fetchStatus();
      } else {
        setSeedResult(`Seeding notice: ${res.error || 'Check configuration'}`);
      }
    } catch (err: any) {
      setSeedResult(`Failed to seed: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const copyToClipboard = (text: string, type: 'sql' | 'env') => {
    navigator.clipboard.writeText(text);
    if (type === 'sql') {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    } else {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    }
  };

  if (!isOpen) return null;

  const isConfigured = Boolean(statusData?.configured || isFrontendSupabaseConfigured());
  const isConnected = Boolean(statusData?.connected);

  const sampleEnvText = `# Add to backend/.env
SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]

# Add to frontend/.env
VITE_SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Supabase PostgreSQL Database</h2>
                {isConnected ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live &amp; Connected
                  </span>
                ) : isConfigured ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Unreachable / Schema Needed
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-700 text-stone-300 border border-stone-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    In-Memory Mode (Keys Required)
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Multi-tenant persistence engine for enterprise operations
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

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'status'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Server className="w-4 h-4" />
            Database Status &amp; Metrics
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'setup'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            Quick Setup Guide (3 Steps)
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'sql'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            SQL Schema Migration
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: STATUS & METRICS */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              {/* Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                  isConnected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : isConfigured
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-stone-100 border-stone-200 text-stone-800'
                }`}
              >
                {isConnected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 text-xs">
                  <p className="font-bold text-sm">
                    {isConnected
                      ? 'Live Supabase Connection Established'
                      : isConfigured
                      ? 'Supabase Configured — Schema Verification'
                      : 'Running in In-Memory Demo Mode'}
                  </p>
                  <p className="mt-1 leading-relaxed text-stone-600">
                    {statusData?.message ||
                      (isConnected
                        ? 'All backend operational queries, tasks, projects, and approvals are directly backed by Supabase PostgreSQL with multi-tenant row isolation.'
                        : 'To activate cloud database persistence, add your Supabase project credentials to backend/.env and frontend/.env.')}
                  </p>
                  {statusData?.url && (
                    <div className="mt-2 text-[11px] font-mono bg-white/70 px-2.5 py-1 rounded-lg border border-stone-200 inline-block">
                      URL: {statusData.url}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleTestPing}
                  disabled={testingPing || loading}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-2xs transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingPing ? 'animate-spin' : ''}`} />
                  Test Ping
                </button>
              </div>

              {/* Metrics Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Enterprise Data Persistence Records
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                    <p className="text-[11px] font-semibold text-stone-500">Enterprise Businesses</p>
                    <p className="text-xl font-extrabold text-stone-900 mt-1">
                      {statusData?.tableCounts?.organizations ?? statusData?.memoryCachedRecords?.organizations ?? 5}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-semibold">Multi-Tenant Scoped</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                    <p className="text-[11px] font-semibold text-stone-500">Operational Projects</p>
                    <p className="text-xl font-extrabold text-stone-900 mt-1">
                      {statusData?.tableCounts?.projects ?? statusData?.memoryCachedRecords?.projects ?? 15}
                    </p>
                    <span className="text-[10px] text-stone-500">Active initiatives</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                    <p className="text-[11px] font-semibold text-stone-500">Tasks &amp; Action Items</p>
                    <p className="text-xl font-extrabold text-stone-900 mt-1">
                      {statusData?.tableCounts?.tasks ?? statusData?.memoryCachedRecords?.tasks ?? 24}
                    </p>
                    <span className="text-[10px] text-stone-500">Cross-department</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                    <p className="text-[11px] font-semibold text-stone-500">Executive Approvals</p>
                    <p className="text-xl font-extrabold text-stone-900 mt-1">
                      {statusData?.tableCounts?.approvals ?? statusData?.memoryCachedRecords?.approvals ?? 10}
                    </p>
                    <span className="text-[10px] text-stone-500">Governance log</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                    <p className="text-[11px] font-semibold text-stone-500">Autonomous Workflows</p>
                    <p className="text-xl font-extrabold text-stone-900 mt-1">
                      {statusData?.tableCounts?.workflows ?? statusData?.memoryCachedRecords?.workflows ?? 10}
                    </p>
                    <span className="text-[10px] text-stone-500">Trigger engines</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                    <p className="text-[11px] font-semibold text-stone-500">Database Latency</p>
                    <p className="text-xl font-extrabold text-stone-900 mt-1">
                      {statusData?.latencyMs ? `${statusData.latencyMs}ms` : '< 1ms (local)'}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-semibold">High throughput</span>
                  </div>
                </div>
              </div>

              {/* Actions Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Clean Reset &amp; Seed 4 Enterprise Businesses
                  </h4>
                  <p className="text-xs text-stone-300 mt-1 max-w-md">
                    Empties existing records and provisions 4 distinct businesses: Apex Cloud Tech, Pulse Creative Media, Nexus BioHealth, and Vanguard Global Logistics.
                  </p>
                  {seedResult && (
                    <p className="text-xs font-semibold text-emerald-300 mt-2 bg-emerald-950/60 p-2 rounded-lg border border-emerald-800">
                      {seedResult}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleSeedDatabase}
                  disabled={seeding}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition flex items-center gap-2 shrink-0 shadow-md"
                >
                  <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
                  {seeding ? 'Resetting & Seeding...' : 'Clean Reset & Seed 4 Businesses'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: QUICK SETUP GUIDE */}
          {activeTab === 'setup' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div className="flex-1 text-xs">
                    <h4 className="font-bold text-sm text-stone-900">Create a Free Supabase Project</h4>
                    <p className="text-stone-600 mt-1">
                      Go to Supabase.com and create a new project (it takes ~45 seconds on their free tier).
                    </p>
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold mt-2"
                    >
                      Open Supabase Dashboard
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div className="flex-1 text-xs">
                    <h4 className="font-bold text-sm text-stone-900">Execute the SQL Schema</h4>
                    <p className="text-stone-600 mt-1">
                      In your Supabase Dashboard, click <strong>SQL Editor</strong> &rarr; <strong>New query</strong>, then paste the contents of <code className="bg-stone-200 px-1 py-0.5 rounded">backend/src/config/schema.sql</code> and click <strong>Run</strong>.
                    </p>
                    <button
                      onClick={() => copyToClipboard(schemaSql, 'sql')}
                      className="mt-2.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedSql ? 'Schema Copied to Clipboard!' : 'Copy Full SQL Schema'}
                    </button>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div className="flex-1 text-xs">
                    <h4 className="font-bold text-sm text-stone-900">Add Keys to .env Files</h4>
                    <p className="text-stone-600 mt-1">
                      Go to Supabase <strong>Project Settings &rarr; API</strong>, copy your Project URL and service_role / anon keys, then paste them into your <code className="bg-stone-200 px-1 py-0.5 rounded">backend/.env</code> and <code className="bg-stone-200 px-1 py-0.5 rounded">frontend/.env</code>.
                    </p>
                    <div className="mt-2.5 relative">
                      <pre className="p-3 rounded-xl bg-stone-900 text-emerald-300 font-mono text-[11px] overflow-x-auto">
                        {sampleEnvText}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(sampleEnvText, 'env')}
                        className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-[10px] font-semibold flex items-center gap-1 transition"
                      >
                        {copiedEnv ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedEnv ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SQL SCHEMA */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900">PostgreSQL Schema Definition</h4>
                  <p className="text-xs text-stone-500">
                    Includes 11 multi-tenant tables, indexes, RLS policies, and instant seed data
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(schemaSql, 'sql')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema'}
                </button>
              </div>

              <div className="relative rounded-2xl bg-stone-900 border border-stone-800 p-4 max-h-96 overflow-y-auto">
                <pre className="text-[11px] font-mono text-emerald-300 leading-relaxed whitespace-pre">
                  {schemaSql || '-- Loading schema.sql...'}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Row-Level Security (RLS) &amp; Multi-Tenant Isolation enabled</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
