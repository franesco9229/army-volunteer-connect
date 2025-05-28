
import { apiClient, GenericApiClient } from './genericApiClient';

// Modern API service that uses the generic client
export class ModernApiService {
  private client: GenericApiClient;

  constructor() {
    this.client = apiClient;
  }

  // Volunteering API methods
  async getOpportunities(filters?: any) {
    return this.client.get('/opportunities', filters ? { 'X-Filter-Params': JSON.stringify(filters) } : {});
  }

  async applyForOpportunity(opportunityId: string, userId: string, additionalData?: any) {
    return this.client.post('/register-interest', { 
      opportunityId, 
      userId,
      ...additionalData,
      metadata: {
        source: 'web-platform',
        timestamp: new Date().toISOString()
      }
    });
  }

  async getUserApplications(userId: string) {
    return this.client.get(`/applications/${userId}`);
  }

  async getUserVolunteeringRecords(userId: string) {
    return this.client.get(`/volunteering-records/${userId}`);
  }

  async updateVolunteeringHours(recordId: string, hoursData: any) {
    return this.client.post('/update-volunteering-record', {
      recordId,
      ...hoursData,
      timestamp: new Date().toISOString()
    });
  }

  async getUserSkills(userId: string) {
    return this.client.get(`/skills/${userId}`);
  }

  async updateUserSkills(userId: string, skills: any[]) {
    return this.client.post('/update-skills', {
      userId,
      skills,
      timestamp: new Date().toISOString()
    });
  }

  // Notification methods
  async subscribeToTopic(userId: string, topic: string, endpoint: string) {
    return this.client.post('/notifications/subscribe', {
      userId,
      topic,
      endpoint
    });
  }

  async getUserSubscriptions(userId: string) {
    return this.client.get(`/notifications/users/${userId}/subscriptions`);
  }

  async sendNotification(userId: string, message: string, subject: string) {
    return this.client.post('/notifications/send', {
      userId,
      message,
      subject
    });
  }

  // User management
  async getUserProfile(userId: string) {
    return this.client.get(`/users/${userId}`);
  }

  async updateUserProfile(userId: string, profileData: any) {
    return this.client.put(`/users/${userId}`, profileData);
  }

  // Generic methods for custom endpoints
  async customGet<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.client.get<T>(endpoint, headers);
  }

  async customPost<T = any>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.client.post<T>(endpoint, body, headers);
  }

  async customPut<T = any>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.client.put<T>(endpoint, body, headers);
  }

  async customDelete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.client.delete<T>(endpoint, headers);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.testConnection();
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Configuration management
  isConfigured(): boolean {
    try {
      const config = this.client.getConfiguration();
      return !!(config.apiUrl && config.apiKey);
    } catch (error) {
      return false;
    }
  }

  getConfiguration() {
    return this.client.getConfiguration();
  }
}

// Export singleton instance
export const modernApi = new ModernApiService();

// Export class for custom instances
export default ModernApiService;
