import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/loyalty-operations`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'get-loyalty-data', userId })
      });

      const result = await response.json();
      if (result.data) {
        setLoyaltyData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch loyalty data:', error);
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
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/user-auth`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'signup',
        email,
        password,
        fullName,
        phone
      })
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.user || !result.user.id) {
      throw new Error('Failed to create account. Please try again.');
    }

    setUser(result.user);
    localStorage.setItem('matchai_user', JSON.stringify(result.user));
    await fetchLoyaltyData(result.user.id);
  };

  const signIn = async (email: string, password: string) => {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/user-auth`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'signin',
        email,
        password
      })
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.user || !result.user.id) {
      throw new Error('Failed to sign in. Please try again.');
    }

    setUser(result.user);
    localStorage.setItem('matchai_user', JSON.stringify(result.user));
    await fetchLoyaltyData(result.user.id);
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
