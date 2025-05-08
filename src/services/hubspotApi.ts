
// Integration with HubSpot for CRM
import { ApiService, EXTERNAL_APIS } from './apiService';

export const HubSpotApi = {
  // Get user profile from HubSpot
  getUserProfile: (userId: string) => 
    ApiService.get(`/hubspot/contacts`, {
      headers: {
        'X-User-Id': userId,
        'X-HubSpot-Portal-Id': EXTERNAL_APIS.HUBSPOT.PORTAL_ID
      }
    }),
    
  // Update user profile in HubSpot
  updateUserProfile: (userId: string, profileData: any) =>
    ApiService.put(`/hubspot/contacts`, {
      userId,
      ...profileData,
      hubspotBaseUrl: EXTERNAL_APIS.HUBSPOT.BASE_URL,
      portalId: EXTERNAL_APIS.HUBSPOT.PORTAL_ID
    }),
    
  // Track user engagement with the platform
  trackEngagement: (userId: string, activityType: string, details?: any) =>
    ApiService.post(`/hubspot/engagement`, {
      userId,
      activityType,
      details,
      timestamp: new Date().toISOString(),
      hubspotBaseUrl: EXTERNAL_APIS.HUBSPOT.BASE_URL,
      portalId: EXTERNAL_APIS.HUBSPOT.PORTAL_ID
    }),
    
  // Create a new contact in HubSpot
  createContact: (userData: any) =>
    ApiService.post(`/hubspot/contacts`, {
      ...userData,
      hubspotBaseUrl: EXTERNAL_APIS.HUBSPOT.BASE_URL,
      portalId: EXTERNAL_APIS.HUBSPOT.PORTAL_ID
    })
};
