import {
  Service,
  Project,
  Blog,
  Career,
  Testimonial,
  ClientPartner,
  GalleryItem,
  TeamMember,
  Invoice,
  SEOConfig,
  WebsiteSettings,
  AnalyticsSummary,
  ActivityLog,
  CareerApplication,
  ContactMessage,
  Subscriber,
  AdminUser
} from './types';

export const seedServices: Service[] = [
  {
    id: 'custom-software',
    title: 'Custom Software Development',
    icon: 'Cpu',
    shortDesc: 'Tailor-made software architectures engineered to streamline operations and scale with your enterprise growth.',
    description: 'We construct secure, high-performing, and highly available bespoke software. From high-throughput backend services to cloud-native microservices, our architectures are built to adapt. We leverage state-of-the-art software engineering principles to ensure your proprietary logic is robustly implemented, completely auditable, and seamlessly expandable.',
    category: 'Software Engineering'
  },
  {
    id: 'web-dev',
    title: 'Website Development',
    icon: 'CodeXml',
    shortDesc: 'Polished, responsive, and ultra-fast web platforms using leading frameworks to represent your brand online.',
    description: 'Our websites combine premium aesthetics with modern performance benchmarks. Leveraging static generation, server-side rendering, and responsive grid layouts, we build secure digital spaces. Optimized for fast content loading, screen responsiveness, and conversion rate efficiency.',
    category: 'Web Development'
  },
  {
    id: 'mobile-apps',
    title: 'Mobile App Development',
    icon: 'Smartphone',
    shortDesc: 'Immersive native and cross-platform mobile apps built for seamless iOS and Android deployments.',
    description: 'We craft high-fidelity mobile experiences using React Native and Flutter, ensuring native performance and consistent UI across devices. Integrated with hardware features, biometric secure authentication, local storage mechanisms, and push notifications, your app stays active and secure.',
    category: 'Mobile Apps'
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    icon: 'Palette',
    shortDesc: 'User-centric wireframes, beautiful high-fidelity designs, and engaging interactive prototypes.',
    description: 'Design is not just what it looks like, but how it behaves. We perform thorough user research, develop structured design languages, and deliver high-contrast, fully interactive Figma layouts. Every viewport is planned for intuitive flow, visual hierarchy, and delightful micro-interactions.',
    category: 'Creative Design'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    icon: 'Megaphone',
    shortDesc: 'Strategic social media, ad campaigns, and brand storytelling that generates qualified leads.',
    description: 'Expand your company reach through targeted digital campaigns. We compile market research data, manage high-yield advertising spend across social/search platforms, and orchestrate automated client nurturing pipelines to maximize ROI and lower customer acquisition costs.',
    category: 'Marketing'
  },
  {
    id: 'seo-services',
    title: 'SEO Services',
    icon: 'SearchCode',
    shortDesc: 'Maximize search engine visibility, raise organic keyword rankings, and attract organic web traffic.',
    description: 'We conduct comprehensive keyword exploration, fix technical crawler issues, establish secure sitemap structures, and optimize content semantics. Our data-driven search optimization audits help move your services to Page 1 rankings to increase your natural conversion pipeline.',
    category: 'Marketing'
  },
  {
    id: 'ecommerce-dev',
    title: 'E-Commerce Development',
    icon: 'ShoppingBag',
    shortDesc: 'Highly scalable digital storefronts, checkout engines, and inventory integrations.',
    description: 'We build transactional digital stores engineered to process credit secure gateways easily. Equipped with granular product configuration matrices, dynamic coupon rules, modern shopping cart sync, tax auto-calculation, and multi-tier logistics integrations.',
    category: 'Web Development'
  },
  {
    id: 'erp-crm-dev',
    title: 'ERP & CRM Development',
    icon: 'Network',
    shortDesc: 'Internal enterprise business planning, workforce modules, CRM funnels, and tracking.',
    description: 'Consolidate your resource monitoring. We develop dedicated ERP dashboards mapping client relations, team scheduling, supply chains, invoicing histories, and client interaction records, completely customized around your existing business logic.',
    category: 'Enterprise Solutions'
  },
  {
    id: 'cloud-solutions',
    title: 'Cloud Solutions',
    icon: 'Cloud',
    shortDesc: 'Secure cloud migration, scalable server cluster configurations, and active auto-scaling support.',
    description: 'Migrate with absolute confidence. We arrange serverless instances, distribute traffic via global content delivery networks, structure Virtual Private Clouds, and coordinate active monitoring to keep your web services safe, available, and highly performant.',
    category: 'Cloud Infrastructure'
  },
  {
    id: 'api-integration',
    title: 'API Integration',
    icon: 'Link2',
    shortDesc: 'Connect third-party secure systems, CRM platforms, legacy databases, and visual streams.',
    description: 'We unify fragmented digital systems. Our team constructs tailored API integrations using standard REST/GraphQL interfaces with strict token validations, rate limits, and failure fallback modes, ensuring your platforms exchange critical info without delay.',
    category: 'Software Engineering'
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    icon: 'BrainCircuit',
    shortDesc: 'Dynamic LLM prompts, automated task procedures, intelligent chatbots, and predictive algorithms.',
    description: 'Implement AI inside your operations. We build pipelines featuring advanced Large Language Models, document semantic search agents, conversational support helpers, and background data classification triggers, removing mundane administrative workloads.',
    category: 'AI Engineering'
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    icon: 'BarChart3',
    shortDesc: 'Dynamic enterprise tracking, interactive chart dashboards, and automated report generators.',
    description: 'We turn digital data points into understandable maps. By implementing comprehensive tracking layers, aggregating raw client behaviors, and assembling responsive graphs, we enable managers to form business decisions supported by clean metrics.',
    category: 'Enterprise Solutions'
  },
  {
    id: 'it-consulting',
    title: 'IT Consulting',
    icon: 'HeartHandshake',
    shortDesc: 'Strategic design auditing, cloud optimization consultations, and digital security planning.',
    description: 'Align your digital spend with company objectives. We audit server overhead logs, inspect existing code bases for common structural bottlenecks, design clear security procedures, and outline software blueprints ready to guide your engineer hires.',
    category: 'Consulting'
  },
  {
    id: 'maintenance-support',
    title: 'Maintenance & Support',
    icon: 'ShieldAlert',
    shortDesc: '24/7 server health verification, periodic library updates, and security patch deployment.',
    description: 'We keep your digital assets secure and online. Our support packages provide constant downtime tracking, weekly database backups, active security patching, third-party library maintenance, and immediate bug resolution to guarantee constant application uptime.',
    category: 'Consulting'
  }
];

