import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  FileCheck,
  Building2,
  Briefcase,
  CheckSquare,
  Calendar,
  Layers,
  Sparkles,
  Compass,
  FolderOpen,
  MessageSquare,
  CreditCard,
  Receipt,
  PiggyBank,
  Users2,
  BarChart3,
  Bot,
  Settings,
  Search,
  Bell,
  Plus,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Activity,
  LogOut,
  ExternalLink,
  Zap,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { GlobalSearchModal } from '../components/GlobalSearchModal';
import { AIBrainDrawer } from '../components/AIBrainDrawer';
import { QuickActionModal } from '../components/QuickActionModal';
import { SupabaseModal } from '../components/SupabaseModal';
import { CreateOrganizationModal } from '../components/CreateOrganizationModal';
import { api } from '../services/api';
import { UserRole } from '../types';

export const DashboardLayout: React.FC = () => {
  const { currentBusiness, switchBusiness, allBusinesses, currentUser, switchUser, allUsers } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBrainOpen, setIsBrainOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState<boolean | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    api.getSupabaseStatus().then(data => {
      if (mounted && data) {
        setIsDbConnected(Boolean(data.connected));
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read);

  // Navigation structure per spec #47
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Command Center', path: '/command-center', icon: Activity, adminOnly: true },
    { label: 'Decision Insights', path: '/insights', icon: Sparkles },
    { label: 'Workflows', path: '/workflows', icon: Zap },
    {
      group: 'CRM & Pipeline',
      items: [
        { label: 'Leads & CRM', path: '/leads', icon: Users },
        { label: 'Cold Calling', path: '/sales', icon: PhoneCall },
        { label: 'Proposals', path: '/proposals', icon: FileCheck },
      ]
    },
    { label: 'Clients', path: '/clients', icon: Building2 },
    { label: 'Projects', path: '/projects', icon: Briefcase },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    {
      group: 'Creative & Content',
      items: [
        { label: 'Content Board', path: '/content', icon: Layers },
        { label: 'Designer Workspace', path: '/design', icon: Sparkles },
        { label: 'Video Editor Workspace', path: '/video', icon: Layers },
        { label: 'Approvals Center', path: '/approvals', icon: FileCheck },
        { label: 'Agency Calendar', path: '/calendar', icon: Calendar },
      ]
    },
    { label: 'Strategy Planner', path: '/strategies', icon: Compass },
    { label: 'Asset Library', path: '/documents', icon: FolderOpen },
    { label: 'Communications', path: '/communications', icon: MessageSquare },
    {
      group: 'Finance',
      items: [
        { label: 'Invoices', path: '/invoices', icon: Receipt },
        { label: 'Payments', path: '/payments', icon: CreditCard },
        { label: 'Expenses', path: '/finance', icon: PiggyBank },
      ]
    },
    { label: 'Team & Workload', path: '/team', icon: Users2 },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Client Portal View', path: '/client-portal', icon: ExternalLink, highlight: true },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex text-[#202522]">
      {/* -------------------- SIDEBAR -------------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E5E7E3] flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-0 max-lg:-translate-x-full'
        }`}
      >
        {/* Brand Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#E5E7E3] bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0"
              style={{ backgroundColor: currentBusiness.color }}
            >
              {currentBusiness.logoLetter}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-[#15382B] truncate">{currentBusiness.name}</span>
              </div>
              <p className="text-[10px] text-[#59655F] uppercase tracking-wider font-semibold truncate">{currentBusiness.industry.split(' ')[0]} Workspace</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item, idx) => {
            if ('group' in item && item.items) {
              return (
                <div key={idx} className="pt-3 pb-1">
                  <p className="px-3 text-[10.5px] font-bold uppercase tracking-wider text-[#8A9690] mb-1">
                    {item.group}
                  </p>
                  <div className="space-y-0.5">
                    {item.items.map(subItem => {
                      const Icon = subItem.icon;
                      const isActive = location.pathname === subItem.path;
                      return (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-[#1F4D3A] text-white shadow-xs'
                              : 'text-[#59655F] hover:text-[#202522] hover:bg-[#FAF9F6]'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-[#6F8F7D]'}`} />
                          <span>{subItem.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            }

            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1F4D3A] text-white shadow-xs'
                    : item.highlight
                      ? 'text-[#1F4D3A] bg-[#EBF2EE] hover:bg-[#D5E4DC]'
                      : 'text-[#59655F] hover:text-[#202522] hover:bg-[#FAF9F6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-[#6F8F7D]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.adminOnly && (
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'}`}>Admin</span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* AI Brain Floating Trigger in sidebar footer */}
        <div className="p-3 border-t border-[#E5E7E3] bg-[#FAF9F6]">
          <button
            onClick={() => setIsBrainOpen(true)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-[#1F4D3A] to-[#15382B] text-white shadow-xs hover:opacity-95 transition-all text-xs font-semibold"
          >
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>Entreprise AI Brain</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </button>
        </div>
      </aside>

      {/* -------------------- MAIN CONTENT WRAPPER -------------------- */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-[#E5E7E3] flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#F7F5EF] hover:bg-[#EBF2EE] border border-[#E5E7E3] text-[#59655F] text-xs font-medium transition-all w-40 sm:w-60"
            >
              <Search className="w-4 h-4 text-[#6F8F7D]" />
              <span className="truncate">Search records...</span>
              <kbd className="hidden sm:inline-block ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-[#E5E7E3] text-stone-500 font-bold">
                ⌘K
              </kbd>
            </button>

            {/* Enterprise Business Workspace Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsBusinessDropdownOpen(!isBusinessDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-900 text-xs font-bold transition shadow-2xs"
                title="Switch between the 5 live enterprise businesses"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: currentBusiness.color }}
                />
                <span className="truncate max-w-[110px] sm:max-w-[170px]">{currentBusiness.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              </button>

              {isBusinessDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 p-2 overflow-hidden animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-stone-100 mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Switch Enterprise Workspace
                    </p>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      5 distinct businesses with isolated data &amp; roles
                    </p>
                  </div>
                  <div className="space-y-1">
                    {allBusinesses.map(b => {
                      const isCurrent = b.id === currentBusiness.id;
                      return (
                        <div
                          key={b.id}
                          onClick={() => {
                            switchBusiness(b.id);
                            setIsBusinessDropdownOpen(false);
                          }}
                          className={`flex items-center gap-2.5 p-2 rounded-xl text-xs cursor-pointer transition ${
                            isCurrent
                              ? 'bg-emerald-50 text-[#0F4C3A] font-bold border border-emerald-200'
                              : 'hover:bg-stone-50 text-stone-800'
                          }`}
                        >
                          <div
                            className="w-6 h-6 rounded-md text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-2xs"
                            style={{ backgroundColor: b.color }}
                          >
                            {b.logoLetter}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-semibold">{b.name}</p>
                            <p className="text-[10px] text-stone-500 truncate">{b.industry}</p>
                          </div>
                          {isCurrent && <span className="w-2 h-2 rounded-full bg-[#0F4C3A]" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Create New Organization Button */}
                  <div className="pt-2 mt-1 border-t border-stone-100">
                    <button
                      onClick={() => {
                        setIsBusinessDropdownOpen(false);
                        setIsCreateOrgOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-bold bg-[#0F4C3A] text-white hover:bg-[#15382B] transition shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Create Organization</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Supabase Database Connection Status Indicator */}
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition shadow-2xs ${
                isDbConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
              }`}
              title="Supabase Database Connection & Diagnostics"
            >
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden md:inline">
                {isDbConnected ? 'Supabase Live' : 'Database'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                }`}
              />
            </button>

            {/* Quick Action Button */}
            <button
              onClick={() => setIsQuickActionOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F4D3A] text-white hover:bg-[#15382B] text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Action</span>
            </button>

            {/* AI Brain Button */}
            <button
              onClick={() => setIsBrainOpen(true)}
              className="p-2 rounded-xl text-[#1F4D3A] bg-[#EBF2EE] hover:bg-[#D5E4DC] relative transition-colors"
              title="Open Entreprise AI Brain"
            >
              <Bot className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-xl text-stone-600 hover:text-[#1F4D3A] hover:bg-[#F7F5EF] relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E5E7E3] z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7E3] bg-[#FAF9F6]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#202522]">Notifications</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-50 text-[#1F4D3A] font-bold">
                        {unreadNotifications.length} unread
                      </span>
                    </div>
                    {unreadNotifications.length > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] font-semibold text-[#1F4D3A] hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E7E3]">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#8A9690]">No notifications</div>
                    ) : (
                      notifications.slice(0, 6).map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 text-xs hover:bg-[#FAF9F6] cursor-pointer transition-colors ${
                            !n.read ? 'bg-[#EBF2EE]/30' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-[#202522]">{n.title}</span>
                            <span className="text-[10px] text-[#8A9690]">{n.timestamp.substring(11)}</span>
                          </div>
                          <p className="text-[#59655F] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Persona / Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsUserSwitcherOpen(!isUserSwitcherOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl hover:bg-[#F7F5EF] border border-[#E5E7E3] transition-all"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-[#E5E7E3]"
                />
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-[#202522] leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-[#6F8F7D] font-semibold uppercase">{currentUser.role.replace('_', ' ')}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Persona Selector Dropdown */}
              {isUserSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E5E7E3] z-50 p-2 overflow-hidden">
                  <div className="px-3 py-2 border-b border-[#E5E7E3] mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A9690]">Switch Persona / Role View</p>
                    <p className="text-xs text-[#59655F] mt-0.5">Test agency experience from any employee or client perspective</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-1">
                    {allUsers.map(u => {
                      const isCurrent = u.id === currentUser.id;
                      return (
                        <div
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setIsUserSwitcherOpen(false);
                          }}
                          className={`flex items-center gap-2.5 p-2 rounded-xl text-xs cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-[#EBF2EE] text-[#1F4D3A] font-bold'
                              : 'hover:bg-[#FAF9F6] text-[#202522]'
                          }`}
                        >
                          <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-md object-cover" />
                          <div className="flex-1 truncate">
                            <p className="truncate font-semibold">{u.name}</p>
                            <p className="text-[10px] text-[#59655F] uppercase">{u.role.replace('_', ' ')} · {u.department}</p>
                          </div>
                          {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#1F4D3A]" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-stone-200 mt-2">
                    <button
                      onClick={() => {
                        setIsUserSwitcherOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition"
                    >
                      <LogOut className="w-3.5 h-3.5 text-stone-500" />
                      <span>Log Out / Change Enterprise</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Persona Awareness Banner for non-admin roles */}
        {currentUser.role !== 'ADMIN' && (
          <div className="bg-[#15382B] text-white px-6 py-2 flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>
                Viewing as <strong>{currentUser.name}</strong> ({currentUser.title}) — Workspace personalized for <strong>{currentUser.department}</strong>
              </span>
            </div>
            <button
              onClick={() => switchUser('user-admin')}
              className="text-emerald-300 hover:text-white font-semibold underline text-[11px]"
            >
              Switch back to Admin
            </button>
          </div>
        )}

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AIBrainDrawer isOpen={isBrainOpen} onClose={() => setIsBrainOpen(false)} />
      <QuickActionModal isOpen={isQuickActionOpen} onClose={() => setIsQuickActionOpen(false)} />
      <SupabaseModal isOpen={isSupabaseModalOpen} onClose={() => setIsSupabaseModalOpen(false)} />
      <CreateOrganizationModal isOpen={isCreateOrgOpen} onClose={() => setIsCreateOrgOpen(false)} />
    </div>
  );
};
