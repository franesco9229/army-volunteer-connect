
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { SkillsTab } from '@/components/profile/SkillsTab';
import { PreferencesTab } from '@/components/profile/PreferencesTab';
import { SocialLinksTab, SocialLink } from '@/components/profile/SocialLinksTab';
import { Skill, SkillLevel } from '@/types';
import { fetchUserSkills, updateUserSkill, mockCurrentUser } from '@/data/mockData';
import { toast } from '@/components/ui/sonner';
import { Linkedin, Twitter, Github, Facebook, Instagram } from 'lucide-react';
import { SkillBadge } from '@/components/ui/SkillBadge';

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
  
  // Initial social links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: "1", platform: "LinkedIn", url: "https://linkedin.com/in/username", icon: Linkedin },
    { id: "2", platform: "X (Twitter)", url: "https://twitter.com/username", icon: Twitter },
  ]);

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
  
  const handleSocialLinksChange = (updatedLinks: SocialLink[]) => {
    setSocialLinks(updatedLinks);
  };
  
  const handlePreferencesChange = (updatedPreferences: typeof preferences) => {
    setPreferences(updatedPreferences);
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
          socialLinks={socialLinks}
          preferences={preferences}
        />
        
        <Tabs defaultValue="skills">
          <TabsList>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
          </TabsList>
          
          <TabsContent value="skills" className="mt-6">
            <SkillsTab 
              skills={skills} 
              onSkillUpdate={handleSkillUpdate} 
              onAddSkill={handleAddSkill}
            />
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-6">
            <PreferencesTab 
              initialPreferences={preferences} 
              onPreferencesChange={handlePreferencesChange}
            />
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <SocialLinksTab 
              initialLinks={socialLinks}
              onSocialLinksChange={handleSocialLinksChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
