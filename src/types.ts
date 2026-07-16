export interface Service {
  id: string;
  title: string;
  icon: string; // Lucide icon name
  shortDesc: string;
  description: string;
  category: string;
  pricing?: string;
  image?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  technologies: string[];
  client: string;
  duration: string;
  completionDate: string;
  liveLink?: string;
  githubLink?: string;
  description: string;
  images?: string[]; // Support multiple images
  featured: boolean;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  summary: string;
  content: string; // HTML or Markdown format
  featuredImage?: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  views: number;
  comments: Comment[];
  metaTitle?: string;
  metaDesc?: string;
  metaKeywords?: string;
}

export interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

export interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experience: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  benefits: string[];
  status: 'Active' | 'Closed';
}

export interface CareerApplication {
  id: string;
  careerId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  resumeUrl: string; // Dynamic path
  coverLetter?: string;
  status: 'Pending' | 'Reviewing' | 'Interview Scheduled' | 'Offered' | 'Rejected';
  appliedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Replied';
  submittedAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'Active' | 'Unsubscribed';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  feedback: string;
  rating: number;
  image?: string;
}

export interface ClientPartner {
  id: string;
  name: string;
  logo: string;
  website?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image?: string;
  category: string;
  description?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  items: { description: string; quantity: number; rate: number; amount: number }[];
  issuedAt: string;
}

export interface SEOConfig {
  metaTitle: string;
  metaDesc: string;
  metaKeywords: string;
  ogTitle: string;
  ogDesc: string;
  ogImage: string;
  twitterCard: string;
}

export interface WebsiteSettings {
  companyName: string;
  logoText: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  workingHours: string;
  mapEmbedUrl: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
  };
}

export interface AnalyticsSummary {
  totalVisitors: number;
  uniqueVisitors: number;
  averageSessionDuration: string;
  bounceRate: string;
  pageViewsByPath: Record<string, number>;
  monthlyVisitorGrowth: { month: string; visitors: number; views: number }[];
}

export interface ActivityLog {
  id: string;
  adminEmail: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Editor' | 'Manager';
  status: 'active' | 'disabled';
  profilePhoto?: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
}

export interface ProposalRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Evaluating' | 'Processed';
  submittedAt: string;
}

