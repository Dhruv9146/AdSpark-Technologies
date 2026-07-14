import React, { useState, useEffect } from 'react';
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
  ActivityLog
} from '../types';
import * as Lucide from 'lucide-react';

interface AdminDashboardProps {
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
  token: string;
  onLogout: () => void;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  services,
  projects,
  blogs,
  careers,
  applications,
  messages,
  subscribers,
  testimonials,
  clients,
  gallery,
  team,
  invoices,
  seo,
  settings,
  analytics,
  logs,
  token,
  onLogout,
  onRefreshData
}) => {
  // Navigation
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  // Form toggles
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // AI Copilot states
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResult, setAiResult] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Core WebsiteSettings state
  const [localSettings, setLocalSettings] = useState<WebsiteSettings>(settings);
  const [localSEO, setLocalSEO] = useState<SEOConfig>(seo);

  // Selected admin profile management
  const [adminName, setAdminName] = useState<string>('Dhruv Marathe');
  const [adminEmail, setAdminEmail] = useState<string>('adsparktechnologies01@gmail.com');

  // Mail Log inbox viewer state
  const [systemEmails, setSystemEmails] = useState<{ id: string; to: string; subject: string; body: string; sentAt: string }[]>([]);

  // CRUD Temp Fields
  const [svcForm, setSvcForm] = useState<Partial<Service>>({});
  const [projForm, setProjForm] = useState<Partial<Project>>({});
  const [blogForm, setBlogForm] = useState<Partial<Blog>>({});
  const [careerForm, setCareerForm] = useState<Partial<Career>>({});
  const [invoiceForm, setInvoiceForm] = useState<Partial<Invoice>>({});

  useEffect(() => {
    // Fetch systemEmails from Express SMTP simulator
    fetch('/api/system-emails', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSystemEmails(data))
      .catch(err => console.error('Error fetching simulated SMTP logs:', err));
  }, [logs]);

  const handleUpdateWebsiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Saving dynamic settings...');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ settings: localSettings, seo: localSEO })
      });
      if (res.ok) {
        setStatusMessage('Website settings and SEO parameters saved dynamically!');
        onRefreshData();
        setTimeout(() => setStatusMessage(''), 4000);
      }
    } catch (err) {
      setStatusMessage('Error updating settings.');
    }
  };

  const handleTriggerAI = async (type: 'blog' | 'seo') => {
    if (!aiPrompt) return;
    setAiLoading(true);
    setAiResult('');
    try {
      const res = await fetch('/api/copilot/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: aiPrompt, type })
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult(data.text);
      }
    } catch (err) {
      console.error(err);
      setAiResult('AI Assistant offline. Connect your Gemini API Key in secrets panel.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (appId: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportSubscribers = () => {
    const headers = 'ID,Email,SubscribedAt,Status\n';
    const rows = subscribers.map(s => `"${s.id}","${s.email}","${s.subscribedAt}","${s.status}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `adspark_newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // General CRUD helper logic
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingId;
    const url = isEdit ? `/api/services/${editingId}` : '/api/services';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
      ...svcForm,
      id: isEdit ? editingId : svcForm.title?.toLowerCase().replace(/\s+/g, '-')
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsCreating(false);
        setEditingId(null);
        setSvcForm({});
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Confirm deletion of this service slot?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingId;
    const url = isEdit ? `/api/projects/${editingId}` : '/api/projects';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
      ...projForm,
      technologies: typeof projForm.technologies === 'string' 
        ? (projForm.technologies as string).split(',').map(t => t.trim())
        : projForm.technologies,
      images: typeof projForm.images === 'string'
        ? (projForm.images as string).split(',').map(i => i.trim())
        : projForm.images || ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop']
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsCreating(false);
        setEditingId(null);
        setProjForm({});
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Delete project from dynamic catalog?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingId;
    const url = isEdit ? `/api/blogs/${editingId}` : '/api/blogs';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
      ...blogForm,
      tags: typeof blogForm.tags === 'string'
        ? (blogForm.tags as string).split(',').map(t => t.trim())
        : blogForm.tags || []
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsCreating(false);
        setEditingId(null);
        setBlogForm({});
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!window.confirm('Confirm deleting this article?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="admin-root-viewport" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Logo brand info */}
          <div className="flex items-center gap-2 px-2">
            <div className="p-2 bg-brand-blue text-white rounded-xl shadow-md">
              <Lucide.Sparkles size={18} />
            </div>
            <div>
              <span className="text-base font-display font-bold text-slate-900 block">AdSpark Admin</span>
              <span className="text-[10px] text-brand-blue font-semibold uppercase tracking-wider block">Content Management</span>
            </div>
          </div>

          {/* Navigation link list */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Analytics Board', icon: <Lucide.BarChart3 size={16} /> },
              { id: 'services', label: '14 Tech Services', icon: <Lucide.Cpu size={16} /> },
              { id: 'projects', label: 'Projects Grid', icon: <Lucide.CodeXml size={16} /> },
              { id: 'blogs', label: 'Article CMS', icon: <Lucide.BookMarked size={16} /> },
              { id: 'careers', label: 'Job vacancy Board', icon: <Lucide.Briefcase size={16} /> },
              { id: 'applicants', label: 'Career applications', icon: <Lucide.UserCheck size={16} /> },
              { id: 'contacts', label: 'Inquiries Mailbox', icon: <Lucide.MailQuestion size={16} /> },
              { id: 'subscribers', label: 'Subscribers List', icon: <Lucide.Megaphone size={16} /> },
              { id: 'invoices', label: 'Invoices tracker', icon: <Lucide.Receipt size={16} /> },
              { id: 'settings', label: 'Website Settings', icon: <Lucide.Sliders size={16} /> },
              { id: 'smtp', label: 'Simulated SMTP Inbox', icon: <Lucide.Inbox size={16} /> },
              { id: 'security', label: 'Security Log Audits', icon: <Lucide.ShieldAlert size={16} /> }
            ].map(item => (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => {
                  setActiveModule(item.id);
                  setIsCreating(false);
                  setEditingId(null);
                  setStatusMessage('');
                }}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeModule === item.id
                    ? 'text-white bg-brand-blue shadow-lg shadow-blue-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

        </div>

        {/* Admin profile & logout */}
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-xs border border-brand-blue/20">
              DM
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">{adminName}</span>
              <span className="text-[10px] text-slate-500 block">{adminEmail}</span>
            </div>
          </div>
          <button
            id="admin-logout-btn"
            onClick={onLogout}
            className="w-full py-2 px-3 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100/50 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Lucide.LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 bg-slate-50">
        
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] text-brand-blue font-bold uppercase tracking-widest block">System Workspace</span>
            <h1 className="text-xl md:text-2xl font-display font-bold text-slate-900 tracking-tight mt-1 capitalize">
              {activeModule} Management Board
            </h1>
          </div>
          <span className="text-xs bg-white text-slate-600 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
            System status: <span className="text-green-600 font-bold flex items-center gap-1">● ACTIVE</span>
          </span>
        </div>

        {/* SECTION: KPI DASHBOARD ANALYTICS */}
        {activeModule === 'dashboard' && (
          <div className="space-y-6" id="admin-analytics-view">
            
            {/* KPI metrics row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Total Visitors', value: analytics.totalVisitors, desc: '+12% month growth', icon: <Lucide.Users size={20} className="text-brand-blue" /> },
                { title: 'Project Catalog', value: projects.length, desc: 'Active dynamic slots', icon: <Lucide.CodeXml size={20} className="text-brand-blue" /> },
                { title: 'Blogs Published', value: blogs.length, desc: 'Dynamic articles', icon: <Lucide.BookMarked size={20} className="text-brand-blue" /> },
                { title: 'Subscribers Log', value: subscribers.length, desc: 'Executive leads', icon: <Lucide.Megaphone size={20} className="text-brand-blue" /> }
              ].map((kpi, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 block font-semibold">{kpi.title}</span>
                    <span className="text-2xl font-display font-bold text-slate-900 block">{kpi.value}</span>
                    <span className="text-[10px] text-slate-400 block">{kpi.desc}</span>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                    {kpi.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Responsive SVG Chart */}
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Monthly Visitor Metrics</h3>
                <span className="text-xs text-slate-500 block font-normal">Analytical views tracking over time</span>
              </div>
              
              <div className="h-64 w-full flex items-end">
                {/* Simulated bar grid */}
                <div className="w-full h-full flex justify-between items-end gap-2 pt-4">
                  {analytics.monthlyVisitorGrowth.map((month, idx) => {
                    const ratio = (month.visitors / 4000) * 100; // relative scale
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div className="relative w-full rounded-t-lg bg-brand-blue/25 border border-brand-blue/30 group cursor-help transition-all hover:bg-brand-blue/50" style={{ height: `${ratio}%` }}>
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-[10px] font-bold text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {month.visitors}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase">{month.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Inquiries Snapshot */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-900 font-bold">Pending Career Applications</h3>
                <div className="space-y-3">
                  {applications.slice(0, 3).map(app => (
                    <div key={app.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-slate-900 block">{app.fullName}</span>
                        <span className="text-slate-500">{app.jobTitle}</span>
                      </div>
                      <span className="bg-brand-blue/10 text-brand-blue border border-brand-blue/15 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[9px]">
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-900 font-bold">Latest Web Inquiries</h3>
                <div className="space-y-3">
                  {messages.slice(0, 3).map(msg => (
                    <div key={msg.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between text-slate-500">
                        <span className="font-bold text-slate-900">{msg.name}</span>
                        <span>{new Date(msg.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-600 line-clamp-1 italic">"{msg.message}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* MODULE: SERVICES MANAGEMENT (14 SERVICES CRUD) */}
        {activeModule === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-base text-white">Dynamic IT Services list</h3>
              {!isCreating && !editingId && (
                <button
                  id="add-service-btn"
                  onClick={() => {
                    setIsCreating(true);
                    setSvcForm({ title: '', icon: 'Cpu', shortDesc: '', description: '', pricing: '', category: 'Software Engineering', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop' });
                  }}
                  className="px-4 py-2 bg-brand-blue hover:bg-opacity-95 text-xs font-bold text-white rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Lucide.PlusCircle size={14} />
                  Add New Service
                </button>
              )}
            </div>

            {(isCreating || editingId) ? (
              <form onSubmit={handleSaveService} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4 max-w-2xl">
                <h4 className="font-display font-bold text-sm text-white">{editingId ? 'Edit Service details' : 'Draft New Service'}</h4>
                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Service Title</label>
                    <input
                      type="text"
                      value={svcForm.title || ''}
                      onChange={(e) => setSvcForm({ ...svcForm, title: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Pricing Range</label>
                    <input
                      type="text"
                      value={svcForm.pricing || ''}
                      onChange={(e) => setSvcForm({ ...svcForm, pricing: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                      placeholder="e.g. $5,000 - $12,000"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Lucide Icon Name</label>
                    <input
                      type="text"
                      value={svcForm.icon || ''}
                      onChange={(e) => setSvcForm({ ...svcForm, icon: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                      placeholder="e.g. Cpu, Cloud, Link2"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Service Category</label>
                    <select
                      value={svcForm.category || 'Software Engineering'}
                      onChange={(e) => setSvcForm({ ...svcForm, category: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                    >
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Apps">Mobile Apps</option>
                      <option value="Creative Design">Creative Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Enterprise Solutions">Enterprise Solutions</option>
                      <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                      <option value="AI Engineering">AI Engineering</option>
                      <option value="Consulting">Consulting</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-slate-400 block mb-1">Featured Image URL</label>
                  <input
                    type="text"
                    value={svcForm.image || ''}
                    onChange={(e) => setSvcForm({ ...svcForm, image: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                    required
                  />
                </div>

                <div className="text-xs">
                  <label className="text-slate-400 block mb-1">Short Description (Summary Card)</label>
                  <input
                    type="text"
                    value={svcForm.shortDesc || ''}
                    onChange={(e) => setSvcForm({ ...svcForm, shortDesc: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                    required
                  />
                </div>

                <div className="text-xs">
                  <label className="text-slate-400 block mb-1">Detailed long-form Description</label>
                  <textarea
                    value={svcForm.description || ''}
                    onChange={(e) => setSvcForm({ ...svcForm, description: e.target.value })}
                    rows={4}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                    required
                  ></textarea>
                </div>

                <div className="flex gap-2.5 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingId(null);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-blue hover:bg-opacity-95 text-xs font-bold text-white rounded-xl shadow"
                  >
                    Save Service Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-4 font-bold">Service Title</th>
                      <th className="p-4 font-bold">Category</th>
                      <th className="p-4 font-bold">pricing Estimate</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {services.map(svc => (
                      <tr key={svc.id} className="hover:bg-slate-800/10">
                        <td className="p-4 font-semibold text-white">{svc.title}</td>
                        <td className="p-4 text-slate-400">{svc.category}</td>
                        <td className="p-4 font-semibold text-brand-blue">{svc.pricing}</td>
                        <td className="p-4 text-right flex gap-2 justify-end">
                          <button
                            id={`edit-svc-${svc.id}`}
                            onClick={() => {
                              setEditingId(svc.id);
                              setSvcForm(svc);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-brand-blue text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                          >
                            <Lucide.Edit size={12} />
                          </button>
                          <button
                            id={`del-svc-${svc.id}`}
                            onClick={() => handleDeleteService(svc.id)}
                            className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                          >
                            <Lucide.Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MODULE: PORTFOLIO MANAGEMENT */}
        {activeModule === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-base text-white">Dynamic Portfolios CMS</h3>
              {!isCreating && !editingId && (
                <button
                  id="add-project-btn"
                  onClick={() => {
                    setIsCreating(true);
                    setProjForm({ title: '', category: 'E-Commerce Development', client: '', duration: '', completionDate: '', technologies: [], description: '', images: [], featured: true });
                  }}
                  className="px-4 py-2 bg-brand-blue hover:bg-opacity-95 text-xs font-bold text-white rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Lucide.PlusCircle size={14} />
                  Add New Project
                </button>
              )}
            </div>

            {(isCreating || editingId) ? (
              <form onSubmit={handleSaveProject} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4 max-w-2xl">
                <h4 className="font-display font-bold text-sm text-white">{editingId ? 'Edit Project details' : 'List New Portfolio Project'}</h4>
                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Project Name</label>
                    <input
                      type="text"
                      value={projForm.title || ''}
                      onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Client Partner</label>
                    <input
                      type="text"
                      value={projForm.client || ''}
                      onChange={(e) => setProjForm({ ...projForm, client: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Category</label>
                    <input
                      type="text"
                      value={projForm.category || ''}
                      onChange={(e) => setProjForm({ ...projForm, category: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                      placeholder="e.g. AI & Automation"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Technologies List (Comma-separated)</label>
                    <input
                      type="text"
                      value={typeof projForm.technologies === 'object' ? projForm.technologies.join(', ') : projForm.technologies || ''}
                      onChange={(e) => setProjForm({ ...projForm, technologies: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                      placeholder="React, Node.js, Stripe, AWS"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Duration</label>
                    <input
                      type="text"
                      value={projForm.duration || ''}
                      onChange={(e) => setProjForm({ ...projForm, duration: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                      placeholder="e.g. 4 Months"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Completion Date</label>
                    <input
                      type="date"
                      value={projForm.completionDate || ''}
                      onChange={(e) => setProjForm({ ...projForm, completionDate: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Live Demo link</label>
                    <input
                      type="text"
                      value={projForm.liveLink || ''}
                      onChange={(e) => setProjForm({ ...projForm, liveLink: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">GitHub repository Link</label>
                    <input
                      type="text"
                      value={projForm.githubLink || ''}
                      onChange={(e) => setProjForm({ ...projForm, githubLink: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-slate-400 block mb-1">Multiple Image URLs (Comma-separated)</label>
                  <input
                    type="text"
                    value={typeof projForm.images === 'object' ? projForm.images.join(', ') : projForm.images || ''}
                    onChange={(e) => setProjForm({ ...projForm, images: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                    placeholder="https://img1.com, https://img2.com"
                  />
                </div>

                <div className="text-xs">
                  <label className="text-slate-400 block mb-1">Project Deliverables & Case Details</label>
                  <textarea
                    value={projForm.description || ''}
                    onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                    rows={4}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                    required
                  ></textarea>
                </div>

                <div className="flex gap-2.5 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingId(null);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-blue hover:bg-opacity-95 text-xs font-bold text-white rounded-xl shadow"
                  >
                    Save Project details
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-4 font-bold">Project Name</th>
                      <th className="p-4 font-bold">Client Partner</th>
                      <th className="p-4 font-bold">Category</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {projects.map(proj => (
                      <tr key={proj.id} className="hover:bg-slate-800/10">
                        <td className="p-4 font-semibold text-white">{proj.title}</td>
                        <td className="p-4 text-slate-400">{proj.client}</td>
                        <td className="p-4 text-slate-400">{proj.category}</td>
                        <td className="p-4 text-right flex gap-2 justify-end">
                          <button
                            id={`edit-proj-${proj.id}`}
                            onClick={() => {
                              setEditingId(proj.id);
                              setProjForm(proj);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-brand-blue text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                          >
                            <Lucide.Edit size={12} />
                          </button>
                          <button
                            id={`del-proj-${proj.id}`}
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                          >
                            <Lucide.Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MODULE: BLOG ARTICLE SYSTEM WITH GEMINI AI ASSISTANT CARD! */}
        {activeModule === 'blogs' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Content column: Blog Forms/Tables */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-base text-white">Dynamic Article CMS</h3>
                {!isCreating && !editingId && (
                  <button
                    id="add-blog-btn"
                    onClick={() => {
                      setIsCreating(true);
                      setBlogForm({ title: '', category: 'AI & Automation', summary: '', content: '', featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop', author: ' Sarah Jenkins', authorRole: 'Head of AI Research', tags: [] });
                    }}
                    className="px-4 py-2 bg-brand-blue hover:bg-opacity-95 text-xs font-bold text-white rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lucide.PlusCircle size={14} />
                    Write New Article
                  </button>
                )}
              </div>

              {(isCreating || editingId) ? (
                <form onSubmit={handleSaveBlog} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h4 className="font-display font-bold text-sm text-white">{editingId ? 'Edit Article' : 'Draft New Article'}</h4>
                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Article Title</label>
                      <input
                        type="text"
                        value={blogForm.title || ''}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Author Name</label>
                      <input
                        type="text"
                        value={blogForm.author || ''}
                        onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Category</label>
                      <input
                        type="text"
                        value={blogForm.category || ''}
                        onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Tags (Comma-separated)</label>
                      <input
                        type="text"
                        value={typeof blogForm.tags === 'object' ? blogForm.tags.join(', ') : blogForm.tags || ''}
                        onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                        placeholder="e.g. Gemini, AI, ERP"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Featured Image URL</label>
                      <input
                        type="text"
                        value={blogForm.featuredImage || ''}
                        onChange={(e) => setBlogForm({ ...blogForm, featuredImage: e.target.value })}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Read Time estimate</label>
                      <input
                        type="text"
                        value={blogForm.readTime || ''}
                        onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                        placeholder="e.g. 5 min read"
                        required
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="text-slate-400 block mb-1">SEO Meta Description (under 155 chars)</label>
                    <input
                      type="text"
                      value={blogForm.metaDesc || ''}
                      onChange={(e) => setBlogForm({ ...blogForm, metaDesc: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                      placeholder="Enter search snippet details..."
                    />
                  </div>

                  <div className="text-xs">
                    <label className="text-slate-400 block mb-1">Summary Card snippet</label>
                    <input
                      type="text"
                      value={blogForm.summary || ''}
                      onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                      required
                    />
                  </div>

                  <div className="text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-400">Long-form HTML content</label>
                      <span className="text-[10px] text-brand-blue font-bold">Use AI Copilot card to draft layouts!</span>
                    </div>
                    <textarea
                      value={blogForm.content || ''}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      rows={10}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-blue resize-none"
                      placeholder="<h3>Section Title</h3><p>Paragraph content...</p>"
                      required
                    ></textarea>
                  </div>

                  <div className="flex gap-2.5 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        setEditingId(null);
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-brand-blue hover:bg-opacity-95 text-xs font-bold text-white rounded-xl shadow"
                    >
                      Save Blog Post
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-4 font-bold">Article Title</th>
                        <th className="p-4 font-bold">Category</th>
                        <th className="p-4 font-bold">Views</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {blogs.map(b => (
                        <tr key={b.id} className="hover:bg-slate-800/10">
                          <td className="p-4 font-semibold text-white line-clamp-1">{b.title}</td>
                          <td className="p-4 text-slate-400">{b.category}</td>
                          <td className="p-4 text-slate-400 font-mono">{b.views || 0}</td>
                          <td className="p-4 text-right flex gap-2 justify-end">
                            <button
                              id={`edit-blog-${b.id}`}
                              onClick={() => {
                                setEditingId(b.id);
                                setBlogForm(b);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-brand-blue text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                            >
                              <Lucide.Edit size={12} />
                            </button>
                            <button
                              id={`del-blog-${b.id}`}
                              onClick={() => handleDeleteBlog(b.id)}
                              className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                            >
                              <Lucide.Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right Column: AI Copilot Assistant Panel */}
            <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Lucide.Sparkles className="text-brand-blue animate-pulse" size={20} />
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Gemini AI Copilot</h3>
                  <span className="text-[9px] text-slate-500 block font-semibold uppercase">Content & SEO Generator</span>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <p className="text-slate-400 leading-relaxed font-normal">
                  Need high-quality blog layout descriptions or search metadata? Enter your requirements below to query Gemini securely from server proxy.
                </p>

                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue resize-none font-medium"
                  placeholder="e.g. Write a detailed analysis of microservice API rate limiting..."
                ></textarea>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTriggerAI('blog')}
                    disabled={aiLoading}
                    className="py-2 px-3 rounded-xl bg-brand-blue text-white font-bold hover:bg-opacity-95 text-[11px] cursor-pointer disabled:opacity-50"
                  >
                    Draft Article HTML
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTriggerAI('seo')}
                    disabled={aiLoading}
                    className="py-2 px-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 text-[11px] cursor-pointer disabled:opacity-50"
                  >
                    Generate SEO Desc
                  </button>
                </div>

                {aiLoading && (
                  <div className="text-center text-brand-blue flex items-center justify-center gap-2 py-3 font-semibold">
                    <Lucide.LoaderCircle size={16} className="animate-spin" />
                    Generative thinking active...
                  </div>
                )}

                {aiResult && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="font-bold text-white block">AI Assistant response:</span>
                    <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl font-mono text-[10px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line text-slate-300">
                      {aiResult}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        // Copy to content form
                        setBlogForm(prev => ({
                          ...prev,
                          content: prev.content ? prev.content + '\n' + aiResult : aiResult
                        }));
                      }}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 font-bold text-[10px] rounded-lg transition-all"
                    >
                      Append to Long-form Content
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* MODULE: CAREERS OPENINGS LIST */}
        {activeModule === 'careers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-base text-white">Active Job Vacancies</h3>
              {!isCreating && !editingId && (
                <button
                  onClick={() => {
                    setIsCreating(true);
                    setCareerForm({ title: '', department: 'Software Engineering', location: 'Remote', type: 'Full-time', experience: '3+ Years', salaryRange: '$80,000 - $110,000', description: '', requirements: [], benefits: [], status: 'Active' });
                  }}
                  className="px-4 py-2 bg-brand-blue hover:bg-opacity-95 text-xs font-bold text-white rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Lucide.PlusCircle size={14} />
                  Add New Job
                </button>
              )}
            </div>

            {(isCreating || editingId) ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const isEdit = !!editingId;
                  const url = isEdit ? `/api/careers/${editingId}` : '/api/careers';
                  const method = isEdit ? 'PUT' : 'POST';
                  const payload = {
                    ...careerForm,
                    requirements: typeof careerForm.requirements === 'string' ? (careerForm.requirements as string).split(',').map(r => r.trim()) : careerForm.requirements,
                    benefits: typeof careerForm.benefits === 'string' ? (careerForm.benefits as string).split(',').map(b => b.trim()) : careerForm.benefits
                  };
                  try {
                    const res = await fetch(url, {
                      method,
                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                      body: JSON.stringify(payload)
                    });
                    if (res.ok) {
                      setIsCreating(false);
                      setEditingId(null);
                      setCareerForm({});
                      onRefreshData();
                    }
                  } catch (err) { console.error(err); }
                }}
                className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4 max-w-2xl text-xs"
              >
                <h4 className="font-display font-bold text-sm text-white">{editingId ? 'Edit vacancy Details' : 'Post Job Vacancy'}</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Job Title</label>
                    <input type="text" value={careerForm.title || ''} onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })} className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Salary Range</label>
                    <input type="text" value={careerForm.salaryRange || ''} onChange={(e) => setCareerForm({ ...careerForm, salaryRange: e.target.value })} className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" placeholder="e.g. $100K - $120K" required />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Location</label>
                    <input type="text" value={careerForm.location || ''} onChange={(e) => setCareerForm({ ...careerForm, location: e.target.value })} className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" placeholder="e.g. Remote" required />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Experience required</label>
                    <input type="text" value={careerForm.experience || ''} onChange={(e) => setCareerForm({ ...careerForm, experience: e.target.value })} className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" placeholder="e.g. 3+ Years" required />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Requirements list (Comma-separated)</label>
                  <input type="text" value={typeof careerForm.requirements === 'object' ? careerForm.requirements.join(', ') : careerForm.requirements || ''} onChange={(e) => setCareerForm({ ...careerForm, requirements: e.target.value })} className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" placeholder="Proficiency in React, Typescript, AWS VPC architectures" />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Benefits (Comma-separated)</label>
                  <input type="text" value={typeof careerForm.benefits === 'object' ? careerForm.benefits.join(', ') : careerForm.benefits || ''} onChange={(e) => setCareerForm({ ...careerForm, benefits: e.target.value })} className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" placeholder="Health benefits, Wellness program, Remote setups" />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Role Description</label>
                  <textarea value={careerForm.description || ''} onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })} rows={4} className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none resize-none" required></textarea>
                </div>

                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => { setIsCreating(false); setEditingId(null); }} className="px-4 py-2 bg-slate-800 rounded-xl">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-xl">Save vacancy Listing</button>
                </div>
              </form>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-4 font-bold">Job Title</th>
                      <th className="p-4 font-bold">Location</th>
                      <th className="p-4 font-bold">Salary Range</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {careers.map(job => (
                      <tr key={job.id} className="hover:bg-slate-800/10">
                        <td className="p-4 font-semibold text-white">{job.title}</td>
                        <td className="p-4 text-slate-400">{job.location}</td>
                        <td className="p-4 font-mono text-slate-400">{job.salaryRange}</td>
                        <td className="p-4 text-right flex gap-2 justify-end">
                          <button
                            onClick={() => { setEditingId(job.id); setCareerForm(job); }}
                            className="p-1.5 bg-slate-800 hover:bg-brand-blue text-slate-300 hover:text-white rounded-lg cursor-pointer"
                          >
                            <Lucide.Edit size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MODULE: CAREER APPLICATIONS */}
        {activeModule === 'applicants' && (
          <div className="space-y-6" id="admin-applicants-view">
            <h3 className="font-display font-bold text-base text-white">Candidates Applications tracker</h3>
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4 font-bold">Candidate Name</th>
                    <th className="p-4 font-bold">Role Applied</th>
                    <th className="p-4 font-bold">Resume File</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Evaluate Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {applications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-800/10">
                      <td className="p-4">
                        <span className="font-semibold text-white block">{app.fullName}</span>
                        <span className="text-[10px] text-slate-500 block">{app.email}</span>
                      </td>
                      <td className="p-4 text-slate-400">{app.jobTitle}</td>
                      <td className="p-4 font-mono text-xs text-brand-blue hover:underline">
                        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                          <Lucide.FileDown size={14} />
                          Resume_File.pdf
                        </a>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          app.status === 'Offered' ? 'bg-green-950 text-green-400' :
                          app.status === 'Rejected' ? 'bg-red-950 text-red-400' : 'bg-slate-850 text-slate-300'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-[11px] rounded-lg px-2 py-1 text-slate-300 focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Reviewing">Reviewing</option>
                          <option value="Interview Scheduled">Schedule Interview</option>
                          <option value="Offered">Offer job</option>
                          <option value="Rejected">Reject Profile</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE: CONTACT MESSAGES */}
        {activeModule === 'contacts' && (
          <div className="space-y-6" id="admin-contacts-view">
            <h3 className="font-display font-bold text-base text-white">Inquiries Messages Inbox</h3>
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4 font-bold">Contact Name</th>
                    <th className="p-4 font-bold">Subject Matter</th>
                    <th className="p-4 font-bold">Message Details</th>
                    <th className="p-4 font-bold">Date Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {messages.map(msg => (
                    <tr key={msg.id} className="hover:bg-slate-800/10">
                      <td className="p-4">
                        <span className="font-semibold text-white block">{msg.name}</span>
                        <span className="text-[10px] text-slate-500 block">{msg.email}</span>
                      </td>
                      <td className="p-4 font-semibold text-white">{msg.subject}</td>
                      <td className="p-4 text-slate-400 max-w-sm leading-relaxed">{msg.message}</td>
                      <td className="p-4 text-slate-500 font-mono text-[11px]">{new Date(msg.submittedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE: NEWSLETTER SUBSCRIBERS */}
        {activeModule === 'subscribers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-base text-white">Newsletter Subscription list</h3>
              <button
                id="export-csv-btn"
                onClick={handleExportSubscribers}
                className="px-4 py-2 bg-brand-blue hover:bg-opacity-95 text-xs font-bold text-white rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Lucide.Download size={14} />
                Export Subscribers (CSV)
              </button>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow max-w-2xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4 font-bold">Subscriber Email</th>
                    <th className="p-4 font-bold">Subscription Date</th>
                    <th className="p-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {subscribers.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-800/10">
                      <td className="p-4 font-semibold text-white">{sub.email}</td>
                      <td className="p-4 text-slate-500 font-mono text-[11px]">{new Date(sub.subscribedAt).toLocaleString()}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-green-950 text-green-400">
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE: INVOICES TRACKER */}
        {activeModule === 'invoices' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-base text-white">Corporate invoices</h3>
              {!isCreating && (
                <button
                  id="create-invoice-btn"
                  onClick={() => {
                    setIsCreating(true);
                    setInvoiceForm({ clientName: '', clientEmail: '', amount: 0, dueDate: '', status: 'Unpaid' });
                  }}
                  className="px-4 py-2 bg-brand-blue hover:bg-opacity-95 text-xs font-bold text-white rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Lucide.PlusCircle size={14} />
                  Generate Invoice
                </button>
              )}
            </div>

            {isCreating ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await fetch('/api/invoices', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                      body: JSON.stringify(invoiceForm)
                    });
                    if (res.ok) {
                      setIsCreating(false);
                      setInvoiceForm({});
                      onRefreshData();
                    }
                  } catch (err) { console.error(err); }
                }}
                className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4 max-w-md text-xs"
              >
                <h4 className="font-display font-bold text-sm text-white">Draft Invoice</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Client Business Name</label>
                    <input type="text" value={invoiceForm.clientName || ''} onChange={(e) => setInvoiceForm({ ...invoiceForm, clientName: e.target.value })} className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Billing Email Address</label>
                    <input type="email" value={invoiceForm.clientEmail || ''} onChange={(e) => setInvoiceForm({ ...invoiceForm, clientEmail: e.target.value })} className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Invoice Amount ($ USD)</label>
                    <input type="number" value={invoiceForm.amount || 0} onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: parseFloat(e.target.value) })} className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Due Date</label>
                    <input type="date" value={invoiceForm.dueDate || ''} onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })} className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3">
                  <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 bg-slate-800 rounded-xl">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-xl">Save & Issue Invoice</button>
                </div>
              </form>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-4 font-bold">Invoice ID</th>
                      <th className="p-4 font-bold">Client Name</th>
                      <th className="p-4 font-bold">Issued Date</th>
                      <th className="p-4 font-bold">Due Date</th>
                      <th className="p-4 font-bold">Amount</th>
                      <th className="p-4 font-bold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-800/10">
                        <td className="p-4 font-bold text-white">{inv.invoiceNumber}</td>
                        <td className="p-4 text-slate-400">{inv.clientName}</td>
                        <td className="p-4 text-slate-500 font-mono text-[11px]">{inv.issuedAt}</td>
                        <td className="p-4 text-slate-500 font-mono text-[11px]">{inv.dueDate}</td>
                        <td className="p-4 font-semibold text-white">${inv.amount.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            inv.status === 'Paid' ? 'bg-green-950 text-green-400' : 'bg-red-950 text-red-400'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MODULE: SLIDERS & WEBSITE SETTINGS */}
        {activeModule === 'settings' && (
          <form onSubmit={handleUpdateWebsiteSettings} className="bg-slate-900/60 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 max-w-2xl text-xs">
            <h3 className="font-display font-bold text-base text-white border-b border-slate-800 pb-3">Dynamically Configure Website Parameters</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={localSettings.companyName}
                  onChange={(e) => setLocalSettings({ ...localSettings, companyName: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Logo Text Prefix</label>
                <input
                  type="text"
                  value={localSettings.logoText}
                  onChange={(e) => setLocalSettings({ ...localSettings, logoText: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Contact Support Email</label>
                <input
                  type="email"
                  value={localSettings.contactEmail}
                  onChange={(e) => setLocalSettings({ ...localSettings, contactEmail: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Support Hotline Phone</label>
                <input
                  type="text"
                  value={localSettings.contactPhone}
                  onChange={(e) => setLocalSettings({ ...localSettings, contactPhone: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Corporate Physical Address</label>
              <input
                type="text"
                value={localSettings.address}
                onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                required
              />
            </div>

            {/* SEO Settings Subsections */}
            <h4 className="font-display font-bold text-sm text-white pt-4 border-t border-slate-800">Dynamic SEO Metatags & Robots Config</h4>
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Default Document Meta Title</label>
                <input
                  type="text"
                  value={localSEO.metaTitle}
                  onChange={(e) => setLocalSEO({ ...localSEO, metaTitle: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Default Document Keywords</label>
                <input
                  type="text"
                  value={localSEO.metaKeywords}
                  onChange={(e) => setLocalSEO({ ...localSEO, metaKeywords: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Default Document Meta Description</label>
                <textarea
                  value={localSEO.metaDesc}
                  onChange={(e) => setLocalSEO({ ...localSEO, metaDesc: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue resize-none"
                  required
                ></textarea>
              </div>
            </div>

            {statusMessage && (
              <div className="p-3 bg-green-950 text-green-400 border border-green-900 rounded-xl font-semibold">
                {statusMessage}
              </div>
            )}

            <button
              id="save-settings-btn"
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-brand-blue text-white font-bold hover:bg-opacity-95 shadow transition-all"
            >
              Save Parameters dynamically
            </button>
          </form>
        )}

        {/* MODULE: SIMULATED SMTP MAIL LOGS */}
        {activeModule === 'smtp' && (
          <div className="space-y-6" id="admin-smtp-view">
            <div>
              <h3 className="font-display font-bold text-base text-white">Outgoing simulated SMTP Transactions</h3>
              <span className="text-xs text-slate-500 block">Review notifications delivered in real-time by sitemap workflows</span>
            </div>

            <div className="space-y-4 max-w-3xl">
              {systemEmails.length > 0 ? (
                systemEmails.map(em => (
                  <div key={em.id} className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-3 text-xs">
                    <div className="flex justify-between items-center text-slate-400 border-b border-slate-800/80 pb-2">
                      <div>
                        <span className="font-bold text-white block">Recipient: {em.to}</span>
                        <span className="font-semibold block text-brand-blue mt-0.5">Subject: {em.subject}</span>
                      </div>
                      <span className="font-mono text-slate-500 text-[10px]">{new Date(em.sentAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-300 whitespace-pre-line leading-relaxed font-mono text-[11px] p-2 bg-slate-950/40 rounded-lg">
                      {em.body}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic text-xs">No email transaction logs created yet.</p>
              )}
            </div>
          </div>
        )}

        {/* MODULE: SECURITY LOG AUDITS */}
        {activeModule === 'security' && (
          <div className="space-y-6" id="admin-security-view">
            <div>
              <h3 className="font-display font-bold text-base text-white">Dynamic Activity log Audit trails</h3>
              <span className="text-xs text-slate-400 block">Complete telemetry tracking system actions and administrator logins</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4 font-bold">Log Event ID</th>
                    <th className="p-4 font-bold">Admin Email</th>
                    <th className="p-4 font-bold">Action Type</th>
                    <th className="p-4 font-bold">Telemetry coordinates</th>
                    <th className="p-4 font-bold">Timestamp UTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px] text-slate-400">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/10">
                      <td className="p-4 font-semibold text-slate-500">{log.id}</td>
                      <td className="p-4 text-white font-sans">{log.adminEmail}</td>
                      <td className="p-4 text-brand-blue font-bold">{log.action}</td>
                      <td className="p-4 text-slate-400 max-w-xs truncate font-sans">{log.details} ({log.ipAddress})</td>
                      <td className="p-4 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
