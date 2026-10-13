import {
  User,
  Lead,
  CallRecord,
  Communication,
  Proposal,
  Client,
  StrategyDoc,
  Project,
  Task,
  ContentItem,
  ApprovalItem,
  FileAsset,
  Invoice,
  PaymentMilestone,
  Expense,
  ChatMessage,
  AppNotification,
  ActivityLog,
  AutomationRule
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Karthik V',
    email: 'karthik@entrepriseai.agency',
    phone: '+91 98401 23450',
    role: 'ADMIN',
    department: 'Executive Leadership',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joiningDate: '2023-01-15',
    title: 'Managing Director & Founder'
  },
  {
    id: 'user-sales',
    name: 'Arjun Mehta',
    email: 'arjun.sales@entrepriseai.agency',
    phone: '+91 98401 23451',
    role: 'SALES',
    department: 'Business Development',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joiningDate: '2023-04-10',
    title: 'Head of Business Development'
  },
  {
    id: 'user-strategist',
    name: 'Vikram Sen',
    email: 'vikram.strategy@entrepriseai.agency',
    phone: '+91 98401 23452',
    role: 'STRATEGIST',
    department: 'Brand & Marketing Strategy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joiningDate: '2023-05-01',
    title: 'Lead Brand & Growth Strategist'
  },
  {
    id: 'user-designer',
    name: 'Priya Sharma',
    email: 'priya.design@entrepriseai.agency',
    phone: '+91 98401 23453',
    role: 'DESIGNER',
    department: 'Creative & Visual Design',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joiningDate: '2023-06-15',
    title: 'Senior Visual & UI Designer'
  },
  {
    id: 'user-video',
    name: 'Rahul Verma',
    email: 'rahul.video@entrepriseai.agency',
    phone: '+91 98401 23454',
    role: 'VIDEO_EDITOR',
    department: 'Video Production & Motion',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joiningDate: '2023-07-20',
    title: 'Senior Video Editor & Reel Producer'
  },
  {
    id: 'user-writer',
    name: 'Ananya Iyer',
    email: 'ananya.content@entrepriseai.agency',
    phone: '+91 98401 23455',
    role: 'CONTENT_WRITER',
    department: 'Content & Copywriting',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joiningDate: '2023-08-01',
    title: 'Lead Copywriter & Scriptwriter'
  },
  {
    id: 'user-am',
    name: 'Meera Nair',
    email: 'meera.am@entrepriseai.agency',
    phone: '+91 98401 23456',
    role: 'ACCOUNT_MANAGER',
    department: 'Client Success',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joiningDate: '2023-03-12',
    title: 'Senior Account Manager'
  },
  {
    id: 'user-finance',
    name: 'Rajesh Gupta',
    email: 'rajesh.finance@entrepriseai.agency',
    phone: '+91 98401 23457',
    role: 'FINANCE',
    department: 'Finance & Accounts',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joiningDate: '2023-02-18',
    title: 'Finance & Operations Controller'
  },
  {
    id: 'user-client',
    name: 'Rohan Roy',
    email: 'rohan@sancharitrails.com',
    phone: '+91 98401 99999',
    role: 'CLIENT',
    department: 'Client Partner',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    joiningDate: '2024-01-10',
    clientId: 'client-1',
    title: 'Founder & CEO, Sanchari Trails'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    companyName: 'GreenRoot Organics',
    contactPerson: 'Aditi Rao',
    phone: '+91 98765 43210',
    email: 'aditi@greenroot.in',
    instagram: '@greenrootorganics',
    website: 'https://greenrootorganics.com',
    location: 'Bangalore, KA',
    industry: 'Organic D2C FMCG',
    source: 'Instagram',
    leadScore: 84,
    estimatedBudget: 95000,
    serviceInterested: 'Social Media & Performance Creative',
    assignedSalespersonId: 'user-sales',
    stage: 'PROPOSAL_SENT',
    nextFollowUpDate: '2026-10-14',
    notes: 'Very enthusiastic about short-form reels. Proposal #PROP-2026-004 sent for ₹95,000/mo retainer.',
    tags: ['High Priority', 'D2C', 'Reels'],
    createdAt: '2026-10-02',
    urgency: 'HIGH',
    decisionMakerAvailable: true
  },
  {
    id: 'lead-2',
    companyName: 'Apex Dental Studios',
    contactPerson: 'Dr. Siddharth Rao',
    phone: '+91 98888 77665',
    email: 'siddharth@apexdental.co',
    instagram: '@apexdentalstudio',
    website: 'https://apexdental.co',
    location: 'Chennai, TN',
    industry: 'Healthcare & Aesthetics',
    source: 'Cold Call',
    leadScore: 74,
    estimatedBudget: 60000,
    serviceInterested: 'Local SEO & Video Patient Stories',
    assignedSalespersonId: 'user-sales',
    stage: 'NEGOTIATION',
    nextFollowUpDate: '2026-10-13',
    notes: 'Dr. Rao requested 10% discount on 6-month upfront commitment. Follow up call scheduled today.',
    tags: ['Healthcare', 'Local', 'Video'],
    createdAt: '2026-10-04',
    urgency: 'HIGH',
    decisionMakerAvailable: true
  },
  {
    id: 'lead-3',
    companyName: 'UrbanKicks Sneakers',
    contactPerson: 'Karan Grover',
    phone: '+91 98222 33445',
    email: 'karan@urbankicks.store',
    instagram: '@urbankicksofficial',
    website: 'https://urbankicks.store',
    location: 'Mumbai, MH',
    industry: 'Fashion & Streetwear',
    source: 'LinkedIn',
    leadScore: 78,
    estimatedBudget: 120000,
    serviceInterested: 'Full Funnel Ad Creative & Influencer Strategy',
    assignedSalespersonId: 'user-sales',
    stage: 'MEETING',
    nextFollowUpDate: '2026-10-15',
    notes: 'Pitch deck presented. Strategy team joining virtual call Thursday 3 PM.',
    tags: ['Fashion', 'Influencer', 'High Budget'],
    createdAt: '2026-10-06',
    urgency: 'MEDIUM',
    decisionMakerAvailable: true
  },
  {
    id: 'lead-4',
    companyName: 'SpiceRoute Cloud Kitchens',
    contactPerson: 'Chef Farhan Qureshi',
    phone: '+91 97111 88223',
    email: 'farhan@spiceroutekitchens.com',
    instagram: '@spiceroutefoods',
    location: 'Hyderabad, TS',
    industry: 'F&B Cloud Kitchen',
    source: 'WhatsApp',
    leadScore: 62,
    estimatedBudget: 45000,
    serviceInterested: 'Zomato/Swiggy Creative & Festive Video Ads',
    assignedSalespersonId: 'user-sales',
    stage: 'QUALIFIED',
    nextFollowUpDate: '2026-10-16',
    notes: 'Wants festival Diwali campaigns launched before Nov 1. Budget confirmed at ₹45k.',
    tags: ['F&B', 'Festive', 'Swiggy'],
    createdAt: '2026-10-08',
    urgency: 'HIGH',
    decisionMakerAvailable: true
  },
  {
    id: 'lead-5',
    companyName: 'The Velvet Lounge Cafe',
    contactPerson: 'Natasha Fernandez',
    phone: '+91 99000 11223',
    email: 'natasha@velvetlounge.in',
    instagram: '@velvetloungeblr',
    location: 'Bangalore, KA',
    industry: 'Hospitality & Nightlife',
    source: 'Instagram',
    leadScore: 48,
    estimatedBudget: 35000,
    serviceInterested: 'Instagram Management & Reel Coverage',
    assignedSalespersonId: 'user-sales',
    stage: 'CONTACTED',
    nextFollowUpDate: '2026-10-14',
    notes: 'Sent initial capability deck via WhatsApp. Awaiting reply.',
    tags: ['Hospitality', 'Warm'],
    createdAt: '2026-10-10',
    urgency: 'MEDIUM',
    decisionMakerAvailable: false
  },
  {
    id: 'lead-6',
    companyName: 'Zenith Fitness Clubs',
    contactPerson: 'Harsh Vardhan',
    phone: '+91 97654 32190',
    email: 'harsh@zenithfitness.co',
    location: 'Coimbatore, TN',
    industry: 'Fitness & Wellness',
    source: 'Website',
    leadScore: 35,
    estimatedBudget: 40000,
    serviceInterested: 'Lead Gen Ads & Landing Page',
    assignedSalespersonId: 'user-sales',
    stage: 'NEW',
    nextFollowUpDate: '2026-10-13',
    notes: 'Website lead form submission. Needs discovery call.',
    tags: ['Inbound', 'Fitness'],
    createdAt: '2026-10-12',
    urgency: 'LOW',
    decisionMakerAvailable: false
  }
];

