import React, { useState } from 'react';
import { Project } from '../types';
import * as Lucide from 'lucide-react';

interface PortfolioViewProps {
  projects: Project[];
  onSelectProject: (id: string | null) => void;
  selectedProjectId: string | null;
  onNavigateToContact: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  projects,
  onSelectProject,
  selectedProjectId,
  onNavigateToContact
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  const categories: string[] = ['All', ...Array.from(new Set(projects.map(p => p.category as string))) as string[]];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  if (selectedProject) {
    return (
      <div id="project-details-viewport" className="py-12 max-w-5xl mx-auto px-4">
        {/* Back navigation */}
        <button
          id="back-to-portfolio-btn"
          onClick={() => {
            onSelectProject(null);
            setActiveImageIdx(0);
          }}
          className="flex items-center gap-2 text-brand-blue font-medium mb-8 hover:underline cursor-pointer group"
        >
          <Lucide.ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </button>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Visual Showcase (Multi-image layout) */}
          <div className="md:col-span-7 space-y-4">
            <div className="rounded-2xl overflow-hidden aspect-video relative shadow border border-slate-100 bg-slate-100">
              <img
                src={selectedProject.images[activeImageIdx] || selectedProject.images[0]}
                alt={selectedProject.title}
                className="w-full h-full object-cover transition-all"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-brand-blue text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                {selectedProject.category}
              </div>
            </div>

            {/* Thumbnail selector */}
            {selectedProject.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2">
                {selectedProject.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-20 aspect-video rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIdx === idx ? 'border-brand-blue shadow-sm scale-95' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-xl font-display font-bold text-slate-900">Project Description</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {selectedProject.description}
              </p>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
              <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
                {selectedProject.title}
              </h1>

              {/* Technologies Badges */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Technologies Used</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.technologies.map(tech => (
                    <span
                      key={tech}
                      className="text-xs font-semibold bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-2.5 py-1 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Attributes Grid */}
              <div className="border-t border-slate-150 pt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block uppercase">Client Partner</span>
                  <span className="font-semibold text-slate-700">{selectedProject.client}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block uppercase">Duration</span>
                  <span className="font-semibold text-slate-700">{selectedProject.duration}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block uppercase">Launch Date</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(selectedProject.completionDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block uppercase">Deployment</span>
                  <span className="font-semibold text-green-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Live Platform
                  </span>
                </div>
              </div>

              {/* Links and Action CTAs */}
              <div className="pt-4 border-t border-slate-150 space-y-2.5">
                {selectedProject.liveLink && (
                  <a
                    href={selectedProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-brand-blue text-white font-semibold text-center shadow-md hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lucide.ExternalLink size={16} />
                    Visit Live Demo
                  </a>
                )}
                {selectedProject.githubLink && (
                  <a
                    href={selectedProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white font-semibold text-center hover:bg-slate-850 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lucide.Github size={16} />
                    View Source Code
                  </a>
                )}
                <button
                  id="project-consultation-btn"
                  onClick={onNavigateToContact}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-center hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lucide.MessageSquareQuote size={16} />
                  Discuss Similar Solutions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="portfolio-grid-viewport" className="py-12 max-w-7xl mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold text-brand-blue tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">
          Our Achievements
        </span>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight mt-3">
          Our Project Portfolio
        </h1>
        <p className="text-slate-600 mt-4 leading-relaxed">
          Explore our record of high-performance digital platforms, client integrations, and bespoke designs created for global scaling enterprises.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            id={`port-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
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

      {/* Projects list */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(proj => (
          <div
            key={proj.id}
            id={`project-card-${proj.id}`}
            onClick={() => onSelectProject(proj.id)}
            className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer"
          >
            <div className="h-52 overflow-hidden relative bg-slate-100">
              <img
                src={proj.images[0]}
                alt={proj.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-brand-blue/90 backdrop-blur text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {proj.category}
              </div>
            </div>

            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-1">
                  {proj.title}
                </h3>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex flex-wrap gap-1">
                {proj.technologies.slice(0, 3).map(tech => (
                  <span key={tech} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {tech}
                  </span>
                ))}
                {proj.technologies.length > 3 && (
                  <span className="text-[10px] font-medium bg-blue-50 text-brand-blue px-2 py-0.5 rounded">
                    +{proj.technologies.length - 3} More
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
