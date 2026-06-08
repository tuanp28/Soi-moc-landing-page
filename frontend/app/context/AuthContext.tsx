'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/src/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (sessionObj: Session) => {
    try {
      const response = await fetch('/api/profile/me', {
        headers: {
          'Authorization': `Bearer ${sessionObj.access_token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        
        // Write role and vip level to cookies for middleware
        if (data.profile) {
          document.cookie = `soimoc-role=${data.profile.role}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `soimoc-vip-level=${data.profile.vipLevel}; path=/; max-age=604800; SameSite=Lax`;
        }
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (session) {
      await fetchProfile(session);
    }
  };

  useEffect(() => {
    // 1. Retrieve initial session on mount
    const getInitialSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession) {
          document.cookie = `soimoc-access-token=${currentSession.access_token}; path=/; max-age=604800; SameSite=Lax`;
          await fetchProfile(currentSession);
        }
      } catch (err) {
        console.error('Error retrieving Supabase session:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 2. Subscribe to real-time auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession) {
        document.cookie = `soimoc-access-token=${currentSession.access_token}; path=/; max-age=604800; SameSite=Lax`;
        await fetchProfile(currentSession);
      } else {
        // Clear cookies on logout
        document.cookie = `soimoc-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
        document.cookie = `soimoc-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
        document.cookie = `soimoc-vip-level=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error('Error logging out from Supabase Auth:', err);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      document.cookie = `soimoc-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
      document.cookie = `soimoc-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
      document.cookie = `soimoc-vip-level=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
