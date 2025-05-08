
// AWS SNS Notification Service
import { ApiService, AWS_CONFIG } from './apiService';

const SNS_TOPICS = {
  DEFAULT: `${AWS_CONFIG.SNS.TOPIC_PREFIX}default`,
  OPPORTUNITIES: `${AWS_CONFIG.SNS.TOPIC_PREFIX}opportunities`,
  APPLICATIONS: `${AWS_CONFIG.SNS.TOPIC_PREFIX}applications`,
  ADMIN: `${AWS_CONFIG.SNS.TOPIC_PREFIX}admin`
};

export const NotificationApi = {
  // Subscribe a user to a topic
  subscribeToTopic: (userId: string, topic: string, endpoint: string) =>
    ApiService.post(`/notifications/subscribe`, {
      userId,
      topic,
      endpoint,
      topicArn: `arn:aws:sns:${AWS_CONFIG.REGION}:*:${topic}`
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
    }),
    
  // Send a notification to a topic
  sendTopicNotification: (topic: string, message: string, subject: string) =>
    ApiService.post(`/notifications/send-topic`, {
      topicArn: `arn:aws:sns:${AWS_CONFIG.REGION}:*:${topic}`,
      message,
      subject
    }),
    
  // Get available SNS topics
  getAvailableTopics: () => SNS_TOPICS
};
