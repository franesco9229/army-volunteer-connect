
import React from 'react';
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function PasswordChangeForm() {
  const { toast } = useToast();

  const form = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const handleSubmit = (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would call your password change API
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully."
    });
    
    form.reset();
    console.log("Password change data:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormItem>
          <FormLabel>Current Password</FormLabel>
          <FormControl>
            <Input {...form.register("currentPassword")} type="password" />
          </FormControl>
        </FormItem>
        
        <FormItem>
          <FormLabel>New Password</FormLabel>
          <FormControl>
            <Input {...form.register("newPassword")} type="password" />
          </FormControl>
        </FormItem>
        
        <FormItem>
          <FormLabel>Confirm New Password</FormLabel>
          <FormControl>
            <Input {...form.register("confirmPassword")} type="password" />
          </FormControl>
        </FormItem>
        
        <Button type="submit">Update Password</Button>
      </form>
    </Form>
  );
}
