
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SkillsTab } from '@/components/profile/SkillsTab';
import { PreferencesTab } from '@/components/profile/PreferencesTab';
import { SocialLinksTab, SocialLink } from '@/components/profile/SocialLinksTab';
import { Skill, SkillLevel } from '@/types';
import { Preferences } from '@/hooks/profile/useProfileData';

interface ProfileTabContentProps {
  skills: Skill[];
  socialLinks: SocialLink[];
  preferences: Preferences;
  onSkillUpdate: (skillId: string, level: SkillLevel) => Promise<void>;
  onAddSkill: (skillName: string) => void;
  onSocialLinksChange: (updatedLinks: SocialLink[]) => void;
  onPreferencesChange: (updatedPreferences: Preferences) => void;
}

export function ProfileTabContent({
  skills,
  socialLinks,
  preferences,
  onSkillUpdate,
  onAddSkill,
  onSocialLinksChange,
  onPreferencesChange
}: ProfileTabContentProps) {
  return (
    <Tabs defaultValue="skills">
      <TabsList>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="social">Social Links</TabsTrigger>
      </TabsList>
      
      <TabsContent value="skills" className="mt-6">
        <SkillsTab 
          skills={skills} 
          onSkillUpdate={onSkillUpdate} 
          onAddSkill={onAddSkill}
        />
      </TabsContent>
      
      <TabsContent value="preferences" className="mt-6">
        <PreferencesTab 
          initialPreferences={preferences} 
          onPreferencesChange={onPreferencesChange}
        />
      </TabsContent>

      <TabsContent value="social" className="mt-6">
        <SocialLinksTab 
          initialLinks={socialLinks}
          onSocialLinksChange={onSocialLinksChange}
        />
      </TabsContent>
    </Tabs>
  );
}
