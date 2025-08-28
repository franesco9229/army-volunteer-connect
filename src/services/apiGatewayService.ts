import { getCognitoConfig } from './cognitoConfig';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
}

interface VolunteerAccount {
  id: string;
  email: string;
  name: string;
  skills?: string[];
  roles?: string[];
  availability?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Export for backward compatibility
export const GraphQLService = class ProjectApiService {
  private static readonly API_GATEWAY_ENDPOINT = 'https://0x1xt3auh4.execute-api.us-west-2.amazonaws.com/dev';

  private static async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      // Check if we have Cognito config
      const config = getCognitoConfig();
      
      if (!config) {
        throw new Error('No Cognito configuration found. Please configure AWS Cognito first.');
      }

      // Get current user to verify authentication
      const currentUser = await getCurrentUser();
      console.log('Current user:', currentUser);

      // Get the auth session with tokens
      const session = await fetchAuthSession();
      console.log('Session details:', {
        hasIdToken: !!session.tokens?.idToken,
        hasAccessToken: !!session.tokens?.accessToken,
        tokenPreview: session.tokens?.idToken?.toString().substring(0, 50) + '...'
      });

      // API Gateway expects Bearer token format
      const idToken = session.tokens?.idToken?.toString();
      const accessToken = session.tokens?.accessToken?.toString();

      if (!idToken && !accessToken) {
        throw new Error('No valid authentication tokens found');
      }

      // Use ID token for API Gateway authorization
      const authToken = idToken || accessToken;

      return {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    } catch (error) {
      console.error('Error getting auth headers:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not authenticated') || error.message.includes('No current user')) {
          throw new Error('Please sign in to access this feature');
        }
      }
      
      throw new Error('Authentication required to access API');
    }
  }

  private static async request<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    try {
      const headers = await GraphQLService.getAuthHeaders();
      
      const url = `${GraphQLService.API_GATEWAY_ENDPOINT}${endpoint}`;

      console.log('Making API request:', {
        url,
        method,
        body,
        authHeaderPreview: headers.Authorization?.substring(0, 50) + '...'
      });

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP error response:', errorText);
        
        if (response.status === 401) {
          throw new Error('Authentication failed. Please sign in again.');
        }
        
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result = await response.json();
      
      console.log('API response received:', result);

      return result;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async listProjects(): Promise<Project[]> {
    try {
      console.log('Attempting to list projects...');
      const response = await GraphQLService.request<Project[]>('/projects', 'GET');
      console.log('Successfully received projects:', response?.length || 0);
      return response || [];
    } catch (error) {
      console.error('Failed to list projects:', error);
      throw new Error('Failed to fetch projects. Please try again or contact support if the issue persists.');
    }
  }

  static async createProject(name: string, description?: string): Promise<Project> {
    const projectData = {
      name,
      description
    };

    try {
      const response = await GraphQLService.request<Project>(
        '/projects', 
        'POST',
        projectData
      );
      return response;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw new Error('Failed to create project. Please try again.');
    }
  }

  static async updateProject(id: string, name?: string, description?: string): Promise<Project> {
    const projectData = {
      name,
      description
    };

    try {
      const response = await GraphQLService.request<Project>(
        `/projects/${id}`, 
        'PUT',
        projectData
      );
      return response;
    } catch (error) {
      console.error('Failed to update project:', error);
      throw new Error('Failed to update project. Please try again.');
    }
  }

  static async deleteProject(id: string): Promise<boolean> {
    try {
      await GraphQLService.request<void>(
        `/projects/${id}`, 
        'DELETE'
      );
      return true;
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw new Error('Failed to delete project. Please try again.');
    }
  }

  static async getProject(id: string): Promise<Project | null> {
    try {
      const response = await GraphQLService.request<Project>(
        `/projects/${id}`, 
        'GET'
      );
      return response || null;
    } catch (error) {
      console.error('Failed to get project:', error);
      throw new Error('Failed to fetch project. Please try again.');
    }
  }

  // Volunteer Account Management
  static async listVolunteers(): Promise<VolunteerAccount[]> {
    try {
      console.log('Attempting to list volunteers...');
      const response = await GraphQLService.request<VolunteerAccount[]>('/volunteers', 'GET');
      console.log('Successfully received volunteers:', response?.length || 0);
      return response || [];
    } catch (error) {
      console.error('Failed to list volunteers:', error);
      throw new Error('Failed to fetch volunteers. Please try again or contact support if the issue persists.');
    }
  }

  static async getVolunteer(id: string): Promise<VolunteerAccount | null> {
    try {
      const response = await GraphQLService.request<VolunteerAccount>(
        `/volunteers/${id}`, 
        'GET'
      );
      return response || null;
    } catch (error) {
      console.error('Failed to get volunteer:', error);
      throw new Error('Failed to fetch volunteer. Please try again.');
    }
  }

  static async createVolunteer(volunteerData: Partial<VolunteerAccount>): Promise<VolunteerAccount> {
    try {
      const response = await GraphQLService.request<VolunteerAccount>(
        '/volunteers', 
        'POST',
        volunteerData
      );
      return response;
    } catch (error) {
      console.error('Failed to create volunteer:', error);
      throw new Error('Failed to create volunteer. Please try again.');
    }
  }

  static async updateVolunteer(id: string, volunteerData: Partial<VolunteerAccount>): Promise<VolunteerAccount> {
    try {
      const response = await GraphQLService.request<VolunteerAccount>(
        `/volunteers/${id}`, 
        'PUT',
        volunteerData
      );
      return response;
    } catch (error) {
      console.error('Failed to update volunteer:', error);
      throw new Error('Failed to update volunteer. Please try again.');
    }
  }

  static async deleteVolunteer(id: string): Promise<boolean> {
    try {
      await GraphQLService.request<void>(
        `/volunteers/${id}`, 
        'DELETE'
      );
      return true;
    } catch (error) {
      console.error('Failed to delete volunteer:', error);
      throw new Error('Failed to delete volunteer. Please try again.');
    }
  }
}

export type { Project, VolunteerAccount };
