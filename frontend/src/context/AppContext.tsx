import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Lead,
  LeadStage,
  CallRecord,
  Communication,
  Proposal,
  ProposalStatus,
  Client,
  StrategyDoc,
  Project,
  ProjectStatus,
  ProjectHealth,
  Task,
  TaskStatus,
  ContentItem,
  ContentStatus,
  ApprovalItem,
  ApprovalVersion,
  FileAsset,
  Invoice,
  InvoiceStatus,
  PaymentMilestone,
  Expense,
  ChatMessage,
  AppNotification,
  ActivityLog,
  AutomationRule
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_LEADS,
  INITIAL_CALLS,
  INITIAL_COMMUNICATIONS,
  INITIAL_CLIENTS,
  INITIAL_PROPOSALS,
  INITIAL_STRATEGIES,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_CONTENT,
  INITIAL_APPROVALS,
  INITIAL_FILES,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_EXPENSES,
  INITIAL_CHAT,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_AUTOMATION_RULES,
  INITIAL_ONBOARDING_CHECKLIST
} from '../services/seedData';
import { ENTERPRISE_DATA_BANK } from '../services/enterpriseDataBank';
import { ENTERPRISE_BUSINESSES } from '../services/enterpriseTenants';

interface AppContextType {
  users: User[];
  leads: Lead[];
  calls: CallRecord[];
  communications: Communication[];
  proposals: Proposal[];
  clients: Client[];
  strategies: StrategyDoc[];
  projects: Project[];
  tasks: Task[];
  contentItems: ContentItem[];
  approvals: ApprovalItem[];
  files: FileAsset[];
  invoices: Invoice[];
  payments: PaymentMilestone[];
  expenses: Expense[];
  chatMessages: ChatMessage[];
  notifications: AppNotification[];
  activityLogs: ActivityLog[];
  automationRules: AutomationRule[];

