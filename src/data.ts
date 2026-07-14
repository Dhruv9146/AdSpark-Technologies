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
  Subscriber
} from './types';

export const seedServices: Service[] = [
  {
    id: 'custom-software',
    title: 'Custom Software Development',
    icon: 'Cpu',
    shortDesc: 'Tailor-made software architectures engineered to streamline operations and scale with your enterprise growth.',
    description: 'We construct secure, high-performing, and highly available bespoke software. From high-throughput backend services to cloud-native microservices, our architectures are built to adapt. We leverage state-of-the-art software engineering principles to ensure your proprietary logic is robustly implemented, completely auditable, and seamlessly expandable.',
    pricing: '$10,000 - $45,000+',
    category: 'Software Engineering',
    image: 'assets/images/services/software_development.jpg'
  },
  {
    id: 'web-dev',
    title: 'Website Development',
    icon: 'CodeXml',
    shortDesc: 'Polished, responsive, and ultra-fast web platforms using leading frameworks to represent your brand online.',
    description: 'Our websites combine premium aesthetics with modern performance benchmarks. Leveraging static generation, server-side rendering, and responsive grid layouts, we build secure digital spaces. Optimized for fast content loading, screen responsiveness, and conversion rate efficiency.',
    pricing: '$3,500 - $12,000',
    category: 'Web Development',
    image: 'assets/images/services/website_development.jpg'
  },
  {
    id: 'mobile-apps',
    title: 'Mobile App Development',
    icon: 'Smartphone',
    shortDesc: 'Immersive native and cross-platform mobile apps built for seamless iOS and Android deployments.',
    description: 'We craft high-fidelity mobile experiences using React Native and Flutter, ensuring native performance and consistent UI across devices. Integrated with hardware features, biometric secure authentication, local storage mechanisms, and push notifications, your app stays active and secure.',
    pricing: '$8,000 - $35,000',
    category: 'Mobile Apps',
    image: 'assets/images/services/ui_ux_design.jpg'
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    icon: 'Palette',
    shortDesc: 'User-centric wireframes, beautiful high-fidelity designs, and engaging interactive prototypes.',
    description: 'Design is not just what it looks like, but how it behaves. We perform thorough user research, develop structured design languages, and deliver high-contrast, fully interactive Figma layouts. Every viewport is planned for intuitive flow, visual hierarchy, and delightful micro-interactions.',
    pricing: '$2,500 - $8,000',
    category: 'Creative Design',
    image: 'assets/images/services/ui_ux_design.jpg'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    icon: 'Megaphone',
    shortDesc: 'Strategic social media, ad campaigns, and brand storytelling that generates qualified leads.',
    description: 'Expand your company reach through targeted digital campaigns. We compile market research data, manage high-yield advertising spend across social/search platforms, and orchestrate automated client nurturing pipelines to maximize ROI and lower customer acquisition costs.',
    pricing: '$1,500 - $5,000 / month',
    category: 'Marketing',
    image: 'assets/images/services/digital_marketing.jpg'
  },
  {
    id: 'seo-services',
    title: 'SEO Services',
    icon: 'SearchCode',
    shortDesc: 'Maximize search engine visibility, raise organic keyword rankings, and attract organic web traffic.',
    description: 'We conduct comprehensive keyword exploration, fix technical crawler issues, establish secure sitemap structures, and optimize content semantics. Our data-driven search optimization audits help move your services to Page 1 rankings to increase your natural conversion pipeline.',
    pricing: '$1,200 - $3,500 / month',
    category: 'Marketing',
    image: 'assets/images/services/digital_marketing.jpg'
  },
  {
    id: 'ecommerce-dev',
    title: 'E-Commerce Development',
    icon: 'ShoppingBag',
    shortDesc: 'Highly scalable digital storefronts, checkout engines, and inventory integrations.',
    description: 'We build transactional digital stores engineered to process credit secure gateways easily. Equipped with granular product configuration matrices, dynamic coupon rules, modern shopping cart sync, tax auto-calculation, and multi-tier logistics integrations.',
    pricing: '$5,000 - $25,000',
    category: 'Web Development',
    image: 'assets/images/services/website_development.jpg'
  },
  {
    id: 'erp-crm-dev',
    title: 'ERP & CRM Development',
    icon: 'Network',
    shortDesc: 'Internal enterprise business planning, workforce modules, CRM funnels, and tracking.',
    description: 'Consolidate your resource monitoring. We develop dedicated ERP dashboards mapping client relations, team scheduling, supply chains, invoicing histories, and client interaction records, completely customized around your existing business logic.',
    pricing: '$12,000 - $50,000+',
    category: 'Enterprise Solutions',
    image: 'assets/images/services/software_development.jpg'
  },
  {
    id: 'cloud-solutions',
    title: 'Cloud Solutions',
    icon: 'Cloud',
    shortDesc: 'Secure cloud migration, scalable server cluster configurations, and active auto-scaling support.',
    description: 'Migrate with absolute confidence. We arrange serverless instances, distribute traffic via global content delivery networks, structure Virtual Private Clouds, and coordinate active monitoring to keep your web services safe, available, and highly performant.',
    pricing: '$4,000 - $18,000',
    category: 'Cloud Infrastructure',
    image: 'assets/images/services/data_analytics.jpg'
  },
  {
    id: 'api-integration',
    title: 'API Integration',
    icon: 'Link2',
    shortDesc: 'Connect third-party secure systems, CRM platforms, legacy databases, and visual streams.',
    description: 'We unify fragmented digital systems. Our team constructs tailored API integrations using standard REST/GraphQL interfaces with strict token validations, rate limits, and failure fallback modes, ensuring your platforms exchange critical info without delay.',
    pricing: '$2,000 - $7,500',
    category: 'Software Engineering',
    image: 'assets/images/services/software_development.jpg'
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    icon: 'BrainCircuit',
    shortDesc: 'Dynamic LLM prompts, automated task procedures, intelligent chatbots, and predictive algorithms.',
    description: 'Implement AI inside your operations. We build pipelines featuring advanced Large Language Models, document semantic search agents, conversational support helpers, and background data classification triggers, removing mundane administrative workloads.',
    pricing: '$6,000 - $30,000',
    category: 'AI Engineering',
    image: 'assets/images/services/data_analytics.jpg'
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    icon: 'BarChart3',
    shortDesc: 'Dynamic enterprise tracking, interactive chart dashboards, and automated report generators.',
    description: 'We turn digital data points into understandable maps. By implementing comprehensive tracking layers, aggregating raw client behaviors, and assembling responsive graphs, we enable managers to form business decisions supported by clean metrics.',
    pricing: '$4,500 - $15,000',
    category: 'Enterprise Solutions',
    image: 'assets/images/services/data_analytics.jpg'
  },
  {
    id: 'it-consulting',
    title: 'IT Consulting',
    icon: 'HeartHandshake',
    shortDesc: 'Strategic design auditing, cloud optimization consultations, and digital security planning.',
    description: 'Align your digital spend with company objectives. We audit server overhead logs, inspect existing code bases for common structural bottlenecks, design clear security procedures, and outline software blueprints ready to guide your engineer hires.',
    pricing: '$150 - $250 / hour',
    category: 'Consulting',
    image: 'assets/images/backgrounds/about_section.jpg'
  },
  {
    id: 'maintenance-support',
    title: 'Maintenance & Support',
    icon: 'ShieldAlert',
    shortDesc: '24/7 server health verification, periodic library updates, and security patch deployment.',
    description: 'We keep your digital assets secure and online. Our support packages provide constant downtime tracking, weekly database backups, active security patching, third-party library maintenance, and immediate bug resolution to guarantee constant application uptime.',
    pricing: '$500 - $2,500 / month',
    category: 'Consulting',
    image: 'assets/images/services/software_development.jpg'
  }
];