export const seedProjects: Project[] = [];
export const seedBlogs: Blog[] = [];
export const seedCareers: Career[] = [];

export const seedTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Eleanor Sterling',
    role: 'Chief Technology Officer',
    company: 'Apex Global Ltd',
    feedback: 'AdSpark Technologies delivered our custom platform ahead of schedule. The engineering team is incredibly meticulous and their attention to technical detail is unrivaled.',
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Marcus Brody',
    role: 'VP of Digital Growth',
    company: 'NovaCare Clinics',
    feedback: 'The custom system they crafted has completely unified our team coordination. Workflow intake procedures are 40% faster now and the custom interfaces are delightfully intuitive.',
    rating: 5
  },
  {
    id: 'test-3',
    name: 'Aria Thompson',
    role: 'Founder & CEO',
    company: 'DecentraHold Inc',
    feedback: 'We wanted a high-end dynamic analytics system. AdSpark listened, planned perfectly, and delivered a clean icon-based dashboard that has blown away our clients.',
    rating: 5
  }
];

export const seedClients: ClientPartner[] = [
  { id: 'cli-1', name: 'Apex Global', logo: '🌐 Apex Global' },
  { id: 'cli-2', name: 'NovaCare Clinics', logo: '🏥 NovaCare Clinics' },
  { id: 'cli-3', name: 'DecentraHold', logo: '⛓️ DecentraHold' },
  { id: 'cli-4', name: 'Vanguard Realty', logo: '🏢 Vanguard Realty' },
  { id: 'cli-5', name: 'Solis Energy', logo: '⚡ Solis Energy' }
];

export const seedGallery: GalleryItem[] = [];
export const seedTeam: TeamMember[] = [];
export const seedInvoices: Invoice[] = [];