export const INITIAL_CALLS: CallRecord[] = [
  {
    id: 'call-1',
    leadId: 'lead-2',
    leadName: 'Apex Dental Studios',
    callerId: 'user-sales',
    callerName: 'Arjun Mehta',
    timestamp: '2026-10-11T11:30:00Z',
    durationMinutes: 14,
    outcome: 'Interested',
    notes: 'Discussed patient testimonial reels and Google My Business ranking. Dr. Siddharth agreed to review custom proposal.',
    nextCallDate: '2026-10-13'
  },
  {
    id: 'call-2',
    leadId: 'lead-3',
    leadName: 'UrbanKicks Sneakers',
    callerId: 'user-sales',
    callerName: 'Arjun Mehta',
    timestamp: '2026-10-09T15:00:00Z',
    durationMinutes: 22,
    outcome: 'Meeting booked',
    notes: 'Founder Karan loved our past streetwear portfolio. Locked in strategy presentation for Thursday.',
    nextCallDate: '2026-10-15'
  },
  {
    id: 'call-3',
    leadId: 'lead-5',
    leadName: 'The Velvet Lounge Cafe',
    callerId: 'user-sales',
    callerName: 'Arjun Mehta',
    timestamp: '2026-10-10T16:20:00Z',
    durationMinutes: 5,
    outcome: 'Call later',
    notes: 'Manager Natasha was in a tasting session. Requested call after 6 PM or WhatsApp message.',
    nextCallDate: '2026-10-14'
  },
  {
    id: 'call-4',
    leadId: 'lead-6',
    leadName: 'Zenith Fitness Clubs',
    callerId: 'user-sales',
    callerName: 'Arjun Mehta',
    timestamp: '2026-10-12T10:15:00Z',
    durationMinutes: 2,
    outcome: 'No answer',
    notes: 'Phone rang with no answer. Left introductory WhatsApp message.',
    nextCallDate: '2026-10-13'
  }
];

export const INITIAL_COMMUNICATIONS: Communication[] = [
  {
    id: 'comm-1',
    entityType: 'CLIENT',
    entityId: 'client-1',
    entityName: 'Sanchari Trails',
    channel: 'WhatsApp',
    direction: 'INBOUND',
    authorName: 'Rohan Roy (Client)',
    date: '2026-10-12 18:30',
    summary: 'Winter Kedarkantha trek batch schedule finalized. Please prioritize Reel 04 with snowfall theme.',
    details: 'Uploaded updated itinerary doc to shared Drive.'
  },
  {
    id: 'comm-2',
    entityType: 'CLIENT',
    entityId: 'client-1',
    entityName: 'Sanchari Trails',
    channel: 'Meeting',
    direction: 'OUTBOUND',
    authorName: 'Meera Nair & Vikram Sen',
    date: '2026-10-10 14:00',
    summary: 'Bi-weekly growth review: Organic impressions up 42% on Instagram. Approved 8 upcoming video topics.',
    details: 'Client confirmed budget release for Diwali promotional boost.'
  },
  {
    id: 'comm-3',
    entityType: 'LEAD',
    entityId: 'lead-1',
    entityName: 'GreenRoot Organics',
    channel: 'Email',
    direction: 'OUTBOUND',
    authorName: 'Arjun Mehta',
    date: '2026-10-11 11:15',
    summary: 'Dispatched formal proposal PROP-2026-004 including 12 Reels + Performance creative framework.',
    details: 'Sent via DocuSign with 7-day validity.'
  },
  {
    id: 'comm-4',
    entityType: 'CLIENT',
    entityId: 'client-2',
    entityName: 'Murugan Family Restaurant',
    channel: 'Call',
    direction: 'OUTBOUND',
    authorName: 'Meera Nair',
    date: '2026-10-09 16:45',
    summary: 'Confirmed food shoot date at Anna Nagar flagship branch on Oct 18 with Chef Sundaram.',
    details: 'Shoot equipment list and call sheet shared with Rahul.'
  }
];

