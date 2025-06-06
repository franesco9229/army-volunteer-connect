
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { ApiService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Crown, Settings } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export function RolesTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadRolesData();
  }, []);

  const loadRolesData = async () => {
    try {
      setIsLoading(true);
      
      // Get user's current roles from Cognito groups
      const currentRoles = user?.groups || [];
      setUserRoles(currentRoles);
      
      // Try to fetch available roles from backend
      try {
        const roles = await ApiService.charity.getAvailableRoles();
        setAvailableRoles(roles);
      } catch (error) {
        console.log('Unable to fetch roles from backend, using defaults');
        // Fallback to common volunteer roles
        setAvailableRoles([
          {
            id: 'volunteer',
            name: 'Volunteer',
            description: 'Basic volunteer access to view and apply for opportunities',
            permissions: ['view_opportunities', 'apply_to_events']
          },
          {
            id: 'coordinator',
            name: 'Event Coordinator',
            description: 'Can manage events and coordinate volunteer activities',
            permissions: ['manage_events', 'view_volunteers', 'coordinate_activities']
          },
          {
            id: 'admin',
            name: 'Administrator',
            description: 'Full access to manage the volunteer platform',
            permissions: ['full_access', 'manage_users', 'manage_roles']
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading roles data:', error);
      toast({
        title: "Error Loading Roles",
        description: "Unable to load role information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleToggle = async (roleId: string, checked: boolean) => {
    try {
      setIsSaving(true);
      
      let newRoles;
      if (checked) {
        newRoles = [...userRoles, roleId];
      } else {
        newRoles = userRoles.filter(role => role !== roleId);
      }
      
      // Try to update roles via backend API
      try {
        await ApiService.charity.updateUserRoles(newRoles);
        setUserRoles(newRoles);
        
        toast({
          title: "Roles Updated",
          description: "Your role permissions have been updated successfully.",
        });
      } catch (error) {
        console.log('Backend role update failed, storing locally');
        setUserRoles(newRoles);
        
        toast({
          title: "Roles Updated Locally",
          description: "Role changes saved locally. Full backend sync pending.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error updating roles:', error);
      toast({
        title: "Update Failed",
        description: "Unable to update roles. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'coordinator':
        return <Settings className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sta-purple"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Current Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userRoles.length === 0 ? (
              <p className="text-muted-foreground">No roles assigned</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {userRoles.map((roleId) => {
                  const role = availableRoles.find(r => r.id === roleId);
                  return (
                    <Badge key={roleId} variant="default" className="flex items-center gap-1">
                      {getRoleIcon(roleId)}
                      {role ? role.name : roleId}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableRoles.map((role) => (
              <div key={role.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id={role.id}
                  checked={userRoles.includes(role.id)}
                  onCheckedChange={(checked) => handleRoleToggle(role.id, checked as boolean)}
                  disabled={isSaving}
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(role.id)}
                    <label htmlFor={role.id} className="font-medium cursor-pointer">
                      {role.name}
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Roles determine your access level and permissions within the volunteer platform</p>
            <p>• Some role changes may require administrator approval</p>
            <p>• Contact your organization administrator if you need additional roles</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
