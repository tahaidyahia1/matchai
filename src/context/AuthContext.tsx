import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
}

interface LoyaltyData {
  total_points: number;
  lifetime_points: number;
  tier: string;
}

interface AuthContextType {
  user: User | null;
  loyaltyData: LoyaltyData | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshLoyaltyData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLoyaltyData = async (userId: string) => {
    const { data, error } = await supabase
      .from('loyalty_points')
      .select('total_points, lifetime_points, tier')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      setLoyaltyData(data);
    }
  };

  const refreshLoyaltyData = async () => {
    if (user) {
      await fetchLoyaltyData(user.id);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('matchai_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchLoyaltyData(userData.id);
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    const passwordHash = await bcrypt.hash(password, 10);

    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        phone: phone || null
      })
      .select('id, email, full_name, phone')
      .single();

    if (userError) throw userError;

    await supabase
      .from('loyalty_points')
      .insert({
        user_id: newUser.id,
        total_points: 0,
        lifetime_points: 0,
        tier: 'Green Member'
      });

    setUser(newUser);
    localStorage.setItem('matchai_user', JSON.stringify(newUser));
    await fetchLoyaltyData(newUser.id);
  };

  const signIn = async (email: string, password: string) => {
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('id, email, full_name, phone, password_hash')
      .eq('email', email)
      .maybeSingle();

    if (fetchError || !userData) {
      throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, userData.password_hash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const user = {
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      phone: userData.phone
    };

    setUser(user);
    localStorage.setItem('matchai_user', JSON.stringify(user));
    await fetchLoyaltyData(user.id);
  };

  const signOut = async () => {
    setUser(null);
    setLoyaltyData(null);
    localStorage.removeItem('matchai_user');
  };

  return (
    <AuthContext.Provider value={{ user, loyaltyData, loading, signUp, signIn, signOut, refreshLoyaltyData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
