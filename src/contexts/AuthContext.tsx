
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService } from '@/services/auth';

interface AuthUser {
  id: string;
  username: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, email: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const checkAuth = async () => {
      try {
        const isAuthenticated = await AuthService.isAuthenticated();
        if (isAuthenticated) {
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await AuthService.signIn({ username, password });
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (username: string, password: string, email: string, name?: string) => {
    setIsLoading(true);
    try {
      const user = await AuthService.signUp({ username, password, email, name });
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await AuthService.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut
      }}
    >
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
