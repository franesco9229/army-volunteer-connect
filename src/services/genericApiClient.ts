
interface ApiCredentials {
  apiUrl: string;
  apiKey: string;
  region?: string;
  authType: 'bearer' | 'api-key' | 'aws-signature';
  additionalHeaders?: Record<string, string>;
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

export class GenericApiClient {
  private credentials: ApiCredentials;
  private baseUrl: string;

  constructor(credentials?: ApiCredentials) {
    this.credentials = credentials || this.loadCredentials();
    this.baseUrl = this.credentials.apiUrl?.replace(/\/$/, '') || '';
  }

  private loadCredentials(): ApiCredentials {
    const activeBackend = localStorage.getItem('active_backend') || 'aws';
    const savedCredentials = localStorage.getItem(`api_credentials_${activeBackend}`);
    
    if (savedCredentials) {
      return JSON.parse(savedCredentials);
    }
    
    throw new Error('No API credentials configured. Please set up your backend connection in Settings > API.');
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    switch (this.credentials.authType) {
      case 'bearer':
        headers['Authorization'] = `Bearer ${this.credentials.apiKey}`;
        break;
      case 'api-key':
        headers['X-API-Key'] = this.credentials.apiKey;
        break;
      case 'aws-signature':
        // For AWS, we'll use the API key in Authorization header
        // In production, this would be replaced with proper AWS signature
        headers['Authorization'] = `AWS4-HMAC-SHA256 ${this.credentials.apiKey}`;
        if (this.credentials.region) {
          headers['X-Amz-Region'] = this.credentials.region;
        }
        break;
    }

    return headers;
  }

  async request<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const {
      method = 'GET',
      body,
      headers = {},
      timeout = 10000
    } = options;

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    const authHeaders = this.getAuthHeaders();
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...authHeaders,
      ...this.credentials.additionalHeaders,
      ...headers
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: defaultHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`API request failed (${response.status}): ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text() as any;
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
      }
      throw new Error('An unknown error occurred');
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  async post<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, headers });
  }

  async put<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  async patch<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, headers });
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    try {
      // Try a simple health check endpoint
      await this.get('/health');
      return true;
    } catch (error) {
      // If /health doesn't exist, try the root endpoint
      try {
        await this.get('/');
        return true;
      } catch (rootError) {
        throw new Error(`Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  // Update credentials
  updateCredentials(newCredentials: ApiCredentials): void {
    this.credentials = newCredentials;
    this.baseUrl = newCredentials.apiUrl?.replace(/\/$/, '') || '';
  }

  // Get current configuration
  getConfiguration(): ApiCredentials {
    return { ...this.credentials };
  }
}

// Create a singleton instance
export const apiClient = new GenericApiClient();

// Export for backward compatibility and specific use cases
export default apiClient;
