import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// -------------------------------------------------------------
// SERVER-SIDE SUPABASE CLIENT INITIALIZATION & DATA FETCHING
// -------------------------------------------------------------
let serverSupabaseClient: any = null;

function getSupabaseServerClient() {
  if (serverSupabaseClient !== null) return serverSupabaseClient;

  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (url && key && url !== 'YOUR_SUPABASE_URL') {
    try {
      serverSupabaseClient = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
      console.log('[SUPABASE] Server-side Supabase client initialized.');
    } catch (err) {
      console.error('[SUPABASE] Failed to initialize server-side Supabase client:', err);
    }
  }
  return serverSupabaseClient;
}

async function fetchSupabaseData() {
  const client = getSupabaseServerClient();
  if (!client) return null;

  try {
    const [
      { data: contacts, error: e1 },
      { data: proposals, error: e2 },
      { data: services, error: e3 },
      { data: portfolio, error: e4 },
      { data: testimonials, error: e5 },
      { data: careers, error: e6 },
      { data: admins, error: e7 },
      { data: settings, error: e8 }
    ] = await Promise.all([
      client.from('contact_requests').select('*').order('created_at', { ascending: false }),
      client.from('proposal_requests').select('*').order('created_at', { ascending: false }),
      client.from('services').select('*'),
      client.from('portfolio').select('*'),
      client.from('testimonials').select('*'),
      client.from('careers').select('*'),
      client.from('admins').select('*'),
      client.from('settings').select('*')
    ]);

    if (e1) console.warn('[SUPABASE] Error fetching contact_requests:', e1.message);
    if (e2) console.warn('[SUPABASE] Error fetching proposal_requests:', e2.message);
    if (e3) console.warn('[SUPABASE] Error fetching services:', e3.message);
    if (e4) console.warn('[SUPABASE] Error fetching portfolio:', e4.message);
    if (e5) console.warn('[SUPABASE] Error fetching testimonials:', e5.message);
    if (e6) console.warn('[SUPABASE] Error fetching careers:', e6.message);
    if (e7) console.warn('[SUPABASE] Error fetching admins:', e7.message);
    if (e8) console.warn('[SUPABASE] Error fetching settings:', e8.message);

    const result: any = {};
    if (contacts) {
      result.contact_requests = contacts.map((c: any) => ({
        id: 'msg-' + c.id,
        name: c.name,
        email: c.email,
        subject: c.subject,
        message: c.message,
        status: c.status,
        submittedAt: c.created_at || c.submittedAt
      }));
      result.messages = result.contact_requests;
    }
    if (proposals) {
      result.proposal_requests = proposals.map((p: any) => ({
        id: 'prop-' + p.id,
        name: p.name,
        email: p.email,
        subject: p.subject,
        message: p.message,
        status: p.status,
        submittedAt: p.created_at || p.submittedAt
      }));
    }
    if (services) {
      result.services = services;
    }
    if (portfolio) {
      result.projects = portfolio.map((p: any) => ({
        id: p.id,
        title: p.title,
        client: p.client,
        category: p.category,
        description: p.description,
        challenge: p.challenge,
        solution: p.solution,
        technologies: p.technologies,
        live_demo: p.live_demo,
        github_link: p.github_link,
        images: p.images
      }));
    }
    if (testimonials) {
      result.testimonials = testimonials;
    }
    if (careers) {
      result.careers = careers;
    }
    if (admins) {
      result.admins = admins.map((a: any) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        role: a.role,
        status: a.status,
        profilePhoto: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(a.name)}`
      }));
    }
    if (settings) {
      const companyConfig = settings.find((s: any) => s.key === 'company_config');
      if (companyConfig) {
        result.settings = companyConfig.value;
      }
    }

    return result;
  } catch (err) {
    console.error('[SUPABASE] Data fetch crash:', err);
    return null;
  }
}


// Default seed values if database.json doesn't exist yet
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
} from './src/data.js';

const app = express();
const PORT = 3000;

// CORS Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Body parsing
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Database File Path
const DB_PATH = path.join(process.cwd(), 'database.json');

// Initialize Gemini SDK with User-Agent telemetry
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// In-Memory Database State
const initialProposals = [
  {
    id: 'prop-1',
    name: 'Robert Chen',
    email: 'robert@apex.com',
    subject: 'Enterprise ERP Workflow Automation',
    message: 'We are looking to develop a custom ERP pipeline to automate our supply chain operations and sync with our legacy PostgreSQL databases.',
    status: 'Unread',
    submittedAt: new Date().toISOString()
  }
];

let DB: any = {
  services: seedServices,
  projects: seedProjects,
  blogs: seedBlogs,
  careers: seedCareers,
  testimonials: seedTestimonials,
  clients: seedClients,
  gallery: seedGallery,
  team: seedTeam,
  invoices: seedInvoices,
  seo: defaultSEO,
  settings: defaultSettings,
  analytics: defaultAnalytics,
  logs: initialLogs,
  applications: initialApplications,
  messages: initialMessages,
  contact_requests: initialMessages,
  proposal_requests: initialProposals,
  subscribers: initialSubscribers,
  admins: initialAdmins,
  // SMTP mock logs to let user inspect "sent" emails inside Admin UI!
  systemEmails: [
    {
      id: 'em-1',
      to: 'info@adsparktech.com',
      subject: 'New Application Received: Senior Developer',
      body: 'Jane Doe has submitted an application for Senior Full-Stack TypeScript Developer. Read cover letter inside Admin Careers application section.',
      sentAt: new Date().toISOString()
    }
  ]
};

// Database utility functions
function loadDatabase() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      // Merge keys to support updates gracefully
      DB = { ...DB, ...parsed };
      if (!DB.contact_requests) {
        DB.contact_requests = DB.messages || DB.contact_requests || initialMessages;
      }
      if (!DB.proposal_requests) {
        DB.proposal_requests = DB.proposal_requests || initialProposals;
      }
      if (!DB.admins) {
        DB.admins = initialAdmins;
      }
      console.log('Database loaded successfully from database.json');
    } else {
      saveDatabase();
      console.log('No database.json found. Created new from seed data.');
    }
  } catch (err) {
    console.error('Error loading database, resetting to seed:', err);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(DB, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database to file:', err);
  }
}

// Initialize datastore
loadDatabase();

// -------------------------------------------------------------
// SECURE PASSWORD HASHING & SEEDING UTILITIES WITH BCRYPT
// -------------------------------------------------------------
function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

function verifyPassword(password: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (err) {
    return false;
  }
}

// Check and seed admin credentials securely on boot using bcrypt
const seedCredentials = [
  { email: 'adsparktechnologies01@gmail.com', password: 'AdSpark@2026' },
  { email: 'admin@adsparktech.com', password: 'AdSparkAdmin@2026' },
  { email: 'editor@adsparktech.com', password: 'AdSparkEditor@2026' },
  { email: 'manager@adsparktech.com', password: 'AdSparkManager@2026' }
];

if (!DB.adminCredentials || !Array.isArray(DB.adminCredentials) || DB.adminCredentials.some((c: any) => !c.passwordHash || !c.passwordHash.startsWith('$2'))) {
  DB.adminCredentials = seedCredentials.map(sc => {
    return {
      email: sc.email.toLowerCase(),
      passwordHash: hashPassword(sc.password),
      salt: ''
    };
  });
  saveDatabase();
  console.log('[SECURITY] Admin credentials successfully seeded with Bcrypt in backend datastore.');
}

// -------------------------------------------------------------
// SECURE BRUTE FORCE PROTECTION REGISTRY
// -------------------------------------------------------------
interface BruteForceRecord {
  failedAttempts: number;
  lockoutUntil: number;
}
const bruteForceRegistry = new Map<string, BruteForceRecord>();

function isLockedOut(key: string): boolean {
  const record = bruteForceRegistry.get(key);
  if (!record) return false;
  if (Date.now() < record.lockoutUntil) {
    return true;
  }
  // Lock expired, reset
  if (Date.now() >= record.lockoutUntil && record.failedAttempts >= 5) {
    bruteForceRegistry.delete(key);
    return false;
  }
  return false;
}

function recordFailedAttempt(key: string) {
  const record = bruteForceRegistry.get(key) || { failedAttempts: 0, lockoutUntil: 0 };
  record.failedAttempts += 1;
  if (record.failedAttempts >= 5) {
    record.lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lockout
    console.warn(`[SECURITY] Key ${key} is locked out due to brute force protection.`);
  }
  bruteForceRegistry.set(key, record);
}

function resetFailedAttempts(key: string) {
  bruteForceRegistry.delete(key);
}

// -------------------------------------------------------------
// SECURE SESSION & PASSWORD RESET REGISTRIES
// -------------------------------------------------------------
interface Session {
  token: string;
  email: string;
  expiresAt: number;
}
const activeSessions = new Map<string, Session>();

interface ResetCodeRecord {
  email: string;
  code: string;
  expiresAt: number;
}
const resetCodesRegistry = new Map<string, ResetCodeRecord>();

// Activity logging helper
function logAction(adminEmail: string, action: string, details: string, req: express.Request) {
  const newLog = {
    id: `log-${Date.now()}`,
    adminEmail,
    action,
    details,
    ipAddress: req.ip || '::1',
    timestamp: new Date().toISOString()
  };
  DB.logs.unshift(newLog);
  saveDatabase();
}

// SMTP Transporter Lazy Initialization
let mailTransporter: nodemailer.Transporter | null = null;

function getMailTransporter(): nodemailer.Transporter | null {
  if (mailTransporter !== null) return mailTransporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    try {
      mailTransporter = nodemailer.createTransport({
        host,
        port: parseInt(port, 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user,
          pass,
        },
      });
      console.log('[SMTP] Nodemailer transport initialized successfully.');
    } catch (err) {
      console.error('[SMTP] Failed to initialize Nodemailer transport:', err);
    }
  }
  return mailTransporter;
}

// Email notifier simulator helper with real SMTP forwarding
function sendSimulatedEmail(to: string, subject: string, body: string) {
  const newEmail = {
    id: `em-${Date.now()}`,
    to,
    subject,
    body,
    sentAt: new Date().toISOString()
  };
  if (!DB.systemEmails) {
    DB.systemEmails = [];
  }
  DB.systemEmails.unshift(newEmail);
  saveDatabase();
  console.log(`[SMTP SIMULATOR] Saved email mock to log for ${to}: "${subject}"`);

  // Forward to real SMTP if configured
  const transporter = getMailTransporter();
  if (transporter) {
    const fromAddress = process.env.SMTP_FROM || `"AdSpark Alerts" <${process.env.SMTP_USER}>`;
    transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text: body,
    }).then(info => {
      console.log(`[SMTP] Real email successfully sent to ${to}: MessageId=${info.messageId}`);
    }).catch(err => {
      console.error(`[SMTP] Real email transmission to ${to} failed:`, err);
    });
  } else {
    console.log('[SMTP] Real SMTP is not configured. Email logged to simulated database logs instead.');
  }
}

// REST APIs

// 0. Complete Database Sync
app.get('/api/db', async (req, res) => {
  const sbData = await fetchSupabaseData();
  res.json({
    services: sbData?.services || DB.services,
    projects: sbData?.projects || DB.projects,
    blogs: DB.blogs,
    careers: sbData?.careers || DB.careers,
    applications: DB.applications,
    messages: sbData?.messages || DB.messages || DB.contact_requests || [],
    contact_requests: sbData?.contact_requests || DB.contact_requests || DB.messages || [],
    proposal_requests: sbData?.proposal_requests || DB.proposal_requests || [],
    subscribers: DB.subscribers,
    admins: sbData?.admins || DB.admins || [],
    testimonials: sbData?.testimonials || DB.testimonials,
    clients: DB.clients,
    gallery: DB.gallery,
    team: DB.team,
    invoices: DB.invoices,
    seo: DB.seo,
    settings: sbData?.settings || DB.settings,
    analytics: DB.analytics,
    logs: DB.logs
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 1. Auth Module
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const emailLower = email.trim().toLowerCase();

  // Check brute force protection
  if (isLockedOut(emailLower) || isLockedOut(req.ip || '::1')) {
    return res.status(429).json({ error: 'Too many failed attempts. Account locked. Try again after 15 minutes.' });
  }

  // Find credentials in our secure DB
  const credentials = (DB.adminCredentials || []).find((c: any) => c.email.toLowerCase() === emailLower);

  if (credentials) {
    if (verifyPassword(password, credentials.passwordHash)) {
      // Find full user details
      const adminDetails = (DB.admins || []).find((a: any) => a.email.toLowerCase() === emailLower) || {
        id: `usr-${Date.now()}`,
        name: emailLower.split('@')[0],
        email: emailLower,
        role: 'Admin',
        status: 'active'
      };

      if (adminDetails.status === 'disabled') {
        return res.status(403).json({ error: 'This administrator account has been disabled. Please contact the Super Admin.' });
      }

      const token = `token-admin-${crypto.randomBytes(32).toString('hex')}`;
      const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours session

      activeSessions.set(token, {
        token,
        email: emailLower,
        expiresAt
      });

      // Reset brute force
      resetFailedAttempts(emailLower);
      resetFailedAttempts(req.ip || '::1');

      logAction(emailLower, 'User Authentication', 'Admin logged in successfully', req);

      return res.json({
        success: true,
        token,
        user: adminDetails
      });
    }
  }

  // Record failed attempts
  recordFailedAttempt(emailLower);
  recordFailedAttempt(req.ip || '::1');

  // Generic error message without revealing field
  return res.status(401).json({ error: 'Invalid email or password' });
});

// Forgot Password Handler
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  const emailLower = email.trim().toLowerCase();

  // Check brute force for email
  if (isLockedOut(emailLower) || isLockedOut(req.ip || '::1')) {
    return res.status(429).json({ error: 'Too many failed attempts. Try again after 15 minutes.' });
  }

  // Find credentials in our secure DB
  const credentials = (DB.adminCredentials || []).find((c: any) => c.email.toLowerCase() === emailLower);

  if (credentials) {
    // Generate a secure 6-digit verification code
    const code = Math.floor(100000 + crypto.randomInt(900000)).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    resetCodesRegistry.set(emailLower, {
      email: emailLower,
      code,
      expiresAt
    });

    // Send simulated email
    sendSimulatedEmail(
      emailLower,
      'Admin Account Password Reset Code',
      `Dear Administrator,\n\nWe received a request to reset your password.\nYour secure 6-digit verification code is:\n\n${code}\n\nThis code is valid for 10 minutes. If you did not request this reset, please ignore this email and review your security settings.`
    );
  }

  // Generic response to avoid user enumeration
  return res.json({
    success: true,
    message: 'If that email address exists in our system, we have dispatched a secure recovery code.'
  });
});

// Reset Password Handler
app.post('/api/auth/reset-password', (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: 'Email, verification code, and new password are required' });
  }

  const emailLower = email.trim().toLowerCase();

  // Check brute force
  if (isLockedOut(emailLower) || isLockedOut(req.ip || '::1')) {
    return res.status(429).json({ error: 'Too many failed attempts. Try again after 15 minutes.' });
  }

  const record = resetCodesRegistry.get(emailLower);
  if (!record || record.code !== code.trim() || Date.now() > record.expiresAt) {
    recordFailedAttempt(emailLower);
    recordFailedAttempt(req.ip || '::1');
    return res.status(400).json({ error: 'Invalid or expired verification code' });
  }

  // Reset password
  const credentialsIndex = (DB.adminCredentials || []).findIndex((c: any) => c.email.toLowerCase() === emailLower);
  if (credentialsIndex === -1) {
    return res.status(400).json({ error: 'Account not found' });
  }

  DB.adminCredentials[credentialsIndex].passwordHash = hashPassword(newPassword);
  DB.adminCredentials[credentialsIndex].salt = '';
  saveDatabase();

  // Clear reset code
  resetCodesRegistry.delete(emailLower);
  resetFailedAttempts(emailLower);

  logAction(emailLower, 'Password Reset', 'Password securely updated via recovery code', req);

  // Send confirmation email
  sendSimulatedEmail(
    emailLower,
    'Your password has been reset successfully',
    `Hi,\n\nThis is to confirm that the password for your administrator account (${emailLower}) has been updated successfully. If you did not perform this change, please contact security immediately.`
  );

  return res.json({ success: true, message: 'Password reset successfully!' });
});

// Logout Handler
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// Admin verification middleware
async function requireAdmin(req: any, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    // 1. Try local session
    const session = activeSessions.get(token);
    if (session && Date.now() < session.expiresAt) {
      req.adminEmail = session.email;
      next();
      return;
    }

    // 2. Try Supabase session
    const sbClient = getSupabaseServerClient();
    if (sbClient) {
      try {
        const { data: { user }, error } = await sbClient.auth.getUser(token);
        if (!error && user) {
          req.adminEmail = user.email;
          next();
          return;
        }
      } catch (sbErr) {
        console.warn('[SUPABASE TOKEN AUTH WARN]:', sbErr);
      }
    }
  }
  res.status(403).json({ error: 'Unauthorized. Admin credentials required.' });
}

// 1.1. Admins Management API (CRUD)

// Helper to check if the current user is a Super Admin
async function requireSuperAdmin(req: any, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    // 1. Try local session
    const session = activeSessions.get(token);
    if (session && Date.now() < session.expiresAt) {
      const adminDetails = (DB.admins || []).find((a: any) => a.email.toLowerCase() === session.email.toLowerCase());
      if (adminDetails && adminDetails.role === 'Super Admin') {
        req.adminEmail = session.email;
        next();
        return;
      }
    }

    // 2. Try Supabase session
    const sbClient = getSupabaseServerClient();
    if (sbClient) {
      try {
        const { data: { user }, error } = await sbClient.auth.getUser(token);
        if (!error && user) {
          let role = 'Admin';
          
          // Query profile role from admins table in Supabase
          try {
            const { data: profile } = await sbClient
              .from('admins')
              .select('role')
              .eq('id', user.id)
              .single();
            if (profile) {
              role = profile.role;
            } else {
              const adminDetails = (DB.admins || []).find((a: any) => a.email.toLowerCase() === user.email.toLowerCase());
              if (adminDetails) role = adminDetails.role;
            }
          } catch (profileErr) {
            const adminDetails = (DB.admins || []).find((a: any) => a.email.toLowerCase() === user.email.toLowerCase());
            if (adminDetails) role = adminDetails.role;
          }

          if (role === 'Super Admin') {
            req.adminEmail = user.email;
            next();
            return;
          }
        }
      } catch (sbErr) {
        console.warn('[SUPABASE TOKEN AUTH WARN]:', sbErr);
      }
    }
  }
  res.status(403).json({ error: 'Forbidden. Super Admin authorization required.' });
}

// Get all admins
app.get('/api/admins', requireAdmin, (req: any, res) => {
  res.json(DB.admins || []);
});

// Create new admin
app.post('/api/admins', requireSuperAdmin, async (req: any, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const emailLower = email.trim().toLowerCase();

  // Check if email already exists
  const exists = (DB.admins || []).some((a: any) => a.email.toLowerCase() === emailLower);
  if (exists) {
    return res.status(400).json({ error: 'An admin account with this email already exists.' });
  }

  // Create in Supabase Auth if configured
  const sbClient = getSupabaseServerClient();
  let supabaseId = null;
  if (sbClient) {
    try {
      // If service role key is provided, use admin API to avoid email confirmation constraints
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const { data: authData, error: authError } = await sbClient.auth.admin.createUser({
          email: emailLower,
          password,
          email_confirm: true,
          user_metadata: { name, role: role || 'Admin' }
        });
        if (authError) {
          console.error('[SUPABASE ADMIN CREATE ERROR]:', authError);
          return res.status(400).json({ error: `Supabase Auth error: ${authError.message}` });
        }
        supabaseId = authData.user?.id;
      } else {
        // Fallback to standard signUp
        const { data: authData, error: authError } = await sbClient.auth.signUp({
          email: emailLower,
          password,
          options: {
            data: { name, role: role || 'Admin' }
          }
        });
        if (authError) {
          console.error('[SUPABASE SIGNUP ERROR]:', authError);
          return res.status(400).json({ error: `Supabase Auth error: ${authError.message}` });
        }
        supabaseId = authData.user?.id;
      }

      // Sync user to the admins public profile table in Supabase if trigger is not present or slow
      if (supabaseId) {
        try {
          const { data: existingAdmin } = await sbClient
            .from('admins')
            .select('*')
            .eq('id', supabaseId)
            .single();
            
          if (!existingAdmin) {
            const { error: insertErr } = await sbClient
              .from('admins')
              .insert([{
                id: supabaseId,
                email: emailLower,
                name,
                role: role || 'Admin',
                status: 'active'
              }]);
            if (insertErr) {
              console.warn('[SUPABASE INSERT ADMIN ERROR]:', insertErr);
            }
          }
        } catch (syncErr) {
          console.warn('[SUPABASE SYNC ADMIN WARN]:', syncErr);
        }
      }
    } catch (err: any) {
      console.error('[SUPABASE AUTH INTEGRATION FAILED]:', err);
      return res.status(500).json({ error: `Supabase integration failed: ${err.message || err}` });
    }
  }

  const newAdmin = {
    id: supabaseId || `usr-${Date.now()}`,
    name,
    email: emailLower,
    role: role || 'Admin',
    status: 'active',
    profilePhoto: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    lastLoginAt: '',
    lastLoginIp: ''
  };

  // Hash password
  const newCredential = {
    email: emailLower,
    passwordHash: hashPassword(password),
    salt: ''
  };

  if (!DB.admins) DB.admins = [];
  if (!DB.adminCredentials) DB.adminCredentials = [];

  DB.admins.push(newAdmin);
  DB.adminCredentials.push(newCredential);
  saveDatabase();

  logAction(req.adminEmail, 'Create Admin', `Added new administrator: ${name} (${emailLower}) with role ${role}`, req);

  res.status(201).json(newAdmin);
});

// Update admin
app.put('/api/admins/:id', requireAdmin, (req: any, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  // Only Super Admin can update roles or update other admins
  const index = (DB.admins || []).findIndex((a: any) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Admin not found.' });
  }

  const targetAdmin = DB.admins[index];
  const isSelf = targetAdmin.email.toLowerCase() === req.adminEmail.toLowerCase();

  // If not self, must be Super Admin
  if (!isSelf) {
    const callerAdmin = (DB.admins || []).find((a: any) => a.email.toLowerCase() === req.adminEmail.toLowerCase());
    if (!callerAdmin || callerAdmin.role !== 'Super Admin') {
      return res.status(403).json({ error: 'Forbidden. You do not have permission to modify other administrator accounts.' });
    }
  }

  const emailLower = email ? email.trim().toLowerCase() : targetAdmin.email;

  // Check email conflict if changing email
  if (emailLower !== targetAdmin.email) {
    const conflict = (DB.admins || []).some((a: any) => a.id !== id && a.email.toLowerCase() === emailLower);
    if (conflict) {
      return res.status(400).json({ error: 'An admin account with this email already exists.' });
    }

    // Update credential email as well
    const credIndex = (DB.adminCredentials || []).findIndex((c: any) => c.email.toLowerCase() === targetAdmin.email);
    if (credIndex !== -1) {
      DB.adminCredentials[credIndex].email = emailLower;
    }
  }

  // Update details
  DB.admins[index].name = name || targetAdmin.name;
  DB.admins[index].email = emailLower;
  
  // Only Super Admin can change roles
  if (role) {
    const callerAdmin = (DB.admins || []).find((a: any) => a.email.toLowerCase() === req.adminEmail.toLowerCase());
    if (callerAdmin && callerAdmin.role === 'Super Admin') {
      DB.admins[index].role = role;
    }
  }

  saveDatabase();

  logAction(req.adminEmail, 'Update Admin', `Updated admin details for ${DB.admins[index].name} (${emailLower})`, req);

  res.json(DB.admins[index]);
});

// Delete admin
app.delete('/api/admins/:id', requireSuperAdmin, async (req: any, res) => {
  const { id } = req.params;
  const index = (DB.admins || []).findIndex((a: any) => a.id === id);
  if (index === -1 && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return res.status(404).json({ error: 'Admin not found.' });
  }

  const targetAdmin = DB.admins[index] || { email: '', name: 'Supabase Admin' };
  if (targetAdmin.email && targetAdmin.email.toLowerCase() === req.adminEmail.toLowerCase()) {
    return res.status(400).json({ error: 'Action Blocked: You cannot delete your own active session.' });
  }

  // Delete from Supabase if configured
  const sbClient = getSupabaseServerClient();
  if (sbClient) {
    try {
      // 1. Delete from public.admins table
      await sbClient.from('admins').delete().eq('id', id);

      // 2. Delete from Supabase Auth if service role is available
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        await sbClient.auth.admin.deleteUser(id);
      }
    } catch (sbErr) {
      console.error('[SUPABASE DELETE USER ERROR]:', sbErr);
    }
  }

  // Delete credentials
  if (targetAdmin.email) {
    DB.adminCredentials = (DB.adminCredentials || []).filter((c: any) => c.email.toLowerCase() !== targetAdmin.email.toLowerCase());
  }
  // Delete admin
  DB.admins = (DB.admins || []).filter((a: any) => a.id !== id);

  saveDatabase();

  logAction(req.adminEmail, 'Delete Admin', `Permanently removed admin account ${targetAdmin.name} (${targetAdmin.email})`, req);

  res.json({ success: true });
});

// Toggle admin status
app.put('/api/admins/:id/toggle-status', requireSuperAdmin, (req: any, res) => {
  const { id } = req.params;
  const index = (DB.admins || []).findIndex((a: any) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Admin not found.' });
  }

  const targetAdmin = DB.admins[index];
  if (targetAdmin.email.toLowerCase() === req.adminEmail.toLowerCase()) {
    return res.status(400).json({ error: 'Action Blocked: You cannot deactivate your own active session.' });
  }

  const nextStatus = targetAdmin.status === 'active' ? 'disabled' : 'active';
  DB.admins[index].status = nextStatus;

  saveDatabase();

  logAction(req.adminEmail, 'Toggle Admin Status', `Changed status of ${targetAdmin.name} to ${nextStatus}`, req);

  res.json(DB.admins[index]);
});

// Reset admin password
app.post('/api/admins/:id/reset-password', requireSuperAdmin, (req: any, res) => {
  const { id } = req.params;
  const { password } = req.body;
  if (!password || password.trim().length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const index = (DB.admins || []).findIndex((a: any) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Admin not found.' });
  }

  const targetAdmin = DB.admins[index];
  const credIndex = (DB.adminCredentials || []).findIndex((c: any) => c.email.toLowerCase() === targetAdmin.email.toLowerCase());
  if (credIndex === -1) {
    return res.status(404).json({ error: 'Credentials not found.' });
  }

  DB.adminCredentials[credIndex].passwordHash = hashPassword(password);
  DB.adminCredentials[credIndex].salt = '';
  saveDatabase();

  logAction(req.adminEmail, 'Admin Password Reset', `Generated fresh password for admin ${targetAdmin.name} (${targetAdmin.email})`, req);

  res.json({ success: true, message: `Password reset successfully for ${targetAdmin.name}!` });
});

// Update personal profile
app.put('/api/admins/profile/update', requireAdmin, (req: any, res) => {
  const { name, email, profilePhoto } = req.body;
  const emailLower = email ? email.trim().toLowerCase() : '';

  const index = (DB.admins || []).findIndex((a: any) => a.email.toLowerCase() === req.adminEmail.toLowerCase());
  if (index === -1) {
    return res.status(404).json({ error: 'Profile not found.' });
  }

  const targetAdmin = DB.admins[index];

  // Conflict check if changing email
  if (emailLower && emailLower !== targetAdmin.email) {
    const conflict = (DB.admins || []).some((a: any) => a.email.toLowerCase() === emailLower);
    if (conflict) {
      return res.status(400).json({ error: 'An admin account with this email already exists.' });
    }

    // Update credential email
    const credIndex = (DB.adminCredentials || []).findIndex((c: any) => c.email.toLowerCase() === targetAdmin.email);
    if (credIndex !== -1) {
      DB.adminCredentials[credIndex].email = emailLower;
    }

    // Update active session email
    activeSessions.forEach((sess, tok) => {
      if (sess.email.toLowerCase() === targetAdmin.email) {
        activeSessions.set(tok, { ...sess, email: emailLower });
      }
    });

    DB.admins[index].email = emailLower;
  }

  if (name) DB.admins[index].name = name;
  if (profilePhoto !== undefined) DB.admins[index].profilePhoto = profilePhoto;

  saveDatabase();

  logAction(emailLower || targetAdmin.email, 'Update Personal Profile', 'Admin updated their own personal profile details', req);

  res.json(DB.admins[index]);
});

// Change personal password
app.put('/api/admins/profile/change-password', requireAdmin, (req: any, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.trim().length < 6) {
    return res.status(400).json({ error: 'Both old and new passwords are required. New password must be at least 6 characters.' });
  }

  const credIndex = (DB.adminCredentials || []).findIndex((c: any) => c.email.toLowerCase() === req.adminEmail.toLowerCase());
  if (credIndex === -1) {
    return res.status(404).json({ error: 'Credentials not found.' });
  }

  const cred = DB.adminCredentials[credIndex];
  if (!verifyPassword(currentPassword, cred.passwordHash)) {
    return res.status(400).json({ error: 'The current password entered is incorrect.' });
  }

  DB.adminCredentials[credIndex].passwordHash = hashPassword(newPassword);
  DB.adminCredentials[credIndex].salt = '';
  saveDatabase();

  logAction(req.adminEmail, 'Change Password', 'Admin updated their security password successfully', req);

  res.json({ success: true, message: 'Password changed successfully.' });
});

// 2. Services REST API
app.get('/api/services', (req, res) => {
  res.json(DB.services);
});

app.post('/api/services', requireAdmin, (req, res) => {
  const newService = { ...req.body, id: req.body.id || `service-${Date.now()}` };
  DB.services.push(newService);
  saveDatabase();
  logAction('admin@adspark.com', 'Create Service', `Created new service: ${newService.title}`, req);
  res.status(201).json(newService);
});

app.put('/api/services/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = DB.services.findIndex(s => s.id === id);
  if (index !== -1) {
    DB.services[index] = { ...DB.services[index], ...req.body };
    saveDatabase();
    logAction('admin@adspark.com', 'Update Service', `Updated service details: ${DB.services[index].title}`, req);
    res.json(DB.services[index]);
  } else {
    res.status(404).json({ error: 'Service not found' });
  }
});

app.delete('/api/services/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const filtered = DB.services.filter(s => s.id !== id);
  if (filtered.length !== DB.services.length) {
    DB.services = filtered;
    saveDatabase();
    logAction('admin@adspark.com', 'Delete Service', `Deleted service ID: ${id}`, req);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Service not found' });
  }
});

// 3. Portfolio Projects REST API
app.get('/api/projects', (req, res) => {
  res.json(DB.projects);
});

app.post('/api/projects', requireAdmin, (req, res) => {
  const newProject = { ...req.body, id: `proj-${Date.now()}` };
  if (!newProject.images || newProject.images.length === 0) {
    newProject.images = ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'];
  }
  DB.projects.push(newProject);
  saveDatabase();
  logAction('admin@adspark.com', 'Create Project', `Added project: ${newProject.title}`, req);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = DB.projects.findIndex(p => p.id === id);
  if (index !== -1) {
    DB.projects[index] = { ...DB.projects[index], ...req.body };
    saveDatabase();
    logAction('admin@adspark.com', 'Update Project', `Updated project details: ${DB.projects[index].title}`, req);
    res.json(DB.projects[index]);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.delete('/api/projects/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const filtered = DB.projects.filter(p => p.id !== id);
  if (filtered.length !== DB.projects.length) {
    DB.projects = filtered;
    saveDatabase();
    logAction('admin@adspark.com', 'Delete Project', `Deleted project ID: ${id}`, req);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

// 4. Blogs REST API
app.get('/api/blogs', (req, res) => {
  res.json(DB.blogs);
});

app.post('/api/blogs', requireAdmin, (req, res) => {
  const newBlog = {
    ...req.body,
    id: `blog-${Date.now()}`,
    slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    views: 0,
    comments: [],
    publishedAt: new Date().toISOString().split('T')[0]
  };
  DB.blogs.push(newBlog);
  saveDatabase();
  logAction('admin@adspark.com', 'Create Blog Post', `Published article: ${newBlog.title}`, req);
  res.status(201).json(newBlog);
});

app.put('/api/blogs/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = DB.blogs.findIndex(b => b.id === id);
  if (index !== -1) {
    DB.blogs[index] = { ...DB.blogs[index], ...req.body };
    saveDatabase();
    logAction('admin@adspark.com', 'Update Blog Post', `Modified blog article: ${DB.blogs[index].title}`, req);
    res.json(DB.blogs[index]);
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
});

app.delete('/api/blogs/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const filtered = DB.blogs.filter(b => b.id !== id);
  if (filtered.length !== DB.blogs.length) {
    DB.blogs = filtered;
    saveDatabase();
    logAction('admin@adspark.com', 'Delete Blog Post', `Deleted blog post ID: ${id}`, req);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
});

// Blog comments and hit updates
app.post('/api/blogs/:id/comments', (req, res) => {
  const { id } = req.params;
  const { author, email, content } = req.body;
  if (!author || !email || !content) {
    return res.status(400).json({ error: 'Author, email and content are required' });
  }
  const index = DB.blogs.findIndex(b => b.id === id);
  if (index !== -1) {
    const newComment = {
      id: `comment-${Date.now()}`,
      author,
      email,
      content,
      createdAt: new Date().toISOString(),
      approved: true // Auto-approved in preview for convenience, admin can manage
    };
    DB.blogs[index].comments.push(newComment);
    saveDatabase();
    res.status(201).json(newComment);
  } else {
    res.status(404).json({ error: 'Blog article not found' });
  }
});

app.post('/api/blogs/:id/view', (req, res) => {
  const { id } = req.params;
  const index = DB.blogs.findIndex(b => b.id === id);
  if (index !== -1) {
    DB.blogs[index].views = (DB.blogs[index].views || 0) + 1;
    saveDatabase();
    res.json({ views: DB.blogs[index].views });
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
});

// 5. Careers REST API
app.get('/api/careers', (req, res) => {
  res.json(DB.careers);
});

app.post('/api/careers', requireAdmin, (req, res) => {
  const newCareer = { ...req.body, id: `job-${Date.now()}` };
  DB.careers.push(newCareer);
  saveDatabase();
  logAction('admin@adspark.com', 'Post Career Job', `Listed opening: ${newCareer.title}`, req);
  res.status(201).json(newCareer);
});

app.put('/api/careers/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = DB.careers.findIndex(c => c.id === id);
  if (index !== -1) {
    DB.careers[index] = { ...DB.careers[index], ...req.body };
    saveDatabase();
    logAction('admin@adspark.com', 'Update Career Job', `Updated job listing: ${DB.careers[index].title}`, req);
    res.json(DB.careers[index]);
  } else {
    res.status(404).json({ error: 'Job listing not found' });
  }
});

app.delete('/api/careers/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const filtered = DB.careers.filter(c => c.id !== id);
  if (filtered.length !== DB.careers.length) {
    DB.careers = filtered;
    saveDatabase();
    logAction('admin@adspark.com', 'Delete Career Job', `Deleted job ID: ${id}`, req);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Career not found' });
  }
});

// 6. Online Careers Job Applications API
app.get('/api/applications', requireAdmin, (req, res) => {
  res.json(DB.applications);
});

app.post('/api/applications', (req, res) => {
  const { careerId, jobTitle, fullName, email, phone, coverLetter, resumeUrl } = req.body;
  if (!careerId || !fullName || !email || !phone) {
    return res.status(400).json({ error: 'Job, candidate details, and contact coordinates are required' });
  }
  const newApplication = {
    id: `app-${Date.now()}`,
    careerId,
    jobTitle: jobTitle || 'IT Professional Post',
    fullName,
    email,
    phone,
    resumeUrl: resumeUrl || '/uploads/resumes/simulated_upload.pdf',
    coverLetter,
    status: 'Pending' as const,
    appliedAt: new Date().toISOString()
  };
  DB.applications.push(newApplication);
  saveDatabase();

  // Send transactional simulated administrative alert
  sendSimulatedEmail(
    DB.settings.contactEmail,
    `New Application: ${fullName} Applied For ${newApplication.jobTitle}`,
    `Review Jane application portal details. Email: ${email} | Phone: ${phone}\n\nCover Letter Preview:\n${coverLetter || 'None'}`
  );

  res.status(201).json(newApplication);
});

app.put('/api/applications/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const index = DB.applications.findIndex(a => a.id === id);
  if (index !== -1) {
    DB.applications[index].status = status;
    saveDatabase();
    logAction('admin@adspark.com', 'Evaluate Application', `Updated applicant ${DB.applications[index].fullName} status to: ${status}`, req);

    // Simulated email confirmation to candidates
    sendSimulatedEmail(
      DB.applications[index].email,
      `Application Status Update - AdSpark Technologies`,
      `Hi ${DB.applications[index].fullName},\n\nWe appreciate your interest in AdSpark Technologies. The status of your application for ${DB.applications[index].jobTitle} has been updated to: "${status}". Our team will reach out directly for corresponding next steps.\n\nWarm regards,\nAdSpark HR Recruits`
    );

    res.json(DB.applications[index]);
  } else {
    res.status(404).json({ error: 'Application not found' });
  }
});

app.delete('/api/applications/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const filtered = DB.applications.filter(a => a.id !== id);
  if (filtered.length !== DB.applications.length) {
    DB.applications = filtered;
    saveDatabase();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Application not found' });
  }
});

// 7. Contacts & Proposals Storage APIs
app.get('/api/contacts', requireAdmin, (req, res) => {
  res.json(DB.contact_requests || DB.messages || []);
});

app.post('/api/contacts', async (req, res) => {
  const { name, email, subject, message, skipSupabase } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message text are required' });
  }

  let dbId = `msg-${Date.now()}`;

  // Save to Supabase if configured and not skipped
  if (!skipSupabase) {
    const sbClient = getSupabaseServerClient();
    if (sbClient) {
      try {
        const { data, error } = await sbClient.from('contact_requests').insert([{
          name,
          email,
          subject: subject || 'General IT Business Query',
          message,
          status: 'Unread'
        }]).select('id').single();
        if (error) {
          console.error('[SUPABASE CONTACT INSERT ERROR]:', error.message);
        } else if (data) {
          dbId = 'msg-' + data.id;
        }
      } catch (err) {
        console.error('[SUPABASE CONTACT INSERT FAILED]:', err);
      }
    }
  }

  const newMessage = {
    id: dbId,
    name,
    email,
    subject: subject || 'General IT Business Query',
    message,
    status: 'Unread' as const,
    submittedAt: new Date().toISOString()
  };
  
  // Save in both for flawless backwards compatibility
  if (!DB.contact_requests) DB.contact_requests = [];
  if (!DB.messages) DB.messages = [];
  
  DB.contact_requests.unshift(newMessage);
  DB.messages.unshift(newMessage);
  saveDatabase();

  // Send contact notification email automatically to adsparktechnologies01@gmail.com
  sendSimulatedEmail(
    'adsparktechnologies01@gmail.com',
    `New Contact Form Submission: "${newMessage.subject}" from ${name}`,
    `CONTACT FORM SUBMISSION DETAILS:\n\nContact Name: ${name}\nContact Email: ${email}\nSubject Matter: ${newMessage.subject}\n\nMessage Content:\n${message}\n\nThis message has been securely recorded inside contact_requests.`
  );

  res.status(201).json(newMessage);
});

app.put('/api/contacts/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const cleanId = id.replace(/^(msg-|prop-)/, '');
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

  // Update in Supabase if configured & UUID
  if (isUuid) {
    const sbClient = getSupabaseServerClient();
    if (sbClient) {
      try {
        const { error } = await sbClient.from('contact_requests').update({ status }).eq('id', cleanId);
        if (error) console.error('[SUPABASE CONTACT UPDATE ERROR]:', error.message);
      } catch (err) {
        console.error('[SUPABASE CONTACT UPDATE FAILED]:', err);
      }
    }
  }
  
  if (!DB.contact_requests) DB.contact_requests = [];
  if (!DB.messages) DB.messages = [];

  const idx1 = DB.contact_requests.findIndex((m: any) => m.id === id);
  const idx2 = DB.messages.findIndex((m: any) => m.id === id);
  
  let updatedMessage = null;
  if (idx1 !== -1) {
    DB.contact_requests[idx1].status = status;
    updatedMessage = DB.contact_requests[idx1];
  }
  if (idx2 !== -1) {
    DB.messages[idx2].status = status;
    if (!updatedMessage) updatedMessage = DB.messages[idx2];
  }

  if (updatedMessage || isUuid) {
    saveDatabase();
    res.json(updatedMessage || { id, status });
  } else {
    res.status(404).json({ error: 'Contact message not found' });
  }
});

app.delete('/api/contacts/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  
  const cleanId = id.replace(/^(msg-|prop-)/, '');
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

  // Delete in Supabase if configured & UUID
  if (isUuid) {
    const sbClient = getSupabaseServerClient();
    if (sbClient) {
      try {
        const { error } = await sbClient.from('contact_requests').delete().eq('id', cleanId);
        if (error) console.error('[SUPABASE CONTACT DELETE ERROR]:', error.message);
      } catch (err) {
        console.error('[SUPABASE CONTACT DELETE FAILED]:', err);
      }
    }
  }

  if (!DB.contact_requests) DB.contact_requests = [];
  if (!DB.messages) DB.messages = [];

  const len1 = DB.contact_requests.length;
  const len2 = DB.messages.length;

  DB.contact_requests = DB.contact_requests.filter((m: any) => m.id !== id);
  DB.messages = DB.messages.filter((m: any) => m.id !== id);

  if (DB.contact_requests.length !== len1 || DB.messages.length !== len2 || isUuid) {
    saveDatabase();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Message not found' });
  }
});

// Proposals Management Endpoints
app.get('/api/proposals', requireAdmin, (req, res) => {
  res.json(DB.proposal_requests || []);
});

app.post('/api/proposals', async (req, res) => {
  const { name, email, subject, message, skipSupabase } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and detailed specifications are required' });
  }

  let dbId = `prop-${Date.now()}`;

  // Save to Supabase if configured and not skipped
  if (!skipSupabase) {
    const sbClient = getSupabaseServerClient();
    if (sbClient) {
      try {
        const { data, error } = await sbClient.from('proposal_requests').insert([{
          name,
          email,
          subject: subject || 'New Tech Proposal Request',
          message,
          status: 'Unread'
        }]).select('id').single();
        if (error) {
          console.error('[SUPABASE PROPOSAL INSERT ERROR]:', error.message);
        } else if (data) {
          dbId = 'prop-' + data.id;
        }
      } catch (err) {
        console.error('[SUPABASE PROPOSAL INSERT FAILED]:', err);
      }
    }
  }

  const newProposal = {
    id: dbId,
    name,
    email,
    subject: subject || 'New Tech Proposal Request',
    message,
    status: 'Unread' as const,
    submittedAt: new Date().toISOString()
  };
  
  if (!DB.proposal_requests) DB.proposal_requests = [];
  DB.proposal_requests.unshift(newProposal);
  saveDatabase();

  // Send proposal notification email automatically to adsparktechnologies01@gmail.com
  sendSimulatedEmail(
    'adsparktechnologies01@gmail.com',
    `New Proposal Request Received: "${newProposal.subject}" from ${name}`,
    `PROPOSAL INQUIRY DETAILS:\n\nClient Name: ${name}\nClient Email: ${email}\nSubject Matter: ${newProposal.subject}\n\nDetailed Specifications:\n${message}\n\nThis proposal has been safely logged in the proposal_requests datastore and is visible on your Admin Dashboard.`
  );

  res.status(201).json(newProposal);
});

app.put('/api/proposals/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const cleanId = id.replace(/^(msg-|prop-)/, '');
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

  // Update in Supabase if configured & UUID
  if (isUuid) {
    const sbClient = getSupabaseServerClient();
    if (sbClient) {
      try {
        const { error } = await sbClient.from('proposal_requests').update({ status }).eq('id', cleanId);
        if (error) console.error('[SUPABASE PROPOSAL UPDATE ERROR]:', error.message);
      } catch (err) {
        console.error('[SUPABASE PROPOSAL UPDATE FAILED]:', err);
      }
    }
  }

  if (!DB.proposal_requests) DB.proposal_requests = [];
  const idx = DB.proposal_requests.findIndex((p: any) => p.id === id);
  if (idx !== -1) {
    DB.proposal_requests[idx].status = status;
    saveDatabase();
    res.json(DB.proposal_requests[idx]);
  } else if (isUuid) {
    saveDatabase();
    res.json({ id, status });
  } else {
    res.status(404).json({ error: 'Proposal request not found' });
  }
});

app.delete('/api/proposals/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  
  const cleanId = id.replace(/^(msg-|prop-)/, '');
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

  // Delete in Supabase if configured & UUID
  if (isUuid) {
    const sbClient = getSupabaseServerClient();
    if (sbClient) {
      try {
        const { error } = await sbClient.from('proposal_requests').delete().eq('id', cleanId);
        if (error) console.error('[SUPABASE PROPOSAL DELETE ERROR]:', error.message);
      } catch (err) {
        console.error('[SUPABASE PROPOSAL DELETE FAILED]:', err);
      }
    }
  }

  if (!DB.proposal_requests) DB.proposal_requests = [];
  const len = DB.proposal_requests.length;
  DB.proposal_requests = DB.proposal_requests.filter((p: any) => p.id !== id);
  
  if (DB.proposal_requests.length !== len || isUuid) {
    saveDatabase();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Proposal request not found' });
  }
});

// 8. Newsletter Subscribers API
app.get('/api/subscribers', requireAdmin, (req, res) => {
  res.json(DB.subscribers);
});

app.post('/api/subscribers', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please submit a valid email address' });
  }
  const exists = DB.subscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(200).json({ success: true, message: 'Already subscribed!' });
  }
  const newSub = {
    id: `sub-${Date.now()}`,
    email,
    subscribedAt: new Date().toISOString(),
    status: 'Active' as const
  };
  DB.subscribers.push(newSub);
  saveDatabase();

  sendSimulatedEmail(
    email,
    'Subscription Confirmed - AdSpark Tech Insights',
    'Thank you for subscribing to AdSpark Technologies. We periodically publish modern architectural breakdowns, software advice, and IT resources.'
  );

  res.status(201).json({ success: true, subscriber: newSub });
});

app.delete('/api/subscribers/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const filtered = DB.subscribers.filter(s => s.id !== id);
  if (filtered.length !== DB.subscribers.length) {
    DB.subscribers = filtered;
    saveDatabase();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Subscriber not found' });
  }
});

// 9. Website & SEO Settings API
app.get('/api/settings', (req, res) => {
  res.json({ settings: DB.settings, seo: DB.seo });
});

app.put('/api/settings', requireAdmin, (req, res) => {
  if (req.body.settings) {
    DB.settings = { ...DB.settings, ...req.body.settings };
  }
  if (req.body.seo) {
    DB.seo = { ...DB.seo, ...req.body.seo };
  }
  saveDatabase();
  logAction('admin@adspark.com', 'Update Settings', 'Modified core company settings or SEO attributes', req);
  res.json({ settings: DB.settings, seo: DB.seo });
});

// 10. Dashboard Analytics Summary API
app.get('/api/analytics', requireAdmin, (req, res) => {
  // Synthesize modern metrics based on dynamic values
  const synthesized = {
    ...DB.analytics,
    totalVisitors: DB.analytics.totalVisitors + DB.messages.length * 3, // slightly dynamic mapping
    metaStats: {
      totalProjects: DB.projects.length,
      totalServices: DB.services.length,
      totalBlogs: DB.blogs.length,
      totalCareers: DB.careers.length,
      totalInquiries: DB.messages.length,
      totalApplicants: DB.applications.length,
      totalSubscribers: DB.subscribers.length,
      totalInvoices: DB.invoices.length,
      totalSystemEmails: DB.systemEmails.length
    }
  };
  res.json(synthesized);
});

// 11. Activity logs API
app.get('/api/logs', requireAdmin, (req, res) => {
  res.json(DB.logs);
});

// 12. Invoices Module API
app.get('/api/invoices', requireAdmin, (req, res) => {
  res.json(DB.invoices);
});

app.post('/api/invoices', requireAdmin, (req, res) => {
  const newInvoice = {
    ...req.body,
    id: `inv-${Date.now()}`,
    invoiceNumber: req.body.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    issuedAt: new Date().toISOString().split('T')[0]
  };
  DB.invoices.unshift(newInvoice);
  saveDatabase();
  logAction('admin@adspark.com', 'Create Invoice', `Generated Invoice Number: ${newInvoice.invoiceNumber}`, req);
  res.status(201).json(newInvoice);
});

app.put('/api/invoices/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = DB.invoices.findIndex(i => i.id === id);
  if (index !== -1) {
    DB.invoices[index] = { ...DB.invoices[index], ...req.body };
    saveDatabase();
    logAction('admin@adspark.com', 'Update Invoice', `Updated invoice details: ${DB.invoices[index].invoiceNumber}`, req);
    res.json(DB.invoices[index]);
  } else {
    res.status(404).json({ error: 'Invoice not found' });
  }
});

app.delete('/api/invoices/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const filtered = DB.invoices.filter(i => i.id !== id);
  if (filtered.length !== DB.invoices.length) {
    DB.invoices = filtered;
    saveDatabase();
    logAction('admin@adspark.com', 'Delete Invoice', `Deleted invoice ID: ${id}`, req);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Invoice not found' });
  }
});

// 13. System Emails API (to inspect mocked SMTP)
app.get('/api/system-emails', requireAdmin, (req, res) => {
  res.json(DB.systemEmails);
});

// 14. Extra Modules: Team, Testimonials, Gallery, Partners APIs
app.get('/api/team', (req, res) => res.json(DB.team));
app.post('/api/team', requireAdmin, (req, res) => {
  const member = { ...req.body, id: `tm-${Date.now()}` };
  DB.team.push(member);
  saveDatabase();
  res.status(201).json(member);
});
app.put('/api/team/:id', requireAdmin, (req, res) => {
  const index = DB.team.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    DB.team[index] = { ...DB.team[index], ...req.body };
    saveDatabase();
    res.json(DB.team[index]);
  } else res.status(404).end();
});
app.delete('/api/team/:id', requireAdmin, (req, res) => {
  DB.team = DB.team.filter(t => t.id !== req.params.id);
  saveDatabase();
  res.json({ success: true });
});

app.get('/api/testimonials', (req, res) => res.json(DB.testimonials));
app.post('/api/testimonials', requireAdmin, (req, res) => {
  const t = { ...req.body, id: `test-${Date.now()}` };
  DB.testimonials.push(t);
  saveDatabase();
  res.status(201).json(t);
});
app.put('/api/testimonials/:id', requireAdmin, (req, res) => {
  const index = DB.testimonials.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    DB.testimonials[index] = { ...DB.testimonials[index], ...req.body };
    saveDatabase();
    res.json(DB.testimonials[index]);
  } else res.status(404).end();
});
app.delete('/api/testimonials/:id', requireAdmin, (req, res) => {
  DB.testimonials = DB.testimonials.filter(t => t.id !== req.params.id);
  saveDatabase();
  res.json({ success: true });
});

app.get('/api/gallery', (req, res) => res.json(DB.gallery));
app.post('/api/gallery', requireAdmin, (req, res) => {
  const g = { ...req.body, id: `gal-${Date.now()}` };
  DB.gallery.push(g);
  saveDatabase();
  res.status(201).json(g);
});
app.delete('/api/gallery/:id', requireAdmin, (req, res) => {
  DB.gallery = DB.gallery.filter(g => g.id !== req.params.id);
  saveDatabase();
  res.json({ success: true });
});

app.get('/api/clients', (req, res) => res.json(DB.clients));
app.post('/api/clients', requireAdmin, (req, res) => {
  const c = { ...req.body, id: `cli-${Date.now()}` };
  DB.clients.push(c);
  saveDatabase();
  res.status(201).json(c);
});
app.delete('/api/clients/:id', requireAdmin, (req, res) => {
  DB.clients = DB.clients.filter(c => c.id !== req.params.id);
  saveDatabase();
  res.json({ success: true });
});

// AI Copilot for Blog & SEO Generation!
// Uses server-side @google/genai module
app.post('/api/copilot/generate', async (req, res) => {
  const { prompt, type } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    if (!ai) {
      // Return beautiful, realistic simulated AI responses if Gemini Key is not set up
      console.log('Gemini API key missing. Serving realistic simulated AI content.');
      const simulatedText = type === 'blog'
        ? `<h3>The Strategic Value of Modern IT Pipelines</h3><p>In the digital age, companies face intense pressure to accelerate software engineering delivery speeds. This article discusses the key pillars of microservice architectures, emphasizing the integration of robust telemetry monitors and continuous deployments.</p><p>By unifying API integrations inside a cohesive container network, operations can minimize latency spikes and guarantee steady database sync transactions, establishing high service durability.</p>`
        : `AdSpark Technologies | Next-Gen Enterprise Software Engineering. Explore custom corporate software, fast websites, cloud deployments, and cognitive automation designed for scaling brands.`;
      return res.json({ text: simulatedText, simulated: true });
    }

    // Modern SDK generate content call
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: type === 'blog'
          ? 'You are a professional IT technology author. Write dynamic blog posts in simple, clean HTML format with tags like h3, p, pre, code. Keep it engaging and professional.'
          : 'You are an SEO expert. Generate an optimized meta description under 155 characters that drives click-throughs.'
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API execution failed:', error);
    res.status(500).json({ error: error.message || 'Error occurred during AI generation' });
  }
});

// 15. SEO Features XML Sitemaps & robots.txt
app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Static pages
  const paths = ['', 'about', 'services', 'portfolio', 'pricing', 'team', 'careers', 'blog', 'faq', 'testimonials', 'gallery', 'clients', 'contact'];
  paths.forEach(p => {
    xml += `  <url>\n    <loc>${baseUrl}/${p}</loc>\n    <lastmod>2026-07-13</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${p === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
  });

  // Dynamic service details
  DB.services.forEach(s => {
    xml += `  <url>\n    <loc>${baseUrl}/services/${s.id}</loc>\n    <lastmod>2026-07-13</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  // Dynamic blog details
  DB.blogs.forEach(b => {
    xml += `  <url>\n    <loc>${baseUrl}/blog/${b.slug}</loc>\n    <lastmod>${b.publishedAt}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  // Dynamic portfolio details
  DB.projects.forEach(p => {
    xml += `  <url>\n    <loc>${baseUrl}/portfolio/${p.id}</loc>\n    <lastmod>${p.completionDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  res.send(xml);
});

app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  res.send(`User-agent: *\nDisallow: /api/\nDisallow: /admin\n\nSitemap: ${baseUrl}/sitemap.xml`);
});

// Serve local generated images statically
app.use('/src/assets/images', express.static(path.join(process.cwd(), 'src/assets/images')));

// Vite server development middleware setup
async function startServer() {
  // Catchall for unmatched API paths to prevent HTML leakage
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint ${req.method} ${req.path} not found.`
    });
  });

  // Global Error Handler for API requests to avoid returning HTML errors
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[Unhandled Server Error]', err);
    if (req.path.startsWith('/api/')) {
      return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'An unexpected server error occurred. Please try again later.'
      });
    }
    next(err);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AdSpark Corporate CMS] Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });
}

startServer();
