export type UserRole = 
  | 'ADMIN' 
  | 'OWNER'
  | 'MANAGER'
  | 'MEMBER'
  | 'SALES' 
  | 'STRATEGIST' 
  | 'DESIGNER' 
  | 'VIDEO_EDITOR' 
  | 'CONTENT_WRITER' 
  | 'ACCOUNT_MANAGER' 
  | 'FINANCE'
  | 'CLIENT';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  avatar: string;
  status: 'ACTIVE' | 'AWAY' | 'OFFLINE';
  joiningDate: string;
  clientId?: string; // If role is CLIENT
  title: string;
}

export type LeadSource = 
  | 'Instagram' 
  | 'WhatsApp' 
  | 'Cold Call' 
  | 'Website' 
  | 'Referral' 
  | 'LinkedIn' 
  | 'Facebook' 
  | 'Google' 
  | 'Walk-in' 
  | 'Other';

export type LeadStage = 
  | 'NEW'
  | 'CONTACTED'
  | 'INTERESTED'
  | 'QUALIFIED'
  | 'MEETING'
  | 'MEETING_BOOKED'
  | 'PROPOSAL_SENT'
  | 'NEGOTIATION'
  | 'WON'
  | 'ONBOARDING'
  | 'LOST';

export interface Lead {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  instagram?: string;
  website?: string;
  location: string;
  industry: string;
  source: LeadSource;
  leadScore: number; // 0 - 100
  estimatedBudget: number; // in INR
  serviceInterested: string;
  assignedSalespersonId: string;
  stage: LeadStage;
  nextFollowUpDate: string;
  notes: string;
  tags: string[];
  createdAt: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  decisionMakerAvailable: boolean;
}

export type CallOutcome = 
  | 'Interested' 
  | 'Not interested' 
  | 'Call later' 
  | 'Wrong number' 
  | 'Meeting booked' 
  | 'No answer'
  | 'Converted'
  | 'Busy';

export interface CallRecord {
  id: string;
  leadId: string;
  leadName: string;
  callerId: string;
  callerName: string;
  timestamp: string;
  durationMinutes: number;
  outcome: CallOutcome;
  notes: string;
  audioRecordingUrl?: string;
  nextCallDate?: string;
}

export type CommunicationChannel = 'WhatsApp' | 'Call' | 'Email' | 'Meeting' | 'Instagram' | 'LinkedIn' | 'Twitter' | 'Phone';

export interface Communication {
  id: string;
  entityType: 'LEAD' | 'CLIENT';
  entityId: string;
  entityName: string;
  channel: CommunicationChannel;
  direction: 'INBOUND' | 'OUTBOUND';
  authorName: string;
  date: string;
  summary: string;
  details?: string;
}

export interface ProposalItem {
  id?: string;
  service?: string;
  description?: string;
  deliverables?: string;
  rate?: number;
  quantity: number;
  total?: number;
  amount?: number;
}

export type ProposalStatus = 'Draft' | 'Sent' | 'Viewed' | 'Negotiation' | 'Accepted' | 'Rejected' | 'Expired' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'DRAFT';

export interface Proposal {
  id: string;
  proposalNumber: string;
  leadId?: string;
  clientId?: string;
  clientName: string;
  companyName: string;
  title?: string;
  status: ProposalStatus;
  items: ProposalItem[];
  subtotal: number;
  discount: number;
  tax: number; // 18% GST typical
  finalAmount: number;
  totalValue?: number;
  validUntil?: string;
  timeline: string;
  paymentTerms: string;
  revisionPolicy: string;
  terms: string;
  expiryDate: string;
  createdAt: string;
}

export type ClientHealth = 'Healthy' | 'Needs Attention' | 'At Risk';

export interface OnboardingItem {
  id: number;
  title: string;
  completed: boolean;
  notes?: string;
}

export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  location: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  accountManagerId: string;
  startDate: string;
  contractValue: number;
  monthlyRetainer: number;
  health: ClientHealth;
  healthReason?: string;
  onboardingChecklist: OnboardingItem[];
  brandColors?: string[];
  brandFonts?: string[];
}

export interface BrandStrategy {
  brandPositioning: string;
  targetAudience: string;
  usp: string;
  brandVoice: string;
  competitors: string[];
  contentPillars: string[];
}

export interface MonthlyStrategy {
  month: string;
  focusTheme: string;
  targetImpressions: number;
  targetEngagementRate: number;
  targetLeadsOrSales: number;
  contentPlanSummary: string;
}

export interface StrategyDoc {
  id: string;
  clientId: string;
  clientName: string;
  brandStrategy: BrandStrategy;
  monthlyStrategies?: MonthlyStrategy[];
  monthlyStrategy?: any;
  updatedAt?: string;
  lastUpdated?: string;
}

export type ProjectHealth = 'ON TRACK' | 'AT RISK' | 'DELAYED';
export type ProjectStatus = 'Planning' | 'In Progress' | 'Review' | 'Client Approval' | 'Completed' | 'On Hold' | 'Cancelled';

export interface Project {
  id: string;
  title: string;
  name?: string;
  clientId: string;
  clientName: string;
  projectManagerId: string;
  projectManagerName?: string;
  startDate: string;
  deadline: string;
  budget: number;
  status: ProjectStatus;
  health: ProjectHealth;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  teamMemberIds: string[];
  description: string;
  progressPercent: number;
  createdAt?: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'REVISION' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskCategory = 'General' | 'Design' | 'Video' | 'Content' | 'Strategy' | 'Sales' | 'Finance' | 'Operations';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  avatar: string;
  timestamp: string;
  content: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  clientId?: string;
  clientName: string;
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string;
  deadline: string;
  estimatedHours: number;
  actualHours: number;
  checklist: ChecklistItem[];
  comments: TaskComment[];
  attachments: string[];
  createdAt?: string;
  // Specific specs for design / video tasks
  dimensions?: string;
  aspectRatio?: string;
  videoDuration?: string;
  script?: string;
  rawFootageLink?: string;
  referenceLinks?: string[];
  copyContent?: string;
  feedback?: string;
  revisionVersion?: number;
}

