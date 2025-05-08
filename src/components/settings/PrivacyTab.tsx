
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProfilePrivacyOption } from '@/components/profile/ProfilePrivacyOption';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

type PrivacySettings = {
  showVolunteerHours: boolean;
  showSkills: boolean;
  showAvailability: boolean;
  showPreferences: boolean;
  showSocialLinks: boolean;
};

export function PrivacyTab() {
  const { user } = useAuth();
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    showVolunteerHours: true,
    showSkills: true,
    showAvailability: false,
    showPreferences: true,
    showSocialLinks: true
  });

  const handlePrivacyChange = (setting: keyof PrivacySettings, value: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>
          Control what information is visible to other users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Profile Visibility</h3>
          <div className="space-y-3">
            <ProfilePrivacyOption
              id="show-volunteer-hours"
              label="Show total volunteer hours on profile"
              checked={privacySettings.showVolunteerHours}
              onCheckedChange={(checked) => handlePrivacyChange('showVolunteerHours', checked)}
            />
            
            <ProfilePrivacyOption
              id="show-skills"
              label="Make skills visible to others"
              description="Your skills will be visible on your public profile"
              checked={privacySettings.showSkills}
              onCheckedChange={(checked) => handlePrivacyChange('showSkills', checked)}
            />
            
            <ProfilePrivacyOption
              id="show-availability"
              label="Show availability to project managers"
              checked={privacySettings.showAvailability}
              onCheckedChange={(checked) => handlePrivacyChange('showAvailability', checked)}
            />
            
            <ProfilePrivacyOption
              id="show-preferences"
              label="Show mentoring preferences"
              description="Other volunteers can see if you are open to mentoring"
              checked={privacySettings.showPreferences}
              onCheckedChange={(checked) => handlePrivacyChange('showPreferences', checked)}
            />
            
            <ProfilePrivacyOption
              id="show-social-links"
              label="Show social media links"
              checked={privacySettings.showSocialLinks}
              onCheckedChange={(checked) => handlePrivacyChange('showSocialLinks', checked)}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="font-medium">Email Preferences</h3>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Contact Email</Label>
            <Input id="contact-email" defaultValue={user?.email || ""} />
            
            <ProfilePrivacyOption
              id="use-contact-email"
              label="Use this email for notifications"
              checked={true}
              onCheckedChange={() => {}}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