export const seedProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'OmniChannel Retail Platform',
    category: 'E-Commerce Development',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Stripe'],
    client: 'Apex Global Ltd',
    duration: '6 Months',
    completionDate: '2026-03-15',
    liveLink: 'https://example.com/omnichannel',
    githubLink: 'https://github.com/adspark/omnichannel',
    description: 'A complete, high-yield digital retail infrastructure uniting local store inventory channels, real-time product catalogs, global checkout networks, and structured shipping management in a secure, unified framework.',
    images: [
      'assets/images/portfolio/portfolio_retail.jpg',
      'assets/images/services/website_development.jpg'
    ],
    featured: true
  },
  {
    id: 'proj-2',
    title: 'AI-Powered Resume Screen Engine',
    category: 'AI & Automation',
    technologies: ['Gemini API', 'TypeScript', 'Express', 'React', 'Tailwind CSS'],
    client: 'AdSpark Internal Labs',
    duration: '2 Months',
    completionDate: '2026-06-20',
    liveLink: 'https://example.com/ai-screener',
    githubLink: 'https://github.com/adspark/ai-screener',
    description: 'An intelligent HR recruitment screener that processes candidate application resumes against technical job requirements using Gemini, creating structured scoring grids and summarized qualification matrices.',
    images: [
      'assets/images/portfolio/portfolio_resume.jpg',
      'assets/images/services/software_development.jpg'
    ],
    featured: true
  },
  {
    id: 'proj-3',
    title: 'Cloud-Native Medical Records ERP',
    category: 'ERP & CRM Development',
    technologies: ['React', 'Go', 'AWS Lambda', 'DynamoDB', 'Docker'],
    client: 'NovaCare Clinics',
    duration: '8 Months',
    completionDate: '2025-11-05',
    liveLink: 'https://example.com/healthcare-erp',
    description: 'An advanced, highly compliant electronic medical records planner. Includes patient registration funnels, real-time doctor appointment coordination, and secure, encrypted insurance payment triggers.',
    images: [
      'assets/images/portfolio/portfolio_medical.jpg',
      'assets/images/services/data_analytics.jpg'
    ],
    featured: false
  },
  {
    id: 'proj-4',
    title: 'Crypto Wallet Analytics Suite',
    category: 'Data Analytics',
    technologies: ['Next.js', 'D3.js', 'FastAPI', 'Tailwind CSS', 'Redis'],
    client: 'DecentraHold Inc',
    duration: '4 Months',
    completionDate: '2026-01-10',
    liveLink: 'https://example.com/wallet-analytics',
    githubLink: 'https://github.com/adspark/wallet-analytics',
    description: 'A complete blockchain analytics engine displaying multi-chain investment flows, automated transaction categorization, and dynamic performance charting with interactive filters.',
    images: [
      'assets/images/portfolio/portfolio_crypto.jpg'
    ],
    featured: true
  }
];

