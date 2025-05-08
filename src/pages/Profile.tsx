
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
import { useProfileData } from '@/hooks/profile/useProfileData';
import { ProfileTabContent } from '@/components/profile/ProfileTabContent';

export default function Profile() {
  const { 
    skills, 
    socialLinks,
    preferences, 
    isLoading, 
    handleSkillUpdate, 
    handleAddSkill, 
    handleSocialLinksChange, 
    handlePreferencesChange 
  } = useProfileData();

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
        
        <ProfileTabContent 
          skills={skills}
          socialLinks={socialLinks}
          preferences={preferences}
          onSkillUpdate={handleSkillUpdate}
          onAddSkill={handleAddSkill}
          onSocialLinksChange={handleSocialLinksChange}
          onPreferencesChange={handlePreferencesChange}
        />
      </div>
    </AppLayout>
  );
}
