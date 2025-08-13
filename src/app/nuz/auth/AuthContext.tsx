'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<boolean>;
  signUp: (username: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const sessionToken = getCookie('nuzlocke_session');
    if (sessionToken) {
      // In a real app, you'd validate this token with your backend
      const savedUser = getCookie('nuzlocke_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser as string));
        } catch (error) {
          console.error('Error parsing saved user:', error);
          deleteCookie('nuzlocke_session');
          deleteCookie('nuzlocke_user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (username: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - in a real app, this would be a backend request
      if (username && password) {
        const user: User = {
          id: Date.now().toString(),
          username,
          email: `${username}@example.com`,
        };
        
        // Set cookies for session management
        setCookie('nuzlocke_session', 'authenticated', { maxAge: 60 * 60 * 24 * 7 }); // 7 days
        setCookie('nuzlocke_user', JSON.stringify(user), { maxAge: 60 * 60 * 24 * 7 });
        
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  };

  const signUp = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - in a real app, this would be a backend request
      if (username && email && password) {
        const user: User = {
          id: Date.now().toString(),
          username,
          email,
        };
        
        // Set cookies for session management
        setCookie('nuzlocke_session', 'authenticated', { maxAge: 60 * 60 * 24 * 7 }); // 7 days
        setCookie('nuzlocke_user', JSON.stringify(user), { maxAge: 60 * 60 * 24 * 7 });
        
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    }
  };

  const signOut = () => {
    deleteCookie('nuzlocke_session');
    deleteCookie('nuzlocke_user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
