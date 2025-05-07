
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { Edit, Save, X, Upload, Github, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { User, Skill } from '@/types';
import { SocialLink } from '../profile/SocialLinksTab';

interface ProfileHeaderProps {
  userData: {
    name: string;
    email: string;
    photoUrl: string;
  };
  skills: Skill[];
  totalVolunteerHours: number;
}

export function ProfileHeader({ userData, skills, totalVolunteerHours }: ProfileHeaderProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userData.name,
    email: userData.email,
    photoUrl: userData.photoUrl || '',
    bio: "I'm passionate about volunteering and making a positive impact in my community. With expertise in web development and project management, I enjoy collaborating on meaningful projects.",
    socialLinks: [
      { id: "1", platform: "LinkedIn", url: "https://linkedin.com/in/username", icon: Linkedin },
      { id: "2", platform: "Twitter", url: "https://twitter.com/username", icon: Twitter },
    ],
    preferences: {
      wantToMentor: true,
      wantToBeMentored: false,
    }
  });

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSave = () => {
    toast.success("Profile updated successfully");
    setIsEditingProfile(false);
  };

  const handleProfileCancel = () => {
    setProfileData({
      ...profileData,
      name: userData.name,
      email: userData.email,
      photoUrl: userData.photoUrl || '',
    });
    setIsEditingProfile(false);
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

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Card - Now larger */}
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Photo and Skills */}
            <div className="flex flex-col items-center md:items-start gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profileData.photoUrl || "/placeholder.svg"} alt={profileData.name} />
                  <AvatarFallback className="text-3xl bg-sta-purple text-white">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditingProfile && (
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
            </div>
            
            {/* Right Column - Profile Information */}
            <div className="space-y-5 text-center md:text-left flex-1">
              {isEditingProfile ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={profileData.name} 
                      onChange={handleProfileChange} 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      value={profileData.email} 
                      onChange={handleProfileChange} 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      name="bio" 
                      value={profileData.bio} 
                      onChange={handleProfileChange} 
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  <div className="flex gap-2 justify-center md:justify-start">
                    <Button onClick={handleProfileSave} className="bg-sta-purple hover:bg-sta-purple-dark">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleProfileCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-2xl font-bold">{profileData.name}</h2>
                    <div className="flex items-center justify-center md:justify-start mt-1 text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      <span>{profileData.email}</span>
                    </div>
                  </div>
                  
                  {/* Social Media Links */}
                  <div className="flex gap-3 justify-center md:justify-start">
                    {profileData.socialLinks.map((link) => (
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
                    ))}
                  </div>
                  
                  {/* Bio Section */}
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">About Me</h3>
                    <p className="text-sm">{profileData.bio}</p>
                  </div>
                  
                  {/* Mentoring Preferences */}
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Mentoring</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.preferences.wantToMentor && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Available to mentor
                        </span>
                      )}
                      {profileData.preferences.wantToBeMentored && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Looking for mentorship
                        </span>
                      )}
                      {!profileData.preferences.wantToMentor && !profileData.preferences.wantToBeMentored && (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          No mentoring preferences set
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button variant="outline" className="mt-2" onClick={handleProfileEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    <span>Edit Profile</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Card */}
      <Card className="w-full">
        <CardContent className="p-6">
          <h3 className="font-medium mb-4">Volunteer Stats</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="text-2xl font-bold">{totalVolunteerHours}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Skills</p>
              <p className="text-2xl font-bold">{skills.length}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="text-2xl font-bold">April 2025</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

