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

const fallbackData = {
  services: seedServices,
  projects: seedProjects,
  blogs: seedBlogs,
  careers: seedCareers,
  applications: initialApplications,
  messages: initialMessages,
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

  // Load database from Local Storage for purely static zero-dependency operation
  const fetchDatabase = () => {
    try {
      const stored = localStorage.getItem('adspark_db');
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        localStorage.setItem('adspark_db', JSON.stringify(fallbackData));
        setData(fallbackData);
      }
    } catch (err) {
      console.error('Error synchronizing local database, using fallback:', err);
      setData(fallbackData);
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
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (err) {
        console.error('Logout API request error:', err);
      }
    }
    localStorage.removeItem('adspark_admin_token');
    localStorage.removeItem('adspark_admin_user');
    sessionStorage.removeItem('adspark_admin_token');
    sessionStorage.removeItem('adspark_admin_user');
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
