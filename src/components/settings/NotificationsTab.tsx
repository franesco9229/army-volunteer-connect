
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useAuth } from '@/contexts/AuthContext';
import { NotificationApi } from '@/services/api';

// Flag to switch between mock and real API calls
const USE_REAL_APIS = false;

export function NotificationsTab() {
  const { user } = useAuth();
  const [notifSettings, setNotifSettings] = useState({
    newOpportunities: true,
    applicationUpdates: true,
    projectReminders: true,
    browserNotifications: false,
    marketingComm: true
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Load user's notification preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      
      if (USE_REAL_APIS) {
        try {
          const subscriptions = await NotificationApi.getUserSubscriptions(user.id);
          // Map subscriptions to UI state
          // This is simplified - in a real app you'd map the ARNs to specific settings
          setNotifSettings({
            ...notifSettings,
            newOpportunities: subscriptions.some(s => s.includes('opportunities')),
            applicationUpdates: subscriptions.some(s => s.includes('applications'))
          });
        } catch (error) {
          console.error("Error loading notification preferences:", error);
        }
      }
    };
    
    loadPreferences();
  }, [user]);

  // Handle toggle changes
  const handleToggle = async (setting: keyof typeof notifSettings, value: boolean) => {
    if (!user) return;
    
    setNotifSettings(prev => ({ ...prev, [setting]: value }));
    
    if (USE_REAL_APIS) {
      setIsLoading(true);
      try {
        const topics = NotificationApi.getAvailableTopics();
        
        // Map UI settings to SNS topics
        const topicMap: Record<string, string> = {
          newOpportunities: topics.OPPORTUNITIES,
          applicationUpdates: topics.APPLICATIONS
        };
        
        if (setting in topicMap) {
          if (value) {
            // Subscribe - in a real app, you'd get the endpoint from the browser's push notification API
            const endpoint = window.location.origin;
            await NotificationApi.subscribeToTopic(user.id, topicMap[setting], endpoint);
            toast.success(`Subscribed to ${setting} notifications`);
          } else {
            // For unsubscribe, you'd need to store the subscription ARNs
            // This is simplified
            const subscriptions = await NotificationApi.getUserSubscriptions(user.id);
            const sub = subscriptions.find(s => s.includes(topicMap[setting]));
            if (sub) {
              await NotificationApi.unsubscribeFromTopic(sub);
              toast.success(`Unsubscribed from ${setting} notifications`);
            }
          }
        }
      } catch (error) {
        console.error("Error updating notification settings:", error);
        toast.error("Failed to update notification settings");
        // Revert the toggle if the API call failed
        setNotifSettings(prev => ({ ...prev, [setting]: !value }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Manage how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Notifications</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">New Opportunities</h4>
                <p className="text-sm text-muted-foreground">
                  Receive emails when new volunteering opportunities are posted
                </p>
              </div>
              <Switch 
                checked={notifSettings.newOpportunities}
                onCheckedChange={(checked) => handleToggle('newOpportunities', checked)}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Application Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Receive emails when your application status changes
                </p>
              </div>
              <Switch 
                checked={notifSettings.applicationUpdates}
                onCheckedChange={(checked) => handleToggle('applicationUpdates', checked)}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Project Reminders</h4>
                <p className="text-sm text-muted-foreground">
                  Receive emails about upcoming project deadlines
                </p>
              </div>
              <Switch 
                checked={notifSettings.projectReminders}
                onCheckedChange={(checked) => handleToggle('projectReminders', checked)} 
                disabled={isLoading}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">System Notifications</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Browser Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Show notifications in your browser
                </p>
              </div>
              <Switch 
                checked={notifSettings.browserNotifications}
                onCheckedChange={(checked) => {
                  if (checked) {
                    // Request browser notification permission
                    if ('Notification' in window) {
                      Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                          handleToggle('browserNotifications', true);
                        } else {
                          toast.error("Notification permission denied");
                        }
                      });
                    } else {
                      toast.error("Browser notifications not supported");
                    }
                  } else {
                    handleToggle('browserNotifications', false);
                  }
                }}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Marketing Communications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive updates about STA events and news
                </p>
              </div>
              <Switch 
                checked={notifSettings.marketingComm}
                onCheckedChange={(checked) => handleToggle('marketingComm', checked)}
                disabled={isLoading} 
              />
            </div>
          </div>
          
          {/* Test Notification Button */}
          {USE_REAL_APIS && user && (
            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={async () => {
                  try {
                    await NotificationApi.sendNotification(
                      user.id,
                      "This is a test notification message",
                      "Test Notification"
                    );
                    toast.success("Test notification sent");
                  } catch (error) {
                    toast.error("Failed to send test notification");
                    console.error(error);
                  }
                }}
                disabled={isLoading}
              >
                Send Test Notification
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
