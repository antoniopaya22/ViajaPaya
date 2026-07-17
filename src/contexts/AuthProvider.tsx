import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { supabase } from '@/services/supabase';

WebBrowser.maybeCompleteAuthSession();

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  sendOtp: (email: string) => Promise<{ error: string | null }>;
  verifyOtp: (email: string, code: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      sendOtp: async (email: string) => {
        const { error } = await supabase.auth.signInWithOtp({ email });
        return { error: error?.message ?? null };
      },
      verifyOtp: async (email: string, code: string) => {
        const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
        return { error: error?.message ?? null };
      },
      signInWithGoogle: async () => {
        const redirectTo = makeRedirectUri();
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo, skipBrowserRedirect: true },
        });
        if (error) return { error: error.message };
        if (!data?.url) return { error: 'No se pudo iniciar el login con Google.' };

        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
        if (result.type === 'cancel' || result.type === 'dismiss') {
          return { error: null };
        }
        if (result.type !== 'success' || !result.url) {
          return { error: 'No se pudo completar el login con Google.' };
        }

        const code = new URL(result.url).searchParams.get('code');
        if (!code) return { error: 'Falta el código de autorización de Google.' };

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        return { error: exchangeError?.message ?? null };
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}