export const seedBlogs: Blog[] = [
  {
    id: 'blog-1',
    title: 'Leveraging Gemini Models for Document Classification and ERP Automation',
    slug: 'leveraging-gemini-erp-automation',
    category: 'AI & Automation',
    tags: ['Gemini', 'AI', 'ERP', 'Automation'],
    summary: 'A deep look into integrating Large Language Models inside administrative backends to process incoming forms and organize files.',
    content: `<h3>The Dawn of Cognitive Administrative Pipelines</h3>
<p>Modern enterprises lose thousands of hours annually manually processing purchase forms, organizing email receipts, and sorting client briefs. By incorporating Google's Gemini models into enterprise resource planners, teams can transition to completely cognitive pipelines.</p>

<p>With structured schema schemas using the standard <code>responseSchema</code> configs, Gemini is capable of returning reliable JSON directly. This ensures background script executors parse the values into databases without schema failures.</p>

<pre><code>import { GoogleGenAI, Type } from "@google/genai";
const ai = new GoogleGenAI();
const response = await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: "...",
  config: { responseMimeType: "application/json" }
});
</code></pre>

<p>This simple call triggers secure AI reasoning, scanning the metadata of raw documents and sorting the fields automatically into invoice tables. The result is a dramatic decrease in administrative bottlenecks and an acceleration of workforce output.</p>`,
    featuredImage: 'assets/images/backgrounds/blog_gemini.jpg',
    author: 'Sarah Jenkins',
    authorRole: 'Head of AI Research',
    publishedAt: '2026-07-01',
    readTime: '6 min read',
    views: 452,
    comments: [
      {
        id: 'c1',
        author: 'Robert Chen',
        email: 'robert@apex.com',
        content: 'This schema verification method changed how we process customer invoices. Absolutely brilliant writeup!',
        createdAt: '2026-07-02T10:15:00Z',
        approved: true
      }
    ],
    metaTitle: 'Gemini Models for ERP Enterprise Automation | AdSpark',
    metaDesc: 'Discover how to leverage Gemini models to automate enterprise resource planning systems and document classification workflows.',
    metaKeywords: 'Gemini, ERP, AI Automation, Software Engineering'
  },
  {
    id: 'blog-2',
    title: 'How Tailwind CSS v4 Enhances Web Platform Layout Performance',
    slug: 'tailwind-css-v4-performance',
    category: 'Web Development',
    tags: ['Tailwind v4', 'Web Dev', 'CSS', 'Vite'],
    summary: 'An analysis of Tailwind CSS v4 compiling updates, including native lightning-css integration and streamlined config files.',
    content: `<h3>A Faster Engine for Digital Styling</h3>
<p>Tailwind CSS v4 introduces major architectural upgrades. Compiling is now handled directly inside Vite using native compilation pipelines, completely bypassing heavy legacy post-processing modules.</p>

<p>This means your production build time is cut in half, and developers enjoy instant hot updates in the browser canvas. High-performance layouts keep users engaged, reducing page bounce rates and boosting site rank metrics.</p>`,
    featuredImage: 'assets/images/backgrounds/blog_tailwind.jpg',
    author: 'Daniel Vance',
    authorRole: 'Principal Web Architect',
    publishedAt: '2026-06-15',
    readTime: '4 min read',
    views: 310,
    comments: [],
    metaTitle: 'Tailwind CSS v4 Layout Performance Review | AdSpark',
    metaDesc: 'A deep analysis of Tailwind CSS v4 compiler upgrades and layout performance optimizations for modern enterprise web projects.',
    metaKeywords: 'Tailwind, CSS, Vite, Web Design'
  }
];