export const INITIAL_ONBOARDING_CHECKLIST = [
  { id: 1, title: 'Contract signed & counter-signed', completed: true, notes: 'Signed via DocuSign' },
  { id: 2, title: 'Advance payment received', completed: true, notes: '₹60,000 NEFT received' },
  { id: 3, title: 'Client onboarding intake form completed', completed: true, notes: 'Intake answers logged' },
  { id: 4, title: 'Brand assets received (Logos, Vectors, Fonts)', completed: true, notes: 'Assets uploaded to Files' },
  { id: 5, title: 'High-res Logo variations verified', completed: true, notes: 'Dark & Light SVG verified' },
  { id: 6, title: 'Brand style guidelines documented', completed: true, notes: 'Added to Strategy tab' },
  { id: 7, title: 'Social media & Meta Business Manager access', completed: true, notes: 'Agency partner access granted' },
  { id: 8, title: 'Product & service catalogues received', completed: true, notes: 'Trek itineraries verified' },
  { id: 9, title: 'Target audience personas mapped', completed: true, notes: 'College trekkers & corporate weekenders' },
  { id: 10, title: 'Top 5 direct competitors analyzed', completed: true, notes: 'IndiaHikes & Bikat Adventures audit' },
  { id: 11, title: 'Quarterly content requirements defined', completed: true, notes: '16 Reels + 12 Carousels' },
  { id: 12, title: 'Kickoff strategy alignment meeting', completed: true, notes: 'Completed with MD & Founder' },
  { id: 13, title: 'Live project & master task boards created', completed: true, notes: 'Linked to Sanchari Trails' }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    companyName: 'Sanchari Trails',
    contactPerson: 'Rohan Roy',
    email: 'rohan@sancharitrails.com',
    phone: '+91 98401 99999',
    industry: 'Adventure Tourism & Eco-Travel',
    location: 'Bangalore & Nilgiris',
    website: 'https://sancharitrails.com',
    socialLinks: {
      instagram: '@sancharitrails',
      youtube: 'youtube.com/@sancharitrails'
    },
    accountManagerId: 'user-am',
    startDate: '2024-02-01',
    contractValue: 1440000,
    monthlyRetainer: 120000,
    health: 'Healthy',
    healthReason: 'Consistent approvals within 24h, timely retainer payments, positive engagement metrics.',
    onboardingChecklist: INITIAL_ONBOARDING_CHECKLIST,
    brandColors: ['#1F4D3A', '#D4AF37', '#F5F5DC'],
    brandFonts: ['Plus Jakarta Sans', 'Cinzel']
  },
  {
    id: 'client-2',
    companyName: 'Murugan Family Restaurant',
    contactPerson: 'Sundaram Murugan',
    email: 'sundaram@muruganfoods.in',
    phone: '+91 94440 12345',
    industry: 'Hospitality & Traditional F&B',
    location: 'Chennai (6 Branches)',
    website: 'https://muruganfoods.in',
    socialLinks: {
      instagram: '@muruganfamilyrestaurant'
    },
    accountManagerId: 'user-am',
    startDate: '2024-04-15',
    contractValue: 900000,
    monthlyRetainer: 75000,
    health: 'Healthy',
    healthReason: 'Excellent footfall response to weekend biryani reels.',
    onboardingChecklist: INITIAL_ONBOARDING_CHECKLIST.map(item => ({ ...item, completed: true })),
    brandColors: ['#8B0000', '#FFD700', '#FFFFFF'],
    brandFonts: ['Playfair Display', 'Inter']
  },
  {
    id: 'client-3',
    companyName: 'Boba Cub',
    contactPerson: 'Chloe Chen & Rithvik',
    email: 'founders@bobacub.cafe',
    phone: '+91 99887 76655',
    industry: 'QSR & Youth Beverage Café',
    location: 'Indiranagar & Koramangala, BLR',
    website: 'https://bobacub.cafe',
    socialLinks: {
      instagram: '@bobacubindia'
    },
    accountManagerId: 'user-am',
    startDate: '2024-06-01',
    contractValue: 720000,
    monthlyRetainer: 60000,
    health: 'Needs Attention',
    healthReason: 'Pending approval on 3 Halloween campaign reels; payment due in 2 days.',
    onboardingChecklist: INITIAL_ONBOARDING_CHECKLIST.map(item => ({ ...item, completed: item.id <= 11 })),
    brandColors: ['#E6A23C', '#5C3A21', '#FFF8E7'],
    brandFonts: ['Outfit', 'Fredoka']
  },
  {
    id: 'client-4',
    companyName: 'Artisan Home & Interior Materials',
    contactPerson: 'Maheshwari Patel',
    email: 'maheshwari@artisanhomes.co',
    phone: '+91 98250 88776',
    industry: 'Luxury Furniture & Architecture',
    location: 'Ahmedabad & Mumbai',
    website: 'https://artisanhomes.co',
    socialLinks: {
      instagram: '@artisanhomeinteriors'
    },
    accountManagerId: 'user-am',
    startDate: '2024-08-01',
    contractValue: 1800000,
    monthlyRetainer: 150000,
    health: 'Healthy',
    healthReason: 'Architectural video series driving high-ticket residential inquiries.',
    onboardingChecklist: INITIAL_ONBOARDING_CHECKLIST.map(item => ({ ...item, completed: true })),
    brandColors: ['#2F3E46', '#CAD2C5', '#84A98C'],
    brandFonts: ['Cinzel', 'Plus Jakarta Sans']
  }
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop-1',
    proposalNumber: 'PROP-2026-001',
    clientId: 'client-1',
    clientName: 'Rohan Roy',
    companyName: 'Sanchari Trails',
    status: 'Accepted',
    items: [
      { id: 'item-1', service: 'Monthly Social Media Retainer', deliverables: '12 4K Reels, 8 Carousels, Daily Stories', rate: 85000, quantity: 1, total: 85000 },
      { id: 'item-2', service: 'Performance Ad Creatives', deliverables: '4 Iterative Hook variations for Meta Ads', rate: 25000, quantity: 1, total: 25000 },
      { id: 'item-3', service: 'On-Location Shoot Direction', deliverables: '1 Day Nilgiris Basecamp Shoot', rate: 10000, quantity: 1, total: 10000 }
    ],
    subtotal: 120000,
    discount: 0,
    tax: 21600, // 18% GST
    finalAmount: 141600,
    timeline: 'Annual Retainer (12 Months)',
    paymentTerms: 'Advance payment by 5th of every month',
    revisionPolicy: 'Up to 2 creative revision rounds per asset',
    terms: 'Content calendar locked 7 days prior to monthly publish cycle.',
    expiryDate: '2026-11-01',
    createdAt: '2024-01-20'
  },
  {
    id: 'prop-2',
    proposalNumber: 'PROP-2026-004',
    leadId: 'lead-1',
    clientName: 'Aditi Rao',
    companyName: 'GreenRoot Organics',
    status: 'Sent',
    items: [
      { id: 'item-21', service: 'Organic Brand Transformation Retainer', deliverables: '14 Aesthetic Reels, Founder Personal Branding, 6 Carousels', rate: 75000, quantity: 1, total: 75000 },
      { id: 'item-22', service: 'E-commerce Creative Suite', deliverables: 'Product Unboxing Video Ads + UGC Scripting', rate: 20000, quantity: 1, total: 20000 }
    ],
    subtotal: 95000,
    discount: 5000,
    tax: 16200,
    finalAmount: 106200,
    timeline: '6-Month Retainer with Quarterly review',
    paymentTerms: '50% advance on signoff, 50% on 15th',
    revisionPolicy: '2 revisions per script, 2 revisions per video edit',
    terms: 'Client supplies physical sample packs for studio shoots.',
    expiryDate: '2026-10-20',
    createdAt: '2026-10-11'
  },
  {
    id: 'prop-3',
    proposalNumber: 'PROP-2026-005',
    leadId: 'lead-2',
    clientName: 'Dr. Siddharth Rao',
    companyName: 'Apex Dental Studios',
    status: 'Draft',
    items: [
      { id: 'item-31', service: 'Smile Makeover Video Campaigns', deliverables: '8 High-End Patient Smile Stories + Doctor QA', rate: 50000, quantity: 1, total: 50000 },
      { id: 'item-32', service: 'Google Business Profile & Review System', deliverables: 'Local SEO & Review booster posters', rate: 10000, quantity: 1, total: 10000 }
    ],
    subtotal: 60000,
    discount: 6000,
    tax: 9720,
    finalAmount: 63720,
    timeline: '3 Months Pilot',
    paymentTerms: 'Full month advance',
    revisionPolicy: '1 script revision round',
    terms: 'Clinic patient consent forms handled by client.',
    expiryDate: '2026-10-25',
    createdAt: '2026-10-12'
  }
];

