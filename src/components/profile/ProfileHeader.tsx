
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { Edit, Save, X, Upload } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { User, Skill } from '@/types';

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
  });

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Profile Card */}
      <Card className="flex-1">
        <CardContent className="p-6">
          <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileData.photoUrl || "/placeholder.svg"} alt={profileData.name} />
                <AvatarFallback className="text-2xl bg-sta-purple text-white">
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
            
            <div className="space-y-4 text-center md:text-left flex-1">
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
                  
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {skills.slice(0, 3).map((skill) => (
                      <SkillBadge 
                        key={skill.id} 
                        name={skill.name} 
                        level={skill.level} 
                      />
                    ))}
                    {skills.length > 3 && (
                      <span className="text-sm text-muted-foreground">
                        +{skills.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <Button variant="outline" className="mt-4" onClick={handleProfileEdit}>
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
      <Card className="w-full md:w-80">
        <CardContent className="p-6">
          <h3 className="font-medium mb-4">Volunteer Stats</h3>
          
          <div className="space-y-4">
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
