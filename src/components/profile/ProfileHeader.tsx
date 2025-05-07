import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skill } from '@/types';
import { SocialLink } from './SocialLinksTab';
import { ProfileView } from './ProfileView';
import { ProfileEditForm } from './ProfileEditForm';
import { ProfileStats } from './ProfileStats';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, Github, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { SkillBadge } from '@/components/ui/SkillBadge';

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
  isEditMode?: boolean;
  isOwnProfile?: boolean;
  onEditToggle?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export function ProfileHeader({ 
  userData, 
  skills, 
  totalVolunteerHours, 
  socialLinks = [], 
  preferences,
  isEditMode = false,
  isOwnProfile = false,
  onEditToggle,
  onSave,
  onCancel
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

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setProfileData(prev => ({
        ...prev,
        photoUrl: fileUrl
      }));
      toast.success("Profile photo updated");
    }
  };

  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'x (twitter)':
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'github':
        return <Github className="w-5 h-5" />;
      default:
        return <Linkedin className="w-5 h-5" />;
    }
  };

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
                {isEditMode && (
                  <div className="absolute bottom-0 right-0">
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="bg-sta-purple hover:bg-sta-purple-dark text-white p-2 rounded-full">
                        <Upload className="h-4 w-4" />
                      </div>
                    </Label>
                    <Input 
                      id="photo-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoChange}
                    />
                  </div>
                )}
              </div>
              
              <div className="text-center md:text-left w-full">
                <h3 className="font-medium text-sm text-muted-foreground mb-2">My Skills</h3>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {skills.slice(0, 5).map((skill) => (
                    <SkillBadge 
                      key={skill.id} 
                      name={skill.name} 
                      level={skill.level} 
                    />
                  ))}
                  {skills.length > 5 && (
                    <span className="text-sm text-muted-foreground">
                      +{skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
              
              {/* Social Links */}
              <div className="w-full">
                <h3 className="font-medium text-sm text-muted-foreground mb-2 text-center md:text-left">Connect with me</h3>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {profileData.socialLinks.length > 0 ? (
                    profileData.socialLinks.map((link) => (
                      <a 
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-sta-purple transition-colors"
                        title={link.platform}
                      >
                        {renderSocialIcon(link.platform)}
                      </a>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No social links added</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column - Profile Information */}
            <div className="space-y-5 text-center md:text-left flex-1">
              {isEditMode ? (
                <ProfileEditForm
                  name={profileData.name}
                  email={profileData.email}
                  bio={profileData.bio}
                  onSave={onSave || (() => {})}
                  onCancel={onCancel || (() => {})}
                  onChange={handleProfileChange}
                />
              ) : (
                <ProfileView
                  name={profileData.name}
                  email={profileData.email}
                  bio={profileData.bio}
                  preferences={profileData.preferences}
                  isOwnProfile={isOwnProfile}
                  onEditToggle={onEditToggle || (() => {})}
                />
              )}
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
