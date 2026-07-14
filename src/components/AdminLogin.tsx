import React, { useState } from 'react';
import * as Lucide from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  onClose: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState<string>('adsparktechnologies01@gmail.com');
  const [password, setPassword] = useState<string>('AdSpark@2026');
  const [authMode, setAuthMode] = useState<'login' | 'reset' | 'verify'>('login');
  
  // Feedback states
  const [errorText, setErrorText] = useState<string>('');
  const [successText, setSuccessText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Verification states
  const [verifyCode, setVerifyCode] = useState<string>('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');
    setLoading(true);

    setTimeout(() => {
      if (email === 'adsparktechnologies01@gmail.com' && password === 'AdSpark@2026') {
        setSuccessText('Sign in authentication validated! Accessing dashboard...');
        setTimeout(() => {
          onLoginSuccess('static-session-token-2026');
        }, 1000);
      } else {
        setErrorText('Invalid Email or Password');
        setLoading(false);
      }
    }, 600);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');
    setLoading(true);

    setTimeout(() => {
      if (email === 'adsparktechnologies01@gmail.com') {
        setSuccessText('Password recovery link sent successfully to adsparktechnologies01@gmail.com.');
        setTimeout(() => {
          setAuthMode('login');
          setSuccessText('');
        }, 3000);
      } else {
        setErrorText('Invalid Email Address');
      }
      setLoading(false);
    }, 500);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');
    setLoading(true);

    setTimeout(() => {
      if (email === 'adsparktechnologies01@gmail.com' && verifyCode === '2026') {
        setSuccessText('Email verification approved!');
        setTimeout(() => {
          setAuthMode('login');
          setSuccessText('');
        }, 2000);
      } else {
        setErrorText('Invalid Email or Verification Code. (Use code: 2026)');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div id="admin-login-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl relative space-y-6">
        
        {/* Close Button */}
        <button
          id="close-login-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <Lucide.XCircle size={22} />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="p-3 bg-blue-50 text-brand-blue border border-blue-100 rounded-2xl w-fit mx-auto">
            <Lucide.ShieldCheck size={26} />
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight animate-fade-in">
            {authMode === 'login' && 'Administrator Auth'}
            {authMode === 'reset' && 'Reset Secure Password'}
            {authMode === 'verify' && 'Verify Email Address'}
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            {authMode === 'login' && 'Laravel-Style Secure Access Module'}
            {authMode === 'reset' && 'A recovery link will be simulated on SMTP'}
            {authMode === 'verify' && 'Check outgoing logs for validation codes'}
          </p>
        </div>

        {/* MODE: LOGIN FORM */}
        {authMode === 'login' && (
          <form id="admin-login-form" onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-600 font-semibold uppercase tracking-wider block">Admin Email Address</label>
              <div className="relative">
                <Lucide.User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-brand-blue text-xs"
                  placeholder="e.g. adsparktechnologies01@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-slate-600 font-semibold uppercase tracking-wider">Secret Password</label>
                <button
                  type="button"
                  onClick={() => setAuthMode('reset')}
                  className="text-[10px] text-brand-blue hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lucide.KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-brand-blue text-xs"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            {errorText && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl font-semibold leading-relaxed">
                {errorText}
              </div>
            )}

            {successText && (
              <div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl font-semibold leading-relaxed animate-pulse">
                {successText}
              </div>
            )}

            <button
              id="submit-auth-login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-blue text-white font-bold text-center hover:bg-opacity-95 shadow-lg shadow-blue-100 hover:shadow-blue-200/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Validating Session...' : 'Sign In To Panel'}
              <Lucide.ArrowRight size={16} />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('verify')}
                className="text-[10px] text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Need Email Verification Code?
              </button>
            </div>
          </form>
        )}

        {/* MODE: PASSWORD RESET */}
        {authMode === 'reset' && (
          <form id="admin-reset-form" onSubmit={handleResetSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-600 font-semibold uppercase tracking-wider block">Admin Email Address</label>
              <div className="relative">
                <Lucide.Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-brand-blue"
                  placeholder="e.g. adsparktechnologies01@gmail.com"
                  required
                />
              </div>
            </div>

            {errorText && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl font-semibold">
                {errorText}
              </div>
            )}

            {successText && (
              <div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl font-semibold">
                {successText}
              </div>
            )}

            <button
              id="submit-auth-reset-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-blue text-white font-bold text-center hover:bg-opacity-95 shadow-lg shadow-blue-100 hover:shadow-blue-200/50 transition-all cursor-pointer"
            >
              Dispatch Recovery Link
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorText('');
                  setSuccessText('');
                }}
                className="text-[10px] text-slate-500 hover:text-slate-800 cursor-pointer flex items-center gap-1 justify-center mx-auto"
              >
                <Lucide.ArrowLeft size={12} />
                Return to Login
              </button>
            </div>
          </form>
        )}

        {/* MODE: EMAIL VERIFICATION */}
        {authMode === 'verify' && (
          <form id="admin-verify-form" onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-600 font-semibold uppercase tracking-wider block">Admin Email Address</label>
              <div className="relative">
                <Lucide.Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-brand-blue"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 font-semibold uppercase tracking-wider block">Verification code</label>
              <div className="relative">
                <Lucide.LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-brand-blue text-xs font-mono tracking-widest"
                  placeholder="e.g. 842915"
                  required
                />
              </div>
            </div>

            {errorText && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl font-semibold">
                {errorText}
              </div>
            )}

            {successText && (
              <div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl font-semibold">
                {successText}
              </div>
            )}

            <button
              id="submit-auth-verify-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-blue text-white font-bold text-center hover:bg-opacity-95 shadow-lg shadow-blue-100 hover:shadow-blue-200/50 transition-all cursor-pointer"
            >
              Verify Code Credentials
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorText('');
                  setSuccessText('');
                }}
                className="text-[10px] text-slate-500 hover:text-slate-800 cursor-pointer flex items-center gap-1 justify-center mx-auto"
              >
                <Lucide.ArrowLeft size={12} />
                Return to Login
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
