
// Integration with AWS API Gateway, Lambda, DynamoDB and related services
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
  },
  
  // WebSockets for real-time updates
  connectWebSocket: (url: string, onMessage: (data: any) => void) => {
    const socket = new WebSocket(url);
    
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
    return {
      send: (data: any) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(data));
        } else {
          console.error('WebSocket is not open');
        }
      },
      close: () => socket.close()
    };
  }
};

// AWS API endpoints based on provided specifications
export const VolunteeringApi = {
  // Get all available opportunities
  getOpportunities: (filters?: any) => 
    ApiService.get('/opportunities', { 
      requiresAuth: false, // Allow unauthenticated users to browse opportunities
      headers: filters ? { 'X-Filter-Params': JSON.stringify(filters) } : {}
    }),
  
  // Apply for a specific opportunity (register interest)
  applyForOpportunity: (opportunityId: string, userId: string, additionalData?: any) => 
    ApiService.post('/register-interest', { 
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
    ApiService.get(`/applications/${userId}`),
    
  // Get volunteering records for a user
  getUserVolunteeringRecords: (userId: string) => 
    ApiService.get(`/volunteering-records/${userId}`),
    
  // Get registered opportunities for a user
  getUserRegisteredOpportunities: (userId: string) => 
    ApiService.get(`/registered-opportunities/${userId}`),
    
  // Update volunteering hours
  updateVolunteeringHours: (recordId: string, hoursData: any) => 
    ApiService.post(`/update-volunteering-record`, {
      recordId,
      ...hoursData,
      timestamp: new Date().toISOString()
    }),
    
  // Update user skills
  updateUserSkills: (userId: string, skills: any[]) => 
    ApiService.post(`/update-skills`, {
      userId,
      skills,
      timestamp: new Date().toISOString()
    })
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
    }),
    
  // Create a new Jira issue for a volunteer
  createJiraTicket: (opportunityId: string, userId: string) =>
    ApiService.post(`/jira/tasks`, {
      opportunityId,
      userId,
      timestamp: new Date().toISOString()
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
    }),
    
  // Create a new contact in HubSpot
  createContact: (userData: any) =>
    ApiService.post(`/hubspot/contacts`, userData)
};

// AWS SNS Notification Service
export const NotificationApi = {
  // Subscribe a user to a topic
  subscribeToTopic: (userId: string, topic: string, endpoint: string) =>
    ApiService.post(`/notifications/subscribe`, {
      userId,
      topic,
      endpoint
    }),
    
  // Unsubscribe a user from a topic
  unsubscribeFromTopic: (subscriptionArn: string) =>
    ApiService.delete(`/notifications/subscriptions/${subscriptionArn}`),
    
  // Get all subscriptions for a user
  getUserSubscriptions: (userId: string) =>
    ApiService.get(`/notifications/users/${userId}/subscriptions`),
    
  // Send a notification to a specific user
  sendNotification: (userId: string, message: string, subject: string) =>
    ApiService.post(`/notifications/send`, {
      userId,
      message,
      subject
    })
};
