
// AWS SNS Notification Service
import { ApiService } from './apiService';

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
