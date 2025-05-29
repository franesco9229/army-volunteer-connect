import { Auth } from './auth';
import { AuthUser } from '@/contexts/AuthContext';

export class AuthService {
  static async signIn(username: string, password: string): Promise<AuthUser> {
    try {
      console.log('Signing in with credentials:', { username });
      
      // Check for mock login credentials
      if (username === 'MOCK_USER' && password === 'MOCK_PASSWORD') {
        // Force mock authentication
        const mockUser: AuthUser = {
          id: `mock-user-${Date.now()}`,
          username: 'demo@example.com',
          email: 'demo@example.com',
          name: 'Demo User',
          groups: ['users'],
          isAdmin: false
        };
        
        Auth.currentUser = mockUser;
        Auth.currentSession = 'mock-session-token';
        localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
        
        return mockUser;
      }
      
      const result = await Auth.signIn({ username, password });
      return result;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw new Error('Authentication failed. Please check your credentials.');
    }
  }

  static async signUp(username: string, password: string, email: string, name?: string, attributes?: Record<string, string>): Promise<AuthUser> {
    try {
      console.log('Signing up with credentials:', { username, email });
      const result = await Auth.signUp({ username, password, email, name, attributes });
      return result;
    } catch (error) {
      console.error('Sign up failed:', error);
      
      // If Cognito signup fails due to configuration issues, fall back to mock authentication
      if (error instanceof Error && (
        error.message.includes('SECRET_HASH') || 
        error.message.includes('Client') ||
        error.message.includes('configured with secret')
      )) {
        console.log('Cognito configuration issue detected, falling back to mock authentication');
        
        // Create mock user and auto-sign them in
        const mockUser: AuthUser = {
          id: `mock-user-${Date.now()}`,
          username: email,
          email: email,
          name: name || email.split('@')[0] || 'Demo User',
          groups: ['users'],
          isAdmin: false
        };
        
        Auth.currentUser = mockUser;
        Auth.currentSession = 'mock-session-token';
        localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
        
        return mockUser;
      }
      
      throw new Error('Registration failed. Please try again.');
    }
  }

  static async signOut(): Promise<void> {
    try {
      await Auth.signOut();
      console.log('Successfully signed out');
    } catch (error) {
      console.error('Sign out failed:', error);
      throw new Error('Failed to sign out. Please try again.');
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const isAuthenticated = await Auth.isAuthenticated();
      if (!isAuthenticated) return null;
      
      return await Auth.getCurrentUser();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      return await Auth.isAuthenticated();
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }
}
