// AWS Cognito Authentication Service for your charity backend
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

import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession, confirmSignUp, resendSignUpCode, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { getCognitoConfig, initializeCharityBackend } from './cognitoConfig';

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
  
  // Initialize with your charity's backend configuration
  initialize: () => {
    initializeCharityBackend();
  },
  
  // Sign in with username/email and password using your Cognito setup
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
    
    // Use your charity's Cognito authentication
    try {
      console.log("Attempting Cognito sign in with your charity backend");

      // Sign out any existing user first
      try {
        await signOut();
        console.log("Successfully signed out existing user");
      } catch (signOutError) {
        console.log("No existing user to sign out (this is normal)");
      }

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
        
        console.log("Successfully signed in to charity backend:", user);
        return user;
      } else {
        throw new Error(`Sign in incomplete. Next step: ${nextStep.signInStep}`);
      }
    } catch (error) {
      console.error("Charity Cognito sign in failed:", error);
      
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        
        // Handle specific Cognito errors
        if (error.message.includes('SECRET_HASH')) {
          throw new Error("Cognito configuration error: Client secret detected. Please configure your app client without a secret for web applications.");
        }
        
        if (error.message.includes('NotAuthorizedException')) {
          throw new Error("Invalid credentials. Please check your email and password.");
        }
        
        if (error.message.includes('UserNotFoundException')) {
          throw new Error("User not found. Please check your email or sign up first.");
        }
        
        if (error.message.includes('UserNotConfirmedException')) {
          throw new Error("Please verify your email address before signing in.");
        }
      }
      
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
      console.log("🚀 Starting Cognito signup process...");
      console.log("📋 Configuration being used:", {
        region: config.region,
        userPoolId: config.userPoolId,
        userPoolWebClientId: config.userPoolWebClientId
      });
      
      // Use email as the Cognito username so you can find the user in the console and log in with email
      const usernameForCognito = credentials.username;
      
      console.log("📝 Signup parameters:", {
        username: usernameForCognito,
        email: credentials.email,
        name: credentials.name || credentials.username.split('@')[0] || 'Demo User'
      });

      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: usernameForCognito,
        password: credentials.password,
        options: {
          userAttributes: {
            email: credentials.email,
            name: credentials.name || credentials.username.split('@')[0] || 'Demo User',
            ...credentials.attributes
          }
        }
      });

      console.log("✅ Signup request completed successfully:", {
        isSignUpComplete,
        userId,
        nextStep: nextStep?.signUpStep,
        usernameUsed: usernameForCognito
      });

      if (isSignUpComplete) {
        // Auto sign in after successful signup
        return await Auth.signIn({
          username: credentials.username,
          password: credentials.password
        });
      } else {
        // Store the username for verification
        localStorage.setItem('temp_cognito_username', usernameForCognito);
        localStorage.setItem('temp_cognito_email', credentials.email);
        
        // Handle confirmation required
        throw new Error(`Registration requires confirmation. Next step: ${nextStep.signUpStep}`);
      }
    } catch (error) {
      console.error("❌ Cognito sign up failed with detailed error:", error);
      
      // Enhanced error logging for debugging
      if (error instanceof Error) {
        console.error("📄 Error Details:");
        console.error("   Message:", error.message);
        console.error("   Name:", error.name);
        console.error("   Stack:", error.stack);
        
        // Check for specific Cognito errors
        if (error.message.includes('SECRET_HASH')) {
          console.error("❌ SECRET_HASH error detected during signup. Your Cognito app client is configured with a client secret.");
          console.error("🔧 To fix this: Go to AWS Cognito Console → User Pools → App clients → Edit your app client → Uncheck 'Generate client secret'");
          throw new Error("Cognito configuration error: Client secret detected. Please configure your app client without a secret for web applications.");
        }
        
        if (error.message.includes('UsernameExistsException')) {
          throw new Error("An account with this email already exists. Please try signing in instead.");
        }
        
        if (error.message.includes('InvalidPasswordException')) {
          throw new Error("Password does not meet requirements. Please choose a stronger password.");
        }
        
        if (error.message.includes('InvalidParameterException')) {
          console.error("🔧 Invalid Parameter Error Details:");
          console.error("   → Check User Pool attribute requirements");
          console.error("   → Verify email format is valid");
          console.error("   → Check if username requirements are met");
          throw new Error("Invalid parameters. Check email format and User Pool requirements.");
        }
        
        if (error.message.includes('ResourceNotFoundException')) {
          console.error("🔧 Resource Not Found Error:");
          console.error("   → Verify User Pool ID is correct");
          console.error("   → Check if User Pool exists in the specified region");
          console.error("   → Confirm the region setting matches your AWS setup");
          throw new Error("User Pool not found. Please verify your configuration.");
        }
      }
      
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

// Initialize the charity backend on module load
Auth.initialize();
