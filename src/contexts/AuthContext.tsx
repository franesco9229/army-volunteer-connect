
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth as useOIDCAuth } from 'react-oidc-context';
import { OIDCAuthService } from '@/services/oidcAuthService';

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
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  updateUserAttributes: (attributes: Record<string, string>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const oidcAuth = useOIDCAuth();

  const user = oidcAuth.user ? OIDCAuthService.convertOIDCUserToAuthUser(oidcAuth.user) : null;
  const isAuthenticated = oidcAuth.isAuthenticated;
  const isLoading = oidcAuth.isLoading;
  const isAdmin = !!user?.groups?.includes('admins');

  const signIn = async () => {
    await oidcAuth.signinRedirect();
  };

  const signUp = async () => {
    // For OIDC, signup typically redirects to the same signin flow
    // where users can choose to sign up on the Cognito hosted UI
    await oidcAuth.signinRedirect();
  };

  const signOut = async () => {
    // Use the OIDC context's removeUser method
    await oidcAuth.removeUser();
  };
  
  const forgotPassword = async (email: string) => {
    console.log('Forgot password for:', email);
    // This would typically redirect to Cognito's forgot password flow
  };
  
  const resetPassword = async (email: string, code: string, newPassword: string) => {
    console.log('Reset password for:', email);
    // This would typically be handled by Cognito's hosted UI
  };
  
  const updateUserAttributes = async (attributes: Record<string, string>) => {
    console.log('Update attributes:', attributes);
    // This would typically require API calls to Cognito
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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
