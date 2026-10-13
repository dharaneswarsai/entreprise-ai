import { UserRole } from '../types';

export interface EnterpriseEmployee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  title: string;
  department: string;
  avatar: string;
  status?: 'ACTIVE' | 'AWAY' | 'OFFLINE';
  joiningDate?: string;
  passwordHint: string;
}

export interface EnterpriseBusiness {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  industry: string;
  plan: string;
  logoLetter: string;
  color: string;
  employees: EnterpriseEmployee[];
}

export const ENTERPRISE_BUSINESSES: EnterpriseBusiness[] = [
  {
    id: 'org-apex-001',
    name: 'Apex Cloud Tech',
    slug: 'apex-cloud',
    tagline: 'Multi-Region Kubernetes & API Gateway Cloud SaaS',
    industry: 'Cloud Infrastructure & B2B SaaS',
    plan: 'Enterprise Cloud Tier',
    logoLetter: 'A',
    color: '#0F4C3A',
    employees: [
      {
        id: 'usr-apex-1',
        name: 'Alex Rivers',
        email: 'alex.rivers@apexcloud.io',
        role: 'OWNER',
        title: 'Chief Technology Officer & Founder',
        department: 'Cloud Infrastructure',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        passwordHint: 'apex2026',
      },
      {
        id: 'usr-apex-2',
        name: 'Marcus Chen',
        email: 'marcus.chen@apexcloud.io',
        role: 'ADMIN',
        title: 'VP of Platform Engineering',
        department: 'Platform Engineering',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        passwordHint: 'apex2026',
      },
      {
        id: 'usr-apex-3',
        name: 'Elena Rostova',
        email: 'elena.rostova@apexcloud.io',
        role: 'MANAGER',
        title: 'DevOps & Security Lead',
        department: 'Information Security',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        passwordHint: 'apex2026',
      },
      {
        id: 'usr-apex-4',
        name: 'Tariq Mansoor',
        email: 'tariq.mansoor@apexcloud.io',
        role: 'MEMBER',
        title: 'Senior Site Reliability Engineer',
        department: 'Product Architecture',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        passwordHint: 'apex2026',
      },
    ],
  },
  {
    id: 'org-pulse-002',
    name: 'Pulse Creative Media',
    slug: 'pulse-creative',
    tagline: 'Omnichannel Brand Campaigns & 4K Studio Bays',
    industry: 'Digital Marketing & Creative Agency',
    plan: 'Agency Studio Pro',
    logoLetter: 'P',
    color: '#D97706',
    employees: [
      {
        id: 'usr-pulse-1',
        name: 'Chloe Dupont',
        email: 'chloe.dupont@pulsecreative.co',
        role: 'OWNER',
        title: 'Managing Director & Founder',
        department: 'Brand Strategy',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        passwordHint: 'pulse2026',
      },
      {
        id: 'usr-pulse-2',
        name: 'Leo Santiago',
        email: 'leo.santiago@pulsecreative.co',
        role: 'ADMIN',
        title: 'Executive Creative Director',
        department: '4K Video Bays',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
        passwordHint: 'pulse2026',
      },
      {
        id: 'usr-pulse-3',
        name: 'Maya Lin',
        email: 'maya.lin@pulsecreative.co',
        role: 'MANAGER',
        title: 'Senior Video Production Lead',
        department: 'Paid Performance Media',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
        passwordHint: 'pulse2026',
      },
      {
        id: 'usr-pulse-4',
        name: 'Samuel Vance',
        email: 'samuel.vance@pulsecreative.co',
        role: 'MEMBER',
        title: 'Motion Graphics Designer',
        department: 'Client Accounts',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
        passwordHint: 'pulse2026',
      },
    ],
  },
  {
    id: 'org-nexus-003',
    name: 'Nexus BioHealth',
    slug: 'nexus-biohealth',
    tagline: 'Genomic Sequencing & FDA Phase III Clinical Trials',
    industry: 'Biotechnology & Healthcare Operations',
    plan: 'Life Sciences Enterprise',
    logoLetter: 'N',
    color: '#0284C7',
    employees: [
      {
        id: 'usr-nexus-1',
        name: 'Dr. Aravind Nair',
        email: 'dr.aravind.nair@nexusbio.org',
        role: 'OWNER',
        title: 'Chief Medical Officer',
        department: 'Clinical Trial Operations',
        avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150',
        passwordHint: 'nexus2026',
      },
      {
        id: 'usr-nexus-2',
        name: 'Dr. Sarah Jenkins',
        email: 'sarah.jenkins@nexusbio.org',
        role: 'ADMIN',
        title: 'Director of Clinical Trial Protocols',
        department: 'Genomic Sequencing Labs',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
        passwordHint: 'nexus2026',
      },
      {
        id: 'usr-nexus-3',
        name: 'Kenji Sato',
        email: 'kenji.sato@nexusbio.org',
        role: 'MANAGER',
        title: 'Laboratory Automation Specialist',
        department: 'FDA Regulatory Affairs',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
        passwordHint: 'nexus2026',
      },
      {
        id: 'usr-nexus-4',
        name: 'Claire Dubois',
        email: 'claire.dubois@nexusbio.org',
        role: 'MEMBER',
        title: 'Bio-Safety Compliance Officer',
        department: 'Bio-Safety QA',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
        passwordHint: 'nexus2026',
      },
    ],
  },
  {
    id: 'org-vanguard-004',
    name: 'Vanguard Global Logistics',
    slug: 'vanguard-logistics',
    tagline: 'Maritime Shipping, Air Cargo & Cold-Chain IoT Routing',
    industry: 'Freight & Supply Chain Operations',
    plan: 'Supply Chain Operations',
    logoLetter: 'V',
    color: '#1E3A8A',
    employees: [
      {
        id: 'usr-van-1',
        name: 'Victor Kovacs',
        email: 'victor.kovacs@vanguardfreight.com',
        role: 'OWNER',
        title: 'VP of Global Supply Chain',
        department: 'Maritime & Air Freight',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
        passwordHint: 'vanguard2026',
      },
      {
        id: 'usr-van-2',
        name: 'Ananya Sharma',
        email: 'ananya.sharma@vanguardfreight.com',
        role: 'ADMIN',
        title: 'Fleet Operations Director',
        department: 'Smart Warehouse Centers',
        avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150',
        passwordHint: 'vanguard2026',
      },
      {
        id: 'usr-van-3',
        name: 'Diego Morales',
        email: 'diego.morales@vanguardfreight.com',
        role: 'MANAGER',
        title: 'Port Customs Dispatch Lead',
        department: 'Customs & Port Compliance',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        passwordHint: 'vanguard2026',
      },
      {
        id: 'usr-van-4',
        name: 'Fatima Zahra',
        email: 'fatima.zahra@vanguardfreight.com',
        role: 'MEMBER',
        title: 'Cold-Chain IoT Sensor Specialist',
        department: 'Cold-Chain IoT Dispatch',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        passwordHint: 'vanguard2026',
      },
    ],
  },
];

