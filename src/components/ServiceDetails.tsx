import React, { useState } from 'react';
import { Service } from '../types';
import * as Lucide from 'lucide-react';

interface ServiceDetailsProps {
  services: Service[];
  onSelectService: (id: string | null) => void;
  selectedServiceId: string | null;
  onNavigateToContact: () => void;
}

// Icon mapper helper
export const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Lucide as any)[name];
  if (!IconComponent) {
    return <Lucide.Cpu className={className} />;
  }
  return <IconComponent className={className} />;
};

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  services,
  onSelectService,
  selectedServiceId,
  onNavigateToContact
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const categories: string[] = ['All', ...Array.from(new Set(services.map(s => s.category as string))) as string[]];

  const filteredServices = activeCategory === 'All'
    ? services
    : services.filter(s => s.category === activeCategory);

  const selectedService = services.find(s => s.id === selectedServiceId);

  if (selectedService) {
    return (
      <div id="service-details-viewport" className="py-12 max-w-5xl mx-auto px-4">
        {/* Breadcrumb */}
        <button
          id="back-to-services-btn"
          onClick={() => onSelectService(null)}
          className="flex items-center gap-2 text-brand-blue font-medium mb-8 hover:underline cursor-pointer group"
        >
          <Lucide.ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to All Services
        </button>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Main Visuals & Long Description */}
          <div className="md:col-span-8 space-y-6">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-2xl flex flex-col sm:flex-row items-center gap-6 text-white shadow-md">
              <div className="p-4 rounded-xl bg-brand-blue text-white shadow">
                <IconRenderer name={selectedService.icon} className="w-12 h-12" />
              </div>
              <div className="text-center sm:text-left space-y-1.5">
                <span className="text-xs font-semibold bg-white/20 text-white backdrop-blur px-2.5 py-1 rounded-full uppercase">
                  {selectedService.category}
                </span>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight block">
                  {selectedService.title}
                </h1>
              </div>
            </div>

            <div className="prose max-w-none text-slate-700 space-y-4">
              <h2 className="text-xl font-display font-bold text-slate-900 border-b pb-2">
                Service Overview
              </h2>
              <p className="text-lg leading-relaxed text-slate-600">
                {selectedService.description}
              </p>
              
              <h3 className="text-lg font-display font-semibold text-slate-900 pt-4">
                Key Deliverables & Outcomes
              </h3>
              <ul className="grid sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Enterprise-grade code security standards',
                  'Highly responsive layout architectures',
                  'Optimized database sync procedures',
                  'Complete technical handoff documentation',
                  '24/7 client communication loops',
                  'Continuous service health monitoring'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600">
                    <Lucide.CheckCircle2 className="text-brand-blue shrink-0 mt-0.5" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Service Pricing & CTAs */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Service Request
                </span>
                <span className="text-xl font-display font-bold text-slate-900 block mt-1">
                  Bespoke Consultation
                </span>
                <p className="text-xs text-slate-500 mt-2">
                  Tailored scopes depend on exact business goals and technical engineering metrics.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  id="consultation-cta-btn"
                  onClick={onNavigateToContact}
                  className="w-full py-3 px-4 rounded-xl bg-brand-blue text-white font-semibold text-center shadow-md hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lucide.PhoneCall size={18} />
                  Book A Consultation
                </button>
                <button
                  id="explore-pricing-cta-btn"
                  onClick={() => onSelectService(null)}
                  className="w-full py-3 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-center hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Explore Other Services
                </button>
              </div>

              <div className="border-t pt-4 space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">Why choose AdSpark?</h4>
                <div className="flex gap-3 text-xs text-slate-600">
                  <Lucide.ShieldCheck size={20} className="text-brand-blue shrink-0" />
                  <span>100% Secure & Confidential intellectual property management.</span>
                </div>
                <div className="flex gap-3 text-xs text-slate-600">
                  <Lucide.Clock size={20} className="text-brand-blue shrink-0" />
                  <span>Agile sprint layouts to ensure rapid service releases.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="services-grid-viewport" className="py-12 max-w-7xl mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold text-brand-blue tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">
          Our Specializations
        </span>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight mt-3">
          Comprehensive Tech Engineering Services
        </h1>
        <p className="text-slate-600 mt-4 leading-relaxed">
          From tailored high-throughput software architectures to digital marketing campaigns, our engineering squads deliver high service excellence.
        </p>
      </div>

      {/* Categories Horizontal Selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div
            key={service.id}
            id={`service-card-${service.id}`}
            className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="p-6 flex flex-col justify-between h-full flex-grow">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-blue-50 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all shadow-xs">
                    <IconRenderer name={service.icon} className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-brand-blue uppercase bg-blue-50 px-2 py-0.5 rounded-full block w-fit mb-1">
                      {service.category}
                    </span>
                    <h3 className="text-lg font-display font-bold text-slate-900 leading-snug">
                      {service.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {service.shortDesc}
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Professional Scoping</span>
                <button
                  id={`explore-service-${service.id}-btn`}
                  onClick={() => onSelectService(service.id)}
                  className="text-xs font-bold text-brand-blue hover:text-opacity-80 transition-all flex items-center gap-1 group/btn cursor-pointer"
                >
                  Learn More
                  <Lucide.ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
