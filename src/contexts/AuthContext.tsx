import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Auth } from '@/services/auth';
import { getCognitoConfig, configureCognito, initializeCharityBackend } from '@/services/cognitoConfig';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  name?: string;
  attributes?: Record<string, string>;
  groups?: string[];
  isAdmin?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
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
    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication with charity backend...');
        
        // Initialize charity backend configuration
        initializeCharityBackend();

        // Check for existing authentication
        const currentUser = await Auth.getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          console.log('User authenticated with charity backend:', currentUser);
        }
      } catch (error) {
        console.error('Error initializing authentication:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
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

  const isAdmin = !!user?.groups?.includes('admins') || !!user?.groups?.includes('admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin,
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
