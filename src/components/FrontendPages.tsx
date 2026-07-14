import React, { useState } from 'react';
import {
  Service,
  Project,
  Blog,
  Career,
  Testimonial,
  ClientPartner,
  GalleryItem,
  TeamMember,
  WebsiteSettings
} from '../types';
import * as Lucide from 'lucide-react';

// Import modular subsets
import { ServiceDetails, IconRenderer } from './ServiceDetails';
import { PortfolioView } from './PortfolioView';
import { BlogView } from './BlogView';
import { CareerJobs } from './CareerJobs';
import { ContactForm } from './ContactForm';

interface FrontendPagesProps {
  services: Service[];
  projects: Project[];
  blogs: Blog[];
  careers: Career[];
  testimonials: Testimonial[];
  clients: ClientPartner[];
  gallery: GalleryItem[];
  team: TeamMember[];
  settings: WebsiteSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRefreshData: () => void;
  onOpenAdmin: () => void;
}

export const FrontendPages: React.FC<FrontendPagesProps> = ({
  services,
  projects,
  blogs,
  careers,
  testimonials,
  clients,
  gallery,
  team,
  settings,
  activeTab,
  setActiveTab,
  onRefreshData,
  onOpenAdmin
}) => {
  // Navigation states
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);

  // Home Hero Slider state
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const slides = [
    {
      title: 'Next-Gen Enterprise Software Engineering',
      desc: 'Bespoke corporate software, responsive web platforms, and automated LLM configurations custom-engineered for global scaling brands.',
      image: 'assets/images/hero/hero_banner.jpg',
      cta: 'Request Free IT Proposal',
      tab: 'contact'
    },
    {
      title: 'Full-Stack E-Commerce & ERP Solutions',
      desc: 'High-yield storefronts, complete transaction safety, multi-tier checkout paths, and unified resource planners tailored around your company logic.',
      image: 'assets/images/services/website_development.jpg',
      cta: 'Explore Our Services',
      tab: 'services'
    },
    {
      title: 'Cognitive AI Systems & Process Automation',
      desc: 'Unifying neural models, document semantic searches, conversational helpers, and cloud-native serverless clusters to accelerate operations.',
      image: 'assets/images/services/data_analytics.jpg',
      cta: 'Meet Our Tech Leaders',
      tab: 'team'
    }
  ];

  const handleCtaClick = (tabName: string) => {
    setActiveTab(tabName);
    setSelectedServiceId(null);
    setSelectedProjectId(null);
    setSelectedBlogSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectService = (id: string | null) => {
    setSelectedServiceId(id);
    setActiveTab('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProject = (id: string | null) => {
    setSelectedProjectId(id);
    setActiveTab('portfolio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBlog = (slug: string | null) => {
    setSelectedBlogSlug(slug);
    setActiveTab('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Technologies We Use List
  const techLogos = [
    { name: 'TypeScript', icon: 'CodeXml' },
    { name: 'React', icon: 'Cpu' },
    { name: 'Node.js', icon: 'Database' },
    { name: 'Tailwind CSS', icon: 'Palette' },
    { name: 'Docker / Kubernetes', icon: 'Layers' },
    { name: 'PostgreSQL', icon: 'HardDrive' },
    { name: 'Gemini AI', icon: 'BrainCircuit' },
    { name: 'AWS Cloud', icon: 'Cloud' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      
      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          
          {/* Logo */}
          <div
            onClick={() => handleCtaClick('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-2 bg-brand-blue text-white rounded-xl shadow-md group-hover:scale-105 transition-transform">
              <Lucide.Sparkles size={20} />
            </div>
            <span className="text-xl font-display font-bold text-slate-900 tracking-tight">
              {settings.logoText || 'AdSpark'}
              <span className="text-brand-blue">.</span>
            </span>
          </div>

          {/* Desktop Nav menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: 'Home', tab: 'home' },
              { label: 'About', tab: 'about' },
              { label: 'Services', tab: 'services' },
              { label: 'Portfolio', tab: 'portfolio' },
              { label: 'Pricing', tab: 'pricing' },
              { label: 'Careers', tab: 'careers' },
              { label: 'Blog', tab: 'blog' },
              { label: 'Inquiries', tab: 'contact' }
            ].map(item => (
              <button
                key={item.tab}
                id={`nav-link-${item.tab}`}
                onClick={() => handleCtaClick(item.tab)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === item.tab
                    ? 'text-brand-blue bg-blue-50/60'
                    : 'text-slate-600 hover:text-brand-blue hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA & Admin Link */}
          <div className="flex items-center gap-3">
            <button
              id="goto-admin-btn"
              onClick={onOpenAdmin}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Lucide.LockKeyhole size={14} className="text-brand-blue" />
              Admin Access
            </button>
            <button
              id="proposal-header-cta-btn"
              onClick={() => handleCtaClick('contact')}
              className="px-4 py-1.5 rounded-xl bg-brand-blue text-white font-bold text-xs hover:bg-opacity-95 shadow transition-all cursor-pointer flex items-center gap-1"
            >
              <Lucide.FileText size={13} />
              Get Proposal
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Page Layouts Router */}
      <main className="flex-grow">
        
        {/* TAB: HOME */}
        {activeTab === 'home' && (
          <div id="home-view" className="space-y-16 pb-16">
            
            {/* HERO SLIDER SECTION */}
            <section className="relative h-[480px] bg-brand-dark overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src={slides[activeSlide].image}
                  alt="Slide Visual"
                  className="w-full h-full object-cover opacity-35 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent"></div>
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
                <div className="max-w-2xl space-y-6">
                  <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-950/50 border border-brand-blue/30 px-3 py-1 rounded-full w-fit">
                    AdSpark Technologies
                  </span>
                  <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight transition-all duration-500">
                    {slides[activeSlide].title}
                  </h1>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                    {slides[activeSlide].desc}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      id="hero-main-cta-btn"
                      onClick={() => handleCtaClick(slides[activeSlide].tab)}
                      className="px-6 py-3 rounded-xl bg-brand-blue text-white font-bold text-sm hover:bg-opacity-95 shadow-lg shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
                    >
                      {slides[activeSlide].cta}
                      <Lucide.ArrowRight size={16} />
                    </button>
                    <button
                      id="hero-service-cta-btn"
                      onClick={() => handleCtaClick('services')}
                      className="px-5 py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all cursor-pointer border border-white/15"
                    >
                      Our Services
                    </button>
                  </div>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="absolute bottom-6 right-6 flex items-center gap-2 z-15">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      activeSlide === idx ? 'w-8 bg-brand-blue' : 'w-2.5 bg-white/40 hover:bg-white/60'
                    }`}
                  ></button>
                ))}
              </div>
            </section>

            {/* STATISTICS COUNTER SECTION */}
            <section className="max-w-7xl mx-auto px-4">
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { value: '150+', label: 'Successful Launches' },
                  { value: '98%', label: 'SLA Client Retention' },
                  { value: '45+', label: 'IT Professionals Pod' },
                  { value: '24/7', label: 'Continuous Support' }
                ].map((stat, idx) => (
                  <div key={idx} className="space-y-1 border-r last:border-0 border-slate-100">
                    <span className="text-3xl md:text-4xl font-display font-bold text-brand-blue block">
                      {stat.value}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* COMPANY INTRODUCTION SECTION */}
            <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
              <div className="rounded-2xl overflow-hidden aspect-video shadow-md bg-slate-100">
                <img
                  src="assets/images/backgrounds/about_section.jpg"
                  alt="Corporate Teamwork"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-5">
                <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                  Who We Are
                </span>
                <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                  High-Trust Digital Transformation Architectures
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  AdSpark Technologies designs secure, cognitive software systems for global brands. Our development pod is composed of meticulous technologists specialized in web performance optimization, API schema integrations, and Large Language Model automation pipelines.
                </p>
                <div className="pt-2">
                  <button
                    id="about-learn-more-btn"
                    onClick={() => handleCtaClick('about')}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    Read Company History
                    <Lucide.ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* SERVICES HOME SECTION (Pulls 3 featured services) */}
            <section className="max-w-7xl mx-auto px-4 space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                    Expertise Areas
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight mt-3">
                    Featured Services
                  </h2>
                </div>
                <button
                  id="view-all-services-cta"
                  onClick={() => handleCtaClick('services')}
                  className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View All 14 Services
                  <Lucide.ArrowRight size={14} />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.slice(0, 3).map(service => (
                  <div
                    key={service.id}
                    id={`home-service-card-${service.id}`}
                    className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="p-3 bg-blue-50 text-brand-blue rounded-xl w-fit mb-4">
                        <IconRenderer name={service.icon} className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {service.shortDesc}
                      </p>
                    </div>
                    <button
                      id={`home-explore-service-${service.id}`}
                      onClick={() => handleSelectService(service.id)}
                      className="text-xs font-bold text-brand-blue hover:underline text-left mt-4 flex items-center gap-1 cursor-pointer"
                    >
                      Read Specifications
                      <Lucide.ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* PORTFOLIO HOME SECTION (Pulls featured projects) */}
            <section className="max-w-7xl mx-auto px-4 space-y-8 bg-white border border-slate-100 py-12 rounded-3xl shadow-sm">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                  Work Showcase
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
                  Engineered Products & Deliveries
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  A snapshot of the custom corporate applications, e-commerce networks, and analytical interfaces built by AdSpark developers.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                {projects.filter(p => p.featured).slice(0, 3).map(proj => (
                  <div
                    key={proj.id}
                    id={`home-project-card-${proj.id}`}
                    onClick={() => handleSelectProject(proj.id)}
                    className="group bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
                  >
                    <div className="h-44 bg-slate-200 overflow-hidden relative">
                      <img
                        src={proj.images[0]}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-4 left-4 bg-brand-blue text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        {proj.category}
                      </span>
                    </div>
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <h3 className="text-base font-display font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                        {proj.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  id="home-view-all-portfolio"
                  onClick={() => handleCtaClick('portfolio')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  Browse Full Portfolio Catalog
                  <Lucide.ArrowRight size={14} />
                </button>
              </div>
            </section>

            {/* WHY CHOOSE US & PROCESS */}
            <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-start">
              {/* Why Choose Us */}
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                    Our Quality Matrix
                  </span>
                  <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight mt-3">
                    Why Partners Trust AdSpark
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    { t: 'Meticulous Engineering Standards', d: 'Every viewport, API endpoint, and state lifecycle is planned for robust operations and complete system maintainability.' },
                    { t: 'Continuous Communication Retainers', d: 'We provide immediate access, collaborative sprint reviews, and direct Slack coordination loops so you are never left guessing.' },
                    { t: 'IP Protection & Data Security', d: 'Enterprise-grade NDA compliance, sandboxed databases, and secure token handshakes to keep your operational data safe.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-brand-blue shrink-0">
                        <Lucide.ShieldCheck size={20} />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-slate-900 text-sm">{item.t}</h4>
                        <p className="text-slate-600 text-xs mt-1 leading-relaxed">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Our Process */}
              <div className="space-y-6 bg-white text-slate-800 p-8 rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  Execution Workflow
                </span>
                <h2 className="text-2xl font-display font-bold tracking-tight text-slate-900">Our Modern Delivery Process</h2>

                <div className="space-y-4">
                  {[
                    { step: '01', t: 'Discovery & System Blueprinting', d: 'Mapping requirements, APIs, and layouts into standard system architectures.' },
                    { step: '02', t: 'Incremental Sprint Deliveries', d: 'Bi-weekly builds delivered so you watch progress in live interactive previews.' },
                    { step: '03', t: 'Security & Integrity Auditing', d: 'Thorough stress testing, page load optimization, and database verification.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start border-l border-slate-200 pl-4 relative">
                      <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-brand-blue border-2 border-white"></div>
                      <div>
                        <span className="text-xs text-brand-blue font-bold block">{item.step}</span>
                        <h4 className="font-display font-bold text-slate-900 text-sm mt-0.5">{item.t}</h4>
                        <p className="text-slate-600 text-xs mt-1 leading-relaxed">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* TECHNOLOGIES WE USE SECTION */}
            <section className="max-w-7xl mx-auto px-4 space-y-6 text-center">
              <div>
                <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                  Stack Standards
                </span>
                <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight mt-3">
                  Leading Technologies We Deploy
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {techLogos.map((tech, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center justify-center gap-2.5">
                    <IconRenderer name={tech.icon} className="text-brand-blue w-5 h-5" />
                    <span className="text-xs font-bold text-slate-700">{tech.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* TESTIMONIALS SLIDER IN HOME */}
            <section className="bg-slate-50 text-slate-800 py-12 border-y border-slate-200">
              <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
                <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  Client Endorsements
                </span>
                <h2 className="text-2xl font-display font-bold text-slate-900">Trusted by Technical Leadership</h2>
                
                <div className="p-6 rounded-2xl bg-white border border-slate-200 max-w-3xl mx-auto space-y-4 shadow-sm">
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Lucide.Star key={star} size={16} className="fill-brand-blue text-brand-blue" />
                    ))}
                  </div>
                  <p className="text-slate-700 italic text-sm md:text-base leading-relaxed">
                    "{testimonials[0]?.feedback || 'AdSpark team delivered on all milestones. Professional engineering at its finest.'}"
                  </p>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{testimonials[0]?.name || 'Sarah Jenkins'}</h4>
                    <span className="text-xs text-slate-500">{testimonials[0]?.role} at {testimonials[0]?.company}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* LATEST BLOGS SECTION */}
            <section className="max-w-7xl mx-auto px-4 space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                    Articles
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight mt-3">
                    Latest Insights & Engineering Updates
                  </h2>
                </div>
                <button
                  id="goto-blogs-btn-home"
                  onClick={() => handleCtaClick('blog')}
                  className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View Blog Directory
                  <Lucide.ArrowRight size={14} />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.slice(0, 3).map(b => (
                  <div
                    key={b.id}
                    id={`home-blog-card-${b.id}`}
                    onClick={() => handleSelectBlog(b.slug)}
                    className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="h-44 overflow-hidden relative">
                      <img src={b.featuredImage} alt={b.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <span className="absolute top-4 left-4 bg-brand-blue text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        {b.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] text-slate-400 font-semibold">{b.publishedAt} • {b.readTime}</span>
                      <h4 className="font-display font-bold text-slate-900 text-sm mt-1.5 line-clamp-2">{b.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PARTNERS & CLIENTS PANEL */}
            <section className="max-w-7xl mx-auto px-4 py-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">Unifying systems with enterprise pioneers</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
                {clients.map(cli => (
                  <span key={cli.id} className="text-sm font-display font-bold text-slate-700 tracking-wider">
                    {cli.logo}
                  </span>
                ))}
              </div>
            </section>

            {/* CONTACT & FAQ MODULE REDIRECT/INTEGRATION */}
            <section className="max-w-7xl mx-auto px-4 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden grid md:grid-cols-12">
              <div className="md:col-span-5 bg-slate-50 border-r border-slate-100 text-slate-800 p-8 md:p-12 space-y-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 w-fit block">
                    Contact Coordinates
                  </span>
                  <h3 className="text-2xl font-display font-bold tracking-tight mt-4 text-slate-900">Let's blueprint your custom system</h3>
                  <p className="text-slate-600 text-xs leading-relaxed mt-2">
                    Submit your enterprise project details. Our software development consultants respond within 24 hours with custom workflow diagrams.
                  </p>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-200 text-xs text-slate-600">
                  <div className="flex gap-2">
                    <Lucide.MapPin size={16} className="text-brand-blue" />
                    <span>{settings.address}</span>
                  </div>
                  <div className="flex gap-2">
                    <Lucide.Mail size={16} className="text-brand-blue" />
                    <span>{settings.contactEmail}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 p-8">
                <ContactForm settings={settings} onRefreshData={onRefreshData} />
              </div>
            </section>

          </div>
        )}

        {/* TAB: ABOUT */}
        {activeTab === 'about' && (
          <div id="about-view" className="py-12 max-w-5xl mx-auto px-4 space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                Our Genesis
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight mt-3">
                About AdSpark Technologies
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed mt-4">
                Founded with a core philosophy of extreme attention to software standards, reliable delivery pipelines, and cognitive AI integrations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center pt-4">
              <div className="space-y-4">
                <h3 className="text-xl font-display font-bold text-slate-900">The Blueprint of Our Core Mission</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  At AdSpark Technologies, we do not believe in boilerplate templates or unmonitored deployments. Every software architecture we construct is written from the ground up to support modern security protocols, responsive design grids, and durable cloud synchronization.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our development pod operates globally under the technical supervision of sarah Jenkins and sarah Vance, coordinating daily to solve complex logic challenges for retail pioneers, medical centers, and web growth executives.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden aspect-video shadow-md bg-slate-100">
                <img
                  src="assets/images/services/digital_marketing.jpg"
                  alt="Tech team workspace"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Core Values */}
            <div className="border-t pt-10 grid sm:grid-cols-3 gap-6">
              {[
                { t: '100% Architectural Integrity', d: 'Zero short-cuts. Codebases are thoroughly commented, modularized, and structured to survive heavy workloads easily.' },
                { t: 'Active Client Collaboration', d: 'Every step is validated through clear, testable previews, ensuring your product is exactly what you Blueprinted.' },
                { t: 'System-wide Security First', d: 'From AES encryption to tokenized APIs, we safeguard proprietary enterprise data at all levels.' }
              ].map((val, idx) => (
                <div key={idx} className="bg-white p-5 border border-slate-100 rounded-xl shadow-sm space-y-2">
                  <span className="text-xs font-bold text-brand-blue block">Core Standard {idx+1}</span>
                  <h4 className="font-display font-bold text-slate-900 text-sm">{val.t}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{val.d}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SERVICES */}
        {activeTab === 'services' && (
          <ServiceDetails
            services={services}
            onSelectService={setSelectedServiceId}
            selectedServiceId={selectedServiceId}
            onNavigateToContact={() => handleCtaClick('contact')}
          />
        )}

        {/* TAB: PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <PortfolioView
            projects={projects}
            onSelectProject={setSelectedProjectId}
            selectedProjectId={selectedProjectId}
            onNavigateToContact={() => handleCtaClick('contact')}
          />
        )}

        {/* TAB: PRICING */}
        {activeTab === 'pricing' && (
          <div id="pricing-view" className="py-12 max-w-7xl mx-auto px-4 space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                SLA Matrices
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight mt-3">
                Transparent Enterprise Pricing
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed mt-4">
                We design comprehensive, milestones-based development agreements aligned with exact engineering workloads.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 pt-4">
              {[
                {
                  tier: 'Growth Framework',
                  price: '$3,500',
                  desc: 'Perfect for fast corporate websites, product launchers, and landing portfolios.',
                  features: ['Custom design language & wireframing', 'Responsive grid configuration', 'Standard SEO meta sitemap configs', 'Contact forms Rest synchronization', '3 Months post-launch support']
                },
                {
                  tier: 'Enterprise Solution',
                  price: '$9,500',
                  desc: 'Our flagship plan. Tailored mobile app deployments, dynamic storefronts, and API routers.',
                  features: ['Complete React Native / Node setup', 'Granular state lifecycle tracking', 'Full CRM/API backend integrations', 'Custom database table syncing', 'Email notification systems', '6 Months SLA maintenance support'],
                  featured: true
                },
                {
                  tier: 'Architect Cognitive AI',
                  price: '$25,000+',
                  desc: 'High-end cognitive workflows incorporating advanced Large Language models.',
                  features: ['Gemini system-prompt engineering', 'Document categorization logic', 'Custom vector data integrations', 'Auto-scaling VPC server configs', '24/7 dedicated support hotline', '1 Year SLA monitoring retainer']
                }
              ].map((tier, idx) => (
                <div
                  key={idx}
                  className={`p-6 border rounded-2xl flex flex-col justify-between shadow-sm ${
                    tier.featured
                      ? 'border-brand-blue bg-blue-50/10 scale-102 ring-2 ring-brand-blue/15'
                      : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="space-y-4">
                    <div>
                      {tier.featured && (
                        <span className="text-[9px] font-bold text-white bg-brand-blue uppercase px-2 py-0.5 rounded-full mb-2 inline-block">
                          Most Requested
                        </span>
                      )}
                      <h3 className="text-lg font-display font-bold text-slate-900 block">{tier.tier}</h3>
                      <span className="text-3xl font-display font-bold text-slate-900 block mt-2">
                        {tier.price}
                      </span>
                      <p className="text-slate-500 text-xs mt-2 leading-relaxed">{tier.desc}</p>
                    </div>

                    <ul className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
                      {tier.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <Lucide.CheckCircle2 className="text-brand-blue shrink-0 mt-0.5" size={14} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    id={`pricing-select-${tier.tier.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleCtaClick('contact')}
                    className={`w-full py-2.5 px-4 rounded-xl text-center font-semibold text-xs mt-8 transition-all cursor-pointer ${
                      tier.featured
                        ? 'bg-brand-blue text-white shadow hover:bg-opacity-95'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Discuss This Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: TEAM */}
        {activeTab === 'team' && (
          <div id="team-view" className="py-12 max-w-5xl mx-auto px-4 space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                Engineering Brains
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight mt-3">
                Our Professional Development Pod
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed mt-4">
                We are a meticulous team of software architects, creative systems designers, and AI implementation specialists.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {team.map(member => (
                <div key={member.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm text-center space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-slate-100 shadow border-2 border-brand-blue/20">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-slate-900 text-base">{member.name}</h3>
                      <span className="text-xs font-semibold text-brand-blue bg-blue-50 px-2.5 py-0.5 rounded-full uppercase mt-1 inline-block">
                        {member.role}
                      </span>
                      <p className="text-slate-500 text-xs leading-relaxed mt-3 px-2 font-normal">
                        {member.bio}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 pt-3 border-t">
                    {member.socials.linkedin && (
                      <a href={member.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-blue">
                        <Lucide.Linkedin size={18} />
                      </a>
                    )}
                    {member.socials.github && (
                      <a href={member.socials.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900">
                        <Lucide.Github size={18} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CAREERS */}
        {activeTab === 'careers' && (
          <CareerJobs careers={careers} onRefreshData={onRefreshData} />
        )}

        {/* TAB: BLOG */}
        {activeTab === 'blog' && (
          <BlogView
            blogs={blogs}
            onSelectBlog={setSelectedBlogSlug}
            selectedBlogSlug={selectedBlogSlug}
            onRefreshData={onRefreshData}
          />
        )}

        {/* TAB: GALLERY */}
        {activeTab === 'gallery' && (
          <div id="gallery-view" className="py-12 max-w-5xl mx-auto px-4 space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                Workspace Media
              </span>
              <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight mt-3">Office Media & Summit Gallery</h1>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map(item => (
                <div key={item.id} className="group relative rounded-2xl overflow-hidden aspect-square bg-slate-100 shadow-sm border border-slate-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">{item.category}</span>
                    <h4 className="font-display font-bold text-sm mt-0.5 leading-snug">{item.title}</h4>
                    {item.description && <p className="text-[11px] text-slate-300 font-normal mt-1 leading-snug">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CLIENTS */}
        {activeTab === 'clients' && (
          <div id="clients-view" className="py-12 max-w-4xl mx-auto px-4 space-y-8 text-center">
            <div className="max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Corporate Network</span>
              <h1 className="text-3xl font-display font-bold text-slate-900">Clients & Strategic Partners</h1>
              <p className="text-slate-500 text-sm font-normal">We coordinate with operational teams worldwide to deliver stable software architectures.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-6">
              {clients.map(cli => (
                <div key={cli.id} className="bg-white p-6 border border-slate-100 rounded-xl shadow-sm hover:border-brand-blue transition-colors flex items-center justify-center font-display font-bold text-slate-700 h-28">
                  {cli.logo}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CONTACT */}
        {activeTab === 'contact' && (
          <div id="contact-tab-viewport">
            <div className="text-center max-w-xl mx-auto pt-12 pb-6 px-4">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Systems Consultation</span>
              <h1 className="text-3xl font-display font-bold text-slate-900 mt-3">Corporate Contact coordinates</h1>
            </div>
            <ContactForm settings={settings} onRefreshData={onRefreshData} />
          </div>
        )}

        {/* TAB: PRIVACY POLICY */}
        {activeTab === 'privacy' && (
          <div id="privacy-view" className="py-12 max-w-3xl mx-auto px-4 space-y-6 text-slate-700">
            <h1 className="text-3xl font-display font-bold text-slate-900">Privacy Protection guidelines</h1>
            <span className="text-xs text-slate-400 font-semibold block">Effective Date: July 13, 2026</span>
            <p className="leading-relaxed text-sm">
              AdSpark Technologies is committed to safeguarding client intellectual property and personnel data. This policy outlines how sitemaps, database tracking, contact messaging coordinates, and resume upload documents are stored, encrypted, and evaluated inside our server environments.
            </p>
            <h3 className="text-lg font-display font-bold text-slate-900 mt-6">Data Encryption & Storage Policies</h3>
            <p className="leading-relaxed text-sm">
              All client specifications, codeblueprints, transaction logs, and subscriber files are serialized into our sandboxed file storage environments using AES-256 standards. We do not distribute contact emails to third-party advertising modules.
            </p>
          </div>
        )}

        {/* TAB: TERMS */}
        {activeTab === 'terms' && (
          <div id="terms-view" className="py-12 max-w-3xl mx-auto px-4 space-y-6 text-slate-700">
            <h1 className="text-3xl font-display font-bold text-slate-900">Terms of digital engineering Services</h1>
            <span className="text-xs text-slate-400 font-semibold block">Effective Date: July 13, 2026</span>
            <p className="leading-relaxed text-sm">
              By engaging AdSpark Technologies for Software Development, ERP setups, sitemap constructions, or AI promt optimizations, you agree to our standard bi-weekly sprint review schedules, payment milestone terms, and IP handoff parameters. All digital products are supported by our SLA retention commitments.
            </p>
          </div>
        )}

      </main>

      {/* 3. Footer Section with Sitemap & Map coordinates */}
      <footer className="bg-brand-dark text-slate-400 border-t border-slate-800 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Logo brand info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="p-2 bg-brand-blue text-white rounded-xl">
                <Lucide.Sparkles size={18} />
              </div>
              <span className="text-lg font-display font-bold tracking-tight">{settings.companyName}</span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-normal">
              A leading digital engineering company designing high-throughput corporate softwares, responsive e-commerce storefronts, and automated Large Language models.
            </p>
            <span className="text-xs text-slate-600 block pt-1">
              © {new Date().getFullYear()} AdSpark Technologies. All rights reserved.
            </span>
          </div>

          {/* Sitemap links column 1 */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider">Company Directory</h4>
            <ul className="space-y-1.5 text-xs">
              {['home', 'about', 'team', 'careers', 'pricing'].map(tab => (
                <li key={tab}>
                  <button
                    onClick={() => handleCtaClick(tab)}
                    className="hover:text-brand-blue cursor-pointer capitalize"
                  >
                    {tab} page
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sitemap links column 2 */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider">Services & Insights</h4>
            <ul className="space-y-1.5 text-xs">
              {['services', 'portfolio', 'blog', 'gallery', 'contact'].map(tab => (
                <li key={tab}>
                  <button
                    onClick={() => handleCtaClick(tab)}
                    className="hover:text-brand-blue cursor-pointer capitalize"
                  >
                    Our {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sitemap links column 3 */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider">SLA Protections</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => handleCtaClick('privacy')} className="hover:text-brand-blue cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleCtaClick('terms')} className="hover:text-brand-blue cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" className="hover:text-brand-blue">
                  XML Sitemap
                </a>
              </li>
              <li>
                <a href="/robots.txt" target="_blank" className="hover:text-brand-blue">
                  Robots Schema
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <span className="text-slate-600 font-semibold uppercase tracking-wider">Powered by Node.js Full-Stack Workspace</span>
          <div className="flex gap-4 opacity-50">
            {settings.socialLinks.facebook && <a href={settings.socialLinks.facebook} className="text-white hover:text-brand-blue"><Lucide.Facebook size={16} /></a>}
            {settings.socialLinks.twitter && <a href={settings.socialLinks.twitter} className="text-white hover:text-brand-blue"><Lucide.Twitter size={16} /></a>}
            {settings.socialLinks.linkedin && <a href={settings.socialLinks.linkedin} className="text-white hover:text-brand-blue"><Lucide.Linkedin size={16} /></a>}
            {settings.socialLinks.github && <a href={settings.socialLinks.github} className="text-white hover:text-brand-blue"><Lucide.Github size={16} /></a>}
          </div>
        </div>
      </footer>

    </div>
  );
};
