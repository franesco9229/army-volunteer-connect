
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { TwoFactorAuth } from '@/components/profile/TwoFactorAuth';
import { PasswordChangeForm } from './PasswordChangeForm';
import { AccountActions } from './AccountActions';

export function AccountTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm />
        </CardContent>
      </Card>
      
      <TwoFactorAuth />
      
      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>
            Manage your account settings and connected services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountActions />
        </CardContent>
      </Card>
    </div>
  );
}
