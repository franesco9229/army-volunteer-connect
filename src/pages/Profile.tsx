
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { SkillLevelSelector } from '@/components/ui/SkillLevelSelector';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { 
  fetchUserSkills,
  updateUserSkill,
  mockCurrentUser
} from '@/data/mockData';
import { Skill, SkillLevel } from '@/types';
import { User, Mail, Edit, Save, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';

export default function Profile() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: mockCurrentUser.name,
    email: mockCurrentUser.email,
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
    // In a real app, this would make an API call to update the user profile
    toast.success("Profile updated successfully");
    setIsEditingProfile(false);
    // Since we're using mock data, we would normally update the state here
    // For demonstration purposes, we'll just close the edit mode
  };

  const handleProfileCancel = () => {
    // Reset to original values
    setProfileData({
      name: mockCurrentUser.name,
      email: mockCurrentUser.email,
    });
    setIsEditingProfile(false);
  };

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Card */}
          <Card className="flex-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder.svg" alt={mockCurrentUser.name} />
                  <AvatarFallback className="text-2xl">
                    {mockCurrentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
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
                          <Mail className="h-4 w-4 mr-2" />
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
                  <p className="text-2xl font-bold">{mockCurrentUser.totalVolunteerHours}</p>
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
        
        <Tabs defaultValue="skills">
          <TabsList>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="skills" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Your Skills</h3>
                  <Button 
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Done' : 'Edit Skills'}
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {isEditing ? (
                    // Edit mode
                    <div className="space-y-6">
                      {skills.map((skill) => (
                        <SkillLevelSelector
                          key={skill.id}
                          skillName={skill.name}
                          currentLevel={skill.level}
                          onChange={(level) => handleSkillUpdate(skill.id, level)}
                        />
                      ))}
                    </div>
                  ) : (
                    // View mode
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skills.map((skill) => (
                        <div key={skill.id} className="flex justify-between items-center p-3 border rounded-md">
                          <span className="font-medium">{skill.name}</span>
                          <SkillBadge name="" level={skill.level} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Notification Preferences</h3>
                
                <p className="text-muted-foreground">
                  Notification preferences coming soon. You will be able to customize
                  which updates and opportunities you receive notifications for.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