export const seedCareers: Career[] = [
  {
    id: 'job-1',
    title: 'Senior Full-Stack TypeScript Developer',
    department: 'Software Engineering',
    location: 'Remote (US/Canada)',
    type: 'Full-time',
    experience: '5+ Years',
    salaryRange: '$110,000 - $145,000',
    description: 'Join our elite software engineering pod to construct bespoke web applications and high-throughput backend services for global enterprise clients.',
    requirements: [
      'Extensive proficiency in Node.js, Express, and modern React setups.',
      'Experience styling fluid user interfaces with Tailwind CSS and Framer Motion.',
      'Strong grasp of relational databases, SQLite, or NoSQL schemas.',
      'Familiarity with cloud infrastructures (AWS, GCP) and containerization.'
    ],
    benefits: [
      'Comprehensive health, dental, and vision packages.',
      'Remote working allowance and custom tech setup budget.',
      'Generous paid-time-off and technical certification credits.',
      'Annual growth bonuses.'
    ],
    status: 'Active'
  },
  {
    id: 'job-2',
    title: 'AI Implementation Specialist',
    department: 'AI Engineering',
    location: 'Hybrid (Toronto Office)',
    type: 'Full-time',
    experience: '3+ Years',
    salaryRange: '$120,000 - $160,000',
    description: 'Help enterprise brands incorporate LLM configurations, agentic setups, and visual generators into their workflows to remove administrative workloads.',
    requirements: [
      'Deep knowledge of generative AI libraries, specifically @google/genai.',
      'Strong background structuring semantic search (RAG) and embedding indexes.',
      'Familiarity with API rate limits, structured JSON schema prompting, and fallback setups.'
    ],
    benefits: [
      'Premium health benefits and physical wellness allowances.',
      'In-office catering and modern work environments.',
      'Direct learning collaborations with major technology partners.'
    ],
    status: 'Active'
  }
];

