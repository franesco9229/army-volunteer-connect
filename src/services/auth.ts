// AWS Cognito Authentication Service
// This would be replaced with actual AWS Amplify/Cognito SDK in production

interface AuthUser {
  id: string;
  username: string;
  email: string;
  name?: string;
  attributes?: Record<string, string>;
  groups?: string[];
  isAdmin?: boolean;
}

interface SignInCredentials {
  username: string;
  password: string;
}

interface SignUpCredentials {
  username: string;
  password: string;
  email: string;
  name?: string;
  attributes?: Record<string, string>;
}

import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { getCognitoConfig } from './cognitoConfig';

// Mock users for demo purposes
const MOCK_USERS = [
  {
    username: 'demo@example.com',
    password: 'demo123',
    user: {
      id: 'mock-user-1',
      username: 'demo@example.com',
      email: 'demo@example.com',
      name: 'Demo User',
      groups: ['users'],
      isAdmin: false
    }
  },
  {
    username: 'admin@example.com',
    password: 'admin123',
    user: {
      id: 'mock-admin-1',
      username: 'admin@example.com',
      email: 'admin@example.com',
      name: 'Admin User',
      groups: ['admins'],
      isAdmin: true
    }
  }
];

export const Auth = {
  // Current authenticated user
  currentUser: null as AuthUser | null,
  currentSession: null as string | null,
  
  // Sign in with username/email and password using AWS Cognito or Mock
  signIn: async (credentials: SignInCredentials): Promise<AuthUser> => {
    console.log("Attempting sign in:", credentials);
    
    const config = getCognitoConfig();
    
    // If no Cognito config, use mock authentication
    if (!config) {
      console.log("No Cognito config found, using mock authentication");
      
      // Accept any email/password combination for mock login
      const mockUser: AuthUser = {
        id: `mock-user-${Date.now()}`,
        username: credentials.username,
        email: credentials.username,
        name: credentials.username.split('@')[0] || 'Demo User',
        groups: ['users'],
        isAdmin: false
      };
      
      Auth.currentUser = mockUser;
      Auth.currentSession = 'mock-session-token';
      localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
      return mockUser;
    }
    
    // Use real Cognito authentication
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: credentials.username,
        password: credentials.password,
      });

      if (isSignedIn) {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        
        const user: AuthUser = {
          id: currentUser.userId,
          username: currentUser.username,
          email: currentUser.signInDetails?.loginId || '',
          name: currentUser.username,
          groups: (session.tokens?.accessToken?.payload['cognito:groups'] as string[]) || [],
          isAdmin: ((session.tokens?.accessToken?.payload['cognito:groups'] as string[]) || []).includes('admins')
        };
        
        Auth.currentUser = user;
        Auth.currentSession = session.tokens?.idToken?.toString() || null;
        
        return user;
      } else {
        throw new Error(`Sign in incomplete. Next step: ${nextStep.signInStep}`);
      }
    } catch (error) {
      console.error("Cognito sign in failed:", error);
      throw new Error(error instanceof Error ? error.message : "Authentication failed. Please check your credentials.");
    }
  },
  
  // Register a new user with AWS Cognito or Mock
  signUp: async (credentials: SignUpCredentials): Promise<AuthUser> => {
    console.log("Attempting sign up:", credentials);
    
    const config = getCognitoConfig();
    
    // If no Cognito config, use mock authentication
    if (!config) {
      console.log("No Cognito config found, using mock sign up");
      const newUser: AuthUser = {
        id: `mock-user-${Date.now()}`,
        username: credentials.username,
        email: credentials.email,
        name: credentials.name || credentials.username.split('@')[0] || 'Demo User',
        groups: ['users'],
        isAdmin: false
      };
      
      Auth.currentUser = newUser;
      Auth.currentSession = 'mock-session-token';
      localStorage.setItem('mock_auth_user', JSON.stringify(newUser));
      return newUser;
    }
    
    // Use real Cognito sign up
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: credentials.username,
        password: credentials.password,
        options: {
          userAttributes: {
            email: credentials.email,
            name: credentials.name || credentials.username.split('@')[0] || 'Demo User',
            ...credentials.attributes
          }
        }
      });

      if (isSignUpComplete) {
        // Auto sign in after successful signup
        return await Auth.signIn({
          username: credentials.username,
          password: credentials.password
        });
      } else {
        // Handle confirmation required
        throw new Error(`Registration requires confirmation. Next step: ${nextStep.signUpStep}`);
      }
    } catch (error) {
      console.error("Cognito sign up failed:", error);
      throw new Error(error instanceof Error ? error.message : "Registration failed. Please try again.");
    }
  },
  
  // Sign out current user from Cognito or Mock
  signOut: async (): Promise<void> => {
    console.log("Signing out");
    
    const config = getCognitoConfig();
    
    if (!config) {
      // Mock sign out
      localStorage.removeItem('mock_auth_user');
      Auth.currentUser = null;
      Auth.currentSession = null;
      return;
    }
    
    try {
      await signOut();
      Auth.currentUser = null;
      Auth.currentSession = null;
    } catch (error) {
      console.error("Cognito sign out failed:", error);
      throw error;
    }
  },
  
  // Check if user is authenticated with Cognito or Mock
  isAuthenticated: async (): Promise<boolean> => {
    const config = getCognitoConfig();
    
    if (!config) {
      // Check mock authentication
      const mockUser = localStorage.getItem('mock_auth_user');
      return !!mockUser;
    }
    
    try {
      const currentUser = await getCurrentUser();
      return !!currentUser;
    } catch (error) {
      return false;
    }
  },
  
  // Get current authenticated user from Cognito or Mock
  getCurrentUser: async (): Promise<AuthUser | null> => {
    const config = getCognitoConfig();
    
    if (!config) {
      // Get mock user
      const mockUserData = localStorage.getItem('mock_auth_user');
      if (mockUserData) {
        const user = JSON.parse(mockUserData);
        Auth.currentUser = user;
        Auth.currentSession = 'mock-session-token';
        return user;
      }
      return null;
    }
    
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      const user: AuthUser = {
        id: currentUser.userId,
        username: currentUser.username,
        email: currentUser.signInDetails?.loginId || '',
        name: currentUser.username,
        groups: (session.tokens?.accessToken?.payload['cognito:groups'] as string[]) || [],
        isAdmin: ((session.tokens?.accessToken?.payload['cognito:groups'] as string[]) || []).includes('admins')
      };
      
      Auth.currentUser = user;
      Auth.currentSession = session.tokens?.idToken?.toString() || null;
      
      return user;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },
  
  // Get current session JWT token
  getCurrentSession: async (): Promise<string | null> => {
    try {
      // This would be replaced with actual Cognito token fetch
      // Using AWS Amplify Auth.currentSession() or similar
      return Auth.currentSession;
    } catch (error) {
      console.error("Error getting current session:", error);
      throw new Error("No active session found");
    }
  },
  
  // Forgot password flow with Cognito
  forgotPassword: async (email: string): Promise<void> => {
    try {
      // This would be replaced with actual Cognito forgot password
      // Using AWS Amplify Auth.forgotPassword() or similar
      console.log("Sending password reset for:", email);
    } catch (error) {
      console.error("Forgot password failed:", error);
      throw error;
    }
  },
  
  // Reset password with verification code from Cognito
  resetPassword: async (email: string, code: string, newPassword: string): Promise<void> => {
    try {
      // This would be replaced with actual Cognito password reset
      // Using AWS Amplify Auth.forgotPasswordSubmit() or similar
      console.log("Resetting password for:", email);
    } catch (error) {
      console.error("Reset password failed:", error);
      throw error;
    }
  },
  
  // Update user attributes in Cognito
  updateUserAttributes: async (attributes: Record<string, string>): Promise<void> => {
    try {
      // This would be replaced with actual Cognito attribute update
      // Using AWS Amplify Auth.updateUserAttributes() or similar
      console.log("Updating user attributes:", attributes);
    } catch (error) {
      console.error("Update attributes failed:", error);
      throw error;
    }
  }
};