const CUSTOM_BIZ_KEY = 'ENTREPRISE_CUSTOM_BUSINESSES';

export function getStoredEnterpriseBusinesses(): EnterpriseBusiness[] {
  try {
    const raw = localStorage.getItem(CUSTOM_BIZ_KEY);
    if (raw) {
      const parsed: EnterpriseBusiness[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with base 4, avoiding duplicates
        const existingIds = new Set(ENTERPRISE_BUSINESSES.map(b => b.id));
        const customUnique = parsed.filter(b => !existingIds.has(b.id));
        return [...ENTERPRISE_BUSINESSES, ...customUnique];
      }
    }
  } catch (e) {
    // fallback
  }
  return ENTERPRISE_BUSINESSES;
}

export function saveCustomBusiness(biz: EnterpriseBusiness): EnterpriseBusiness[] {
  try {
    const existing = getStoredEnterpriseBusinesses();
    const updated = [...existing.filter(b => b.id !== biz.id), biz];
    const customOnly = updated.filter(b => !ENTERPRISE_BUSINESSES.some(base => base.id === b.id));
    localStorage.setItem(CUSTOM_BIZ_KEY, JSON.stringify(customOnly));
    return updated;
  } catch (e) {
    return ENTERPRISE_BUSINESSES;
  }
}
