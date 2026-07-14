import React, { useState } from 'react';
import { Career } from '../types';
import * as Lucide from 'lucide-react';

interface CareerJobsProps {
  careers: Career[];
  onRefreshData: () => void;
}

export const CareerJobs: React.FC<CareerJobsProps> = ({ careers, onRefreshData }) => {
  const [selectedJob, setSelectedJob] = useState<Career | null>(null);
  const [applyJobId, setApplyJobId] = useState<string | null>(null);

  // Application form states
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [resumeName, setResumeName] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<string>('');

  const activeJobToApply = careers.find(c => c.id === applyJobId);

  // Simulate file upload pattern
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setResumeName(file.name);
      setFormStatus('');
      
      // Simulate progress bar loading
      setUploadProgress(10);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 30;
        });
      }, 150);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyJobId || !fullName || !email || !phone) {
      setFormStatus('Please complete all mandatory parameters.');
      return;
    }
    if (!resumeName) {
      setFormStatus('Please attach your Resume / Curriculum Vitae.');
      return;
    }

    setFormStatus('Submitting your profile application...');
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerId: applyJobId,
          jobTitle: activeJobToApply?.title || 'Professional Role',
          fullName,
          email,
          phone,
          coverLetter,
          resumeUrl: `/uploads/resumes/${resumeName}`
        })
      });

      if (res.ok) {
        setFullName('');
        setEmail('');
        setPhone('');
        setCoverLetter('');
        setResumeName('');
        setUploadProgress(0);
        setFormStatus('Application submitted successfully! Our HR recruiters will contact you shortly.');
        onRefreshData();
      } else {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const err = await res.json();
          setFormStatus(`Submission error: ${err.error || 'Failed to apply'}`);
        } else {
          setFormStatus('Failed to submit application. Server returned an invalid response.');
        }
      }
    } catch (err) {
      console.error(err);
      setFormStatus('Connection failed. Server backend is offline.');
    }
  };

  if (applyJobId && activeJobToApply) {
    return (
      <div id="apply-job-form-viewport" className="py-12 max-w-2xl mx-auto px-4">
        <button
          id="back-to-jobs-list-btn"
          onClick={() => {
            setApplyJobId(null);
            setFormStatus('');
            setResumeName('');
            setUploadProgress(0);
          }}
          className="flex items-center gap-2 text-brand-blue font-medium mb-6 hover:underline cursor-pointer group"
        >
          <Lucide.ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Career Openings
        </button>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Apply Online</span>
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight mt-1">
              {activeJobToApply.title}
            </h1>
            <p className="text-slate-500 text-sm mt-1">{activeJobToApply.department} • {activeJobToApply.location}</p>
          </div>

          <form id="career-application-form" onSubmit={handleApplySubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue text-slate-700 font-medium"
                  placeholder="e.g. Jane Doe"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue text-slate-700 font-medium"
                  placeholder="e.g. jane.doe@gmail.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue text-slate-700 font-medium"
                placeholder="e.g. +1 (555) 012-3456"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Resume / Curriculum Vitae (PDF/DOCX) *</label>
              {/* File upload box */}
              <div className="border-2 border-dashed border-slate-200 hover:border-brand-blue rounded-2xl p-6 transition-all relative group/upload">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="text-center space-y-2 pointer-events-none">
                  <div className="p-3 bg-blue-50 text-brand-blue rounded-full w-fit mx-auto group-hover/upload:scale-105 transition-transform">
                    <Lucide.UploadCloud size={24} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {resumeName ? `Attached: ${resumeName}` : 'Drag & drop or Click to choose file'}
                  </p>
                  <p className="text-xs text-slate-400">Supported formats: PDF, DOCX up to 10MB</p>
                </div>
              </div>

              {uploadProgress > 0 && (
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>Uploading Resume...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Cover Letter / Brief Summary</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue text-slate-700 resize-none"
                placeholder="Summarize your engineering expertise or ask clarifying details..."
              ></textarea>
            </div>

            {formStatus && (
              <div className={`p-4 rounded-xl text-xs font-semibold border ${
                formStatus.includes('successfully')
                  ? 'bg-green-50 text-green-700 border-green-150'
                  : 'bg-blue-50 text-brand-blue border-blue-150'
              }`}>
                {formStatus}
              </div>
            )}

            <button
              id="submit-job-app-btn"
              type="submit"
              disabled={uploadProgress > 0 && uploadProgress < 100}
              className="w-full py-3 px-4 rounded-xl bg-brand-blue text-white font-bold text-center shadow-md hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lucide.Send size={18} />
              Submit Application
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div id="careers-directory-viewport" className="py-12 max-w-7xl mx-auto px-4">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold text-brand-blue tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">
          Join Our Pod
        </span>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight mt-3">
          Explore Current Career Opportunities
        </h1>
        <p className="text-slate-600 mt-4 leading-relaxed">
          We are searching for meticulous engineers, designers, and innovators to build Next-Gen digital systems. Read details and apply online below.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Jobs list */}
        <div className="md:col-span-7 space-y-4">
          {careers.map(job => (
            <div
              key={job.id}
              id={`job-card-${job.id}`}
              onClick={() => setSelectedJob(job)}
              className={`p-6 border rounded-2xl transition-all cursor-pointer flex flex-col justify-between ${
                selectedJob?.id === job.id
                  ? 'border-brand-blue bg-blue-50/10 shadow-sm'
                  : 'border-slate-100 hover:border-slate-200 bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-brand-blue uppercase bg-blue-50/70 px-2 py-0.5 rounded">
                    {job.type}
                  </span>
                  <h3 className="text-lg font-display font-bold text-slate-900 mt-2 hover:text-brand-blue transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex gap-4 text-xs text-slate-500 mt-1">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </div>
                <Lucide.ChevronRight size={18} className="text-slate-400 mt-1 shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Selected Job Specifications Box */}
        <div className="md:col-span-5">
          {selectedJob ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Job Overview</span>
                <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight mt-1">{selectedJob.title}</h2>
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 mt-3 pt-3 border-t">
                  <div>
                    <span className="text-slate-400 block font-normal">Experience</span>
                    <span className="font-semibold text-slate-700">{selectedJob.experience}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">Salary Estimate</span>
                    <span className="font-semibold text-slate-700">{selectedJob.salaryRange}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-600">
                <p className="leading-relaxed font-normal">{selectedJob.description}</p>
                
                {selectedJob.requirements && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider">Key Requirements:</h4>
                    <ul className="space-y-1.5 pl-1">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs">
                          <Lucide.CheckSquare size={14} className="text-brand-blue shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.benefits && (
                  <div className="space-y-2 pt-2">
                    <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider">Perks & Benefits:</h4>
                    <ul className="space-y-1.5 pl-1">
                      {selectedJob.benefits.map((ben, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs">
                          <Lucide.HeartHandshake size={14} className="text-brand-blue shrink-0 mt-0.5" />
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                id={`apply-to-${selectedJob.id}-btn`}
                onClick={() => setApplyJobId(selectedJob.id)}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-blue text-white font-semibold text-center hover:bg-opacity-95 shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lucide.FileUser size={16} />
                Apply Online Now
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed rounded-2xl p-8 text-center text-slate-400">
              <Lucide.MousePointerClick size={36} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-medium">Select an opening to read requirements, salary, and benefits details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
