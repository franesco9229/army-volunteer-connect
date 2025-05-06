
// Integration with AWS API Gateway and related services
import { Auth } from './auth';

// Base configuration for AWS services
const API_GATEWAY_URL = process.env.REACT_APP_API_GATEWAY_URL || 'https://api.example.com';
const REGION = process.env.REACT_APP_AWS_REGION || 'eu-west-2';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

export const ApiService = {
  // Generic API call function that integrates with AWS API Gateway
  callApi: async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    const { method = 'GET', body, headers = {}, requiresAuth = true } = options;
    
    let authHeaders = {};
    
    // Add Authorization header with Cognito JWT token if authentication is required
    if (requiresAuth) {
      try {
        const token = await Auth.getCurrentSession();
        authHeaders = {
          'Authorization': `Bearer ${token}`
        };
      } catch (error) {
        console.error('Error getting authentication token:', error);
        throw new Error('Authentication required to access this resource');
      }
    }
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    
    try {
      const response = await fetch(`${API_GATEWAY_URL}${endpoint}`, {
        method,
        headers: { ...defaultHeaders, ...authHeaders, ...headers },
        body: body ? JSON.stringify(body) : undefined
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `API request failed with status ${response.status}`
        );
      }
      
      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },
  
  // Convenient wrappers for common HTTP methods
  get: <T>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T> => {
    return ApiService.callApi<T>(endpoint, { ...options, method: 'GET' });
  },
  
  post: <T>(endpoint: string, body: any, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T> => {
    return ApiService.callApi<T>(endpoint, { ...options, method: 'POST', body });
  },
  
  put: <T>(endpoint: string, body: any, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T> => {
    return ApiService.callApi<T>(endpoint, { ...options, method: 'PUT', body });
  },
  
  delete: <T>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T> => {
    return ApiService.callApi<T>(endpoint, { ...options, method: 'DELETE' });
  }
};

// API endpoints for volunteering opportunities
export const VolunteeringApi = {
  // Get all available opportunities
  getOpportunities: (filters?: any) => 
    ApiService.get('/opportunities', { 
      requiresAuth: true,
      headers: filters ? { 'X-Filter-Params': JSON.stringify(filters) } : {}
    }),
  
  // Apply for a specific opportunity
  applyForOpportunity: (opportunityId: string, userId: string, additionalData?: any) => 
    ApiService.post('/applications', { 
      opportunityId, 
      userId,
      ...additionalData,
      metadata: {
        source: 'web-platform',
        timestamp: new Date().toISOString()
      }
    }),
  
  // Get applications for a specific user
  getUserApplications: (userId: string) => 
    ApiService.get(`/users/${userId}/applications`),
  
  // Get volunteering history for a specific user
  getUserVolunteeringHistory: (userId: string) => 
    ApiService.get(`/users/${userId}/history`)
};

// Integration with Jira for volunteer assignments
export const JiraApi = {
  // Get tasks assigned to a specific volunteer
  getAssignedTasks: (userId: string) => 
    ApiService.get(`/jira/tasks`, {
      headers: {
        'X-User-Id': userId
      }
    }),
    
  // Update task status in Jira
  updateTaskStatus: (taskId: string, status: string) =>
    ApiService.put(`/jira/tasks/${taskId}/status`, { status }),
    
  // Log time spent on a task
  logTimeSpent: (taskId: string, timeSpentSeconds: number, comment?: string) =>
    ApiService.post(`/jira/tasks/${taskId}/worklog`, {
      timeSpentSeconds,
      comment
    })
};

// Integration with HubSpot for CRM
export const HubSpotApi = {
  // Get user profile from HubSpot
  getUserProfile: (userId: string) => 
    ApiService.get(`/hubspot/contacts`, {
      headers: {
        'X-User-Id': userId
      }
    }),
    
  // Update user profile in HubSpot
  updateUserProfile: (userId: string, profileData: any) =>
    ApiService.put(`/hubspot/contacts`, {
      userId,
      ...profileData
    }),
    
  // Track user engagement with the platform
  trackEngagement: (userId: string, activityType: string, details?: any) =>
    ApiService.post(`/hubspot/engagement`, {
      userId,
      activityType,
      details,
      timestamp: new Date().toISOString()
    })
};
