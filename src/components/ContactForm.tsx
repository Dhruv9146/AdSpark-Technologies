import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { WebsiteSettings } from '../types';

interface ContactFormProps {
  settings: WebsiteSettings;
  onRefreshData: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ settings, onRefreshData }) => {
  // Message form states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [msgStatus, setMsgStatus] = useState<string>('');

  // Newsletter state
  const [newsEmail, setNewsEmail] = useState<string>('');
  const [newsStatus, setNewsStatus] = useState<string>('');

  // FAQ list accordion
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'What is your standard Service Level Agreement (SLA) response time?',
      a: 'We provide immediate 24/7 coverage for Critical Priority (P1) infrastructure incidents with a guaranteed response time of under 15 minutes. General software inquiries are resolved within standard 4-8 hour operational cycles.'
    },
    {
      q: 'Do you offer post-launch maintenance and active performance monitoring?',
      a: 'Yes, we structure dedicated support and maintenance retainer agreements. This includes continuous API health monitoring, automated database backup, library upgrades, security scanning, and monthly reports.'
    },
    {
      q: 'How do you ensure data security during enterprise migrations?',
      a: 'We strictly adhere to secure design practices. All migrations leverage military-grade AES-256 data encryption protocols, SSL security handshakes, private virtual subnets, and strict multi-factor role authorizations.'
    },
    {
      q: 'Can you integrate existing custom ERP architectures with external APIs?',
      a: 'API Integration is one of our core service fields. We construct custom endpoints, tokenize data handshakes, set up rate limit protectors, and map complex schemas to integrate legacy databases with modern software dashboards.'
    }
  ];

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setMsgStatus('Please fill in Name, Email and Message.');
      return;
    }

    try {
      const stored = localStorage.getItem('adspark_db');
      if (stored) {
        const db = JSON.parse(stored);
        const newMessage = {
          id: 'msg-' + Date.now(),
          name,
          email,
          subject: subject || 'General Systems Consultation',
          message,
          status: 'Unread',
          submittedAt: new Date().toISOString()
        };
        db.messages = [newMessage, ...(db.messages || [])];
        
        // Push a security/audit log too
        const newLog = {
          id: 'log-' + Date.now(),
          adminEmail: 'visitor@adspark.tech',
          action: 'Contact Inquiry Submitted',
          details: `Inquiry received from ${name} (${email})`,
          ipAddress: '::1',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        db.logs = [newLog, ...(db.logs || [])];

        localStorage.setItem('adspark_db', JSON.stringify(db));
      }
    } catch (err) {
      console.error('Error saving local message:', err);
    }

    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setMsgStatus('Thank you. Your enquiry has been submitted successfully.');
    onRefreshData();
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail || !newsEmail.includes('@')) {
      setNewsStatus('Please specify a valid email address.');
      return;
    }

    try {
      const stored = localStorage.getItem('adspark_db');
      if (stored) {
        const db = JSON.parse(stored);
        const newSub = {
          id: 'sub-' + Date.now(),
          email: newsEmail,
          subscribedAt: new Date().toISOString().split('T')[0],
          status: 'Active'
        };
        db.subscribers = [newSub, ...(db.subscribers || [])];
        localStorage.setItem('adspark_db', JSON.stringify(db));
      }
    } catch (err) {
      console.error('Error saving local subscriber:', err);
    }

    setNewsEmail('');
    setNewsStatus('Subscription confirmed! Thank you.');
    onRefreshData();
    setTimeout(() => setNewsStatus(''), 5000);
  };

  return (
    <div id="contact-and-faq-viewport" className="py-12 max-w-7xl mx-auto px-4 space-y-16">
      {/* 1. FAQs Accordion block */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <span className="text-xs font-bold text-brand-blue tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">
            Knowledge Base
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight mt-3">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all shadow-sm"
            >
              <button
                id={`faq-toggle-${idx}`}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-4 flex justify-between items-center text-left font-display font-bold text-slate-900 hover:text-brand-blue transition-all cursor-pointer"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? (
                  <Lucide.MinusCircle size={20} className="text-brand-blue shrink-0" />
                ) : (
                  <Lucide.PlusCircle size={20} className="text-slate-400 shrink-0" />
                )}
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Contact Main Panels */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left column: coordinates & map */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-brand-blue uppercase tracking-widest block">Get In Touch</span>
              <h3 className="text-xl font-display font-bold text-slate-900 tracking-tight mt-1">Our Headquarters</h3>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex gap-3">
                <Lucide.MapPin size={20} className="text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Office Address</span>
                  <span>{settings.address}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Lucide.Mail size={20} className="text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">General Mailbox</span>
                  <a href={`mailto:${settings.contactEmail}`} className="hover:underline text-brand-blue">
                    {settings.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <Lucide.PhoneCall size={20} className="text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Support Hotline</span>
                  <a href={`tel:${settings.contactPhone}`} className="hover:underline text-slate-700 font-semibold">
                    {settings.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <Lucide.CalendarClock size={20} className="text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Operational Hours</span>
                  <span>{settings.workingHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Frame */}
          <div className="rounded-2xl overflow-hidden aspect-square relative shadow-sm border border-slate-100 h-64 w-full">
            <iframe
              title="Office Location Map"
              src={settings.mapEmbedUrl}
              className="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 transition-all"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Right column: Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
                Request A Free IT Proposal
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Have a specialized software workflow, website redesign, or ERP requirement? Send coordinates and specifications below.
              </p>
            </div>

            <form id="contact-inquiry-form" onSubmit={handleMessageSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue text-slate-700"
                    placeholder="e.g. Robert Chen"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Email Coordinates *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue text-slate-700"
                    placeholder="e.g. robert@apex.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Subject Matter</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue text-slate-700"
                  placeholder="e.g. Custom CRM Planning"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Detailed Specifications *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue text-slate-700 resize-none"
                  placeholder="Tell us about your project milestones, systems, users, and estimated timeline..."
                  required
                ></textarea>
              </div>

              {msgStatus && (
                <div className={`p-4 rounded-xl text-xs font-semibold border ${
                  msgStatus.includes('successfully') ? 'bg-green-50 text-green-700 border-green-150' : 'bg-blue-50 text-brand-blue border-blue-150'
                }`}>
                  {msgStatus}
                </div>
              )}

              <button
                id="submit-contact-proposal-btn"
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-brand-blue text-white font-bold text-center shadow hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lucide.Send size={18} />
                Send Proposal Request
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Newsletter Box */}
      <div className="bg-brand-dark rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute inset-0 bg-radial-gradient from-blue-900/40 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-widest">Digital Insights</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
            Subscribe To Our Technology Newsletter
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Join 2,000+ IT executives. Get high-quality software architectures, ERP guides, and cloud cost-optimization updates delivered to your inbox.
          </p>

          <form id="newsletter-form" onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={newsEmail}
              onChange={(e) => setNewsEmail(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-800 bg-slate-900 text-white text-sm focus:outline-none focus:border-brand-blue flex-1 placeholder:text-slate-500 font-medium w-full"
              placeholder="Enter your executive email"
              required
            />
            <button
              id="submit-newsletter-btn"
              type="submit"
              className="py-3 px-6 rounded-xl bg-brand-blue text-white font-bold text-sm hover:bg-opacity-90 transition-all cursor-pointer whitespace-nowrap w-full sm:w-auto"
            >
              Subscribe Now
            </button>
          </form>

          {newsStatus && (
            <div className={`text-xs font-medium ${newsStatus.includes('confirmed') ? 'text-green-400' : 'text-slate-300'}`}>
              {newsStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
