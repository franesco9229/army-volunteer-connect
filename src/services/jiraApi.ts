
// Integration with Jira for volunteer assignments
import { ApiService } from './apiService';

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
