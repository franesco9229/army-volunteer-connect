
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skill } from '@/types';
import { SocialLink } from './SocialLinksTab';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfileStats } from './ProfileStats';
import { ProfileInfo } from './ProfileInfo';
import { ProfileSkillsDisplay } from './ProfileSkillsDisplay';
import { SocialLinksDisplay } from './SocialLinksDisplay';

interface ProfileHeaderProps {
  userData: {
    name: string;
    email: string;
    photoUrl: string;
  };
  skills: Skill[];
  totalVolunteerHours: number;
  socialLinks?: SocialLink[];
  preferences?: {
    wantToMentor: boolean;
    wantToBeMentored: boolean;
    hoursPerWeek: number;
    availability: {
      [key: string]: boolean;
    }
  };
}

export function ProfileHeader({ 
  userData, 
  skills, 
  totalVolunteerHours, 
  socialLinks = [], 
  preferences
}: ProfileHeaderProps) {
  const [profileData, setProfileData] = useState({
    name: userData.name,
    email: userData.email,
    photoUrl: userData.photoUrl || '',
    bio: "I'm passionate about volunteering and making a positive impact in my community. With expertise in web development and project management, I enjoy collaborating on meaningful projects.",
    socialLinks: socialLinks,
    preferences: preferences || {
      wantToMentor: true,
      wantToBeMentored: false,
      hoursPerWeek: 5,
      availability: {
        monday: false,
        tuesday: true,
        wednesday: true,
        thursday: false,
        friday: true,
        saturday: false,
        sunday: false,
      }
    }
  });

  // Update social links when props change
  React.useEffect(() => {
    if (socialLinks && socialLinks.length > 0) {
      setProfileData(prev => ({
        ...prev,
        socialLinks
      }));
    }
  }, [socialLinks]);

  // Update preferences when props change
  React.useEffect(() => {
    if (preferences) {
      setProfileData(prev => ({
        ...prev,
        preferences
      }));
    }
  }, [preferences]);

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Card */}
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Photo and Skills */}
            <div className="flex flex-col items-center md:items-start gap-6 md:w-1/3">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profileData.photoUrl || "/placeholder.svg"} alt={profileData.name} />
                  <AvatarFallback className="text-3xl bg-sta-purple text-white">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <ProfileSkillsDisplay skills={skills} />
              
              {/* Social Links */}
              <SocialLinksDisplay links={profileData.socialLinks} />
            </div>
            
            {/* Right Column - Profile Information */}
            <div className="flex-1">
              <ProfileInfo 
                name={profileData.name}
                email={profileData.email}
                bio={profileData.bio}
                preferences={profileData.preferences}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Card */}
      <ProfileStats 
        totalVolunteerHours={totalVolunteerHours} 
        skillsCount={skills.length} 
      />
    </div>
  );
}
