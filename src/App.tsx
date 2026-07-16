import { useState, useEffect } from 'react';
import {
  Service,
  Project,
  Blog,
  Career,
  CareerApplication,
  ContactMessage,
  Subscriber,
  Testimonial,
  ClientPartner,
  GalleryItem,
  TeamMember,
  Invoice,
  SEOConfig,
  WebsiteSettings,
  AnalyticsSummary,
  ActivityLog,
  AdminUser
} from './types';

import {
  seedServices,
  seedProjects,
  seedBlogs,
  seedCareers,
  seedTestimonials,
  seedClients,
  seedGallery,
  seedTeam,
  seedInvoices,
  defaultSEO,
  defaultSettings,
  defaultAnalytics,
  initialLogs,
  initialApplications,
  initialMessages,
  initialSubscribers,
  initialAdmins
} from './data';

// Import modular layouts
import { FrontendPages } from './components/FrontendPages';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import * as Lucide from 'lucide-react';
import { secureLogout } from './lib/supabase';

const fallbackData = {
  services: seedServices,
  projects: seedProjects,
  blogs: seedBlogs,
  careers: seedCareers,
  applications: initialApplications,
  messages: initialMessages,
  contact_requests: initialMessages,
  proposal_requests: [
    {
      id: 'prop-1',
      name: 'Robert Chen',
      email: 'robert@apex.com',
      subject: 'Enterprise ERP Workflow Automation',
      message: 'We are looking to develop a custom ERP pipeline to automate our supply chain operations and sync with our legacy PostgreSQL databases.',
      status: 'Unread' as const,
      submittedAt: new Date().toISOString()
    }
  ],
  subscribers: initialSubscribers,
  testimonials: seedTestimonials,
  clients: seedClients,
  gallery: seedGallery,
  team: seedTeam,
  invoices: seedInvoices,
  seo: defaultSEO,
  settings: defaultSettings,
  analytics: defaultAnalytics,
  logs: initialLogs,
  admins: initialAdmins
};

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<{
    services: Service[];
    projects: Project[];
    blogs: Blog[];
    careers: Career[];
    applications: CareerApplication[];
    messages: ContactMessage[];
    contact_requests?: any[];
    proposal_requests?: any[];
    subscribers: Subscriber[];
    testimonials: Testimonial[];
    clients: ClientPartner[];
    gallery: GalleryItem[];
    team: TeamMember[];
    invoices: Invoice[];
    seo: SEOConfig;
    settings: WebsiteSettings;
    analytics: AnalyticsSummary;
    logs: ActivityLog[];
    admins: AdminUser[];
  } | null>(null);

  // Active client view tab sitemap
  const [activeTab, setActiveTab] = useState<string>('home');

  // Admin Session States
  const [adminToken, setAdminToken] = useState<string | null>(
    localStorage.getItem('adspark_admin_token') || sessionStorage.getItem('adspark_admin_token')
  );
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  // Load database from the full-stack database endpoint, falling back to Local Storage
  const fetchDatabase = async () => {
    try {
      const res = await fetch('/api/db');
      if (res.ok) {
        const serverData = await res.json();
        setData(serverData);
        localStorage.setItem('adspark_db', JSON.stringify(serverData));
      } else {
        throw new Error('Non-ok response from server API');
      }
    } catch (err) {
      console.warn('Could not sync with Express server datastore, using local fallback:', err);
      try {
        const stored = localStorage.getItem('adspark_db');
        if (stored) {
          setData(JSON.parse(stored));
        } else {
          localStorage.setItem('adspark_db', JSON.stringify(fallbackData));
          setData(fallbackData);
        }
      } catch (localErr) {
        console.error('Error loading static backup database:', localErr);
        setData(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabase();

    // Safety timeout to ensure preloader disappears within 1 second under any conditions
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setData(prev => {
        if (!prev) {
          console.warn('1-second safety timeout triggered. Using static database fallback.');
          return fallbackData;
        }
        return prev;
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Sync document SEO whenever seo/settings update
  useEffect(() => {
    if (data?.seo && data?.settings) {
      document.title = `${data.seo.metaTitle} | ${data.settings.companyName}`;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', data.seo.metaDesc);

      // Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', data.seo.metaKeywords);
    }
  }, [data]);

  const handleLoginSuccess = (token: string) => {
    setAdminToken(token);
    setShowLoginModal(false);
    setIsAdminView(true);
    fetchDatabase();
  };

  const handleLogout = async () => {
    if (adminToken) {
      await secureLogout(adminToken);
    }
    setAdminToken(null);
    setIsAdminView(false);
    fetchDatabase();
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="p-4 bg-brand-blue rounded-3xl animate-bounce">
          <Lucide.Sparkles size={36} className="text-white" />
        </div>
        <div className="space-y-1 text-center">
          <span className="text-sm font-bold tracking-widest uppercase block text-brand-blue animate-pulse">AdSpark Technologies</span>
          <span className="text-xs text-slate-400 font-medium block">Booting dynamic system engine...</span>
        </div>
      </div>
    );
  }

  // Toggle between Admin Dashboard and Client Portfolio Website
  if (isAdminView && adminToken) {
    return (
      <AdminDashboard
        services={data.services}
        projects={data.projects}
        blogs={data.blogs}
        careers={data.careers}
        applications={data.applications}
        messages={data.messages}
        contact_requests={data.contact_requests || []}
        proposal_requests={data.proposal_requests || []}
        subscribers={data.subscribers}
        testimonials={data.testimonials}
        clients={data.clients}
        gallery={data.gallery}
        team={data.team}
        invoices={data.invoices}
        seo={data.seo}
        settings={data.settings}
        analytics={data.analytics}
        logs={data.logs}
        admins={data.admins}
        token={adminToken}
        onLogout={handleLogout}
        onRefreshData={fetchDatabase}
      />
    );
  }

  return (
    <>
      <FrontendPages
        services={data.services}
        projects={data.projects}
        blogs={data.blogs}
        careers={data.careers}
        testimonials={data.testimonials}
        clients={data.clients}
        gallery={data.gallery}
        team={data.team}
        settings={data.settings}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefreshData={fetchDatabase}
        onOpenAdmin={() => {
          if (adminToken) {
            setIsAdminView(true);
          } else {
            setShowLoginModal(true);
          }
        }}
      />

      {showLoginModal && (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </>
  );
}
