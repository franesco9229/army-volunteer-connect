
// Integration with HubSpot for CRM
import { ApiService } from './apiService';

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
