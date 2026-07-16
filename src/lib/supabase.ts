import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL');
};

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('[SUPABASE] Failed to initialize Supabase client:', error);
    return null;
  }
};

export const supabase = getSupabaseClient();

// Unified secure authentication layer
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
  };
  error?: string;
}

export const secureLogin = async (email: string, password: string, rememberMe = true): Promise<AuthResponse> => {
  const emailLower = email.trim().toLowerCase();

  // Try Supabase Auth if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailLower,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data && data.user) {
        // Fetch role from profile table if exists
        let role = 'Admin';
        let name = emailLower.split('@')[0];
        
        const { data: profile } = await supabase
          .from('admins')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          role = profile.role || 'Admin';
          name = profile.name || name;
        }

        const sessionToken = data.session?.access_token || `sb-token-${data.user.id}`;

        // Persist session if rememberMe is true
        if (rememberMe) {
          localStorage.setItem('adspark_admin_token', sessionToken);
          localStorage.setItem('adspark_admin_user', JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name,
            role,
            status: 'active'
          }));
        } else {
          sessionStorage.setItem('adspark_admin_token', sessionToken);
          sessionStorage.setItem('adspark_admin_user', JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name,
            role,
            status: 'active'
          }));
        }

        return {
          success: true,
          token: sessionToken,
          user: {
            id: data.user.id,
            email: data.user.email || emailLower,
            name,
            role,
            status: 'active'
          }
        };
      }
    } catch (sbErr: any) {
      console.warn('[SUPABASE AUTH] Failed, falling back to secure Express Server Auth...', sbErr);
    }
  }

  // Fallback / standard full-stack Express API Auth
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailLower, password })
    });

    const result = await res.json();
    if (!res.ok) {
      return { success: false, error: result.error || 'Invalid credentials' };
    }

    if (rememberMe) {
      localStorage.setItem('adspark_admin_token', result.token);
      localStorage.setItem('adspark_admin_user', JSON.stringify(result.user));
    } else {
      sessionStorage.setItem('adspark_admin_token', result.token);
      sessionStorage.setItem('adspark_admin_user', JSON.stringify(result.user));
    }

    return {
      success: true,
      token: result.token,
      user: result.user
    };
  } catch (err: any) {
    console.error('[AUTH API ERROR] Fallback authentication failed:', err);
    return { success: false, error: 'Database service connection error. Please try again.' };
  }
};

export const secureLogout = async (token: string): Promise<boolean> => {
  localStorage.removeItem('adspark_admin_token');
  localStorage.removeItem('adspark_admin_user');
  sessionStorage.removeItem('adspark_admin_token');
  sessionStorage.removeItem('adspark_admin_user');

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[SUPABASE] Sign out failed:', err);
    }
  }

  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return true;
  } catch (err) {
    console.warn('[AUTH API ERROR] Express server logout notice failed:', err);
    return true;
  }
};

// Forgot password unified handler
export const secureForgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  const emailLower = email.trim().toLowerCase();

  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailLower, {
        redirectTo: window.location.origin
      });
      if (!error) {
        return { success: true, message: 'Supabase password reset instructions have been dispatched to your email address.' };
      }
    } catch (sbErr) {
      console.warn('[SUPABASE RESET] Failed, falling back to Express reset...', sbErr);
    }
  }

  try {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailLower })
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Password reset request failed');
    }
    return { success: true, message: result.message || 'If that email address exists in our system, we have dispatched a secure recovery code.' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Verification service communication error.' };
  }
};

// Reset password unified handler
export const secureResetPassword = async (email: string, code: string, passwordNew: string): Promise<{ success: boolean; message: string }> => {
  const emailLower = email.trim().toLowerCase();

  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordNew });
      if (!error) {
        return { success: true, message: 'Password reset successfully!' };
      }
    } catch (err) {
      console.warn('[SUPABASE UPDATE USER] Fallback to Express password reset:', err);
    }
  }

  try {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailLower, code, newPassword: passwordNew })
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Password reset failed');
    }
    return { success: true, message: 'Password reset successfully!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Verification service error.' };
  }
};
