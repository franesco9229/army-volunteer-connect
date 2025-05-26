
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function AccountActions() {
  const { signOut } = useAuth();

  const handleExportData = () => {
    console.log('Exporting user data...');
    // Implementation would go here
  };

  const handleDeleteAccount = () => {
    console.log('Deleting account...');
    // Implementation would go here
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Export Data</h3>
          <p className="text-sm text-muted-foreground">
            Download a copy of your data
          </p>
        </div>
        <Button variant="outline" onClick={handleExportData}>
          Export
        </Button>
      </div>
      
      <Separator />
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Sign Out</h3>
          <p className="text-sm text-muted-foreground">
            Sign out from all devices
          </p>
        </div>
        <Button variant="secondary" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
      
      <Separator />
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Delete Account</h3>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all data
          </p>
        </div>
        <Button variant="destructive" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </div>
    </div>
  );
}
