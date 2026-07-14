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
  ActivityLog,
  AdminUser
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
  admins: AdminUser[];
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
  admins: initialAdminsProp,
  onLogout,
  onRefreshData
}) => {
  // Navigation & Core state
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Authentication & Session Simulator
  const [adminEmail, setAdminEmail] = useState<string>('adsparktechnologies01@gmail.com');
  const [adminName, setAdminName] = useState<string>('Dhruv Marathe');

  // Load custom SMTP logs and active admin catalog
  const [systemEmails, setSystemEmails] = useState<any[]>([]);
  const [localAdmins, setLocalAdmins] = useState<AdminUser[]>(initialAdminsProp || []);

  // Compute active user role dynamically
  const currentUser = localAdmins.find(a => a.email === adminEmail) || {
    id: 'usr-1',
    name: adminName,
    email: adminEmail,
    role: 'Super Admin' as const,
    status: 'active' as const
  };

  // Form states
  const [localSettings, setLocalSettings] = useState<WebsiteSettings>(settings);
  const [localSEO, setLocalSEO] = useState<SEOConfig>(seo);
  const [svcForm, setSvcForm] = useState<Partial<Service>>({});
  const [projForm, setProjForm] = useState<Partial<Project>>({});
  const [blogForm, setBlogForm] = useState<Partial<Blog>>({});
  const [careerForm, setCareerForm] = useState<Partial<Career>>({});
  const [invoiceForm, setInvoiceForm] = useState<Partial<Invoice>>({});

  // Inquiries Inbox states
  const [searchInquiry, setSearchInquiry] = useState<string>('');
  const [filterInquiryStatus, setFilterInquiryStatus] = useState<string>('All');
  const [selectedInquiry, setSelectedInquiry] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  // Admin Account CRUD states
  const [adminForm, setAdminForm] = useState<Partial<AdminUser> & { password?: string }>({});
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);

  // Profile Settings states
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    profilePhoto: currentUser.profilePhoto || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load baseline SMTP Logs and Admin list on mount
  useEffect(() => {
    const smtpStored = localStorage.getItem('adspark_smtp_logs');
    if (smtpStored) {
      setSystemEmails(JSON.parse(smtpStored));
    }
    const dbStored = localStorage.getItem('adspark_db');
    if (dbStored) {
      const parsed = JSON.parse(dbStored);
      if (parsed.admins) setLocalAdmins(parsed.admins);
    }
  }, [logs]);

  // Synchronize profile forms when current user session changes
  useEffect(() => {
    setProfileForm(f => ({
      ...f,
      name: currentUser.name,
      email: currentUser.email,
      profilePhoto: currentUser.profilePhoto || ''
    }));
  }, [adminEmail]);

  // Dynamic Zero-Dependency Fetch Interceptor representing Laravel Controller endpoints
  const fetch = async (url: string, options?: any): Promise<Response> => {
    const stored = localStorage.getItem('adspark_db') || '{}';
    const db = JSON.parse(stored);
    const method = (options?.method || 'GET').toUpperCase();
    const body = options?.body ? JSON.parse(options.body) : null;

    const commit = (updated: any) => {
      localStorage.setItem('adspark_db', JSON.stringify(updated));
      if (updated.admins) setLocalAdmins(updated.admins);
      onRefreshData();
    };

    const addAuditLog = (action: string, details: string) => {
      const log: ActivityLog = {
        id: 'log-' + Date.now(),
        adminEmail: currentUser.email,
        action,
        details,
        ipAddress: '127.0.0.1',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      db.logs = [log, ...(db.logs || [])];
    };

    // SMTP notification triggers
    const triggerSimulatedEmail = (to: string, subject: string, bodyText: string) => {
      const mail = {
        id: 'smtp-' + Date.now(),
        to,
        subject,
        body: bodyText,
        sentAt: new Date().toISOString()
      };
      const mails = [mail, ...systemEmails];
      localStorage.setItem('adspark_smtp_logs', JSON.stringify(mails));
      setSystemEmails(mails);
    };

    // 1. Settings Update
    if (url === '/api/settings' && method === 'PUT') {
      db.settings = body.settings;
      db.seo = body.seo;
      addAuditLog('Settings Updated', 'Modified Website Parameters and SEO configs');
      commit(db);
      return { ok: true, json: async () => ({ success: true }) } as Response;
    }

    // 2. Application Status Toggle
    if (url.startsWith('/api/applications/') && method === 'PUT') {
      const id = url.split('/').pop();
      db.applications = (db.applications || []).map((a: any) => a.id === id ? { ...a, status: body.status } : a);
      addAuditLog('Application Processed', `Updated candidate ID ${id} to: ${body.status}`);
      commit(db);
      return { ok: true, json: async () => ({ success: true }) } as Response;
    }

    // 3. Services CRUD
    if (url === '/api/services' && method === 'POST') {
      db.services = [...(db.services || []), body];
      addAuditLog('Service Created', `Created technology service: "${body.title}"`);
      commit(db);
      return { ok: true, json: async () => ({ success: true }) } as Response;
    }
    if (url.startsWith('/api/services/') && method === 'PUT') {
      const id = url.split('/').pop();
      db.services = (db.services || []).map((s: any) => s.id === id ? { ...s, ...body } : s);
      addAuditLog('Service Updated', `Updated technology service ID: ${id}`);
      commit(db);
      return { ok: true, json: async () => ({ success: true }) } as Response;
    }
    if (url.startsWith('/api/services/') && method === 'DELETE') {
      const id = url.split('/').pop();
      db.services = (db.services || []).filter((s: any) => s.id !== id);
      addAuditLog('Service Deleted', `Deleted technology service ID: ${id}`);
      commit(db);
      return { ok: true, json: async () => ({ success: true }) } as Response;
    }

    // 4. Projects CRUD
    if (url === '/api/projects' && method === 'POST') {
      db.projects = [...(db.projects || []), body];
      addAuditLog('Project Created', `Added portfolio case: "${body.title}"`);
      commit(db);
      return { ok: true, json: async () => ({ success: true }) } as Response;
    }
    if (url.startsWith('/api/projects/') && method === 'PUT') {
      const id = url.split('/').pop();
      db.projects = (db.projects || []).map((p: any) => p.id === id ? { ...p, ...body } : p);
      addAuditLog('Project Updated', `Updated portfolio case ID: ${id}`);
      commit(db);
      return { ok: true, json: async () => ({ success: true }) } as Response;
    }
    if (url.startsWith('/api/projects/') && method === 'DELETE') {
      const id = url.split('/').pop();
      db.projects = (db.projects || []).filter((p: any) => p.id !== id);
      addAuditLog('Project Deleted', `Deleted portfolio case ID: ${id}`);
      commit(db);
      return { ok: true, json: async () => ({ success: true }) } as Response;
    }

    // 5. Article CMS CRUD
    if (url === '/api/blogs' && method === 'POST') {
      db.blogs = [...(db.blogs || []), body];
      addAuditLog('Article Published', `Published article draft: "${body.title}"`);
      commit(db);
      return { ok: true, json: async () => ({ success: true }) } as Response;
    }
    if (url.startsWith('/api/blogs/') && method === 'PUT') {
      const id = url.split('/').pop();
      db.blogs = (db.blogs || []).map((b: any) => b.id === id ? { ...b, ...body } : b);
      addAuditLog('Article Updated', `Updated article draft ID: ${id}`);
      commit(db);
      return { ok: true, json: async () => ({ success: true }) } as Response;
    }
    if (url.startsWith('/api/blogs/') && method === 'DELETE') {
      const id = url.split('/').pop();
      db.blogs = (db.blogs || []).filter((b: any) => b.id !== id);
      addAuditLog('Article Deleted', `Deleted article draft ID: ${id}`);
      commit(db);
      return { ok: true, json: async () => ({ success: true }) } as Response;
    }

    // 6. Careers CRUD
    if (url === '/api/careers' && method === 'POST') {
      db.careers = [...(db.careers || []), body];
      addAuditLog('Vacancy Posted', `Created job vacancy: "${body.title}"`);
      commit(db);
      return { ok: true, json: async () => ({ success: true }) } as Response;
    }
    if (url.startsWith('/api/careers/') && method === 'PUT') {
      const id = url.split('/').pop();
      db.careers = (db.careers || []).map((c: any) => c.id === id ? { ...c, ...body } : c);
      addAuditLog('Vacancy Updated', `Updated job vacancy ID: ${id}`);
      commit(db);
      return { ok: true, json: async () => ({ success: true }) } as Response;
    }
    if (url.startsWith('/api/careers/') && method === 'DELETE') {
      const id = url.split('/').pop();
      db.careers = (db.careers || []).filter((c: any) => c.id !== id);
      addAuditLog('Vacancy Removed', `Deleted job vacancy ID: ${id}`);
      commit(db);
      return { ok: true, json: async () => ({ success: true }) } as Response;
    }

    // 7. Invoices Setup
    if (url === '/api/invoices' && method === 'POST') {
      db.invoices = [...(db.invoices || []), body];
      addAuditLog('Invoice Generated', `Created invoice for "${body.clientName}" worth $${body.amount}`);
      triggerSimulatedEmail(body.clientEmail, `Invoice Issued - AdSpark Technologies`, `Hello ${body.clientName},\n\nWe have issued an invoice for your custom systems work. Please find details below:\nInvoice Number: ${body.invoiceNumber}\nAmount Due: $${body.amount}\nDue Date: ${body.dueDate}\n\nWarm regards,\nAdSpark billing team`);
      commit(db);
      return { ok: true, json: async () => ({ success: true }) } as Response;
    }

    return { ok: false } as Response;
  };

  // Helper local operations
  const logLocalAction = (action: string, details: string) => {
    try {
      const db = JSON.parse(localStorage.getItem('adspark_db') || '{}');
      const log: ActivityLog = {
        id: 'log-' + Date.now(),
        adminEmail: currentUser.email,
        action,
        details,
        ipAddress: '127.0.0.1',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      db.logs = [log, ...(db.logs || [])];
      localStorage.setItem('adspark_db', JSON.stringify(db));
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Action: Save Dynamic Settings
  const handleUpdateWebsiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Saving global CMS specifications...');
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: localSettings, seo: localSEO })
    });
    if (res.ok) {
      setStatusMessage('Settings and dynamic SEO headers updated successfully!');
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  // Action: Service Save Handler
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingId;
    const url = isEdit ? `/api/services/${editingId}` : '/api/services';
    const method = isEdit ? 'PUT' : 'POST';
    const payload = { ...svcForm, id: isEdit ? editingId : svcForm.title?.toLowerCase().replace(/\s+/g, '-') };
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setIsCreating(false);
      setEditingId(null);
      setSvcForm({});
    }
  };

  // Action: Project Save Handler
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingId;
    const url = isEdit ? `/api/projects/${editingId}` : '/api/projects';
    const method = isEdit ? 'PUT' : 'POST';
    const payload = {
      ...projForm,
      technologies: typeof projForm.technologies === 'string' ? (projForm.technologies as string).split(',').map(t => t.trim()) : projForm.technologies || [],
      images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop']
    };
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setIsCreating(false);
      setEditingId(null);
      setProjForm({});
    }
  };

  // Action: Article CMS Save Handler
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingId;
    const url = isEdit ? `/api/blogs/${editingId}` : '/api/blogs';
    const method = isEdit ? 'PUT' : 'POST';
    const payload = {
      ...blogForm,
      slug: blogForm.title?.toLowerCase().replace(/\s+/g, '-'),
      tags: typeof blogForm.tags === 'string' ? (blogForm.tags as string).split(',').map(t => t.trim()) : blogForm.tags || [],
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: '5 min read',
      views: 0,
      comments: []
    };
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setIsCreating(false);
      setEditingId(null);
      setBlogForm({});
    }
  };

  // Action: Inquiries Mailbox Reply & Operations
  const handleInquiryStatusChange = (id: string, status: 'Read' | 'Unread' | 'Replied') => {
    try {
      const db = JSON.parse(localStorage.getItem('adspark_db') || '{}');
      db.messages = (db.messages || []).map((m: any) => m.id === id ? { ...m, status } : m);
      localStorage.setItem('adspark_db', JSON.stringify(db));
      onRefreshData();
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInquiryReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !replyText.trim()) return;

    try {
      const db = JSON.parse(localStorage.getItem('adspark_db') || '{}');
      
      // Update enquiry with response
      db.messages = (db.messages || []).map((m: any) => 
        m.id === selectedInquiry.id 
          ? { ...m, status: 'Replied' as const, reply_text: replyText, replied_at: new Date().toISOString() } 
          : m
      );

      // Save simulated SMTP transaction log
      const mail = {
        id: 'smtp-' + Date.now(),
        to: selectedInquiry.email,
        subject: `Response to: ${selectedInquiry.subject}`,
        body: `Dear ${selectedInquiry.name},\n\nThank you for reaching out to AdSpark Technologies.\n\n${replyText}\n\nWarm regards,\n\n${currentUser.name}\n${currentUser.role}\nAdSpark Executive Suite`,
        sentAt: new Date().toISOString()
      };
      const mails = [mail, ...systemEmails];
      localStorage.setItem('adspark_smtp_logs', JSON.stringify(mails));
      setSystemEmails(mails);

      // Security Audit Trail
      const log: ActivityLog = {
        id: 'log-' + Date.now(),
        adminEmail: currentUser.email,
        action: 'Replied to Inquiry',
        details: `Sent reply to ${selectedInquiry.name} (${selectedInquiry.email}) about subject: "${selectedInquiry.subject}"`,
        ipAddress: '127.0.0.1',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      db.logs = [log, ...(db.logs || [])];

      localStorage.setItem('adspark_db', JSON.stringify(db));
      onRefreshData();
      
      setSelectedInquiry(null);
      setReplyText('');
      alert('Reply processed and simulation email dispatched via secure SMTP!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInquiry = (id: string) => {
    if (!window.confirm('Delete this contact message permanently?')) return;
    try {
      const db = JSON.parse(localStorage.getItem('adspark_db') || '{}');
      db.messages = (db.messages || []).filter((m: any) => m.id !== id);
      
      // Security Audit Trail
      const log: ActivityLog = {
        id: 'log-' + Date.now(),
        adminEmail: currentUser.email,
        action: 'Inquiry Deleted',
        details: `Removed message ID: ${id}`,
        ipAddress: '127.0.0.1',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      db.logs = [log, ...(db.logs || [])];

      localStorage.setItem('adspark_db', JSON.stringify(db));
      onRefreshData();
      setSelectedInquiry(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const headers = 'ID,Name,Email,Subject,Message,Status,DateReceived,ReplyText,RepliedAt\n';
    const rows = messages.map(m => 
      `"${m.id}","${m.name.replace(/"/g, '""')}","${m.email}","${m.subject.replace(/"/g, '""')}","${m.message.replace(/"/g, '""')}","${m.status}","${m.submittedAt}","${(m as any).reply_text ? (m as any).reply_text.replace(/"/g, '""') : ''}","${(m as any).replied_at || ''}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `adspark_inquiries_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    logLocalAction('Exported Inquiries CSV', 'Triggered file stream download of full inbox.');
  };

  // Action: Super Admin Users Management CRUD
  const handleSaveAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.role !== 'Super Admin') {
      alert('Forbidden: Role-based authorization requires Super Admin role.');
      return;
    }
    if (!adminForm.name || !adminForm.email || (!editingAdminId && !adminForm.password)) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const db = JSON.parse(localStorage.getItem('adspark_db') || '{}');
      let currentAdmins = db.admins || [];

      if (editingAdminId) {
        // Edit Admin
        currentAdmins = currentAdmins.map((a: any) => 
          a.id === editingAdminId 
            ? { ...a, name: adminForm.name, email: adminForm.email, role: adminForm.role } 
            : a
        );
        logLocalAction('Admin Account Updated', `Edited user ${adminForm.name} (${adminForm.email}) role to ${adminForm.role}`);
      } else {
        // Create Admin
        const newAdmin: AdminUser = {
          id: 'usr-' + Date.now(),
          name: adminForm.name!,
          email: adminForm.email!,
          role: adminForm.role || 'Admin',
          status: 'active',
          profilePhoto: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(adminForm.name!)}`
        };
        currentAdmins = [...currentAdmins, newAdmin];
        logLocalAction('Admin Account Created', `Added new user ${adminForm.name} with role: ${newAdmin.role}`);
      }

      db.admins = currentAdmins;
      localStorage.setItem('adspark_db', JSON.stringify(db));
      onRefreshData();
      setLocalAdmins(currentAdmins);
      setAdminForm({});
      setEditingAdminId(null);
      setIsCreating(false);
      alert('Administrative credentials successfully synchronized!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAdminStatus = (id: string) => {
    if (currentUser.role !== 'Super Admin') return;
    try {
      const db = JSON.parse(localStorage.getItem('adspark_db') || '{}');
      const target = db.admins?.find((a: any) => a.id === id);
      if (!target) return;
      if (target.email === currentUser.email) {
        alert('Action Blocked: You cannot deactivate your own active session!');
        return;
      }

      const nextStatus = target.status === 'active' ? 'disabled' : 'active';
      db.admins = db.admins.map((a: any) => a.id === id ? { ...a, status: nextStatus } : a);
      logLocalAction('Admin Status Toggled', `Changed ${target.name} status to ${nextStatus}`);
      localStorage.setItem('adspark_db', JSON.stringify(db));
      onRefreshData();
      setLocalAdmins(db.admins);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAdminUser = (id: string) => {
    if (currentUser.role !== 'Super Admin') return;
    try {
      const db = JSON.parse(localStorage.getItem('adspark_db') || '{}');
      const target = db.admins?.find((a: any) => a.id === id);
      if (!target) return;
      if (target.email === currentUser.email) {
        alert('Action Blocked: You cannot delete your own active session!');
        return;
      }

      if (!window.confirm(`Permanently terminate administrator account "${target.name}"?`)) return;

      db.admins = db.admins.filter((a: any) => a.id !== id);
      logLocalAction('Admin Account Deleted', `Removed user ${target.name} (${target.email})`);
      localStorage.setItem('adspark_db', JSON.stringify(db));
      onRefreshData();
      setLocalAdmins(db.admins);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetAdminPassword = (id: string) => {
    if (currentUser.role !== 'Super Admin') return;
    const newPass = prompt('Enter the temporary password for this administrator account:');
    if (!newPass || newPass.trim().length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    const target = localAdmins.find(a => a.id === id);
    if (target) {
      logLocalAction('Admin Password Reset', `Generated fresh login credentials for ${target.name}`);
      alert(`Security credentials reset successfully for ${target.name}!`);
    }
  };

  // Action: Personal Profile Save
  const handleSavePersonalProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const db = JSON.parse(localStorage.getItem('adspark_db') || '{}');
      
      // Update details in array
      db.admins = (db.admins || []).map((a: any) => 
        a.email === adminEmail 
          ? { ...a, name: profileForm.name, email: profileForm.email, profilePhoto: profileForm.profilePhoto } 
          : a
      );

      logLocalAction('Profile Credentials Modified', 'Changed personal identification data and attributes.');
      localStorage.setItem('adspark_db', JSON.stringify(db));
      onRefreshData();
      
      setAdminName(profileForm.name);
      setAdminEmail(profileForm.email);
      alert('Personal administration profile synchronized!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.currentPassword || !profileForm.newPassword) {
      alert('Please fill out all credential fields.');
      return;
    }
    if (profileForm.newPassword !== profileForm.confirmPassword) {
      alert('Confirm Password mismatch! Please check key sequences.');
      return;
    }
    logLocalAction('Password Changed', 'Updated administrative account secure key.');
    alert('Security key successfully updated! Session re-authorized.');
    setProfileForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  // Filter messages list dynamically based on search & filters
  const filteredMessages = messages.filter(m => {
    const query = searchInquiry.toLowerCase();
    const matchesSearch = 
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.subject.toLowerCase().includes(query) ||
      m.message.toLowerCase().includes(query);
    
    if (filterInquiryStatus === 'All') return matchesSearch;
    return matchesSearch && m.status === filterInquiryStatus;
  });

  // Role Hiding Rules helper
  const isAuthorized = (allowed: string[]) => {
    return allowed.includes(currentUser.role);
  };

  // Switch role session tester
  const switchSimulatedUser = (email: string) => {
    const target = localAdmins.find(a => a.email === email);
    if (target) {
      if (target.status === 'disabled') {
        alert(`Authentication Failure: Account "${target.name}" is currently disabled by Super Admin. Access Denied.`);
        return;
      }
      setAdminEmail(target.email);
      setAdminName(target.name);
      setActiveModule('dashboard');
      logLocalAction('Switched Administrative Session', `Simulated login as ${target.name} (${target.role})`);
    }
  };

  return (
    <div id="admin-root-viewport" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-72 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Logo brand info */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg">
              <Lucide.Sparkles size={20} />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">AdSpark CMS v12</span>
              <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider block">Enterprise Administrator</span>
            </div>
          </div>

          {/* SIMULATED SESSION SWITCHER FOR EASY TESTING */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
              <Lucide.ShieldCheck size={10} className="text-blue-500" /> Active Session Switcher
            </span>
            <select 
              value={adminEmail} 
              onChange={(e) => switchSimulatedUser(e.target.value)} 
              className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2 py-1.5 focus:outline-none"
            >
              {localAdmins.map(admin => (
                <option key={admin.id} value={admin.email}>
                  {admin.name} ({admin.role}) {admin.status === 'disabled' ? '[DISABLED]' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation link list */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Analytics Board', icon: <Lucide.BarChart3 size={15} />, auth: ['Super Admin', 'Admin', 'Editor', 'Manager'] },
              { id: 'services', label: '14 Tech Services', icon: <Lucide.Cpu size={15} />, auth: ['Super Admin', 'Admin', 'Editor'] },
              { id: 'projects', label: 'Projects Grid', icon: <Lucide.CodeXml size={15} />, auth: ['Super Admin', 'Admin', 'Editor'] },
              { id: 'blogs', label: 'Article CMS', icon: <Lucide.BookMarked size={15} />, auth: ['Super Admin', 'Admin', 'Editor'] },
              { id: 'careers', label: 'Vacancy Board', icon: <Lucide.Briefcase size={15} />, auth: ['Super Admin', 'Admin', 'Editor'] },
              { id: 'applicants', label: 'Career Applications', icon: <Lucide.UserCheck size={15} />, auth: ['Super Admin', 'Admin', 'Editor'] },
              { id: 'contacts', label: 'Inquiries Inbox', icon: <Lucide.MailQuestion size={15} />, auth: ['Super Admin', 'Admin', 'Manager'] },
              { id: 'subscribers', label: 'Subscribers List', icon: <Lucide.Megaphone size={15} />, auth: ['Super Admin', 'Admin'] },
              { id: 'invoices', label: 'Invoices Tracker', icon: <Lucide.Receipt size={15} />, auth: ['Super Admin', 'Admin'] },
              { id: 'admins', label: 'Admin Accounts', icon: <Lucide.Users size={15} />, auth: ['Super Admin'] },
              { id: 'settings', label: 'Website Settings', icon: <Lucide.Sliders size={15} />, auth: ['Super Admin'] },
              { id: 'smtp', label: 'SMTP Mail Logs', icon: <Lucide.Inbox size={15} />, auth: ['Super Admin', 'Admin', 'Manager'] },
              { id: 'security', label: 'Security Audits', icon: <Lucide.ShieldAlert size={15} />, auth: ['Super Admin', 'Admin'] },
            ].filter(item => isAuthorized(item.auth)).map(item => (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => {
                  setActiveModule(item.id);
                  setIsCreating(false);
                  setEditingId(null);
                  setStatusMessage('');
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeModule === item.id
                    ? 'text-white bg-blue-600 shadow-md shadow-blue-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

        </div>

        {/* Admin profile & logout */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <button 
            onClick={() => setActiveModule('profile')}
            className="w-full flex items-center gap-3 px-2 text-left hover:bg-slate-800/50 p-2.5 rounded-2xl transition-all"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center shrink-0">
              {currentUser.profilePhoto ? (
                <img src={currentUser.profilePhoto} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-xs text-blue-400">{currentUser.name.substring(0,2).toUpperCase()}</span>
              )}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate">{currentUser.name}</span>
              <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
                ● {currentUser.role}
              </span>
            </div>
          </button>
          <button
            id="admin-logout-btn"
            onClick={onLogout}
            className="w-full py-2 px-3 bg-red-950/40 border border-red-900/40 text-red-400 hover:bg-red-900/30 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Lucide.LogOut size={13} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 bg-slate-950">
        
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block">System Workspace</span>
            <h1 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight mt-1 capitalize">
              {activeModule === 'contacts' ? 'Inquiries Inbox' : `${activeModule} Management Board`}
            </h1>
          </div>
          <span className="text-xs bg-slate-900 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
            Role Access Level: <span className="text-green-400 font-bold uppercase tracking-widest text-[10px] bg-green-950/80 px-2 py-0.5 rounded-md border border-green-900">{currentUser.role}</span>
          </span>
        </div>

        {/* SECTION: KPI DASHBOARD ANALYTICS */}
        {activeModule === 'dashboard' && (
          <div className="space-y-6" id="admin-analytics-view">
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Total Visitors', value: analytics.totalVisitors, desc: '+12% month growth', icon: <Lucide.Users size={18} className="text-blue-400" /> },
                { title: 'Project Catalog', value: projects.length, desc: 'Active dynamic cases', icon: <Lucide.CodeXml size={18} className="text-blue-400" /> },
                { title: 'Article CMS Posts', value: blogs.length, desc: 'Dynamic articles', icon: <Lucide.BookMarked size={18} className="text-blue-400" /> },
                { title: 'Subscribers Log', value: subscribers.length, desc: 'Executive newsletter leads', icon: <Lucide.Megaphone size={18} className="text-blue-400" /> }
              ].map((kpi, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 block font-semibold">{kpi.title}</span>
                    <span className="text-2xl font-display font-bold text-white block">{kpi.value}</span>
                    <span className="text-[9px] text-slate-500 block">{kpi.desc}</span>
                  </div>
                  <div className="p-2.5 bg-blue-950 border border-blue-900 rounded-xl">
                    {kpi.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Monthly graph simulation */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="font-display font-bold text-sm text-white">Monthly Visitor Telemetry</h3>
                <span className="text-[10px] text-slate-500 block">Analytical views tracking over time</span>
              </div>
              <div className="h-56 w-full flex items-end">
                <div className="w-full h-full flex justify-between items-end gap-2 pt-4">
                  {analytics.monthlyVisitorGrowth.map((month, idx) => {
                    const ratio = (month.visitors / 4000) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="relative w-full rounded-t bg-blue-600/30 border border-blue-500/40 group hover:bg-blue-600/50 cursor-pointer transition-all" style={{ height: `${ratio}%` }}>
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-[9px] font-bold text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {month.visitors} users
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase">{month.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                <h3 className="font-display font-bold text-xs text-white">Pending Career Applications</h3>
                <div className="space-y-2">
                  {applications.slice(0, 3).map(app => (
                    <div key={app.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex justify-between items-center text-[11px]">
                      <div>
                        <span className="font-semibold text-white block">{app.fullName}</span>
                        <span className="text-slate-500 text-[10px]">{app.jobTitle}</span>
                      </div>
                      <span className="bg-blue-950 text-blue-400 border border-blue-900 font-bold px-2 py-0.5 rounded text-[8px] uppercase">
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                <h3 className="font-display font-bold text-xs text-white">Recent Web Inquiries</h3>
                <div className="space-y-2">
                  {messages.slice(0, 3).map(msg => (
                    <div key={msg.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-[11px] space-y-1">
                      <div className="flex justify-between text-slate-500">
                        <span className="font-bold text-slate-300">{msg.name}</span>
                        <span className="text-[10px]">{new Date(msg.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-400 line-clamp-1 italic">"{msg.message}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE: TECHNOLOGY SERVICES */}
        {activeModule === 'services' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Manage Corporate Technology Catalog</h3>
              {!isCreating && !editingId && (
                <button onClick={() => { setIsCreating(true); setSvcForm({}); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white flex items-center gap-1 transition-all cursor-pointer">
                  <Lucide.PlusCircle size={14} /> Add Service
                </button>
              )}
            </div>

            {(isCreating || editingId) ? (
              <form onSubmit={handleSaveService} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 max-w-lg text-xs">
                <h4 className="font-bold text-white text-xs">{editingId ? 'Edit Service Specification' : 'Add New Service Specification'}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Service Title</label>
                    <input type="text" value={svcForm.title || ''} onChange={(e) => setSvcForm({ ...svcForm, title: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Short Description</label>
                    <input type="text" value={svcForm.shortDesc || ''} onChange={(e) => setSvcForm({ ...svcForm, shortDesc: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">In-Depth Description</label>
                    <textarea value={svcForm.description || ''} onChange={(e) => setSvcForm({ ...svcForm, description: e.target.value })} rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Icon Name (Lucide)</label>
                      <input type="text" value={svcForm.icon || 'Cpu'} onChange={(e) => setSvcForm({ ...svcForm, icon: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Category Group</label>
                      <input type="text" value={svcForm.category || ''} onChange={(e) => setSvcForm({ ...svcForm, category: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => { setIsCreating(false); setEditingId(null); }} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold">Save changes</button>
                </div>
              </form>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map(svc => (
                  <div key={svc.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950/60 border border-blue-900 px-2 py-0.5 rounded-md inline-block mb-2">{svc.category}</span>
                      <h4 className="font-bold text-white text-sm">{svc.title}</h4>
                      <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">{svc.shortDesc}</p>
                    </div>
                    <div className="flex gap-2 justify-end pt-2 border-t border-slate-800/60">
                      <button onClick={() => { setEditingId(svc.id); setSvcForm(svc); }} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold text-slate-300">Edit</button>
                      <button onClick={async () => { if (window.confirm('Delete this service?')) { await fetch(`/api/services/${svc.id}`, { method: 'DELETE' }); } }} className="px-2.5 py-1 bg-red-950 hover:bg-red-900/40 text-red-400 rounded text-[10px] font-bold">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODULE: PORTFOLIO PROJECTS */}
        {activeModule === 'projects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Manage Corporate Case Studies</h3>
              {!isCreating && !editingId && (
                <button onClick={() => { setIsCreating(true); setProjForm({}); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white flex items-center gap-1 transition-all">
                  <Lucide.PlusCircle size={14} /> Add Case Study
                </button>
              )}
            </div>

            {(isCreating || editingId) ? (
              <form onSubmit={handleSaveProject} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 max-w-lg text-xs">
                <h4 className="font-bold text-white text-xs">{editingId ? 'Edit Case Study' : 'Publish New Case Study'}</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Project Name</label>
                      <input type="text" value={projForm.title || ''} onChange={(e) => setProjForm({ ...projForm, title: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Category</label>
                      <input type="text" value={projForm.category || ''} onChange={(e) => setProjForm({ ...projForm, category: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">In-Depth Description</label>
                    <textarea value={projForm.description || ''} onChange={(e) => setProjForm({ ...projForm, description: e.target.value })} rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Client Brand</label>
                      <input type="text" value={projForm.client || ''} onChange={(e) => setProjForm({ ...projForm, client: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Duration</label>
                      <input type="text" value={projForm.duration || ''} onChange={(e) => setProjForm({ ...projForm, duration: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Technologies Used (comma separated)</label>
                    <input type="text" value={typeof projForm.technologies === 'object' ? projForm.technologies.join(', ') : projForm.technologies || ''} onChange={(e) => setProjForm({ ...projForm, technologies: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" placeholder="React, Node, Laravel, MySQL" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => { setIsCreating(false); setEditingId(null); }} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold">Publish case</button>
                </div>
              </form>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {projects.map(proj => (
                  <div key={proj.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold text-slate-400">{proj.category}</span>
                        <span className="text-[9px] font-bold text-blue-400">Client: {proj.client}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-1">{proj.title}</h4>
                      <p className="text-slate-400 text-[11px] line-clamp-2 mt-1">{proj.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {proj.technologies.map((t, i) => (
                          <span key={i} className="text-[9px] bg-slate-950 px-2 py-0.5 border border-slate-800 rounded-full font-mono">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-3 border-t border-slate-800/60 mt-4">
                      <button onClick={() => { setEditingId(proj.id); setProjForm(proj); }} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold text-slate-300">Edit</button>
                      <button onClick={async () => { if (window.confirm('Delete this case?')) { await fetch(`/api/projects/${proj.id}`, { method: 'DELETE' }); } }} className="px-2.5 py-1 bg-red-950 hover:bg-red-900/40 text-red-400 rounded text-[10px] font-bold">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODULE: ARTICLE CMS */}
        {activeModule === 'blogs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Manage Corporate Article CMS</h3>
              {!isCreating && !editingId && (
                <button onClick={() => { setIsCreating(true); setBlogForm({}); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white flex items-center gap-1 transition-all">
                  <Lucide.PlusCircle size={14} /> Compose Article
                </button>
              )}
            </div>

            {(isCreating || editingId) ? (
              <form onSubmit={handleSaveBlog} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 max-w-lg text-xs">
                <h4 className="font-bold text-white text-xs">{editingId ? 'Edit Article Draft' : 'Compose New Article'}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Article Title</label>
                    <input type="text" value={blogForm.title || ''} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Author Name</label>
                      <input type="text" value={blogForm.author || ''} onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Author Corporate Role</label>
                      <input type="text" value={blogForm.authorRole || ''} onChange={(e) => setBlogForm({ ...blogForm, authorRole: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Article Brief Summary</label>
                    <input type="text" value={blogForm.summary || ''} onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Article Content (Markdown / HTML)</label>
                    <textarea value={blogForm.content || ''} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} rows={5} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none font-mono text-[11px]" required></textarea>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Topic Tags (comma separated)</label>
                    <input type="text" value={typeof blogForm.tags === 'object' ? blogForm.tags.join(', ') : blogForm.tags || ''} onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => { setIsCreating(false); setEditingId(null); }} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold">Publish article</button>
                </div>
              </form>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/60 border-b border-slate-800 text-[10px] uppercase text-slate-400">
                    <tr>
                      <th className="p-4">Title</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">Date Published</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {blogs.map(blog => (
                      <tr key={blog.id} className="hover:bg-slate-800/10">
                        <td className="p-4">
                          <span className="font-bold text-white block">{blog.title}</span>
                          <span className="text-[10px] text-slate-500 block truncate max-w-sm mt-0.5">{blog.summary}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-300 font-semibold block">{blog.author}</span>
                          <span className="text-[10px] text-slate-500 block">{blog.authorRole}</span>
                        </td>
                        <td className="p-4 text-slate-500 font-mono text-[11px]">{blog.publishedAt}</td>
                        <td className="p-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => { setEditingId(blog.id); setBlogForm(blog); }} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold text-slate-300">Edit</button>
                            <button onClick={async () => { if (window.confirm('Delete this article?')) { await fetch(`/api/blogs/${blog.id}`, { method: 'DELETE' }); } }} className="px-2 py-1 bg-red-950 hover:bg-red-900/40 text-red-400 rounded text-[10px] font-bold">Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MODULE: VACANCY BOARD */}
        {activeModule === 'careers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Manage Corporate Hiring</h3>
              {!isCreating && !editingId && (
                <button onClick={() => { setIsCreating(true); setCareerForm({}); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white flex items-center gap-1 transition-all">
                  <Lucide.PlusCircle size={14} /> Post Job Vacancy
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
                    requirements: typeof careerForm.requirements === 'string' ? (careerForm.requirements as string).split(',').map(r => r.trim()) : careerForm.requirements || [],
                    benefits: typeof careerForm.benefits === 'string' ? (careerForm.benefits as string).split(',').map(b => b.trim()) : careerForm.benefits || [],
                    status: 'Active' as const
                  };
                  const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                  if (res.ok) {
                    setIsCreating(false);
                    setEditingId(null);
                    setCareerForm({});
                  }
                }}
                className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 max-w-lg text-xs"
              >
                <h4 className="font-bold text-white text-xs">{editingId ? 'Edit vacancy' : 'Post vacancy'}</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Job Title</label>
                      <input type="text" value={careerForm.title || ''} onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Department</label>
                      <input type="text" value={careerForm.department || ''} onChange={(e) => setCareerForm({ ...careerForm, department: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Location</label>
                      <input type="text" value={careerForm.location || ''} onChange={(e) => setCareerForm({ ...careerForm, location: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Job Type</label>
                      <select value={careerForm.type || 'Full-time'} onChange={(e) => setCareerForm({ ...careerForm, type: e.target.value as any })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none">
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Vacancy Description</label>
                    <textarea value={careerForm.description || ''} onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })} rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required></textarea>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => { setIsCreating(false); setEditingId(null); }} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold">Publish listing</button>
                </div>
              </form>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {careers.map(car => (
                  <div key={car.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-900 px-2 py-0.5 rounded uppercase font-bold">{car.type}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{car.location}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-2">{car.title}</h4>
                      <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">{car.description}</p>
                    </div>
                    <div className="flex gap-2 justify-end pt-3 border-t border-slate-800/60 mt-4">
                      <button onClick={() => { setEditingId(car.id); setCareerForm(car); }} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold text-slate-300">Edit</button>
                      <button onClick={async () => { if (window.confirm('Delete this vacancy?')) { await fetch(`/api/careers/${car.id}`, { method: 'DELETE' }); } }} className="px-2.5 py-1 bg-red-950 hover:bg-red-900/40 text-red-400 rounded text-[10px] font-bold">Close job</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODULE: CAREER APPLICANTS */}
        {activeModule === 'applicants' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Review Candidate Applications</h3>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Target Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Process</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {applications.length > 0 ? (
                    applications.map(app => (
                      <tr key={app.id} className="hover:bg-slate-800/10">
                        <td className="p-4">
                          <span className="font-bold text-white block">{app.fullName}</span>
                          <span className="text-[10px] text-slate-500 block">{app.email}</span>
                        </td>
                        <td className="p-4 text-slate-300 font-semibold">{app.jobTitle}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            app.status === 'Offered' ? 'bg-green-950 text-green-400' :
                            app.status === 'Rejected' ? 'bg-red-950 text-red-400' :
                            'bg-slate-800 text-slate-300'
                          }`}>{app.status}</span>
                        </td>
                        <td className="p-4 text-right">
                          <select 
                            value={app.status} 
                            onChange={async (e) => { await fetch(`/api/applications/${app.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: e.target.value }) }); }}
                            className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2 py-1 focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Reviewing">Reviewing</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Offered">Offered</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500 italic">No job applications submitted yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE: CONTACTS INQUIRIES MAILBOX */}
        {activeModule === 'contacts' && (
          <div className="space-y-4" id="admin-contacts-view">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-bold text-white">Inquiries Messages Inbox</h3>
                <span className="text-[10px] text-slate-500 block">Manage customer consultations, request for proposals, and sales enquiries</span>
              </div>
              <button 
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-blue-950 border border-blue-900 text-blue-400 hover:bg-blue-900/20 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Lucide.ArrowDownCircle size={14} /> Export CSV Spreadsheet
              </button>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="flex flex-col sm:flex-row gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="relative flex-1">
                <Lucide.Search className="absolute left-3 top-2.5 text-slate-500" size={15} />
                <input 
                  type="text" 
                  value={searchInquiry}
                  onChange={(e) => setSearchInquiry(e.target.value)}
                  placeholder="Search inquiries by sender name, email, topic, or coordinates..." 
                  className="w-full bg-slate-950/80 border border-slate-800 text-xs rounded-xl pl-9 pr-4 py-2 text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-1.5 overflow-x-auto">
                {['All', 'Unread', 'Read', 'Replied'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterInquiryStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      filterInquiryStatus === status 
                        ? 'bg-blue-600 text-white shadow' 
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-850'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* INTERACTIVE INQUIRIES VIEW SPLITPANEL */}
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left Column: List */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 h-[500px] overflow-y-auto">
                <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2">Messages ({filteredMessages.length})</h4>
                <div className="space-y-2">
                  {filteredMessages.length > 0 ? (
                    filteredMessages.map(msg => (
                      <button
                        key={msg.id}
                        onClick={() => {
                          setSelectedInquiry(msg);
                          if (msg.status === 'Unread') {
                            handleInquiryStatusChange(msg.id, 'Read');
                          }
                        }}
                        className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedInquiry?.id === msg.id 
                            ? 'bg-blue-950/40 border-blue-600' 
                            : 'bg-slate-950/60 border-slate-850 hover:bg-slate-900/40'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-white text-[11px] truncate block">{msg.name}</span>
                          <span className="text-[8px] font-mono text-slate-500 shrink-0">{new Date(msg.submittedAt).toLocaleDateString()}</span>
                        </div>
                        <span className="text-[10px] text-blue-400 font-semibold truncate block mt-0.5">{msg.subject}</span>
                        <p className="text-slate-400 text-[10px] line-clamp-1 mt-1 italic">"{msg.message}"</p>
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-bold border uppercase tracking-wider ${
                            msg.status === 'Replied' ? 'bg-green-950 text-green-400 border-green-900' :
                            msg.status === 'Read' ? 'bg-blue-950 text-blue-400 border-blue-900' :
                            'bg-red-950 text-red-400 border-red-900 animate-pulse'
                          }`}>{msg.status}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-slate-500 italic text-xs text-center pt-8">No matching contact messages.</p>
                  )}
                </div>
              </div>

              {/* Right Column: Active detail pane */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[500px] overflow-y-auto flex flex-col justify-between">
                {selectedInquiry ? (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Meta header */}
                      <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                        <div>
                          <h4 className="font-bold text-white text-sm">{selectedInquiry.name}</h4>
                          <a href={`mailto:${selectedInquiry.email}`} className="text-xs text-blue-400 hover:underline">{selectedInquiry.email}</a>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block font-mono">{new Date(selectedInquiry.submittedAt).toLocaleString()}</span>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block mt-1">ID: {selectedInquiry.id}</span>
                        </div>
                      </div>

                      {/* Content block */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold block">Subject: {selectedInquiry.subject}</span>
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-850 whitespace-pre-line font-sans italic">
                          "{selectedInquiry.message}"
                        </p>
                      </div>

                      {/* Existing Response display if any */}
                      {((selectedInquiry as any).reply_text) && (
                        <div className="p-4 bg-green-950/40 border border-green-900 rounded-2xl space-y-1.5 text-xs">
                          <span className="font-bold text-green-400 text-[10px] uppercase tracking-wider block">✓ Replied On: {new Date((selectedInquiry as any).replied_at).toLocaleString()}</span>
                          <p className="text-slate-300 whitespace-pre-line font-mono text-[11px] italic">
                            {(selectedInquiry as any).reply_text}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* REPLY ACTION OR DELETE BAR */}
                    <div className="pt-4 border-t border-slate-800 space-y-3">
                      {selectedInquiry.status !== 'Replied' && (
                        <form onSubmit={handleInquiryReply} className="space-y-2.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Draft SMTP Email Reply</label>
                          <textarea 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type response coordinate. Clicking Reply will mark status as Replied, write the reply, and send a simulated SMTP notification..." 
                            rows={3}
                            className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-600 resize-none placeholder:text-slate-600 font-mono"
                            required
                          ></textarea>
                          <div className="flex justify-between items-center">
                            <button 
                              type="button"
                              onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                              className="px-3 py-1.5 bg-red-950/60 border border-red-900 text-red-400 hover:bg-red-900/20 text-xs font-bold rounded-lg transition-all cursor-pointer"
                            >
                              Delete inquiry
                            </button>
                            <button 
                              type="submit"
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-lg shadow flex items-center gap-1 cursor-pointer"
                            >
                              <Lucide.Send size={12} /> Dispatch SMTP Reply
                            </button>
                          </div>
                        </form>
                      )}
                      {selectedInquiry.status === 'Replied' && (
                        <div className="flex justify-between">
                          <span className="text-[11px] text-green-400 font-bold flex items-center gap-1">✓ INQUIRY FULLY PROCESSED</span>
                          <button 
                            type="button"
                            onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                            className="px-2.5 py-1 bg-red-950 hover:bg-red-900/25 text-red-400 text-[10px] font-bold rounded"
                          >
                            Delete inquiry from system
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-slate-500 space-y-2">
                    <Lucide.MailQuestion size={40} className="text-slate-700 animate-bounce" />
                    <p className="text-xs italic text-center">Select an inquiry from the list to view specifications, reply, or delete.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODULE: SUBSCRIBERS */}
        {activeModule === 'subscribers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Newsletter Subscription List</h3>
              <button onClick={handleExportCSV} className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-300">Export csv</button>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Subscriber email</th>
                    <th className="p-4">Date Joined</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {subscribers.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-800/10">
                      <td className="p-4 text-white font-semibold">{sub.email}</td>
                      <td className="p-4 text-slate-500 font-mono text-[11px]">{sub.subscribedAt}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[9px] bg-green-950 text-green-400 font-bold uppercase border border-green-900">{sub.status}</span>
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
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Client billing Invoices Tracker</h3>
              {!isCreating && (
                <button onClick={() => { setIsCreating(true); setInvoiceForm({ invoiceNumber: 'INV-2026-' + Math.floor(Math.random()*10000), items: [{ description: 'Custom ERP system & CMS Integration', quantity: 1, rate: 8500, amount: 8500 }], amount: 8500, issuedAt: new Date().toISOString().split('T')[0], status: 'Unpaid' }); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white flex items-center gap-1">
                  <Lucide.PlusCircle size={14} /> Draft Invoice
                </button>
              )}
            </div>

            {isCreating ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const res = await fetch('/api/invoices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(invoiceForm) });
                  if (res.ok) {
                    setIsCreating(false);
                    setInvoiceForm({});
                  }
                }}
                className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 max-w-md text-xs"
              >
                <h4 className="font-bold text-white text-xs">Draft Client Billing Invoice</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Invoice Number</label>
                    <input type="text" value={invoiceForm.invoiceNumber || ''} onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" required />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Client Business Name</label>
                    <input type="text" value={invoiceForm.clientName || ''} onChange={(e) => setInvoiceForm({ ...invoiceForm, clientName: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" required />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Billing Email Coordinate</label>
                    <input type="email" value={invoiceForm.clientEmail || ''} onChange={(e) => setInvoiceForm({ ...invoiceForm, clientEmail: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Amount ($ USD)</label>
                      <input type="number" value={invoiceForm.amount || ''} onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: parseFloat(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" required />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Due Date</label>
                      <input type="date" value={invoiceForm.dueDate || ''} onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" required />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg">Issue billing</button>
                </div>
              </form>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Invoice NO</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Due Date</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-800/10">
                        <td className="p-4 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                        <td className="p-4 text-slate-300 font-semibold">{inv.clientName}</td>
                        <td className="p-4 text-white font-mono">${inv.amount.toLocaleString()}</td>
                        <td className="p-4 text-slate-500 font-mono">{inv.dueDate}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${inv.status === 'Paid' ? 'bg-green-950 text-green-400' : 'bg-red-950 text-red-400'}`}>{inv.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MODULE: ADMIN ACCOUNTS CRUD (Super Admin Only) */}
        {activeModule === 'admins' && (
          <div className="space-y-4" id="admin-management-module">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">System Administrative Users</h3>
                <span className="text-[10px] text-slate-500 block">Manage backend profiles, roles, toggles, and credentials.</span>
              </div>
              {!isCreating && !editingAdminId && (
                <button 
                  onClick={() => { setIsCreating(true); setAdminForm({ role: 'Admin' }); }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white flex items-center gap-1"
                >
                  <Lucide.UserPlus size={14} /> Create New Admin
                </button>
              )}
            </div>

            {(isCreating || editingAdminId) ? (
              <form onSubmit={handleSaveAdminUser} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 max-w-md text-xs">
                <h4 className="font-bold text-white text-xs">{editingAdminId ? 'Edit User Credentials' : 'Provision Administrative Profile'}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Full Legal Name *</label>
                    <input 
                      type="text" 
                      value={adminForm.name || ''} 
                      onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" 
                      placeholder="e.g. Dhruv Marathe"
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Corporate Email Address *</label>
                    <input 
                      type="email" 
                      value={adminForm.email || ''} 
                      onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" 
                      placeholder="e.g. dhruv@adspark.tech"
                      required 
                    />
                  </div>
                  {!editingAdminId && (
                    <div>
                      <label className="text-slate-400 block mb-1">Temporary Password *</label>
                      <input 
                        type="password" 
                        value={adminForm.password || ''} 
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" 
                        placeholder="At least 6 characters"
                        required 
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-slate-400 block mb-1">Authorized Access Role *</label>
                    <select 
                      value={adminForm.role || 'Admin'} 
                      onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value as any })} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Admin">Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => { setIsCreating(false); setEditingAdminId(null); setAdminForm({}); }} 
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold"
                  >
                    Authorize Account
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {localAdmins.map(admin => (
                  <div key={admin.id} className={`p-5 rounded-2xl border ${admin.status === 'disabled' ? 'bg-slate-900/40 border-slate-900 opacity-60' : 'bg-slate-900 border-slate-800'} space-y-4 flex flex-col justify-between`}>
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700 bg-slate-850 flex items-center justify-center shrink-0">
                        {admin.profilePhoto ? (
                          <img src={admin.profilePhoto} alt={admin.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-xs text-blue-400">{admin.name.substring(0,2).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-white text-xs block truncate">{admin.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate mt-0.5">{admin.email}</span>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="bg-blue-950 text-blue-400 border border-blue-900/50 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                            {admin.role}
                          </span>
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${admin.status === 'active' ? 'bg-green-950 text-green-400 border border-green-900/50' : 'bg-red-950 text-red-400 border border-red-900/50'}`}>
                            {admin.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1.5 justify-end pt-3 border-t border-slate-800/60 text-[9px] font-bold">
                      <button 
                        onClick={() => handleResetAdminPassword(admin.id)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-750 rounded text-slate-300"
                        title="Reset Account Password"
                      >
                        Reset Password
                      </button>
                      <button 
                        onClick={() => { setEditingAdminId(admin.id); setAdminForm(admin); }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-750 rounded text-slate-300"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleToggleAdminStatus(admin.id)}
                        className={`px-2 py-1 rounded border ${admin.status === 'active' ? 'bg-red-950/20 border-red-900/50 text-red-400 hover:bg-red-950/40' : 'bg-green-950/20 border-green-900/50 text-green-400 hover:bg-green-950/40'}`}
                      >
                        {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleDeleteAdminUser(admin.id)}
                        className="px-2 py-1 bg-red-950/80 border border-red-900 text-red-400 hover:bg-red-900/40 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODULE: PROFILE SETTINGS */}
        {activeModule === 'profile' && (
          <div className="grid md:grid-cols-2 gap-6" id="personal-profile-module">
            {/* Account Details */}
            <form onSubmit={handleSavePersonalProfile} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 text-xs">
              <h3 className="font-display font-bold text-sm text-white border-b border-slate-800 pb-3">Update Personal Details</h3>
              <div className="space-y-3">
                <div className="flex justify-center py-2">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-600 mx-auto flex items-center justify-center bg-slate-800">
                      {profileForm.profilePhoto ? (
                        <img src={profileForm.profilePhoto} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-blue-400">{currentUser.name.substring(0,2).toUpperCase()}</span>
                      )}
                    </div>
                    <label className="text-[10px] text-blue-400 hover:underline cursor-pointer block font-semibold">
                      Avatar seed ID
                      <input 
                        type="text" 
                        value={profileForm.profilePhoto} 
                        onChange={(e) => setProfileForm({ ...profileForm, profilePhoto: e.target.value })}
                        className="block mt-1 w-full bg-slate-950 text-[10px] border border-slate-800 rounded px-2 py-1 text-center font-mono text-white" 
                        placeholder=" dicebear icon link "
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Display/Legal Name</label>
                  <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" required />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Corporate Email coordinates</label>
                  <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" required />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Administrative Access Role</label>
                  <input type="text" value={currentUser.role} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-500 font-bold uppercase" disabled />
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow mt-3">Save Profile Attributes</button>
            </form>

            {/* Change Password */}
            <form onSubmit={handleUpdatePassword} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 text-xs">
              <h3 className="font-display font-bold text-sm text-white border-b border-slate-800 pb-3">Change Administrative Password</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 block mb-1">Current Password</label>
                  <input type="password" value={profileForm.currentPassword} onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" placeholder="••••••••" required />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">New CMS Password</label>
                  <input type="password" value={profileForm.newPassword} onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" placeholder="At least 6 characters" required />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Confirm New Password</label>
                  <input type="password" value={profileForm.confirmPassword} onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" placeholder="Re-type new password" required />
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow mt-3">Change Account Password</button>
            </form>
          </div>
        )}

        {/* MODULE: SLIDERS & WEBSITE SETTINGS (Super Admin Only) */}
        {activeModule === 'settings' && (
          <form onSubmit={handleUpdateWebsiteSettings} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 max-w-lg text-xs">
            <h3 className="font-display font-bold text-sm text-white border-b border-slate-800 pb-3">Configure Website Settings</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1">Company Legal Name</label>
                <input type="text" value={localSettings.companyName} onChange={(e) => setLocalSettings({ ...localSettings, companyName: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Logo Text Prefix</label>
                <input type="text" value={localSettings.logoText} onChange={(e) => setLocalSettings({ ...localSettings, logoText: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Contact Support Email</label>
                <input type="email" value={localSettings.contactEmail} onChange={(e) => setLocalSettings({ ...localSettings, contactEmail: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Hotline Phone</label>
                <input type="text" value={localSettings.contactPhone} onChange={(e) => setLocalSettings({ ...localSettings, contactPhone: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Corporate Physical Address</label>
              <input type="text" value={localSettings.address} onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
            </div>

            <h4 className="font-bold text-xs text-white pt-3 border-t border-slate-800">SEO Metatags Config</h4>
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Document Meta Title</label>
                <input type="text" value={localSEO.metaTitle} onChange={(e) => setLocalSEO({ ...localSEO, metaTitle: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Document Meta Keywords</label>
                <input type="text" value={localSEO.metaKeywords} onChange={(e) => setLocalSEO({ ...localSEO, metaKeywords: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" required />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Document Meta Description</label>
                <textarea value={localSEO.metaDesc} onChange={(e) => setLocalSEO({ ...localSEO, metaDesc: e.target.value })} rows={2} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none resize-none" required></textarea>
              </div>
            </div>

            {statusMessage && <div className="p-2.5 bg-green-950/80 text-green-400 border border-green-900 rounded-xl font-bold">{statusMessage}</div>}
            <button id="save-settings-btn" type="submit" className="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 shadow transition-all">Save website settings</button>
          </form>
        )}

        {/* MODULE: SIMULATED SMTP MAIL LOGS */}
        {activeModule === 'smtp' && (
          <div className="space-y-4" id="admin-smtp-view">
            <div>
              <h3 className="text-sm font-bold text-white">Simulated Outgoing SMTP Mail Logs</h3>
              <span className="text-[10px] text-slate-500 block">Review and audit outgoing response emails dispatched dynamically by the contact form replies</span>
            </div>

            <div className="space-y-3 max-w-xl">
              {systemEmails.length > 0 ? (
                systemEmails.map(em => (
                  <div key={em.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-400 border-b border-slate-850 pb-2">
                      <div>
                        <span className="font-bold text-white block">Recipient: {em.to}</span>
                        <span className="font-semibold text-blue-400 text-[10px] block mt-0.5">Subject: {em.subject}</span>
                      </div>
                      <span className="font-mono text-slate-500 text-[9px]">{new Date(em.sentAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-300 whitespace-pre-line leading-relaxed font-mono text-[10px] p-2 bg-slate-950 rounded-lg">
                      {em.body}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic text-xs">No simulated SMTP logs recorded. Try replying to an inquiry in the Contacts tab!</p>
              )}
            </div>
          </div>
        )}

        {/* MODULE: SECURITY LOG AUDITS */}
        {activeModule === 'security' && (
          <div className="space-y-4" id="admin-security-view">
            <div>
              <h3 className="text-sm font-bold text-white">Security Action Audits & Activity Logs</h3>
              <span className="text-[10px] text-slate-500 block">Complete audit records tracking all administrative actions, logins, status toggles, and CMS updates.</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4 font-bold">Admin Email</th>
                    <th className="p-4 font-bold">Action Event</th>
                    <th className="p-4 font-bold">Details</th>
                    <th className="p-4 font-bold">Timestamp UTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 font-mono text-[10px] text-slate-400">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/10">
                      <td className="p-4 text-white font-sans">{log.adminEmail}</td>
                      <td className="p-4 text-blue-400 font-bold">{log.action}</td>
                      <td className="p-4 text-slate-300 font-sans max-w-xs truncate">{log.details}</td>
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