export type ContentType = 'Reel' | 'Post' | 'Carousel' | 'Story' | 'YouTube' | 'Blog';
export type ContentStatus = 
  | 'IDEA' 
  | 'SCRIPT' 
  | 'DESIGN' 
  | 'EDITING' 
  | 'REVIEW' 
  | 'APPROVAL' 
  | 'SCHEDULED' 
  | 'PUBLISHED';

export interface ContentItem {
  id: string;
  clientId: string;
  clientName: string;
  projectId: string;
  platform: 'Instagram' | 'LinkedIn' | 'YouTube' | 'Twitter' | 'Website';
  contentType: ContentType;
  title: string;
  hook: string;
  script?: string;
  caption?: string;
  cta?: string;
  writerId?: string;
  designerId?: string;
  editorId?: string;
  publishDate: string;
  status: ContentStatus;
  thumbnailUrl?: string;
  deliverableUrl?: string;
  feedbackNotes?: string;
  version: number;
}

export type ApprovalType = 'Design' | 'Video' | 'Content' | 'Campaign Strategy' | 'DESIGN' | 'VIDEO' | 'COPY' | 'WEBSITE';
export type ApprovalStatus = 
  | 'Pending Internal' 
  | 'Pending Client' 
  | 'Revision Requested' 
  | 'Approved' 
  | 'Rejected'
  | 'PENDING_INTERNAL'
  | 'PENDING_CLIENT'
  | 'REVISION_REQUESTED'
  | 'APPROVED'
  | 'REJECTED';

export interface ApprovalVersion {
  versionNumber: number;
  submittedAt: string;
  submittedBy: string;
  assetUrl?: string;
  thumbnailUrl?: string;
  notes?: string;
  changeNotes?: string;
  clientFeedback?: string;
  clientFeedbackDate?: string;
  reviewerFeedback?: string;
  previewUrl?: string;
  reviewedAt?: string;
  status?: string;
}

export interface ApprovalItem {
  id: string;
  title: string;
  type: ApprovalType;
  clientId: string;
  clientName: string;
  projectId: string;
  relatedContentId?: string;
  relatedTaskId?: string;
  status?: ApprovalStatus;
  currentStatus: ApprovalStatus;
  clientSignoffRequired?: boolean;
  assignedReviewerId: string; // Internal account manager or art director
  currentVersion?: number;
  versions: ApprovalVersion[];
  createdAt: string;
}

export type FileCategory = 
  | 'Logo' 
  | 'Brand Asset' 
  | 'Brand Assets'
  | 'Raw Video' 
  | 'Raw Footage'
  | 'Rendered Video' 
  | 'Design File' 
  | 'Designs'
  | 'Contract' 
  | 'Documents'
  | 'Invoice' 
  | 'Invoices'
  | 'Proposals'
  | 'Final Exports'
  | 'Report';

export interface FileAsset {
  id: string;
  fileName: string;
  fileType: string;
  category: FileCategory;
  clientId?: string;
  clientName?: string;
  projectId?: string;
  sizeBytes: number;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
  url: string;
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Partially Paid' | 'Overdue' | 'PAID' | 'SENT' | 'PENDING' | 'OVERDUE';

export interface InvoiceItem {
  id?: string;
  description: string;
  amount: number;
  quantity: number;
  rate?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amount?: number;
  issuedDate: string;
  issueDate?: string;
  dueDate: string;
  status: InvoiceStatus;
  amountPaid: number;
}

export interface PaymentMilestone {
  id: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  title: string;
  amount: number;
  dueDate: string;
  scheduledDate?: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'Paid' | 'Pending' | 'Overdue';
  paidDate?: string;
  transactionRef?: string;
  invoiceId?: string;
  method?: string;
}

export type ExpenseCategory = 
  | 'Software' 
  | 'Salaries' 
  | 'Freelancers' 
  | 'Advertising' 
  | 'Equipment' 
  | 'Travel' 
  | 'Production' 
  | 'Office' 
  | 'Shoot Logistics'
  | 'Software & Tools'
  | 'Operations'
  | 'Other';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paidTo: string;
  paidBy?: string;
  receiptUrl?: string;
  invoiceAttached?: boolean;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  content: string;
  mentions: string[];
  attachments?: string[];
  convertedToTaskId?: string;
}

export interface AppNotification {
  id: string;
  userId: string; // or 'ALL'
  title: string;
  message: string;
  timestamp: string;
  type: 'TASK' | 'APPROVAL' | 'PAYMENT' | 'LEAD' | 'SYSTEM' | 'DEADLINE' | 'ALERT';
  read: boolean;
  linkUrl?: string;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  userName?: string;
  authorName?: string;
  userRole?: UserRole;
  action: string;
  targetName?: string;
  target?: string;
  category?: string;
  timestamp: string;
  details?: string;
}

export interface AutomationRule {
  id: string;
  name?: string;
  trigger: string;
  action?: string;
  actions?: string[];
  active?: boolean;
  enabled?: boolean;
  condition?: string;
  lastFired?: string;
}