export const INITIAL_STRATEGIES: StrategyDoc[] = [
  {
    id: 'strat-1',
    clientId: 'client-1',
    clientName: 'Sanchari Trails',
    brandStrategy: {
      brandPositioning: 'India’s premier mindful eco-trekking collective, championing zero-trace Himalayan and Western Ghats wilderness expeditions.',
      targetAudience: 'Urban professionals aged 23–38 seeking transformative, safe wilderness journeys over commercial crowded tourist trails.',
      usp: 'Certified wilderness medical guides, small 12-person maximum batch sizes, locally sourced organic mountain cuisine.',
      brandVoice: 'Evocative, adventurous, grounded, responsible, inspiring.',
      competitors: ['IndiaHikes', 'Bikat Adventures', 'Trek The Himalayas'],
      contentPillars: [
        'Raw Trail Realities (Himalayan weather, physical prep)',
        'Local Mountain Communities & Folklore',
        'Trekker Stories & Life Epiphanies',
        'Gear Guides & Packing Like a Pro',
        'Leave No Trace Wilderness Ethics'
      ]
    },
    monthlyStrategy: [
      {
        month: 'October 2026',
        revenueGoal: '₹3,50,000 via Winter Trek Bookings',
        targetDeliverables: { reels: 14, posters: 10, carousels: 4, stories: 25 },
        campaigns: [
          'Kedarkantha Snow Trek Early-Bird',
          'Nilgiris Cloud Forest Weekend Getaway',
          'Trek Leader Spotlight Series'
        ]
      }
    ],
    lastUpdated: '2026-10-10'
  },
  {
    id: 'strat-2',
    clientId: 'client-2',
    clientName: 'Murugan Family Restaurant',
    brandStrategy: {
      brandPositioning: 'Authentic 4-decade legacy of unfiltered South Indian flavours, traditional firewood dum cooking.',
      targetAudience: 'Families, food purists, IT office lunch crowds, Sunday breakfast connoisseurs.',
      usp: '40-year unchanged heirloom spice blends, zero artificial colors, ghee roasted specialties.',
      brandVoice: 'Warm, nostalgic, hearty, celebratory.',
      competitors: ['Junior Kuppanna', 'Dindigul Thalappakatti', 'Anjappar'],
      contentPillars: [
        'Behind the Woodfire Kitchen',
        'The Secret 17-Spice Garam Masala',
        'Customer Childhood Memories',
        'Sunday Breakfast Frenzy (Ghee Roast ASMR)'
      ]
    },
    monthlyStrategy: [
      {
        month: 'October 2026',
        revenueGoal: '15% increase in Sunday Dine-in Footfall',
        targetDeliverables: { reels: 12, posters: 8, carousels: 4, stories: 20 },
        campaigns: ['Diwali Feast Catering Pre-orders', 'Secret Heritage Recipe Reveal']
      }
    ],
    lastUpdated: '2026-10-08'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Sanchari Trails — Winter Season 2026 Retainer',
    clientId: 'client-1',
    clientName: 'Sanchari Trails',
    projectManagerId: 'user-am',
    startDate: '2026-10-01',
    deadline: '2026-10-31',
    budget: 120000,
    status: 'In Progress',
    health: 'ON TRACK',
    priority: 'HIGH',
    teamMemberIds: ['user-am', 'user-strategist', 'user-designer', 'user-video', 'user-writer'],
    description: 'Comprehensive month-long content engine covering Himalayan winter expeditions, meta performance ad assets, and community reels.',
    progressPercent: 68
  },
  {
    id: 'proj-2',
    title: 'Murugan Restaurant — Diwali Feast Campaign',
    clientId: 'client-2',
    clientName: 'Murugan Family Restaurant',
    projectManagerId: 'user-am',
    startDate: '2026-10-05',
    deadline: '2026-10-28',
    budget: 75000,
    status: 'In Progress',
    health: 'ON TRACK',
    priority: 'HIGH',
    teamMemberIds: ['user-am', 'user-designer', 'user-video', 'user-writer'],
    description: 'Festive sweet box hampers, catering campaign posters, and cinematic sizzle reels.',
    progressPercent: 55
  },
  {
    id: 'proj-3',
    title: 'Boba Cub — Spooky Halloween Flavor Launch',
    clientId: 'client-3',
    clientName: 'Boba Cub',
    projectManagerId: 'user-am',
    startDate: '2026-10-01',
    deadline: '2026-10-24',
    budget: 60000,
    status: 'Review',
    health: 'AT RISK',
    priority: 'URGENT',
    teamMemberIds: ['user-am', 'user-designer', 'user-video'],
    description: 'Limited edition Charcoal Boba launch assets: in-store standees, Instagram reels, and loyalty scratch-cards.',
    progressPercent: 82
  },
  {
    id: 'proj-4',
    title: 'Artisan Homes — Architectural Bespoke Film',
    clientId: 'client-4',
    clientName: 'Artisan Home & Interior Materials',
    projectManagerId: 'user-am',
    startDate: '2026-09-15',
    deadline: '2026-10-18',
    budget: 150000,
    status: 'Review',
    health: 'DELAYED',
    priority: 'HIGH',
    teamMemberIds: ['user-am', 'user-video', 'user-writer'],
    description: 'Architectural walkthrough of the 8,000 sq ft Jubilee Hills villa highlighting reclaimed teak craftsmanship.',
    progressPercent: 90
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Reel #04: First Snowfall in Kedarkantha (4K Edit)',
    description: 'Edit cinematic 45s reel with emotional pacing, ambient mountain wind SFX, and clear booking CTA for November batch.',
    projectId: 'proj-1',
    projectName: 'Sanchari Trails — Winter Season 2026 Retainer',
    clientId: 'client-1',
    clientName: 'Sanchari Trails',
    assignedEmployeeId: 'user-video',
    assignedEmployeeName: 'Rahul Verma',
    category: 'Video',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    startDate: '2026-10-11',
    deadline: '2026-10-13', // Due today
    estimatedHours: 5,
    actualHours: 3.5,
    checklist: [
      { id: 'c1', text: 'Color grade raw Sony FX3 slog3 footage', completed: true },
      { id: 'c2', text: 'Select indie acoustic mountaineering BGM', completed: true },
      { id: 'c3', text: 'Burn animated captions with keyword emphasis', completed: false },
      { id: 'c4', text: 'Export 1080x1920 60fps MP4', completed: false }
    ],
    comments: [
      { id: 'tc1', authorId: 'user-am', authorName: 'Meera Nair', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', timestamp: '2026-10-12 11:30', content: 'Client is super keen on this. Please push to Review by 4 PM today!' }
    ],
    attachments: ['footage_kedarkantha_broll.mp4'],
    aspectRatio: '9:16',
    videoDuration: '45 seconds',
    script: 'Hook: "They said mountains heal you. But they never told you about the silence right before the first snow..."'
  },
  {
    id: 'task-2',
    title: 'Poster: Nilgiris Cloud Forest Early-Bird Carousel Cover',
    description: 'Design editorial magazine-style cover slide for 7-slide Nilgiris carousel using client brand fonts and earthy forest palette.',
    projectId: 'proj-1',
    projectName: 'Sanchari Trails — Winter Season 2026 Retainer',
    clientId: 'client-1',
    clientName: 'Sanchari Trails',
    assignedEmployeeId: 'user-designer',
    assignedEmployeeName: 'Priya Sharma',
    category: 'Design',
    priority: 'HIGH',
    status: 'TODO',
    startDate: '2026-10-12',
    deadline: '2026-10-14', // Due tomorrow
    estimatedHours: 3,
    actualHours: 0,
    checklist: [
      { id: 'c21', text: 'Crop high-res Kurinjimala landscape photo', completed: false },
      { id: 'c22', text: 'Set typography in Cinzel & Plus Jakarta Sans', completed: false },
      { id: 'c23', text: 'Add subtle grain and brand badge', completed: false }
    ],
    comments: [],
    attachments: ['kurinjimala_raw.jpg'],
    dimensions: '1080 x 1350 px (4:5 Portrait)',
    copyContent: 'Escape the Heat: 3 Secret Nilgiris Trails Nobody Talks About.'
  },
  {
    id: 'task-3',
    title: 'Script & Hook variations for Diwali Dum Biryani Reel',
    description: 'Write 3 viral opening hooks highlighting the 40-year-old brass cauldron aroma and crackling coal embers.',
    projectId: 'proj-2',
    projectName: 'Murugan Restaurant — Diwali Feast Campaign',
    clientId: 'client-2',
    clientName: 'Murugan Family Restaurant',
    assignedEmployeeId: 'user-writer',
    assignedEmployeeName: 'Ananya Iyer',
    category: 'Content',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    startDate: '2026-10-09',
    deadline: '2026-10-11',
    estimatedHours: 2,
    actualHours: 2,
    checklist: [
      { id: 'c31', text: 'Hook 1: Visual ASMR focus', completed: true },
      { id: 'c32', text: 'Hook 2: Nostalgia storytelling', completed: true },
      { id: 'c33', text: 'CTA for family pre-orders', completed: true }
    ],
    comments: [],
    attachments: []
  },
  {
    id: 'task-4',
    title: 'Design Halloween Cup Sleeves & Promo Posters',
    description: 'Playful spooky illustrations for limited Black Charcoal Boba edition across stores.',
    projectId: 'proj-3',
    projectName: 'Boba Cub — Spooky Halloween Flavor Launch',
    clientId: 'client-3',
    clientName: 'Boba Cub',
    assignedEmployeeId: 'user-designer',
    assignedEmployeeName: 'Priya Sharma',
    category: 'Design',
    priority: 'HIGH',
    status: 'IN_REVIEW',
    startDate: '2026-10-07',
    deadline: '2026-10-12', // Overdue by 1 day
    estimatedHours: 6,
    actualHours: 6.5,
    checklist: [
      { id: 'c41', text: 'Packaging die-cut template setup', completed: true },
      { id: 'c42', text: 'CMYK print vector export', completed: true }
    ],
    comments: [
      { id: 'tc4', authorId: 'user-am', authorName: 'Meera Nair', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', timestamp: '2026-10-12 17:00', content: 'Sent to Chloe for final client sign-off.' }
    ],
    attachments: ['boba_halloween_v2.pdf'],
    dimensions: 'Print Ready PDF & 1080x1920 IG Story'
  },
  {
    id: 'task-5',
    title: 'Color Grading & Sound Design for Reclaimed Teak Film',
    description: 'Final 4K master grade: warm wooden tones, chisel ASMR audio pass, architect voiceover sync.',
    projectId: 'proj-4',
    projectName: 'Artisan Homes — Architectural Bespoke Film',
    clientId: 'client-4',
    clientName: 'Artisan Home & Interior Materials',
    assignedEmployeeId: 'user-video',
    assignedEmployeeName: 'Rahul Verma',
    category: 'Video',
    priority: 'HIGH',
    status: 'REVISION',
    startDate: '2026-10-06',
    deadline: '2026-10-11', // Overdue
    estimatedHours: 8,
    actualHours: 9,
    checklist: [
      { id: 'c51', text: 'Apply Davinci Resolve Kodachrome LUT', completed: true },
      { id: 'c52', text: 'Lower bass in opening voiceover track', completed: false }
    ],
    comments: [
      { id: 'tc5', authorId: 'user-am', authorName: 'Meera Nair', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', timestamp: '2026-10-11 19:00', content: 'Client requested warmer lighting on the dining table shot at 0:28.' }
    ],
    attachments: ['artisan_villa_cut2.mp4'],
    aspectRatio: '16:9 & 9:16 Cutdowns'
  },
  {
    id: 'task-6',
    title: 'Quarterly Growth Strategy Deck — Q4 2026',
    description: 'Prepare data slides summarizing Sanchari Trails organic follower growth (+14,000) and ROAS on Meta ads (4.8x).',
    projectId: 'proj-1',
    projectName: 'Sanchari Trails — Winter Season 2026 Retainer',
    clientId: 'client-1',
    clientName: 'Sanchari Trails',
    assignedEmployeeId: 'user-strategist',
    assignedEmployeeName: 'Vikram Sen',
    category: 'Strategy',
    priority: 'MEDIUM',
    status: 'TODO',
    startDate: '2026-10-13',
    deadline: '2026-10-18',
    estimatedHours: 4,
    actualHours: 0,
    checklist: [
      { id: 'c61', text: 'Pull Meta Ads Manager metrics', completed: false },
      { id: 'c62', text: 'Compile top 5 performing reels', completed: false }
    ],
    comments: [],
    attachments: []
  }
];

export const INITIAL_CONTENT: ContentItem[] = [
  {
    id: 'content-1',
    clientId: 'client-1',
    clientName: 'Sanchari Trails',
    projectId: 'proj-1',
    platform: 'Instagram',
    contentType: 'Reel',
    title: 'First Snowfall in Kedarkantha',
    hook: 'They said mountains heal you. But they never told you about the silence right before the first snow...',
    script: 'Show drone reveal of snow-covered pines -> Trekker taking off backpack -> Steam from steel tea glass -> Text overlay: Nov batches opening.',
    caption: 'Some silence cannot be translated. You have to climb 12,500 ft to hear it. ❄️ Kedarkantha registrations now open in bio. #SanchariTrails #Himalayas',
    cta: 'Tap link in bio to book your slot.',
    writerId: 'user-writer',
    editorId: 'user-video',
    publishDate: '2026-10-15',
    status: 'EDITING',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&auto=format&fit=crop&q=80',
    version: 1
  },
  {
    id: 'content-2',
    clientId: 'client-1',
    clientName: 'Sanchari Trails',
    projectId: 'proj-1',
    platform: 'Instagram',
    contentType: 'Carousel',
    title: '3 Secret Nilgiris Trails Nobody Talks About',
    hook: 'Tired of Ooty tourist crowds? Save these 3 untouched trails for your next weekend.',
    caption: 'Beyond the commercial viewpoints lies a Nilgiris preserved in mist and pine scent. Swipe for GPS pins and permit protocols. 🌲',
    cta: 'Save this post for your next Nilgiris roadtrip!',
    writerId: 'user-writer',
    designerId: 'user-designer',
    publishDate: '2026-10-17',
    status: 'DESIGN',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&auto=format&fit=crop&q=80',
    version: 1
  },
  {
    id: 'content-3',
    clientId: 'client-2',
    clientName: 'Murugan Family Restaurant',
    projectId: 'proj-2',
    platform: 'Instagram',
    contentType: 'Reel',
    title: '40-Year Heritage Dum Biryani Ritual',
    hook: 'Why we still use 100% firewood and brass cauldrons in 2026...',
    script: 'Fast-cut embers -> Chef opening seal -> Aromatic steam burst -> Slow-mo ladle serve.',
    caption: 'Patience isn’t an ingredient on the label. It’s the entire recipe. Sunday dum biryani served from 11:30 AM across all 6 outlets. 🍲',
    cta: 'Pre-order via Swiggy or visit your nearest branch.',
    writerId: 'user-writer',
    editorId: 'user-video',
    publishDate: '2026-10-18',
    status: 'APPROVAL',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80',
    version: 2
  },
  {
    id: 'content-4',
    clientId: 'client-3',
    clientName: 'Boba Cub',
    projectId: 'proj-3',
    platform: 'Instagram',
    contentType: 'Story',
    title: 'Spooky Charcoal Boba Taste Test',
    hook: 'Would you drink black boba? 🖤🎃',
    caption: 'Activated charcoal pearls meet velvety Madagascar vanilla cream. Limited edition drops Oct 20.',
    cta: 'Vote in poll below!',
    designerId: 'user-designer',
    publishDate: '2026-10-20',
    status: 'SCHEDULED',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558857563-b37fe84236b2?w=400&auto=format&fit=crop&q=80',
    version: 1
  },
  {
    id: 'content-5',
    clientId: 'client-1',
    clientName: 'Sanchari Trails',
    projectId: 'proj-1',
    platform: 'YouTube',
    contentType: 'YouTube',
    title: 'How to Pack for -10°C Himalayan Treks: Gear Masterclass',
    hook: 'The 3 rookie mistakes that get people evacuated from winter camps.',
    caption: 'Full 14-minute masterclass covering 3-layer system, sleeping bag ratings, and battery preservation.',
    publishDate: '2026-10-22',
    status: 'SCRIPT',
    writerId: 'user-writer',
    version: 1
  }
];

export const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: 'appr-1',
    title: 'Reel #03: 40-Year Heritage Dum Biryani Ritual',
    type: 'VIDEO',
    clientId: 'client-2',
    clientName: 'Murugan Family Restaurant',
    projectId: 'proj-2',
    relatedContentId: 'content-3',
    currentStatus: 'PENDING_CLIENT',
    assignedReviewerId: 'user-am',
    clientSignoffRequired: true,
    createdAt: '2026-10-11',
    versions: [
      {
        versionNumber: 1,
        submittedAt: '2026-10-10 14:00',
        submittedBy: 'Rahul Verma',
        changeNotes: 'Initial rough cut with voiceover draft.',
        status: 'REVISION_REQUESTED',
        reviewerFeedback: 'Pacing too slow between 0:10-0:18. Trim by 3 seconds and punch up sizzle sound effects.',
        reviewedAt: '2026-10-10 17:30'
      },
      {
        versionNumber: 2,
        submittedAt: '2026-10-11 16:00',
        submittedBy: 'Rahul Verma',
        changeNotes: 'Trimmed ladle shot, enhanced sizzling coal audio, revised typography per brand guidelines.',
        status: 'PENDING',
        previewUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'appr-2',
    title: 'Packaging & In-Store Standees: Halloween Boba Edition',
    type: 'DESIGN',
    clientId: 'client-3',
    clientName: 'Boba Cub',
    projectId: 'proj-3',
    relatedTaskId: 'task-4',
    currentStatus: 'PENDING_INTERNAL',
    assignedReviewerId: 'user-am',
    clientSignoffRequired: true,
    createdAt: '2026-10-12',
    versions: [
      {
        versionNumber: 1,
        submittedAt: '2026-10-12 16:45',
        submittedBy: 'Priya Sharma',
        changeNotes: 'Vector print layout with CMYK color separation for printer.',
        status: 'PENDING',
        previewUrl: 'https://images.unsplash.com/photo-1558857563-b37fe84236b2?w=800&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'appr-3',
    title: 'Brand Story Walkthrough: Jubilee Hills Teak Villa',
    type: 'VIDEO',
    clientId: 'client-4',
    clientName: 'Artisan Home & Interior Materials',
    projectId: 'proj-4',
    relatedTaskId: 'task-5',
    currentStatus: 'REVISION_REQUESTED',
    assignedReviewerId: 'user-am',
    clientSignoffRequired: true,
    createdAt: '2026-10-09',
    versions: [
      {
        versionNumber: 1,
        submittedAt: '2026-10-09 18:00',
        submittedBy: 'Rahul Verma',
        changeNotes: 'Director cut 90-second film.',
        status: 'REVISION_REQUESTED',
        reviewerFeedback: 'Lighting on dining table at 0:28 looks too cold. Please warm color balance.',
        reviewedAt: '2026-10-11 11:00'
      }
    ]
  }
];

export const INITIAL_FILES: FileAsset[] = [
  {
    id: 'file-1',
    fileName: 'Sanchari_Trails_Master_Logo_Vector.svg',
    fileType: 'image/svg+xml',
    category: 'Brand Assets',
    clientId: 'client-1',
    clientName: 'Sanchari Trails',
    sizeBytes: 1450000,
    uploadedBy: 'Priya Sharma',
    uploadedAt: '2024-02-05',
    version: 1,
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba'
  },
  {
    id: 'file-2',
    fileName: 'Kedarkantha_Footage_FX3_Selects.mp4',
    fileType: 'video/mp4',
    category: 'Raw Footage',
    clientId: 'client-1',
    clientName: 'Sanchari Trails',
    projectId: 'proj-1',
    sizeBytes: 4200000000,
    uploadedBy: 'Rahul Verma',
    uploadedAt: '2026-10-05',
    version: 1,
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba'
  },
  {
    id: 'file-3',
    fileName: 'Diwali_Feast_Menu_Print_V3.pdf',
    fileType: 'application/pdf',
    category: 'Designs',
    clientId: 'client-2',
    clientName: 'Murugan Family Restaurant',
    projectId: 'proj-2',
    sizeBytes: 18400000,
    uploadedBy: 'Priya Sharma',
    uploadedAt: '2026-10-10',
    version: 3,
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8'
  },
  {
    id: 'file-4',
    fileName: 'Service_Agreement_Sanchari_Trails_2026.pdf',
    fileType: 'application/pdf',
    category: 'Documents',
    clientId: 'client-1',
    clientName: 'Sanchari Trails',
    sizeBytes: 2400000,
    uploadedBy: 'Rajesh Gupta',
    uploadedAt: '2024-02-01',
    version: 1,
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-101',
    clientId: 'client-1',
    clientName: 'Sanchari Trails',
    projectId: 'proj-1',
    projectName: 'Winter Season 2026 Retainer',
    items: [
      { id: 'i1', description: 'October 2026 Retainer — 12 Reels, Strategy & Paid Ad Creatives', amount: 120000, quantity: 1 }
    ],
    subtotal: 120000,
    tax: 21600, // 18% GST
    discount: 0,
    total: 141600,
    issuedDate: '2026-10-01',
    dueDate: '2026-10-15',
    status: 'Paid',
    amountPaid: 141600
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-102',
    clientId: 'client-2',
    clientName: 'Murugan Family Restaurant',
    projectId: 'proj-2',
    projectName: 'Diwali Feast Campaign',
    items: [
      { id: 'i2', description: 'Diwali Campaign Milestone 1 (50% Advance)', amount: 37500, quantity: 1 }
    ],
    subtotal: 37500,
    tax: 6750,
    discount: 0,
    total: 44250,
    issuedDate: '2026-10-05',
    dueDate: '2026-10-15',
    status: 'Partially Paid',
    amountPaid: 20000
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-103',
    clientId: 'client-3',
    clientName: 'Boba Cub',
    projectId: 'proj-3',
    projectName: 'Spooky Halloween Flavor Launch',
    items: [
      { id: 'i3', description: 'Halloween Campaign Production & Print Prep', amount: 60000, quantity: 1 }
    ],
    subtotal: 60000,
    tax: 10800,
    discount: 0,
    total: 70800,
    issuedDate: '2026-09-25',
    dueDate: '2026-10-10', // Overdue
    status: 'Overdue',
    amountPaid: 0
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2026-104',
    clientId: 'client-4',
    clientName: 'Artisan Home & Interior Materials',
    projectId: 'proj-4',
    projectName: 'Architectural Bespoke Film',
    items: [
      { id: 'i4', description: 'Milestone 2: Villa Architectural Video Edit & Color Grade', amount: 75000, quantity: 1 }
    ],
    subtotal: 75000,
    tax: 13500,
    discount: 0,
    total: 88500,
    issuedDate: '2026-10-08',
    dueDate: '2026-10-22',
    status: 'Sent',
    amountPaid: 0
  }
];

export const INITIAL_PAYMENTS: PaymentMilestone[] = [
  {
    id: 'pay-1',
    projectId: 'proj-1',
    projectName: 'Winter Season Retainer',
    clientId: 'client-1',
    clientName: 'Sanchari Trails',
    title: 'Advance Retainer Fee (October)',
    amount: 141600,
    dueDate: '2026-10-05',
    status: 'PAID',
    paidDate: '2026-10-04',
    transactionRef: 'HDFC-NEFT-98402120'
  },
  {
    id: 'pay-2',
    projectId: 'proj-2',
    projectName: 'Diwali Feast Campaign',
    clientId: 'client-2',
    clientName: 'Murugan Family Restaurant',
    title: '50% Campaign Advance',
    amount: 44250,
    dueDate: '2026-10-15',
    status: 'PENDING'
  },
  {
    id: 'pay-3',
    projectId: 'proj-3',
    projectName: 'Spooky Halloween Flavor Launch',
    clientId: 'client-3',
    clientName: 'Boba Cub',
    title: 'Full Campaign Fee',
    amount: 70800,
    dueDate: '2026-10-10',
    status: 'OVERDUE'
  },
  {
    id: 'pay-4',
    projectId: 'proj-4',
    projectName: 'Architectural Bespoke Film',
    clientId: 'client-4',
    clientName: 'Artisan Home & Interior Materials',
    title: 'Final Delivery & Copyright Transfer',
    amount: 88500,
    dueDate: '2026-10-25',
    status: 'PENDING'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp-1', title: 'Adobe Creative Cloud Team License (10 Seats)', category: 'Software', amount: 36000, date: '2026-10-01', paidTo: 'Adobe Systems' },
  { id: 'exp-2', title: 'Figma Enterprise Organization Plan', category: 'Software', amount: 14500, date: '2026-10-02', paidTo: 'Figma Inc' },
  { id: 'exp-3', title: 'Freelance Sound Engineer (Master Foley for Kedarkantha)', category: 'Freelancers', amount: 12000, date: '2026-10-08', paidTo: 'Studio Sonic Works' },
  { id: 'exp-4', title: 'DJI Ronin 4D Rig & Anamorphic Lens Rental (Shoot)', category: 'Equipment', amount: 22000, date: '2026-10-07', paidTo: 'CineRentals Chennai' },
  { id: 'exp-5', title: 'Agency Team High-Speed Fiber Internet & Cloud Storage', category: 'Office', amount: 8500, date: '2026-10-03', paidTo: 'Airtel Broadband' }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'chat-1',
    projectId: 'proj-1',
    senderId: 'user-am',
    senderName: 'Meera Nair',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    timestamp: '2026-10-12 10:14',
    content: '@Rahul please ensure Reel #04 includes the snowfall audio layer early. Client loved the raw sound on WhatsApp.',
    mentions: ['Rahul Verma']
  },
  {
    id: 'chat-2',
    projectId: 'proj-1',
    senderId: 'user-video',
    senderName: 'Rahul Verma',
    senderAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    timestamp: '2026-10-12 10:25',
    content: 'On it Meera! Color grading is done, layering foley sound right now.',
    mentions: ['Meera Nair']
  },
  {
    id: 'chat-3',
    projectId: 'proj-1',
    senderId: 'user-strategist',
    senderName: 'Vikram Sen',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    timestamp: '2026-10-12 11:00',
    content: '@Priya once Reel #04 drops, we need the Nilgiris carousel live on Friday to balance Himalayas and Western Ghats content pillars.',
    mentions: ['Priya Sharma']
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'ALL',
    title: 'Approval Requested',
    message: 'Murugan Restaurant: Reel #03 Dum Biryani v2 is waiting for Client Approval.',
    type: 'APPROVAL',
    linkUrl: '/approvals',
    timestamp: '2026-10-12 16:30',
    read: false
  },
  {
    id: 'notif-2',
    userId: 'user-video',
    title: 'Deadline Approaching',
    message: 'Task "Reel #04: First Snowfall in Kedarkantha" is due today by 6:00 PM.',
    type: 'DEADLINE',
    linkUrl: '/tasks',
    timestamp: '2026-10-13 09:00',
    read: false
  },
  {
    id: 'notif-3',
    userId: 'user-finance',
    title: 'Payment Overdue Alert',
    message: 'Boba Cub invoice INV-2026-103 (₹70,800) is 3 days overdue.',
    type: 'PAYMENT',
    linkUrl: '/finance',
    timestamp: '2026-10-13 08:30',
    read: false
  },
  {
    id: 'notif-4',
    userId: 'user-sales',
    title: 'Proposal Viewed',
    message: 'GreenRoot Organics (Aditi Rao) opened Proposal #PROP-2026-004.',
    type: 'LEAD',
    linkUrl: '/proposals',
    timestamp: '2026-10-12 14:10',
    read: true
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'act-1', authorName: 'Karthik V', action: 'Approved proposal #PROP-2026-001', target: 'Sanchari Trails Retainer', timestamp: '2026-10-12 18:00', category: 'CRM' },
  { id: 'act-2', authorName: 'Rahul Verma', action: 'Submitted new version for approval', target: 'Reel #03 Dum Biryani v2', timestamp: '2026-10-12 16:00', category: 'APPROVAL' },
  { id: 'act-3', authorName: 'Rajesh Gupta', action: 'Logged payment receipt ₹1,41,600', target: 'Sanchari Trails (INV-2026-101)', timestamp: '2026-10-12 11:20', category: 'FINANCE' },
  { id: 'act-4', authorName: 'Arjun Mehta', action: 'Logged cold call outcome: Interested', target: 'Apex Dental Studios', timestamp: '2026-10-11 11:45', category: 'CRM' },
  { id: 'act-5', authorName: 'Priya Sharma', action: 'Uploaded brand asset file', target: 'Sanchari_Trails_Master_Logo_Vector.svg', timestamp: '2026-10-10 15:30', category: 'CONTENT' }
];

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'auto-1',
    trigger: 'Lead Stage becomes WON',
    condition: 'Signed contract or confirmed deposit',
    actions: [
      'Create Client profile record',
      'Generate 13-step Onboarding Checklist',
      'Create Initial Kickoff Project',
      'Notify Account Manager & Strategist',
      'Create Strategy Task and Payment Milestone'
    ],
    enabled: true,
    lastFired: '2026-10-01 10:00'
  },
  {
    id: 'auto-2',
    trigger: 'Proposal Status becomes ACCEPTED',
    condition: 'Client clicks Accept or DocuSign webhook',
    actions: [
      'Transition Lead to WON',
      'Initiate Client Onboarding Workflow',
      'Draft Initial Advance Invoice'
    ],
    enabled: true,
    lastFired: '2026-09-28 14:15'
  },
  {
    id: 'auto-3',
    trigger: 'Task Deadline is Tomorrow',
    condition: 'Status != COMPLETED',
    actions: [
      'Send priority push notification to assigned employee',
      'Highlight on Employee Dashboard'
    ],
    enabled: true,
    lastFired: '2026-10-13 00:01'
  },
  {
    id: 'auto-4',
    trigger: 'Client Approves Deliverable',
    condition: 'Client Portal 1-click Approval',
    actions: [
      'Move Content Item from APPROVAL to SCHEDULED',
      'Notify Video Editor and Account Manager',
      'Mark related Task as COMPLETED'
    ],
    enabled: true,
    lastFired: '2026-10-11 17:00'
  },
  {
    id: 'auto-5',
    trigger: 'Payment becomes Overdue',
    condition: 'Current Date > Due Date and Status == PENDING',
    actions: [
      'Flag Project Health to AT RISK',
      'Send High-Priority Alert to Finance Controller & Account Manager',
      'Generate WhatsApp Reminder Template'
    ],
    enabled: true,
    lastFired: '2026-10-13 08:30'
  }
];