export const defaultSEO: SEOConfig = {
  metaTitle: 'AdSpark Technologies | Corporate Software & Web Engineering Solutions',
  metaKeywords: 'Custom Software, Web Development, Cloud Solutions, ERP Development, AI Systems, UI/UX Design, IT Company',
  metaDesc: 'AdSpark Technologies is a leading Software Development company engineering custom applications, e-commerce storefronts, cloud infrastructures, and LLM integrations.',
  ogTitle: 'AdSpark Technologies | Enterprise Digital Engineering',
  ogDesc: 'Bespoke corporate software, responsive web portals, and reliable cloud solutions designed to fuel system performance and enterprise growth.',
  ogImage: '',
  twitterCard: 'summary'
};

export const defaultSettings: WebsiteSettings = {
  companyName: 'AdSpark Technologies',
  logoText: 'AdSpark',
  contactEmail: 'adsparktechnologies01@gmail.com',
  contactPhone: '+91 8421038918',
  address: 'CIDCO, Chhatrapati Sambhajinagar - 431001, Maharashtra, India',
  workingHours: 'Mon - Sat: 9:00 AM - 6:00 PM (IST)',
  mapEmbedUrl: 'https://maps.google.com/maps?q=CIDCO%2C%20Chhatrapati%20Sambhajinagar%20-%20431001%2C%20Maharashtra%2C%20India&t=&z=15&ie=UTF8&iwloc=&output=embed',
  socialLinks: {
    facebook: 'https://facebook.com/adsparktech',
    twitter: 'https://twitter.com/adsparktech',
    linkedin: 'https://linkedin.com/company/adsparktech',
    instagram: 'https://instagram.com/adsparktech',
    github: 'https://github.com/adsparktech'
  }
};

export const defaultAnalytics: AnalyticsSummary = {
  totalVisitors: 15420,
  uniqueVisitors: 9840,
  averageSessionDuration: '4m 32s',
  bounceRate: '38.4%',
  pageViewsByPath: {
    '/': 8500,
    '/services': 3200,
    '/contact': 1900
  },
  monthlyVisitorGrowth: [
    { month: 'Feb', visitors: 1100, views: 2400 },
    { month: 'Mar', visitors: 1300, views: 2800 },
    { month: 'Apr', visitors: 1650, views: 3500 },
    { month: 'May', visitors: 2100, views: 4200 },
    { month: 'Jun', visitors: 2800, views: 5600 },
    { month: 'Jul', visitors: 3420, views: 6800 }
  ]
};

export const initialLogs: ActivityLog[] = [
  {
    id: 'log-1',
    adminEmail: 'adsparktechnologies01@gmail.com',
    action: 'Seed Initial Database',
    details: 'Pre-populated services and initial settings.',
    ipAddress: '::1',
    timestamp: '2026-07-13 10:00:00'
  }
];

export const initialApplications: CareerApplication[] = [];

export const initialMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Robert Chen',
    email: 'robert@apex.com',
    subject: 'Request for Custom Systems Proposal',
    message: 'Hello AdSpark, we are looking to replace our legacy pipeline with a bespoke, fast internal React system. Let us set up an introductory discussion.',
    status: 'Unread',
    submittedAt: '2026-07-12 09:15:00'
  }
];

export const initialSubscribers: Subscriber[] = [
  { id: 'sub-1', email: 'newsletter@partner.io', subscribedAt: '2026-07-11 12:00:00', status: 'Active' }
];

export const initialAdmins: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'Dhruv Marathe',
    email: 'adsparktechnologies01@gmail.com',
    role: 'Super Admin',
    status: 'active',
    lastLoginAt: '2026-07-14 04:00:00',
    lastLoginIp: '::1'
  },
  {
    id: 'usr-2',
    name: 'John Admin',
    email: 'admin@adsparktech.com',
    role: 'Admin',
    status: 'active',
    lastLoginAt: '2026-07-13 15:30:00',
    lastLoginIp: '192.168.1.100'
  },
  {
    id: 'usr-3',
    name: 'Sarah Editor',
    email: 'editor@adsparktech.com',
    role: 'Editor',
    status: 'active',
    lastLoginAt: '2026-07-13 11:20:00',
    lastLoginIp: '192.168.1.102'
  },
  {
    id: 'usr-4',
    name: 'Alex Manager',
    email: 'manager@adsparktech.com',
    role: 'Manager',
    status: 'active',
    lastLoginAt: '2026-07-12 09:45:00',
    lastLoginIp: '192.168.1.103'
  }
];

