-- AdSpark Technologies Supabase Schema Migration SQL
-- Execute this SQL script directly in your Supabase SQL Editor to provision all tables, indexes, relationships, and seed data.

-- -------------------------------------------------------------
-- 0. CLEANUP (Optional)
-- -------------------------------------------------------------
-- DROP TABLE IF EXISTS public.settings CASCADE;
-- DROP TABLE IF EXISTS public.media CASCADE;
-- DROP TABLE IF EXISTS public.careers CASCADE;
-- DROP TABLE IF EXISTS public.faq CASCADE;
-- DROP TABLE IF EXISTS public.testimonials CASCADE;
-- DROP TABLE IF EXISTS public.proposal_requests CASCADE;
-- DROP TABLE IF EXISTS public.contact_requests CASCADE;
-- DROP TABLE IF EXISTS public.portfolio CASCADE;
-- DROP TABLE IF EXISTS public.services CASCADE;
-- DROP TABLE IF EXISTS public.admins CASCADE;

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------
-- 1. ADMINS PROFILE TABLE (Linked to auth.users)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Admin' CHECK (role IN ('Super Admin', 'Admin', 'Editor', 'Manager')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 2. SERVICES TABLE
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY DEFAULT 'service-' || uuid_generate_v4()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Sparkles',
    features TEXT[] NOT NULL DEFAULT '{}',
    category TEXT NOT NULL DEFAULT 'Software',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 3. PORTFOLIO TABLE (Projects)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolio (
    id TEXT PRIMARY KEY DEFAULT 'proj-' || uuid_generate_v4()::text,
    title TEXT NOT NULL,
    client TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    challenge TEXT,
    solution TEXT,
    technologies TEXT[] NOT NULL DEFAULT '{}',
    live_demo TEXT,
    github_link TEXT,
    images TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 4. CONTACT REQUESTS TABLE
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT 'General IT Business Query',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Unread' CHECK (status IN ('Unread', 'Read', 'Replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 5. PROPOSAL REQUESTS TABLE
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.proposal_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT 'New Tech Proposal Request',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Unread' CHECK (status IN ('Unread', 'Read', 'Evaluating', 'Processed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.proposal_requests ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 6. TESTIMONIALS TABLE
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY DEFAULT 'test-' || uuid_generate_v4()::text,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    feedback TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 7. FAQ TABLE
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faq (
    id TEXT PRIMARY KEY DEFAULT 'faq-' || uuid_generate_v4()::text,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 8. CAREERS TABLE (Job Openings)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.careers (
    id TEXT PRIMARY KEY DEFAULT 'job-' || uuid_generate_v4()::text,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Full-time' CHECK (type IN ('Full-time', 'Part-time', 'Contract', 'Remote')),
    salary TEXT,
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL DEFAULT '{}',
    benefits TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 9. MEDIA STORAGE FILES REGISTRY
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL,
    size INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 10. SYSTEM SETTINGS KEY-VALUE STORE
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 11. INDEXES FOR QUERY OPTIMIZATION
-- -------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON public.contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_proposal_requests_status ON public.proposal_requests(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON public.portfolio(category);
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);

-- -------------------------------------------------------------
-- 12. ROW-LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------

-- Admins Table Policies
CREATE POLICY "Allow public read access to active admin bios" ON public.admins
    FOR SELECT USING (status = 'active');

CREATE POLICY "Allow write access for admin users only" ON public.admins
    FOR ALL USING (auth.uid() = id);

-- Services Table Policies
CREATE POLICY "Allow public select on services" ON public.services
    FOR SELECT USING (true);

CREATE POLICY "Allow admin manage on services" ON public.services
    FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND status = 'active'));

-- Portfolio Table Policies
CREATE POLICY "Allow public select on portfolio" ON public.portfolio
    FOR SELECT USING (true);

CREATE POLICY "Allow admin manage on portfolio" ON public.portfolio
    FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND status = 'active'));

-- Contact Requests Table Policies
CREATE POLICY "Allow public insert on contact_requests" ON public.contact_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin select on contact_requests" ON public.contact_requests
    FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND status = 'active'));

