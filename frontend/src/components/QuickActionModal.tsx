import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Plus, UserPlus, Building, Briefcase, CheckSquare, FileText, DollarSign, Lightbulb } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAction?: 'lead' | 'client' | 'project' | 'task' | 'proposal' | 'invoice';
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  defaultAction = 'lead'
}) => {
  const [activeTab, setActiveTab] = useState<'lead' | 'client' | 'project' | 'task' | 'proposal' | 'invoice'>(defaultAction);
  const { addLead, addClient, addProject, addTask, createProposal, addInvoice, clients, projects, users } = useApp();
  const { currentUser } = useAuth();

  // Lead state
  const [leadName, setLeadName] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadBudget, setLeadBudget] = useState('60000');
  const [leadIndustry, setLeadIndustry] = useState('D2C FMCG');
  const [leadSource, setLeadSource] = useState<'Instagram' | 'WhatsApp' | 'Cold Call' | 'LinkedIn' | 'Website'>('Instagram');
  const [leadService, setLeadService] = useState('Full Retainer & Content Production');

  // Task state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskProjId, setTaskProjId] = useState(projects[0]?.id || '');
  const [taskAssignee, setTaskAssignee] = useState(users[3]?.id || '');
  const [taskCategory, setTaskCategory] = useState<'Design' | 'Video' | 'Content' | 'Strategy' | 'General'>('Design');
  const [taskPriority, setTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('HIGH');
  const [taskDeadline, setTaskDeadline] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  // Client state
  const [clientCompany, setClientCompany] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientIndustry, setClientIndustry] = useState('Retail & Hospitality');
  const [clientRetainer, setClientRetainer] = useState('80000');

  // Project state
  const [projTitle, setProjTitle] = useState('');
  const [projClientId, setProjClientId] = useState(clients[0]?.id || '');
  const [projBudget, setProjBudget] = useState('100000');
  const [projDeadline, setProjDeadline] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadContact) return;
    addLead({
      companyName: leadName,
      contactPerson: leadContact,
      phone: leadPhone || '+91 98400 11223',
      email: leadEmail || `${leadContact.toLowerCase().replace(/\s+/g, '')}@example.com`,
      location: 'Bangalore, KA',
      industry: leadIndustry,
      source: leadSource,
      estimatedBudget: Number(leadBudget) || 50000,
      serviceInterested: leadService,
      assignedSalespersonId: 'user-sales',
      stage: 'NEW',
      nextFollowUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Lead captured via Quick Action modal.',
      tags: ['Inbound', 'Quick Create'],
      urgency: 'HIGH',
      decisionMakerAvailable: true
    });
    onClose();
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;
    const proj = projects.find(p => p.id === taskProjId) || projects[0];
    const assignee = users.find(u => u.id === taskAssignee) || users[3];

    addTask({
      title: taskTitle,
      description: taskDesc || 'Task created via Quick Action',
      projectId: proj.id,
      projectName: proj.title,
      clientId: proj.clientId,
      clientName: proj.clientName,
      assignedEmployeeId: assignee.id,
      assignedEmployeeName: assignee.name,
      category: taskCategory,
      priority: taskPriority,
      status: 'TODO',
      startDate: new Date().toISOString().split('T')[0],
      deadline: taskDeadline,
      estimatedHours: 4,
      checklist: [{ id: '1', text: 'Initial deliverable review', completed: false }],
      attachments: []
    });
    onClose();
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientCompany) return;
    addClient({
      companyName: clientCompany,
      contactPerson: clientContact || 'Founder',
      email: clientEmail || 'client@example.com',
      phone: clientPhone || '+91 98400 00000',
      industry: clientIndustry,
      location: 'Bangalore, KA',
      accountManagerId: 'user-am',
      startDate: new Date().toISOString().split('T')[0],
      contractValue: Number(clientRetainer) * 12,
      monthlyRetainer: Number(clientRetainer) || 60000,
      health: 'Healthy',
      healthReason: 'Newly created client record'
    });
    onClose();
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle) return;
    const c = clients.find(cl => cl.id === projClientId) || clients[0];
    addProject({
      title: projTitle,
      clientId: c.id,
      clientName: c.companyName,
      projectManagerId: 'user-am',
      startDate: new Date().toISOString().split('T')[0],
      deadline: projDeadline,
      budget: Number(projBudget) || 50000,
      status: 'In Progress',
      priority: 'HIGH',
      teamMemberIds: ['user-am', 'user-designer', 'user-video'],
      description: 'Project launched via Quick Actions.'
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agency Quick Action" description="Instantly register or create any agency operational record" maxWidth="2xl">
      {/* Tab Switcher */}
      <div className="flex border-b border-[#E5E7E3] mb-6 overflow-x-auto gap-2">
        {[
          { id: 'lead', label: 'Add Lead', icon: UserPlus },
          { id: 'task', label: 'Create Task', icon: CheckSquare },
          { id: 'client', label: 'Add Client', icon: Building },
          { id: 'project', label: 'Create Project', icon: Briefcase },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-[#1F4D3A] text-[#1F4D3A] bg-[#EBF2EE]/50'
                  : 'border-transparent text-[#59655F] hover:text-[#202522]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* LEAD FORM */}
      {activeTab === 'lead' && (
        <form onSubmit={handleCreateLead} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Company / Brand Name *</label>
              <input
                type="text"
                required
                value={leadName}
                onChange={e => setLeadName(e.target.value)}
                placeholder="e.g. BlueTokai Coffee"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Contact Person *</label>
              <input
                type="text"
                required
                value={leadContact}
                onChange={e => setLeadContact(e.target.value)}
                placeholder="e.g. Vikram Sharma (Founder)"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Phone Number</label>
              <input
                type="text"
                value={leadPhone}
                onChange={e => setLeadPhone(e.target.value)}
                placeholder="+91 98400 12345"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Email Address</label>
              <input
                type="email"
                value={leadEmail}
                onChange={e => setLeadEmail(e.target.value)}
                placeholder="founder@brand.in"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Monthly Budget (₹)</label>
              <input
                type="number"
                value={leadBudget}
                onChange={e => setLeadBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Lead Source</label>
              <select
                value={leadSource}
                onChange={e => setLeadSource(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none bg-white"
              >
                <option value="Instagram">Instagram</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Cold Call">Cold Call</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Website">Website</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Industry</label>
              <input
                type="text"
                value={leadIndustry}
                onChange={e => setLeadIndustry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">Service Interested In</label>
            <input
              type="text"
              value={leadService}
              onChange={e => setLeadService(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7E3]">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-[#E5E7E3] text-sm font-semibold text-[#59655F] hover:bg-stone-50">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-[#1F4D3A] text-white text-sm font-semibold hover:bg-[#15382B] transition-colors shadow-xs">
              Save Lead to CRM
            </button>
          </div>
        </form>
      )}

      {/* TASK FORM */}
      {activeTab === 'task' && (
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
              placeholder="e.g. Design 7-Slide Carousel on Himalayan Winter Gear"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Project *</label>
              <select
                value={taskProjId}
                onChange={e => setTaskProjId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none bg-white"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title} ({p.clientName})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Assigned Employee *</label>
              <select
                value={taskAssignee}
                onChange={e => setTaskAssignee(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none bg-white"
              >
                {users.filter(u => u.role !== 'CLIENT').map(u => (
                  <option key={u.id} value={u.id}>{u.name} — {u.department}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Category</label>
              <select
                value={taskCategory}
                onChange={e => setTaskCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none bg-white"
              >
                <option value="Design">Design</option>
                <option value="Video">Video</option>
                <option value="Content">Content</option>
                <option value="Strategy">Strategy</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Priority</label>
              <select
                value={taskPriority}
                onChange={e => setTaskPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none bg-white"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Deadline</label>
              <input
                type="date"
                value={taskDeadline}
                onChange={e => setTaskDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">Description / Brief Notes</label>
            <textarea
              rows={2}
              value={taskDesc}
              onChange={e => setTaskDesc(e.target.value)}
              placeholder="Add key deliverables, dimensions, or creative references..."
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7E3]">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-[#E5E7E3] text-sm font-semibold text-[#59655F] hover:bg-stone-50">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-[#1F4D3A] text-white text-sm font-semibold hover:bg-[#15382B] transition-colors shadow-xs">
              Assign & Create Task
            </button>
          </div>
        </form>
      )}

      {/* CLIENT FORM */}
      {activeTab === 'client' && (
        <form onSubmit={handleCreateClient} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Client / Company Name *</label>
              <input
                type="text"
                required
                value={clientCompany}
                onChange={e => setClientCompany(e.target.value)}
                placeholder="e.g. Aura Wellness Spa"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Contact Person</label>
              <input
                type="text"
                value={clientContact}
                onChange={e => setClientContact(e.target.value)}
                placeholder="e.g. Shalini Roy"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Monthly Retainer (₹)</label>
              <input
                type="number"
                value={clientRetainer}
                onChange={e => setClientRetainer(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Industry</label>
              <input
                type="text"
                value={clientIndustry}
                onChange={e => setClientIndustry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Phone</label>
              <input
                type="text"
                value={clientPhone}
                onChange={e => setClientPhone(e.target.value)}
                placeholder="+91 98401 22334"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7E3]">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-[#E5E7E3] text-sm font-semibold text-[#59655F] hover:bg-stone-50">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-[#1F4D3A] text-white text-sm font-semibold hover:bg-[#15382B] transition-colors shadow-xs">
              Save Client Profile
            </button>
          </div>
        </form>
      )}

      {/* PROJECT FORM */}
      {activeTab === 'project' && (
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={projTitle}
              onChange={e => setProjTitle(e.target.value)}
              placeholder="e.g. Festive Holiday Video & Social Engine"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Client *</label>
              <select
                value={projClientId}
                onChange={e => setProjClientId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none bg-white"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.companyName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Project Budget (₹)</label>
              <input
                type="number"
                value={projBudget}
                onChange={e => setProjBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Target Deadline</label>
              <input
                type="date"
                value={projDeadline}
                onChange={e => setProjDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7E3] text-sm focus:border-[#1F4D3A] outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7E3]">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-[#E5E7E3] text-sm font-semibold text-[#59655F] hover:bg-stone-50">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-[#1F4D3A] text-white text-sm font-semibold hover:bg-[#15382B] transition-colors shadow-xs">
              Launch Project
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
