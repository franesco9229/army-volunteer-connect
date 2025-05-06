
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Auth } from '@/services/auth';

interface AuthUser {
  id: string;
  username: string;
  email: string;
  name?: string;
  attributes?: Record<string, string>;
  groups?: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, email: string, name?: string, attributes?: Record<string, string>) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  updateUserAttributes: (attributes: Record<string, string>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const checkAuth = async () => {
      try {
        const isAuthenticated = await Auth.isAuthenticated();
        if (isAuthenticated) {
          const currentUser = await Auth.getCurrentUser();
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
      const user = await Auth.signIn({ username, password });
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (username: string, password: string, email: string, name?: string, attributes?: Record<string, string>) => {
    setIsLoading(true);
    try {
      const user = await Auth.signUp({ username, password, email, name, attributes });
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await Auth.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await Auth.forgotPassword(email);
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPassword = async (email: string, code: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await Auth.resetPassword(email, code, newPassword);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUserAttributes = async (attributes: Record<string, string>) => {
    setIsLoading(true);
    try {
      await Auth.updateUserAttributes(attributes);
      // Update local user state with new attributes
      if (user) {
        setUser({
          ...user,
          attributes: { ...user.attributes, ...attributes }
        });
      }
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
        signOut,
        forgotPassword,
        resetPassword,
        updateUserAttributes
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
