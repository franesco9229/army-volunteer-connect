
import React from 'react';
import { 
  Bell, 
  User, 
  Lock, 
  Eye, 
  Shield
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import AppLayout from "@/components/layout/AppLayout";
import { AccountTab } from '@/components/settings/AccountTab';
import { NotificationsTab } from '@/components/settings/NotificationsTab';
import { DisplayTab } from '@/components/settings/DisplayTab';
import { PrivacyTab } from '@/components/settings/PrivacyTab';

const Settings = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="w-full md:w-auto mb-4">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Display</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <AccountTab />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>

          <TabsContent value="display">
            <DisplayTab />
          </TabsContent>
          
          <TabsContent value="privacy">
            <PrivacyTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
