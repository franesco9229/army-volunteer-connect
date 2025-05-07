
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { SkillsTab } from '@/components/profile/SkillsTab';
import { PreferencesTab } from '@/components/profile/PreferencesTab';
import { SocialLinksTab } from '@/components/profile/SocialLinksTab';
import { TwoFactorAuth } from '@/components/profile/TwoFactorAuth';
import { Skill, SkillLevel } from '@/types';
import { fetchUserSkills, updateUserSkill, mockCurrentUser } from '@/data/mockData';
import { toast } from '@/components/ui/sonner';
import { ProfilePrivacyOption } from '@/components/profile/ProfilePrivacyOption';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function Profile() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [preferences, setPreferences] = useState({
    wantToMentor: false,
    wantToBeMentored: false,
    hoursPerWeek: 5,
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    }
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    showVolunteerHours: true,
    showSkills: true,
    showAvailability: false,
    showPreferences: false,
    showSocialLinks: true
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const skillsData = await fetchUserSkills(mockCurrentUser.id);
      setSkills(skillsData);
    } catch (error) {
      console.error("Error fetching skills data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSkillUpdate = async (skillId: string, level: SkillLevel) => {
    try {
      const updatedSkills = await updateUserSkill(mockCurrentUser.id, skillId, level);
      setSkills(updatedSkills);
      toast.success("Skill updated successfully");
    } catch (error) {
      toast.error("Failed to update skill");
      console.error(error);
    }
  };

  const handleAddSkill = (skillName: string) => {
    // In a real app, we would make an API call to add the skill
    const newSkillObj: Skill = {
      id: `skill-${Date.now()}`, // Generate a temporary ID
      name: skillName,
      level: SkillLevel.Learning
    };
    
    setSkills(prev => [...prev, newSkillObj]);
    toast.success("Skill added successfully");
  };

  const handlePrivacyChange = (setting: keyof typeof privacySettings, value: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
    toast.success(`Privacy setting updated`);
  };

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <ProfileHeader
          userData={{
            name: mockCurrentUser.name,
            email: mockCurrentUser.email,
            photoUrl: mockCurrentUser.photoUrl || '',
          }}
          skills={skills}
          totalVolunteerHours={mockCurrentUser.totalVolunteerHours}
        />
        
        <Tabs defaultValue="skills">
          <TabsList>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="skills" className="mt-6">
            <SkillsTab 
              skills={skills} 
              onSkillUpdate={handleSkillUpdate} 
              onAddSkill={handleAddSkill}
            />
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-6">
            <PreferencesTab initialPreferences={preferences} />
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <SocialLinksTab />
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <TwoFactorAuth />
          </TabsContent>
          
          <TabsContent value="privacy" className="mt-6">
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
                    <Input id="contact-email" defaultValue={mockCurrentUser.email} />
                    
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
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
