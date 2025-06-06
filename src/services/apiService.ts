
// Updated API service for your charity's AWS Gateway integration
import { Auth } from './auth';

// Your charity's AWS Service Configuration
export const AWS_CONFIG = {
  API_GATEWAY_URL: 'https://ve4jnzoz45.execute-api.eu-west-2.amazonaws.com/prod',
  REGION: 'eu-west-2',
  COGNITO: {
    USER_POOL_ID: 'eu-west-2_kQrUuZhh9',
    CLIENT_ID: '5uasj2k09h4mlfqj6btopne207',
    AUTHORIZER_ID: 'o87uiv'
  },
  DYNAMODB: {
    PROJECTS_TABLE: 'ServerlessVolunteerAppStack-projects9614A9BB-1R56LYOCSM788',
    TABLE_PREFIX: 'ServerlessVolunteerAppStack-'
  },
  SNS: {
    TOPIC_PREFIX: 'charity-volunteer-'
  }
};

// External API configurations for integrations
export const EXTERNAL_APIS = {
  JIRA: {
    BASE_URL: 'https://your-org.atlassian.net',
    PROJECT_KEY: 'VOL'
  },
  HUBSPOT: {
    BASE_URL: 'https://api.hubapi.com',
    PORTAL_ID: 'your-portal-id'
  }
};

export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

export const ApiService = {
  // API call function that integrates with your charity's AWS API Gateway
  callApi: async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    const { method = 'GET', body, headers = {}, requiresAuth = true } = options;
    
    let authHeaders = {};
    
    // Add Authorization header with Cognito JWT token
    if (requiresAuth) {
      try {
        const token = await Auth.getCurrentSession();
        authHeaders = {
          'Authorization': `Bearer ${token}`,
          'X-Amz-Security-Token': token // Additional header for AWS API Gateway
        };
      } catch (error) {
        console.error('Error getting authentication token:', error);
        throw new Error('Authentication required to access this resource');
      }
    }
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    try {
      console.log(`Making API call to: ${AWS_CONFIG.API_GATEWAY_URL}${endpoint}`);
      
      const response = await fetch(`${AWS_CONFIG.API_GATEWAY_URL}${endpoint}`, {
        method,
        headers: { ...defaultHeaders, ...authHeaders, ...headers },
        body: body ? JSON.stringify(body) : undefined
      });
      
      console.log(`API Response Status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error Response:', errorData);
        throw new Error(
          errorData?.message || 
          errorData?.error || 
          `API request failed with status ${response.status}`
        );
      }
      
      const responseData = await response.json();
      console.log('API Response Data:', responseData);
      return responseData;
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
  },

  // Charity-specific API endpoints
  charity: {
    // Volunteer management endpoints
    getVolunteers: (): Promise<any[]> => ApiService.get('/volunteers'),
    getVolunteer: (id: string): Promise<any> => ApiService.get(`/volunteers/${id}`),
    createVolunteer: (data: any): Promise<any> => ApiService.post('/volunteers', data),
    updateVolunteer: (id: string, data: any): Promise<any> => ApiService.put(`/volunteers/${id}`, data),
    
    // Event registration endpoints
    getEvents: (): Promise<any[]> => ApiService.get('/events'),
    getEvent: (id: string): Promise<any> => ApiService.get(`/events/${id}`),
    registerForEvent: (eventId: string, volunteerId: string): Promise<any> => 
      ApiService.post(`/events/${eventId}/register`, { volunteerId }),
    
    // User roles and permissions
    getUserRoles: (): Promise<string[]> => ApiService.get('/user/roles'),
    updateUserRoles: (roles: string[]): Promise<any> => ApiService.put('/user/roles', { roles }),
    getAvailableRoles: (): Promise<any[]> => ApiService.get('/roles'),
    
    // Projects (using your DynamoDB table)
    getProjects: (): Promise<any[]> => ApiService.get('/projects'),
    getProject: (id: string): Promise<any> => ApiService.get(`/projects/${id}`),
    createProject: (data: any): Promise<any> => ApiService.post('/projects', data),
    updateProject: (id: string, data: any): Promise<any> => ApiService.put(`/projects/${id}`, data),
    deleteProject: (id: string): Promise<any> => ApiService.delete(`/projects/${id}`),
  }
};
