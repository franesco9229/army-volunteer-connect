
// Generic API service for AWS Gateway integration
import { Auth } from './auth';

// Base configuration for AWS services
export const API_GATEWAY_URL = process.env.REACT_APP_API_GATEWAY_URL || 'https://api.example.com';
export const REGION = process.env.REACT_APP_AWS_REGION || 'eu-west-2';

export interface ApiOptions {
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