  // Lead / CRM actions
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'leadScore'>) => void;
  updateLeadStage: (leadId: string, stage: LeadStage) => void;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  logCall: (callData: Omit<CallRecord, 'id' | 'timestamp'>) => void;
  addCommunication: (comm: Omit<Communication, 'id' | 'date'>) => void;

  // Proposal actions
  createProposal: (prop: Omit<Proposal, 'id' | 'createdAt' | 'proposalNumber'>) => void;
  updateProposalStatus: (propId: string, status: ProposalStatus) => void;

  // Client actions
  addClient: (client: Omit<Client, 'id' | 'onboardingChecklist'>) => void;
  toggleOnboardingItem: (clientId: string, itemId: number) => void;
  updateClient: (clientId: string, updates: Partial<Client>) => void;

  // Project & Task actions
  addProject: (proj: Omit<Project, 'id' | 'progressPercent' | 'health'>) => void;
  updateProject: (projId: string, updates: Partial<Project>) => void;
  addTask: (task: Omit<Task, 'id' | 'comments' | 'actualHours'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  toggleTaskChecklist: (taskId: string, checklistId: string) => void;
  addTaskComment: (taskId: string, authorId: string, content: string) => void;

  // Content actions
  addContentItem: (item: Omit<ContentItem, 'id' | 'version'>) => void;
  updateContentStatus: (contentId: string, status: ContentStatus) => void;
  updateContentItem: (contentId: string, updates: Partial<ContentItem>) => void;

  // Approval actions
  approveDeliverable: (approvalId: string, feedback?: string) => void;
  requestRevision: (approvalId: string, feedback: string) => void;

  // Finance actions
  addInvoice: (inv: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  updateInvoiceStatus: (invId: string, status: InvoiceStatus) => void;
  markPaymentPaid: (paymentId: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;

  // Chat & Communication
  sendChatMessage: (projectId: string, senderId: string, content: string, mentions?: string[]) => void;
  createTaskFromMessage: (messageId: string, taskTitle: string, assigneeId: string, deadline: string) => void;

  // Notifications
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;

  // File Upload
  addFileAsset: (file: Omit<FileAsset, 'id' | 'uploadedAt' | 'version'>) => void;

  // AI Brain
  askBrain: (query: string) => Promise<{ answer: string; relatedData?: any }>;
  suggestAiTaskBreakdown: (prompt: string) => {
    title: string;
    hook: string;
    pillar: string;
    subtasks: { title: string; category: Task['category']; employeeId: string; hours: number }[];
  };

  // State maintenance
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'ENTREPRISE_AI_OS_DB_V1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load stored state or use initial seeds
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [calls, setCalls] = useState<CallRecord[]>(INITIAL_CALLS);
  const [communications, setCommunications] = useState<Communication[]>(INITIAL_COMMUNICATIONS);
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [strategies, setStrategies] = useState<StrategyDoc[]>(INITIAL_STRATEGIES);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [contentItems, setContentItems] = useState<ContentItem[]>(INITIAL_CONTENT);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(INITIAL_APPROVALS);
  const [files, setFiles] = useState<FileAsset[]>(INITIAL_FILES);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<PaymentMilestone[]>(INITIAL_PAYMENTS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [automationRules] = useState<AutomationRule[]>(INITIAL_AUTOMATION_RULES);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.leads) setLeads(parsed.leads);
        if (parsed.clients) setClients(parsed.clients);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.contentItems) setContentItems(parsed.contentItems);
        if (parsed.proposals) setProposals(parsed.proposals);
        if (parsed.invoices) setInvoices(parsed.invoices);
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.approvals) setApprovals(parsed.approvals);
        if (parsed.calls) setCalls(parsed.calls);
        if (parsed.communications) setCommunications(parsed.communications);
        if (parsed.chatMessages) setChatMessages(parsed.chatMessages);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.activityLogs) setActivityLogs(parsed.activityLogs);
        if (parsed.files) setFiles(parsed.files);
        if (parsed.strategies) setStrategies(parsed.strategies);
      }
    } catch (e) {
      console.error('Failed to load local DB state', e);
    }
    setIsLoaded(true);
  }, []);

  // Multi-tenant organization data loader & synchronizer
  useEffect(() => {
    const loadOrgData = (orgId: string) => {
      const data = ENTERPRISE_DATA_BANK[orgId] || ENTERPRISE_DATA_BANK['org-apex-001'];
      if (data) {
        if (data.clients) setClients(data.clients);
        if (data.projects) setProjects(data.projects);
        if (data.tasks) setTasks(data.tasks);
        if (data.invoices) setInvoices(data.invoices);
        if (data.payments) setPayments(data.payments);
        if (data.expenses) setExpenses(data.expenses);
        if (data.leads) setLeads(data.leads);
        if (data.proposals) setProposals(data.proposals);
      }

      const business = ENTERPRISE_BUSINESSES.find(b => b.id === orgId);
      if (business && business.employees) {
        setUsers(business.employees.map(emp => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          phone: emp.phone || '+1 (555) 019-9000',
          role: emp.role,
          department: emp.department,
          avatar: emp.avatar,
          status: emp.status || 'ACTIVE',
          joiningDate: emp.joiningDate || '2024-01-01',
          title: emp.title,
        })));
      }
    };

    const currentOrg = localStorage.getItem('ENTREPRISE_ACTIVE_ORG_ID') || 'org-apex-001';
    loadOrgData(currentOrg);

    const handleOrgChange = (e: any) => {
      const orgId = e.detail?.orgId || localStorage.getItem('ENTREPRISE_ACTIVE_ORG_ID') || 'org-apex-001';
      loadOrgData(orgId);
    };

    window.addEventListener('ENTERPRISE_ORG_CHANGED', handleOrgChange);
    return () => window.removeEventListener('ENTERPRISE_ORG_CHANGED', handleOrgChange);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToPersist = {
        leads,
        clients,
        projects,
        tasks,
        contentItems,
        proposals,
        invoices,
        payments,
        expenses,
        approvals,
        calls,
        communications,
        chatMessages,
        notifications,
        activityLogs,
        files,
        strategies
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (e) {
      console.error('Failed to persist DB state', e);
    }
  }, [
    isLoaded, leads, clients, projects, tasks, contentItems, proposals, invoices,
    payments, expenses, approvals, calls, communications, chatMessages,
    notifications, activityLogs, files, strategies
  ]);

  // Log activity helper
  const addLog = (authorName: string, action: string, target: string, category: ActivityLog['category']) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      authorName,
      action,
      target,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      category
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Push notification helper
  const pushNotification = (title: string, message: string, type: AppNotification['type'], userId: string = 'ALL', linkUrl?: string) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      title,
      message,
      type,
      linkUrl,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Calculate Lead Score (0 - 100) dynamically
  const calculateLeadScore = (budget: number, urgency: 'LOW' | 'MEDIUM' | 'HIGH', hasDecisionMaker: boolean, industry: string): number => {
    let score = 20;
    if (budget >= 100000) score += 35;
    else if (budget >= 60000) score += 25;
    else if (budget >= 30000) score += 15;
    else score += 5;

    if (urgency === 'HIGH') score += 25;
    else if (urgency === 'MEDIUM') score += 15;
    else score += 5;

    if (hasDecisionMaker) score += 15;
    if (industry.toLowerCase().includes('d2c') || industry.toLowerCase().includes('hospitality') || industry.toLowerCase().includes('luxury')) {
      score += 5;
    }
    return Math.min(score, 98);
  };

  // -------------------------------------------------------------
  // AUTOMATION ENGINE: TRIGGERED ON LEAD WON
  // -------------------------------------------------------------
  const executeLeadWonAutomation = (lead: Lead) => {
    // 1. Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // 2. Check if client already exists
    const existingClient = clients.find(c => c.companyName.toLowerCase() === lead.companyName.toLowerCase());
    let clientId = existingClient?.id;

    if (!existingClient) {
      clientId = `client-${Date.now()}`;
      const newClient: Client = {
        id: clientId,
        companyName: lead.companyName,
        contactPerson: lead.contactPerson,
        email: lead.email,
        phone: lead.phone,
        industry: lead.industry,
        location: lead.location,
        website: lead.website,
        socialLinks: { instagram: lead.instagram },
        accountManagerId: 'user-am',
        startDate: new Date().toISOString().split('T')[0],
        contractValue: lead.estimatedBudget * 12,
        monthlyRetainer: lead.estimatedBudget,
        health: 'Healthy',
        healthReason: 'New client onboarded from high-scoring lead.',
        onboardingChecklist: INITIAL_ONBOARDING_CHECKLIST.map(item => ({
          ...item,
          completed: item.id === 1 // Contract signed
        })),
        brandColors: ['#1F4D3A', '#FAF9F6']
      };
      setClients(prev => [newClient, ...prev]);
    }

    // 3. Create Kickoff Project
    const projectId = `proj-${Date.now()}`;
    const newProject: Project = {
      id: projectId,
      title: `${lead.companyName} — Retainer & Strategy Kickoff`,
      clientId: clientId!,
      clientName: lead.companyName,
      projectManagerId: 'user-am',
      startDate: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: lead.estimatedBudget,
      status: 'In Progress',
      health: 'ON TRACK',
      priority: 'HIGH',
      teamMemberIds: ['user-am', 'user-strategist', 'user-designer', 'user-video', 'user-writer'],
      description: `Automated onboarding project created for ${lead.companyName}. Complete kickoff strategy, brand kit intake, and initial content calendar.`,
      progressPercent: 15
    };
    setProjects(prev => [newProject, ...prev]);

    // 4. Create Strategy Task & Kickoff Task
    const stratTask: Task = {
      id: `task-${Date.now()}-strat`,
      title: `Build Brand & Content Strategy for ${lead.companyName}`,
      description: 'Audit competitors, establish brand voice, target audience personas, and create 30-day content pillars.',
      projectId,
      projectName: newProject.title,
      clientId: clientId!,
      clientName: lead.companyName,
      assignedEmployeeId: 'user-strategist',
      assignedEmployeeName: 'Vikram Sen',
      category: 'Strategy',
      priority: 'URGENT',
      status: 'TODO',
      startDate: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedHours: 6,
      actualHours: 0,
      checklist: [
        { id: 'c1', text: 'Intake questionnaire review', completed: false },
        { id: 'c2', text: 'Competitor audit & USP mapping', completed: false },
        { id: 'c3', text: 'Present strategy deck to client', completed: false }
      ],
      comments: [],
      attachments: []
    };

    const advancePayment: PaymentMilestone = {
      id: `pay-${Date.now()}`,
      projectId,
      projectName: newProject.title,
      clientId: clientId!,
      clientName: lead.companyName,
      title: 'First Month Advance Retainer',
      amount: Math.round(lead.estimatedBudget * 1.18),
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'PENDING'
    };

    setTasks(prev => [stratTask, ...prev]);
    setPayments(prev => [advancePayment, ...prev]);

    // 5. Activity log & notification
    addLog('Automation Engine', `Auto-converted lead to WON & initiated Onboarding`, lead.companyName, 'CRM');
    pushNotification(
      '🎉 New Client Won!',
      `${lead.companyName} is now WON! Onboarding checklist, Kickoff project, and strategy task created.`,
      'LEAD',
      'ALL',
      `/clients`
    );
  };

  // -------------------------------------------------------------
  // CRM ACTIONS
  // -------------------------------------------------------------
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'leadScore'>) => {
    const score = calculateLeadScore(
      leadData.estimatedBudget,
      leadData.urgency,
      leadData.decisionMakerAvailable,
      leadData.industry
    );
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      leadScore: score,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [newLead, ...prev]);
    addLog('Arjun Mehta', 'Created new lead', newLead.companyName, 'CRM');
    pushNotification('New Lead Added', `${newLead.companyName} (${newLead.industry}) entered CRM pipeline.`, 'LEAD', 'user-sales');
  };

  const updateLeadStage = (leadId: string, stage: LeadStage) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage } : l));
    addLog('Sales Team', `Moved lead to stage ${stage}`, lead.companyName, 'CRM');

    // If transitioned to WON, fire automation!
    if (stage === 'WON' && lead.stage !== 'WON') {
      executeLeadWonAutomation({ ...lead, stage: 'WON' });
    }
  };

  const updateLead = (leadId: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const merged = { ...l, ...updates };
        if (updates.estimatedBudget !== undefined || updates.urgency !== undefined || updates.decisionMakerAvailable !== undefined) {
          merged.leadScore = calculateLeadScore(merged.estimatedBudget, merged.urgency, merged.decisionMakerAvailable, merged.industry);
        }
        return merged;
      }
      return l;
    }));
  };

  const logCall = (callData: Omit<CallRecord, 'id' | 'timestamp'>) => {
    const newCall: CallRecord = {
      ...callData,
      id: `call-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setCalls(prev => [newCall, ...prev]);

    // Update lead follow-up & notes
    setLeads(prev => prev.map(l => {
      if (l.id === callData.leadId) {
        let updatedStage = l.stage;
        if (callData.outcome === 'Meeting booked' && l.stage !== 'WON' && l.stage !== 'PROPOSAL_SENT') {
          updatedStage = 'MEETING';
        } else if (callData.outcome === 'Interested' && l.stage === 'CONTACTED') {
          updatedStage = 'INTERESTED';
        } else if (callData.outcome === 'Converted') {
          updatedStage = 'WON';
        }
        return {
          ...l,
          stage: updatedStage,
          nextFollowUpDate: callData.nextCallDate || l.nextFollowUpDate,
          notes: `[Call ${new Date().toLocaleDateString()} - ${callData.outcome}]: ${callData.notes}\n${l.notes}`
        };
      }
      return l;
    }));

    addLog('Salesperson', `Logged cold call (${callData.outcome})`, callData.leadName, 'CRM');

    if (callData.outcome === 'Converted') {
      const targetLead = leads.find(l => l.id === callData.leadId);
      if (targetLead) executeLeadWonAutomation({ ...targetLead, stage: 'WON' });
    }
  };

  const addCommunication = (comm: Omit<Communication, 'id' | 'date'>) => {
    const newComm: Communication = {
      ...comm,
      id: `comm-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setCommunications(prev => [newComm, ...prev]);
    addLog(comm.authorName, `Logged ${comm.channel} message`, comm.entityName, 'CRM');
  };

  // -------------------------------------------------------------
  // PROPOSALS
  // -------------------------------------------------------------
  const createProposal = (prop: Omit<Proposal, 'id' | 'createdAt' | 'proposalNumber'>) => {
    const propNumber = `PROP-2026-${String(proposals.length + 1).padStart(3, '0')}`;
    const newProp: Proposal = {
      ...prop,
      id: `prop-${Date.now()}`,
      proposalNumber: propNumber,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProposals(prev => [newProp, ...prev]);
    addLog('Sales Team', `Generated proposal ${propNumber}`, prop.companyName, 'CRM');
    pushNotification('Proposal Drafted', `Proposal ${propNumber} for ${prop.companyName} is ready to send.`, 'LEAD');
  };

  const updateProposalStatus = (propId: string, status: ProposalStatus) => {
    const prop = proposals.find(p => p.id === propId);
    if (!prop) return;

    setProposals(prev => prev.map(p => p.id === propId ? { ...p, status } : p));
    addLog('Sales Team', `Proposal ${prop.proposalNumber} status updated to ${status}`, prop.companyName, 'CRM');

    if (status === 'Accepted') {
      confetti({ particleCount: 70, spread: 60 });
      // If linked to lead, move lead to WON!
      if (prop.leadId) {
        updateLeadStage(prop.leadId, 'WON');
      } else {
        pushNotification('Proposal Accepted!', `${prop.companyName} accepted proposal ${prop.proposalNumber}!`, 'LEAD');
      }
    }
  };

  // -------------------------------------------------------------
  // CLIENTS & ONBOARDING
  // -------------------------------------------------------------
  const addClient = (clientData: Omit<Client, 'id' | 'onboardingChecklist'>) => {
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`,
      onboardingChecklist: INITIAL_ONBOARDING_CHECKLIST.map(item => ({ ...item, completed: false }))
    };
    setClients(prev => [newClient, ...prev]);
    addLog('Account Manager', 'Created new client profile', newClient.companyName, 'CRM');
  };

  const toggleOnboardingItem = (clientId: string, itemId: number) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const updatedChecklist = c.onboardingChecklist.map(item => 
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        return { ...c, onboardingChecklist: updatedChecklist };
      }
      return c;
    }));
  };

  const updateClient = (clientId: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...updates } : c));
  };

  // -------------------------------------------------------------
  // PROJECTS & TASKS
  // -------------------------------------------------------------
  const addProject = (proj: Omit<Project, 'id' | 'progressPercent' | 'health'>) => {
    const newProj: Project = {
      ...proj,
      id: `proj-${Date.now()}`,
      progressPercent: 0,
      health: 'ON TRACK'
    };
    setProjects(prev => [newProj, ...prev]);
    addLog('Project Manager', 'Created project', newProj.title, 'PROJECT');
    pushNotification('New Project Initiated', `Project "${newProj.title}" is now active.`, 'SYSTEM');
  };

  const updateProject = (projId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === projId ? { ...p, ...updates } : p));
  };

  const addTask = (task: Omit<Task, 'id' | 'comments' | 'actualHours'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      actualHours: 0,
      comments: []
    };
    setTasks(prev => [newTask, ...prev]);
    addLog('Task Dispatcher', `Assigned task to ${newTask.assignedEmployeeName}`, newTask.title, 'PROJECT');
    pushNotification('Task Assigned', `You have been assigned: "${newTask.title}"`, 'TASK', newTask.assignedEmployeeId, '/tasks');
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    addLog(task.assignedEmployeeName, `Moved task to ${status}`, task.title, 'PROJECT');

    // If designer or video editor moves to IN_REVIEW, auto-create an Approval Item!
    if (status === 'IN_REVIEW' && (task.category === 'Design' || task.category === 'Video')) {
      const existingAppr = approvals.find(a => a.relatedTaskId === taskId);
      if (!existingAppr) {
        const newApproval: ApprovalItem = {
          id: `appr-${Date.now()}`,
          title: task.title,
          type: task.category === 'Design' ? 'DESIGN' : 'VIDEO',
          clientId: task.clientId || 'client-default',
          clientName: task.clientName,
          projectId: task.projectId,
          relatedTaskId: task.id,
          status: 'Pending Internal',
          currentStatus: 'Pending Internal',
          assignedReviewerId: 'user-am',
          clientSignoffRequired: true,
          currentVersion: 1,
          createdAt: new Date().toISOString().split('T')[0],
          versions: [
            {
              versionNumber: 1,
              submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              submittedBy: task.assignedEmployeeName,
              changeNotes: 'Submitted for internal review by creative lead.',
              status: 'PENDING'
            }
          ]
        };
        setApprovals(prev => [newApproval, ...prev]);
        pushNotification(
          'Approval Needed',
          `${task.assignedEmployeeName} submitted "${task.title}" for review.`,
          'APPROVAL',
          'user-am',
          '/approvals'
        );
      }
    }
  };

  const toggleTaskChecklist = (taskId: string, checklistId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updated = t.checklist.map(c => c.id === checklistId ? { ...c, completed: !c.completed } : c);
        return { ...t, checklist: updated };
      }
      return t;
    }));
  };

  const addTaskComment = (taskId: string, authorId: string, content: string) => {
    const author = users.find(u => u.id === authorId) || users[0];
    const newComment = {
      id: `tc-${Date.now()}`,
      authorId,
      authorName: author.name,
      avatar: author.avatar,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      content
    };
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t));
  };

  // -------------------------------------------------------------
  // CONTENT MANAGEMENT & PRODUCTION BOARD
  // -------------------------------------------------------------
  const addContentItem = (item: Omit<ContentItem, 'id' | 'version'>) => {
    const newItem: ContentItem = {
      ...item,
      id: `content-${Date.now()}`,
      version: 1
    };
    setContentItems(prev => [newItem, ...prev]);
    addLog('Content Team', `Added new content item (${item.contentType})`, item.title, 'CONTENT');
  };

  const updateContentStatus = (contentId: string, status: ContentStatus) => {
    setContentItems(prev => prev.map(c => c.id === contentId ? { ...c, status } : c));
  };

  const updateContentItem = (contentId: string, updates: Partial<ContentItem>) => {
    setContentItems(prev => prev.map(c => c.id === contentId ? { ...c, ...updates } : c));
  };

  // -------------------------------------------------------------
  // APPROVALS WORKFLOW
  // -------------------------------------------------------------
  const approveDeliverable = (approvalId: string, feedback?: string) => {
    const item = approvals.find(a => a.id === approvalId);
    if (!item) return;

    confetti({ particleCount: 50, spread: 50 });

    setApprovals(prev => prev.map(a => {
      if (a.id === approvalId) {
        const lastVersion = a.versions[a.versions.length - 1];
        const updatedVersions: ApprovalVersion[] = [
          ...a.versions.slice(0, -1),
          {
            ...lastVersion,
            status: 'APPROVED' as const,
            reviewerFeedback: feedback || 'Approved by client without changes.',
            reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          }
        ];
        return {
          ...a,
          currentStatus: 'APPROVED' as const,
          versions: updatedVersions
        };
      }
      return a;
    }));

    // If linked to content item, move to SCHEDULED!
    if (item.relatedContentId) {
      updateContentStatus(item.relatedContentId, 'SCHEDULED');
    }

    // If linked to task, mark completed!
    if (item.relatedTaskId) {
      updateTaskStatus(item.relatedTaskId, 'COMPLETED');
    }

    addLog('Client / Manager', 'Approved deliverable', item.title, 'APPROVAL');
    pushNotification('Deliverable Approved!', `"${item.title}" has been approved and moved to delivery/publishing.`, 'APPROVAL');
  };

  const requestRevision = (approvalId: string, feedback: string) => {
    const item = approvals.find(a => a.id === approvalId);
    if (!item) return;

    setApprovals(prev => prev.map(a => {
      if (a.id === approvalId) {
        const lastVersion = a.versions[a.versions.length - 1];
        const updatedVersions: ApprovalVersion[] = [
          ...a.versions.slice(0, -1),
          {
            ...lastVersion,
            status: 'REVISION_REQUESTED' as const,
            reviewerFeedback: feedback,
            reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          }
        ];
        return {
          ...a,
          currentStatus: 'REVISION_REQUESTED' as const,
          versions: updatedVersions
        };
      }
      return a;
    }));

    // If linked to task, set task to REVISION
    if (item.relatedTaskId) {
      updateTask(item.relatedTaskId, { status: 'REVISION', feedback });
    }

    addLog('Reviewer', 'Requested revision', item.title, 'APPROVAL');
    pushNotification('Revision Requested', `Revision requested on "${item.title}": ${feedback}`, 'APPROVAL');
  };

  // -------------------------------------------------------------
  // FINANCE & PAYMENTS
  // -------------------------------------------------------------
  const addInvoice = (inv: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const invNumber = `INV-2026-${String(invoices.length + 101).padStart(3, '0')}`;
    const newInv: Invoice = {
      ...inv,
      id: `inv-${Date.now()}`,
      invoiceNumber: invNumber
    };
    setInvoices(prev => [newInv, ...prev]);
    addLog('Rajesh Gupta', `Generated invoice ${invNumber}`, inv.clientName, 'FINANCE');
  };

  const updateInvoiceStatus = (invId: string, status: InvoiceStatus) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invId) {
        const updated = { ...inv, status };
        if (status === 'Paid') {
          updated.amountPaid = inv.total;
          confetti({ particleCount: 60, spread: 60 });
        }
        return updated;
      }
      return inv;
    }));
  };

  const markPaymentPaid = (paymentId: string) => {
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'PAID',
          paidDate: new Date().toISOString().split('T')[0],
          transactionRef: `NEFT-AUTO-${Math.floor(100000 + Math.random() * 900000)}`
        };
      }
      return p;
    }));
    confetti({ particleCount: 60, spread: 55 });
    addLog('Finance Team', 'Marked payment milestone as PAID', paymentId, 'FINANCE');
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newExp, ...prev]);
    addLog('Finance Team', `Logged agency expense ₹${expenseData.amount.toLocaleString()}`, expenseData.title, 'FINANCE');
  };

  // -------------------------------------------------------------
  // CHAT & DISCUSSIONS
  // -------------------------------------------------------------
  const sendChatMessage = (projectId: string, senderId: string, content: string, mentions: string[] = []) => {
    const sender = users.find(u => u.id === senderId) || users[0];
    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      projectId,
      senderId,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      content,
      mentions
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const createTaskFromMessage = (messageId: string, taskTitle: string, assigneeId: string, deadline: string) => {
    const msg = chatMessages.find(m => m.id === messageId);
    if (!msg) return;

    const project = projects.find(p => p.id === msg.projectId) || projects[0];
    const assignee = users.find(u => u.id === assigneeId) || users[3]; // default designer/video

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      description: `Task created directly from team chat message: "${msg.content}"`,
      projectId: project.id,
      projectName: project.title,
      clientId: project.clientId,
      clientName: project.clientName,
      assignedEmployeeId: assignee.id,
      assignedEmployeeName: assignee.name,
      category: 'General',
      priority: 'MEDIUM',
      status: 'TODO',
      startDate: new Date().toISOString().split('T')[0],
      deadline: deadline || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedHours: 3,
      actualHours: 0,
      checklist: [{ id: 'c1', text: 'Action requested in chat', completed: false }],
      comments: [],
      attachments: []
    };

    setTasks(prev => [newTask, ...prev]);
    setChatMessages(prev => prev.map(m => m.id === messageId ? { ...m, convertedToTaskId: newTask.id } : m));
    addLog('Chat Assistant', `Created task from chat mention`, newTask.title, 'PROJECT');
    pushNotification('Task Created from Chat', `Created task: "${taskTitle}" assigned to ${assignee.name}`, 'TASK');
  };

  // -------------------------------------------------------------
  // NOTIFICATIONS
  // -------------------------------------------------------------
  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // -------------------------------------------------------------
  // ASSET FILES
  // -------------------------------------------------------------
  const addFileAsset = (file: Omit<FileAsset, 'id' | 'uploadedAt' | 'version'>) => {
    const newFile: FileAsset = {
      ...file,
      id: `file-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      version: 1
    };
    setFiles(prev => [newFile, ...prev]);
    addLog(file.uploadedBy, 'Uploaded asset file', file.fileName, 'CONTENT');
  };

  // -------------------------------------------------------------
  // ENTREPRISE AI BRAIN ENGINE (LIVE DATABASE QUERYING)
  // -------------------------------------------------------------
  const askBrain = async (query: string): Promise<{ answer: string; relatedData?: any }> => {
    const q = query.toLowerCase().trim();

    // 1. Delayed / At Risk projects
    if (q.includes('delayed') || q.includes('at risk') || q.includes('behind schedule')) {
      const problematic = projects.filter(p => p.health === 'DELAYED' || p.health === 'AT RISK' || p.status === 'Review');
      if (problematic.length === 0) {
        return { answer: '✅ All agency projects are currently marked ON TRACK with zero delays reported.' };
      }
      const summary = problematic.map(p => `• **${p.title}** (${p.clientName}) — Health: **${p.health}**, Status: ${p.status}, Progress: ${p.progressPercent}%`).join('\n');
      return {
        answer: `Found **${problematic.length}** project(s) requiring attention:\n\n${summary}\n\n*Action recommended:* Check pending reviews or reach out to client account manager.`,
        relatedData: problematic
      };
    }

    // 2. Unpaid clients / Pending / Overdue Revenue
    if (q.includes('unpaid') || q.includes('haven\'t paid') || q.includes('not paid') || q.includes('pending payment') || q.includes('pending revenue') || q.includes('overdue payment')) {
      const overdueInvoices = invoices.filter(i => i.status === 'Overdue');
      const pendingInvoices = invoices.filter(i => i.status === 'Sent' || i.status === 'Partially Paid');
      const overduePayments = payments.filter(p => p.status === 'OVERDUE');

      const totalOverdue = overdueInvoices.reduce((acc, curr) => acc + (curr.total - curr.amountPaid), 0);
      const totalPending = pendingInvoices.reduce((acc, curr) => acc + (curr.total - curr.amountPaid), 0);

      let text = `💳 **Financial Status:**\n- **Overdue Invoices:** ₹${totalOverdue.toLocaleString()} across ${overdueInvoices.length} invoice(s)\n- **Pending Invoices:** ₹${totalPending.toLocaleString()} across ${pendingInvoices.length} invoice(s)\n\n`;
      if (overdueInvoices.length > 0) {
        text += `**Overdue Invoices:**\n` + overdueInvoices.map(i => `• ${i.clientName}: Invoice **${i.invoiceNumber}** (₹${(i.total - i.amountPaid).toLocaleString()}) - Due: ${i.dueDate}`).join('\n');
      }
      return { answer: text, relatedData: { overdueInvoices, pendingInvoices, overduePayments } };
    }

    // 3. Tasks due tomorrow / due today / overdue
    if (q.includes('due tomorrow') || q.includes('due today') || q.includes('overdue task') || q.includes('what tasks are')) {
      const todayStr = '2026-10-13'; // Local current day
      const dueToday = tasks.filter(t => t.deadline === todayStr && t.status !== 'COMPLETED');
      const overdue = tasks.filter(t => t.deadline < todayStr && t.status !== 'COMPLETED');
      const dueTomorrow = tasks.filter(t => t.deadline === '2026-10-14' && t.status !== 'COMPLETED');

      let reply = `📋 **Task Schedule Overview:**\n\n`;
      reply += `• **Due Today (7 Tasks in agency, ${dueToday.length} active):**\n`;
      if (dueToday.length > 0) {
        reply += dueToday.map(t => `  - [${t.category}] **${t.title}** (Assigned to: ${t.assignedEmployeeName})`).join('\n') + '\n\n';
      } else {
        reply += `  *(None pending)*\n\n`;
      }

      reply += `• **Overdue Tasks (${overdue.length}):**\n`;
      if (overdue.length > 0) {
        reply += overdue.map(t => `  - ⚠️ **${t.title}** (${t.clientName}, Assigned to: ${t.assignedEmployeeName}) — Deadline was: ${t.deadline}`).join('\n') + '\n\n';
      }

      reply += `• **Due Tomorrow (${dueTomorrow.length}):**\n`;
      if (dueTomorrow.length > 0) {
        reply += dueTomorrow.map(t => `  - **${t.title}** (Assigned: ${t.assignedEmployeeName})`).join('\n');
      }

      return { answer: reply, relatedData: { dueToday, overdue, dueTomorrow } };
    }

    // 4. Reels currently in editing / production
    if (q.includes('editing') || q.includes('reels') || q.includes('video')) {
      const inEditing = contentItems.filter(c => c.status === 'EDITING' || c.status === 'DESIGN');
      const videoTasks = tasks.filter(t => t.category === 'Video' && t.status !== 'COMPLETED');
      let msg = `🎬 **Video & Reel Production Status:**\n\n`;
      msg += `There are **${inEditing.length}** content item(s) actively in Editing/Design:\n`;
      msg += inEditing.map(c => `• **${c.title}** (${c.clientName}) — Type: ${c.contentType}, Status: **${c.status}**, Publish Target: ${c.publishDate}`).join('\n');
      msg += `\n\n**Active Video Tasks (${videoTasks.length}):**\n`;
      msg += videoTasks.map(t => `• **${t.title}** (Editor: ${t.assignedEmployeeName}) - Status: ${t.status}`).join('\n');
      return { answer: msg, relatedData: inEditing };
    }

    // 5. Leads needing follow-up
    if (q.includes('lead') || q.includes('follow-up') || q.includes('crm') || q.includes('pipeline')) {
      const needFollowUp = leads.filter(l => l.stage !== 'WON' && l.stage !== 'LOST');
      const highScores = needFollowUp.filter(l => l.leadScore >= 70);
      let res = `🎯 **CRM Follow-Up Priorities (${needFollowUp.length} active leads):**\n\n`;
      res += `**Top High-Priority Leads (Score ≥ 70):**\n`;
      res += highScores.map(l => `• **${l.companyName}** (Score: ${l.leadScore}/100, Est. Budget: ₹${l.estimatedBudget.toLocaleString()}) — Stage: **${l.stage}**, Next Call: ${l.nextFollowUpDate}\n  *Notes:* ${l.notes}`).join('\n\n');
      return { answer: res, relatedData: needFollowUp };
    }

    // 6. Designer / Team Workload
    if (q.includes('workload') || q.includes('highest workload') || q.includes('who is working on what') || q.includes('team')) {
      const counts: Record<string, number> = {};
      tasks.forEach(t => {
        if (t.status !== 'COMPLETED') {
          counts[t.assignedEmployeeName] = (counts[t.assignedEmployeeName] || 0) + 1;
        }
      });
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      let teamSummary = `⚡ **Current Team Workload (Active Tasks):**\n\n`;
      sorted.forEach(([emp, count], idx) => {
        const bar = '█'.repeat(count * 2) + '░'.repeat(Math.max(0, 10 - count * 2));
        teamSummary += `${idx + 1}. **${emp}**: ${count} active tasks \`[${bar}]\`\n`;
      });
      return { answer: teamSummary, relatedData: counts };
    }

    // 7. General agency metrics
    const totalRev = invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + b.amountPaid, 0);
    const activeClients = clients.filter(c => c.health !== 'At Risk').length;
    const activeProjs = projects.filter(p => p.status === 'In Progress').length;
    return {
      answer: `📊 **Agency Overview for Karthik V (MD):**\n\n• **Active Clients:** ${activeClients} retaining clients\n• **Active Projects:** ${activeProjs} projects running\n• **Realized Revenue:** ₹${totalRev.toLocaleString()}\n• **Pending Invoices:** ₹${invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue').reduce((a, b) => a + (b.total - b.amountPaid), 0).toLocaleString()}\n• **Open Tasks:** ${tasks.filter(t => t.status !== 'COMPLETED').length}\n\nAsk me specific questions like: *"Which projects are delayed?"*, *"Which clients haven't paid?"*, *"Show me designer workload"*, or *"What reels are in editing?"*.`
    };
  };

  // AI Task assistant breakdown
  const suggestAiTaskBreakdown = (prompt: string) => {
    // Generate structured agency production task suite
    const clientName = prompt.toLowerCase().includes('sanchari') 
      ? 'Sanchari Trails' 
      : prompt.toLowerCase().includes('murugan') 
        ? 'Murugan Family Restaurant' 
        : prompt.toLowerCase().includes('boba')
          ? 'Boba Cub'
          : 'Selected Client';

    return {
      title: `Winter Trekking Campaign Reel — ${clientName}`,
      hook: `"They told you to pack heavy for winter. They forgot to tell you the only weight that matters is in your mind."`,
      pillar: 'Raw Trail Realities & Preparation',
      subtasks: [
        { title: 'Script & Voiceover Hook for Winter Reel', category: 'Content' as const, employeeId: 'user-writer', hours: 2 },
        { title: 'Storyboarding & Font Template Setup', category: 'Design' as const, employeeId: 'user-designer', hours: 2.5 },
        { title: '4K Snow B-Roll Color Grade & Foley Audio Mix', category: 'Video' as const, employeeId: 'user-video', hours: 4 },
        { title: 'Client Review & Ad Cutdown Version (9:16)', category: 'General' as const, employeeId: 'user-am', hours: 1 }
      ]
    };
  };

  // Reset to initial demo data
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUsers(INITIAL_USERS);
    setLeads(INITIAL_LEADS);
    setCalls(INITIAL_CALLS);
    setCommunications(INITIAL_COMMUNICATIONS);
    setProposals(INITIAL_PROPOSALS);
    setClients(INITIAL_CLIENTS);
    setStrategies(INITIAL_STRATEGIES);
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setContentItems(INITIAL_CONTENT);
    setApprovals(INITIAL_APPROVALS);
    setFiles(INITIAL_FILES);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setExpenses(INITIAL_EXPENSES);
    setChatMessages(INITIAL_CHAT);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    pushNotification('Demo Data Reset', 'All agency records have been restored to clean initial demo state.', 'SYSTEM');
  };

  return (
    <AppContext.Provider
      value={{
        users,
        leads,
        calls,
        communications,
        proposals,
        clients,
        strategies,
        projects,
        tasks,
        contentItems,
        approvals,
        files,
        invoices,
        payments,
        expenses,
        chatMessages,
        notifications,
        activityLogs,
        automationRules,

        addLead,
        updateLeadStage,
        updateLead,
        logCall,
        addCommunication,

        createProposal,
        updateProposalStatus,

        addClient,
        toggleOnboardingItem,
        updateClient,

        addProject,
        updateProject,
        addTask,
        updateTask,
        updateTaskStatus,
        toggleTaskChecklist,
        addTaskComment,

        addContentItem,
        updateContentStatus,
        updateContentItem,

        approveDeliverable,
        requestRevision,

        addInvoice,
        updateInvoiceStatus,
        markPaymentPaid,
        addExpense,

        sendChatMessage,
        createTaskFromMessage,

        markNotificationRead,
        markAllNotificationsRead,

        addFileAsset,

        askBrain,
        suggestAiTaskBreakdown,

        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
