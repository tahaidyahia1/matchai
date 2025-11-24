import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminSignIn, AdminUser } from '../services/adminService';

interface AdminContextType {
  admin: AdminUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    const adminId = localStorage.getItem('adminId');

    if (storedAdmin && adminId) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (error) {
        console.error('Failed to parse stored admin:', error);
        localStorage.removeItem('admin');
        localStorage.removeItem('adminId');
      }
    }

    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const adminUser = await adminSignIn(email, password);
      setAdmin(adminUser);
      localStorage.setItem('admin', JSON.stringify(adminUser));
      localStorage.setItem('adminId', adminUser.id);
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
    localStorage.removeItem('adminId');
  };

  return (
    <AdminContext.Provider value={{ admin, signIn, signOut, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