-- Proposal Requests Table Policies
CREATE POLICY "Allow public insert on proposal_requests" ON public.proposal_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin select on proposal_requests" ON public.proposal_requests
    FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND status = 'active'));

-- Testimonials Table Policies
CREATE POLICY "Allow public select on testimonials" ON public.testimonials
    FOR SELECT USING (true);

CREATE POLICY "Allow admin manage on testimonials" ON public.testimonials
    FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND status = 'active'));

-- FAQ Table Policies
CREATE POLICY "Allow public select on FAQ" ON public.faq
    FOR SELECT USING (true);

CREATE POLICY "Allow admin manage on FAQ" ON public.faq
    FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND status = 'active'));

-- Careers Table Policies
CREATE POLICY "Allow public select on careers" ON public.careers
    FOR SELECT USING (true);

CREATE POLICY "Allow admin manage on careers" ON public.careers
    FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND status = 'active'));

-- Media Table Policies
CREATE POLICY "Allow public select on media" ON public.media
    FOR SELECT USING (true);

CREATE POLICY "Allow admin manage on media" ON public.media
    FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND status = 'active'));

-- Settings Table Policies
CREATE POLICY "Allow public select on settings" ON public.settings
    FOR SELECT USING (true);

CREATE POLICY "Allow admin manage on settings" ON public.settings
    FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND status = 'active'));

-- -------------------------------------------------------------
-- 13. SEED INITIAL DATA
-- -------------------------------------------------------------

-- Seed default services
INSERT INTO public.services (id, title, description, icon, features, category) VALUES
('service-1', 'Enterprise Web Applications', 'Engineered custom SaaS dashboards, heavy client ERP networks, and scalable web solutions with low latency.', 'Globe', ARRAY['Custom CRM/ERP Pipelines', 'High Performance Static Builds', 'Integrated API Gateways'], 'Software'),
('service-2', 'Mobile Native Development', 'Modern, fast, and multiplatform iOS and Android applications built for user retention.', 'Smartphone', ARRAY['Cross-Platform React Native', 'Offline-First Local DB Sync', 'Payment Wallet Integration'], 'Mobile'),
('service-3', 'Cloud Systems & DevOps', 'Highly secure, highly available Google Cloud and AWS container infrastructures.', 'Cloud', ARRAY['Kubernetes Cluster Config', 'Automated CI/CD Deployments', 'Zero-Downtime Rollouts'], 'Cloud')
ON CONFLICT (id) DO NOTHING;

-- Seed default FAQs
INSERT INTO public.faq (id, question, answer, category) VALUES
('faq-1', 'What is your standard Service Level Agreement (SLA)?', 'We provide 24/7 coverage for high-priority incidents with response times under 15 minutes.', 'General'),
('faq-2', 'Do you offer post-launch maintenance packages?', 'Yes, we structure monthly support retainers for active performance tuning, backups, and library upgrades.', 'Support')
ON CONFLICT (id) DO NOTHING;

-- Seed default settings
INSERT INTO public.settings (key, value) VALUES
('company_config', '{"companyName": "AdSpark Technologies", "contactEmail": "adsparktechnologies01@gmail.com", "contactPhone": "+91 8421038918", "address": "AdSpark HQ, Tech Hub, Suite 400, Mumbai, India", "workingHours": "Mon - Fri, 9:00 AM - 6:00 PM", "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.803914844331!2d72.84964647597143!3d19.028399953497887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ced0eb11a3d5%3A0xe67f918e6ff0595d!2sDadar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- -------------------------------------------------------------
-- 14. AUTOMATED ADMIN CREATION TRIGGER
-- -------------------------------------------------------------
-- This trigger automatically inserts a record into public.admins whenever a new user registers via Supabase auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.admins (id, email, name, role, status)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'Admin'),
    'active'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Informative feedback
COMMENT ON TABLE public.admins IS 'Stores synchronized profiles of AdSpark system administrators, integrated with auth.users.';