export const seedTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Eleanor Sterling',
    role: 'Chief Technology Officer',
    company: 'Apex Global Ltd',
    feedback: 'AdSpark Technologies delivered our OmniChannel platform ahead of schedule. The engineering team is incredibly meticulous and their attention to technical detail is unrivaled.',
    rating: 5,
    image: 'assets/images/testimonials/testimonial_eleanor.jpg'
  },
  {
    id: 'test-2',
    name: 'Marcus Brody',
    role: 'VP of Digital Growth',
    company: 'NovaCare Clinics',
    feedback: 'The Medical Records ERP they crafted has completely unified our team coordination. Patient intake flows are 40% faster now and the custom interfaces are delightfully intuitive.',
    rating: 5,
    image: 'assets/images/testimonials/testimonial_marcus.jpg'
  },
  {
    id: 'test-3',
    name: 'Aria Thompson',
    role: 'Founder & CEO',
    company: 'DecentraHold Inc',
    feedback: 'We wanted a high-end blockchain analytics system. AdSpark listened, planned perfectly, and delivered a dynamic glassmorphism dashboard that has blown away our clients.',
    rating: 5,
    image: 'assets/images/testimonials/testimonial_aria.jpg'
  }
];

export const seedClients: ClientPartner[] = [
  { id: 'cli-1', name: 'Apex Global', logo: '🌐 Apex Global' },
  { id: 'cli-2', name: 'NovaCare Clinics', logo: '🏥 NovaCare Clinics' },
  { id: 'cli-3', name: 'DecentraHold', logo: '⛓️ DecentraHold' },
  { id: 'cli-4', name: 'Vanguard Realty', logo: '🏢 Vanguard Realty' },
  { id: 'cli-5', name: 'Solis Energy', logo: '⚡ Solis Energy' }
];

export const seedGallery: GalleryItem[] = [
  { id: 'gal-1', title: 'AdSpark Innovation Summit 2026', image: 'assets/images/backgrounds/about_section.jpg', category: 'Events', description: 'Our annual technology conference discussing LLM architectures.' },
  { id: 'gal-2', title: 'Silicon Valley Team Pod', image: 'assets/images/services/digital_marketing.jpg', category: 'Workplace', description: 'Coordinating on enterprise CRM design frameworks.' },
  { id: 'gal-3', title: 'Figma Prototyping Workshop', image: 'assets/images/services/ui_ux_design.jpg', category: 'Creative', description: 'Polishing layout interactions for mobile app mockups.' }
];

export const seedTeam: TeamMember[] = [
  { id: 'tm-1', name: 'Dhruv Marathe', role: 'Chief Executive Officer', bio: 'Strategic systems leader directing AdSpark Technologies towards advanced, high-performance cognitive software solutions.', image: 'assets/images/team/team_dhruv.jpg', socials: { linkedin: 'https://linkedin.com/in/dhruvmarathe', github: 'https://github.com/dhruv' } },
  { id: 'tm-2', name: 'Sarah Jenkins', role: 'Head of AI & Software', bio: 'Expert backend architect specialized in Large Language Models integration, cognitive parsing, and schema architectures.', image: 'assets/images/team/team_sarah.jpg', socials: { linkedin: 'https://linkedin.com/in/sarahjenkins', github: 'https://github.com/sarah' } },
  { id: 'tm-3', name: 'Daniel Vance', role: 'Principal Web Architect', bio: 'Creative designer and developer committed to responsive layouts, elegant visual transitions, and fast render scores.', image: 'assets/images/team/team_daniel.jpg', socials: { linkedin: 'https://linkedin.com/in/danielvance', github: 'https://github.com/daniel' } }
];

