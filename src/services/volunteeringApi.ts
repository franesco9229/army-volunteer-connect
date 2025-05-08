
// Integration with AWS API Gateway for volunteering opportunities
import { ApiService, AWS_CONFIG } from './apiService';

// DynamoDB table names
const TABLES = {
  OPPORTUNITIES: `${AWS_CONFIG.DYNAMODB.TABLE_PREFIX}opportunities`,
  APPLICATIONS: `${AWS_CONFIG.DYNAMODB.TABLE_PREFIX}applications`,
  VOLUNTEER_RECORDS: `${AWS_CONFIG.DYNAMODB.TABLE_PREFIX}volunteer-records`,
  USER_SKILLS: `${AWS_CONFIG.DYNAMODB.TABLE_PREFIX}user-skills`
};

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
        timestamp: new Date().toISOString(),
        tableName: TABLES.APPLICATIONS
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
      timestamp: new Date().toISOString(),
      tableName: TABLES.VOLUNTEER_RECORDS
    }),
    
  // Update user skills
  updateUserSkills: (userId: string, skills: any[]) => 
    ApiService.post(`/update-skills`, {
      userId,
      skills,
      timestamp: new Date().toISOString(),
      tableName: TABLES.USER_SKILLS
    })
};
