import React, { useState, useEffect } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Toggle scroll lock on body when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [mobileMenuOpen]);

  // Home Hero Slider state
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const slides = [
    {
      title: 'Next-Gen Enterprise Software Engineering',
      desc: 'Bespoke corporate software, responsive web platforms, and automated LLM configurations custom-engineered for global scaling brands.',
      cta: 'Request Free IT Proposal',
      tab: 'contact'
    },
    {
      title: 'Full-Stack E-Commerce & ERP Solutions',
      desc: 'High-yield storefronts, complete transaction safety, multi-tier checkout paths, and unified resource planners tailored around your company logic.',
      cta: 'Explore Our Services',
      tab: 'services'
    },
    {
      title: 'Cognitive AI Systems & Process Automation',
      desc: 'Unifying neural models, document semantic searches, conversational helpers, and cloud-native serverless clusters to accelerate operations.',
      cta: 'Book A Consultation',
      tab: 'contact'
    }
  ];

  const handleCtaClick = (tabName: string) => {
    setActiveTab(tabName);
    setSelectedServiceId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectService = (id: string | null) => {
    setSelectedServiceId(id);
    setActiveTab('services');
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
            onClick={() => {
              handleCtaClick('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="p-1.5 sm:p-2 bg-brand-blue text-white rounded-xl shadow-md group-hover:scale-105 transition-transform">
              <Lucide.Sparkles size={18} className="sm:w-5 sm:h-5" />
            </div>
            <span className="text-lg sm:text-xl font-display font-bold text-slate-900 tracking-tight select-none">
              {settings.logoText || 'AdSpark'}
              <span className="text-brand-blue">.</span>
            </span>
          </div>

          {/* Desktop Nav menu (Shows only >= 992px) */}
          <nav className="nav-desktop-only items-center gap-1">
            {[
              { label: 'Home', tab: 'home' },
              { label: 'About', tab: 'about' },
              { label: 'Services', tab: 'services' },
              { label: 'Contact', tab: 'contact' }
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
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="goto-admin-btn"
              onClick={onOpenAdmin}
              className="nav-desktop-only px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all items-center gap-1.5 cursor-pointer animate-fade-in"
            >
              <Lucide.LockKeyhole size={14} className="text-brand-blue" />
              Admin Access
            </button>
            <button
              id="proposal-header-cta-btn"
              onClick={() => {
                handleCtaClick('contact');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-brand-blue text-white font-bold text-[11px] sm:text-xs hover:bg-opacity-95 shadow transition-all cursor-pointer flex items-center gap-1 shrink-0 select-none"
            >
              <Lucide.FileText size={13} />
              <span className="hidden sm:inline">Get Proposal</span>
              <span className="sm:hidden">Proposal</span>
            </button>

            {/* Mobile Hamburger menu trigger (Shows only < 992px) */}
            <button
              id="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nav-mobile-only p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer items-center justify-center shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <Lucide.X size={18} /> : <Lucide.Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Dark Backdrop Overlay */}
        <div 
          className={`nav-mobile-only fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 cursor-pointer ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Slide-in Offcanvas Menu (Covers 80% of width on mobile, max 340px) */}
        <div 
          className={`nav-mobile-only-block fixed inset-y-0 right-0 w-[80%] max-w-[340px] bg-white z-50 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out border-l border-slate-100 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Offcanvas Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-brand-blue text-white rounded-xl">
                <Lucide.Sparkles size={16} />
              </div>
              <span className="text-base font-display font-bold text-slate-900 tracking-tight">
                {settings.logoText || 'AdSpark'}
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
              aria-label="Close menu"
            >
              <Lucide.X size={18} />
            </button>
          </div>

          {/* Offcanvas Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-2">
              Navigation Directory
            </span>
            <nav className="flex flex-col gap-1.5">
              {[
                { label: 'Home', tab: 'home', icon: Lucide.Home },
                { label: 'About', tab: 'about', icon: Lucide.Info },
                { label: 'Services', tab: 'services', icon: Lucide.Settings },
                { label: 'Contact', tab: 'contact', icon: Lucide.Mail }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.tab}
                    id={`mobile-nav-link-${item.tab}`}
                    onClick={() => {
                      handleCtaClick(item.tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-3 rounded-xl text-sm font-bold transition-all text-left flex items-center gap-3 cursor-pointer ${
                      activeTab === item.tab
                        ? 'text-brand-blue bg-blue-50/70'
                        : 'text-slate-600 hover:text-brand-blue hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={18} className={activeTab === item.tab ? 'text-brand-blue' : 'text-slate-400'} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-100">
              <button
                id="mobile-goto-admin-btn"
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Lucide.LockKeyhole size={14} className="text-brand-blue" />
                Admin Access Panel
              </button>
            </div>
          </div>

          {/* Offcanvas Footer */}
          <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-col items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Lucide.Sparkles size={14} className="text-brand-blue" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{settings.companyName}</span>
            </div>
            <p className="text-[10px] text-slate-400 text-center font-normal">
              Engineering custom high-trust architectures
            </p>
          </div>
        </div>
      </header>

      {/* 2. Main Page Layouts Router */}
      <main className="flex-grow">
        
        {/* TAB: HOME */}
        {activeTab === 'home' && (
          <div id="home-view" className="space-y-16 pb-16">
            
            {/* HERO SLIDER SECTION */}
            <section className="relative min-h-[480px] lg:h-[480px] py-12 lg:py-0 bg-slate-950 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden flex flex-col justify-center">
              <div className="absolute inset-0 opacity-40">
                <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"></div>
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 w-full flex flex-col justify-center">
                <div className="max-w-2xl space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
                  <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-blue-950/50 border border-brand-blue/30 px-3 py-1 rounded-full w-fit">
                    AdSpark Technologies
                  </span>
                  <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight transition-all duration-500">
                    {slides[activeSlide].title}
                  </h1>
                  <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                    {slides[activeSlide].desc}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <button
                      id="hero-main-cta-btn"
                      onClick={() => handleCtaClick(slides[activeSlide].tab)}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-blue text-white font-bold text-sm hover:bg-opacity-95 shadow-lg shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {slides[activeSlide].cta}
                      <Lucide.ArrowRight size={16} />
                    </button>
                    <button
                      id="hero-service-cta-btn"
                      onClick={() => handleCtaClick('services')}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all cursor-pointer border border-white/15 text-center"
                    >
                      Our Services
                    </button>
                  </div>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 flex items-center gap-2 z-15">
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
                  <div key={idx} className="space-y-1 border-r even:border-r-0 md:even:border-r border-slate-100 md:last:border-r-0">
                    <span className="text-2xl md:text-4xl font-display font-bold text-brand-blue block">
                      {stat.value}
                    </span>
                    <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* COMPANY INTRODUCTION SECTION */}
            <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6 shadow-lg border border-slate-800">
                <h3 className="text-lg font-display font-bold border-b border-slate-800 pb-3">AdSpark Capabilities</h3>
                <div className="grid grid-cols-2 gap-4 text-slate-300">
                  <div className="flex items-center gap-2 text-xs">
                    <Lucide.Cpu className="text-brand-blue" size={16} />
                    <span>Bespoke Engineering</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Lucide.BrainCircuit className="text-brand-blue" size={16} />
                    <span>AI Implementations</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Lucide.ShieldCheck className="text-brand-blue" size={16} />
                    <span>Enterprise Security</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Lucide.TrendingUp className="text-brand-blue" size={16} />
                    <span>99.9% Service SLA</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 italic">
                  *Engineering high-trust systems that streamline operational workflows securely.
                </p>
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
              <div className="md:col-span-5 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 text-slate-800 p-6 md:p-12 space-y-6 flex flex-col justify-between">
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

            <div className="grid md:grid-cols-2 gap-8 items-stretch pt-4">
              <div className="space-y-4 flex flex-col justify-center">
                <h3 className="text-xl font-display font-bold text-slate-900">The Blueprint of Our Core Mission</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  At AdSpark Technologies, we do not believe in boilerplate templates or unmonitored deployments. Every software architecture we construct is written from the ground up to support modern security protocols, responsive design grids, and durable cloud synchronization.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our development pod operates globally under technical supervision, coordinating daily to solve complex logic challenges for retail pioneers, medical centers, and web growth executives.
                </p>
              </div>
              <div className="rounded-2xl p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between shadow-md">
                <Lucide.Quote className="text-brand-blue opacity-50" size={32} />
                <p className="text-base italic leading-relaxed font-serif mt-4">
                  "Engineering is not merely about writing code; it is about establishing scalable structural pillars that support business objectives continuously and securely."
                </p>
                <div className="mt-6 border-t border-slate-800 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold block text-white">Engineering Leadership</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">AdSpark Technologies</span>
                  </div>
                  <Lucide.Award className="text-brand-blue" size={24} />
                </div>
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
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-center sm:text-left">
          
          {/* Logo brand info */}
          <div className="col-span-1 sm:col-span-2 space-y-4 flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 text-white">
              <div className="p-2 bg-brand-blue text-white rounded-xl">
                <Lucide.Sparkles size={18} />
              </div>
              <span className="text-lg font-display font-bold tracking-tight">{settings.companyName}</span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-normal text-center sm:text-left">
              A leading digital engineering company designing high-throughput corporate softwares, responsive e-commerce storefronts, and automated Large Language models.
            </p>
            <span className="text-xs text-slate-600 block pt-1 text-center sm:text-left">
              © {new Date().getFullYear()} AdSpark Technologies. All rights reserved.
            </span>
          </div>

          {/* Sitemap links column 1 */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider text-center sm:text-left">Company Directory</h4>
            <ul className="space-y-1.5 text-xs flex flex-col items-center sm:items-start">
              {['home', 'about', 'contact'].map(tab => (
                <li key={tab}>
                  <button
                    onClick={() => handleCtaClick(tab)}
                    className="hover:text-brand-blue cursor-pointer capitalize text-center sm:text-left"
                  >
                    {tab === 'contact' ? 'Contact' : tab} page
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sitemap links column 2 */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider text-center sm:text-left">Services & Insights</h4>
            <ul className="space-y-1.5 text-xs flex flex-col items-center sm:items-start">
              {['services'].map(tab => (
                <li key={tab}>
                  <button
                    onClick={() => handleCtaClick(tab)}
                    className="hover:text-brand-blue cursor-pointer capitalize text-center sm:text-left"
                  >
                    Our {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sitemap links column 3 */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider text-center sm:text-left">SLA Protections</h4>
            <ul className="space-y-1.5 text-xs flex flex-col items-center sm:items-start">
              <li>
                <button onClick={() => handleCtaClick('privacy')} className="hover:text-brand-blue cursor-pointer text-center sm:text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleCtaClick('terms')} className="hover:text-brand-blue cursor-pointer text-center sm:text-left">
                  Terms of Service
                </button>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" className="hover:text-brand-blue text-center sm:text-left">
                  XML Sitemap
                </a>
              </li>
              <li>
                <a href="/robots.txt" target="_blank" className="hover:text-brand-blue text-center sm:text-left">
                  Robots Schema
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <span className="text-slate-600 font-semibold uppercase tracking-wider text-center sm:text-left">Powered by Node.js Full-Stack Workspace</span>
          <div className="flex gap-4 opacity-50 justify-center sm:justify-start">
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