export const seedInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-001',
    clientName: 'Apex Global Ltd',
    clientEmail: 'billing@apex.com',
    amount: 12500,
    dueDate: '2026-08-15',
    status: 'Paid',
    items: [{ description: 'OmniChannel Portal Milestone 2 Deployment', quantity: 1, rate: 12500, amount: 12500 }],
    issuedAt: '2026-07-01'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-002',
    clientName: 'NovaCare Clinics',
    clientEmail: 'billing@novacare.com',
    amount: 8000,
    dueDate: '2026-07-30',
    status: 'Unpaid',
    items: [
      { description: 'Healthcare ERP HIPAA System Consultation', quantity: 20, rate: 200, amount: 4000 },
      { description: 'Dashboard Module Prototyping', quantity: 1, rate: 4000, amount: 4000 }
    ],
    issuedAt: '2026-07-10'
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-003',
    clientName: 'DecentraHold Inc',
    clientEmail: 'finance@decentrahold.io',
    amount: 6200,
    dueDate: '2026-06-25',
    status: 'Overdue',
    items: [{ description: 'Analytics D3 Interactive Dashboard Wireframing', quantity: 1, rate: 6200, amount: 6200 }],
    issuedAt: '2026-05-25'
  }
];

export const defaultSEO: SEOConfig = {
  metaTitle: 'AdSpark Technologies | Corporate Software & Web Engineering Solutions',
  metaKeywords: 'Custom Software, Web Development, Cloud Solutions, ERP Development, AI Systems, UI/UX Design, IT Company',
  metaDesc: 'AdSpark Technologies is a leading Software Development company engineering custom applications, e-commerce storefronts, cloud infrastructures, and LLM integrations.',
  ogTitle: 'AdSpark Technologies | Enterprise Digital Engineering',
  ogDesc: 'Bespoke corporate software, responsive web portals, and reliable cloud solutions designed to fuel system performance and enterprise growth.',
  ogImage: 'assets/images/hero/hero_banner.jpg',
  twitterCard: 'summary_large_image'
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
    '/portfolio': 1900,
    '/careers': 1100,
    '/blog': 720
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
    details: 'Pre-populated services, seed careers, initial user logs, and team metadata.',
    ipAddress: '127.0.0.1',
    timestamp: '2026-07-13T10:00:00Z'
  }
];

export const initialApplications: CareerApplication[] = [
  {
    id: 'app-1',
    careerId: 'job-1',
    jobTitle: 'Senior Full-Stack TypeScript Developer',
    fullName: 'Jane Doe',
    email: 'jane.doe@gmail.com',
    phone: '+1 (555) 0144',
    resumeUrl: '/uploads/resumes/jane_doe_resume.pdf',
    coverLetter: 'I am highly passionate about full-stack TypeScript architectures and modular designs. AdSpark is engineering exactly the kind of systems I thrive on.',
    status: 'Pending',
    appliedAt: '2026-07-10T14:30:00Z'
  }
];

export const initialMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Robert Chen',
    email: 'robert@apex.com',
    subject: 'Request for Custom CRM Proposal',
    message: 'Hello AdSpark, we are looking to replace our legacy Salesforce pipeline with a bespoke, fast internal React+Node manager. Let us set up an introductory discussion.',
    status: 'Unread',
    submittedAt: '2026-07-12T09:15:00Z'
  }
];

export const initialSubscribers: Subscriber[] = [
  { id: 'sub-1', email: 'newsletter@partner.io', subscribedAt: '2026-07-11T12:00:00Z', status: 'Active' },
  { id: 'sub-2', email: 'hello@clientgrowth.com', subscribedAt: '2026-07-12T15:20:00Z', status: 'Active' }
];
