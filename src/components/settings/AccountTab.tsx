
import React from 'react';
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { TwoFactorAuth } from '@/components/profile/TwoFactorAuth';

export function AccountTab() {
  const { toast } = useToast();

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const handlePasswordSubmit = (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully."
    });
    console.log("Password data:", data);
  };

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
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-6">
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input {...passwordForm.register("currentPassword")} type="password" />
                </FormControl>
              </FormItem>
              
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input {...passwordForm.register("newPassword")} type="password" />
                </FormControl>
              </FormItem>
              
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input {...passwordForm.register("confirmPassword")} type="password" />
                </FormControl>
              </FormItem>
              
              <Button type="submit">Update Password</Button>
            </form>
          </Form>
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Export Data</h3>
                <p className="text-sm text-muted-foreground">
                  Download a copy of your data
                </p>
              </div>
              <Button variant="outline">Export</Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Sign Out</h3>
                <p className="text-sm text-muted-foreground">
                  Sign out from all devices
                </p>
              </div>
              <Button variant="secondary">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
