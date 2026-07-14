import React, { useState } from 'react';
import * as Lucide from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  onClose: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authMode, setAuthMode] = useState<'login' | 'reset' | 'verify'>('login');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  
  // Feedback states
  const [errorText, setErrorText] = useState<string>('');
  const [successText, setSuccessText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Verification & reset password states
  const [verifyCode, setVerifyCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const safeFetch = async (url: string, options: RequestInit, retries = 2, delayMs = 1000): Promise<Response> => {
    const timeoutMs = 8000;
    
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const res = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Our API services are currently initializing. Please wait a few seconds and try again.');
        }

        return res;
      } catch (err: any) {
        clearTimeout(timeoutId);

        const isTimeout = err.name === 'AbortError' || err.message?.toLowerCase().includes('timeout');
        const isNetworkError = err.name === 'TypeError' || err.message?.toLowerCase().includes('failed to fetch') || err.message?.toLowerCase().includes('network');
        
        if (attempt <= retries && (isNetworkError || isTimeout)) {
          console.warn(`API Request attempt ${attempt} failed: ${err.message}. Retrying in ${delayMs}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }

        if (isTimeout) {
          throw new Error('The request timed out because the server is taking too long to respond. Please check your internet connection or try again later.');
        }

        if (isNetworkError) {
          throw new Error('Unable to establish a secure connection to AdSpark\'s authentication servers. The server might be offline or you may be experiencing network issues. Please check your internet connection and try again.');
        }

        throw err;
      }
    }
    
    throw new Error('All attempts to reach our authentication services failed. Please check your internet connection and try again.');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');

    if (!email.trim() || !password.trim()) {
      setErrorText('Invalid email or password');
      return;
    }

    setLoading(true);

    try {
      const res = await safeFetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || result.message || 'Invalid email or password');
      }

      setSuccessText('Sign in authentication validated! Accessing dashboard...');
      
      // Store token depending on Remember Me
      if (rememberMe) {
        localStorage.setItem('adspark_admin_token', result.token);
        localStorage.setItem('adspark_admin_user', JSON.stringify(result.user));
      } else {
        sessionStorage.setItem('adspark_admin_token', result.token);
        sessionStorage.setItem('adspark_admin_user', JSON.stringify(result.user));
      }

      setTimeout(() => {
        onLoginSuccess(result.token);
      }, 1000);
    } catch (err: any) {
      setErrorText(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');

    if (!email.trim()) {
      setErrorText('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const res = await safeFetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || result.message || 'An error occurred. Please try again.');
      }

      setSuccessText(result.message || 'If that email address exists in our system, we have dispatched a secure recovery code.');
      setTimeout(() => {
        setAuthMode('verify');
        setSuccessText('');
      }, 3000);
    } catch (err: any) {
      setErrorText(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');

    if (!email.trim() || !verifyCode.trim() || !newPassword.trim()) {
      setErrorText('Please fill in all verification and password fields');
      return;
    }

    setLoading(true);

    try {
      const res = await safeFetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code: verifyCode, newPassword })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || result.message || 'Invalid or expired verification code');
      }

      setSuccessText('Password reset successfully! Returning to login...');
      setTimeout(() => {
        setAuthMode('login');
        setSuccessText('');
        setPassword('');
        setNewPassword('');
        setVerifyCode('');
      }, 2500);
    } catch (err: any) {
      setErrorText(err.message || 'Invalid or expired verification code');
    } finally {
      setLoading(false);
    }
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
          <form id="admin-login-form" onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-600 font-semibold uppercase tracking-wider block">Admin Email Address</label>
              <div className="relative">
                <Lucide.User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-brand-blue text-xs"
                  placeholder="Email Address"
                  autoComplete="off"
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
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 py-1 select-none">
              <input
                id="remember-me-checkbox"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue bg-slate-50 cursor-pointer"
              />
              <label htmlFor="remember-me-checkbox" className="text-slate-500 font-semibold uppercase tracking-wider cursor-pointer text-[10px]">
                Remember Me
              </label>
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
          <form id="admin-reset-form" onSubmit={handleResetSubmit} autoComplete="off" className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-600 font-semibold uppercase tracking-wider block">Admin Email Address</label>
              <div className="relative">
                <Lucide.Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-brand-blue"
                  placeholder="Email Address"
                  autoComplete="off"
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
          <form id="admin-verify-form" onSubmit={handleVerifySubmit} autoComplete="off" className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-600 font-semibold uppercase tracking-wider block">Admin Email Address</label>
              <div className="relative">
                <Lucide.Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-brand-blue"
                  placeholder="Email Address"
                  autoComplete="off"
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
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 font-semibold uppercase tracking-wider block">New Password</label>
              <div className="relative">
                <Lucide.KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-brand-blue text-xs"
                  placeholder="Password"
                  autoComplete="off"
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
              Verify & Reset Password
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
