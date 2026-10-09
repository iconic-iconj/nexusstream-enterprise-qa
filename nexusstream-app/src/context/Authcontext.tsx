import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/health'); // Just to see if server is up
        // In a real app, we might have a /api/auth/me
        // For this demo, let's use localStorage to persist session state
        const storedUser = localStorage.getItem('nexus_user');
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Auth check failed', err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('nexus_user', JSON.stringify(res.data.user));
      localStorage.setItem('theme', 'dark');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    await axios.post('/api/auth/register', { email, password, name });
  };

  const logout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('theme');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
