
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function NotificationsTab() {
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
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Application Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Receive emails when your application status changes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Project Reminders</h4>
                <p className="text-sm text-muted-foreground">
                  Receive emails about upcoming project deadlines
                </p>
              </div>
              <Switch defaultChecked />
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
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Marketing Communications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive updates about STA events and news
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
