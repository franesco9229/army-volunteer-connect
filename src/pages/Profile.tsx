
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
import { User, Mail, Edit, Save, X, Plus, Upload, Clock, Calendar, Star } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

export default function Profile() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [profileData, setProfileData] = useState({
    name: mockCurrentUser.name,
    email: mockCurrentUser.email,
    photoUrl: mockCurrentUser.photoUrl || '',
  });
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
      photoUrl: mockCurrentUser.photoUrl || '',
    });
    setIsEditingProfile(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload the file to a server here
      // For demonstration, we'll use a local URL
      const fileUrl = URL.createObjectURL(file);
      setProfileData(prev => ({
        ...prev,
        photoUrl: fileUrl
      }));
      toast.success("Profile photo updated");
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      // In a real app, we would make an API call to add the skill
      const newSkillObj: Skill = {
        id: `skill-${Date.now()}`, // Generate a temporary ID
        name: newSkill.trim(),
        level: SkillLevel.Learning
      };
      
      setSkills(prev => [...prev, newSkillObj]);
      setNewSkill('');
      toast.success("Skill added successfully");
    }
  };

  const handlePreferenceChange = (name: string, value: boolean | number) => {
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvailabilityChange = (day: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: value
      }
    }));
  };

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
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
                      {/* Add new skill input */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a new skill..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={handleAddSkill} className="bg-sta-purple hover:bg-sta-purple-dark">
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>

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
                <h3 className="text-xl font-semibold mb-6">Your Volunteering Preferences</h3>
                
                {/* Mentoring Section */}
                <div className="space-y-6 mb-8">
                  <h4 className="text-lg font-medium flex items-center">
                    <Star className="h-5 w-5 mr-2 text-sta-purple" />
                    Mentoring Preferences
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="want-to-mentor" 
                        checked={preferences.wantToMentor}
                        onCheckedChange={(checked) => 
                          handlePreferenceChange('wantToMentor', checked === true)
                        }
                      />
                      <label 
                        htmlFor="want-to-mentor" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I want to mentor others
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="want-to-be-mentored" 
                        checked={preferences.wantToBeMentored}
                        onCheckedChange={(checked) => 
                          handlePreferenceChange('wantToBeMentored', checked === true)
                        }
                      />
                      <label 
                        htmlFor="want-to-be-mentored" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I want to be mentored
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Hours Per Week */}
                <div className="space-y-6 mb-8">
                  <h4 className="text-lg font-medium flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-sta-purple" />
                    Volunteer Hours
                  </h4>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Hours available per week</span>
                      <span className="font-medium">{preferences.hoursPerWeek} hours</span>
                    </div>
                    
                    <Slider 
                      value={[preferences.hoursPerWeek]} 
                      min={1} 
                      max={20} 
                      step={1}
                      onValueChange={(values) => handlePreferenceChange('hoursPerWeek', values[0])} 
                    />
                  </div>
                </div>
                
                {/* Availability */}
                <div className="space-y-6">
                  <h4 className="text-lg font-medium flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-sta-purple" />
                    Weekly Availability
                  </h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Object.entries(preferences.availability).map(([day, isAvailable]) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`day-${day}`} 
                          checked={isAvailable}
                          onCheckedChange={(checked) => 
                            handleAvailabilityChange(day, checked === true)
                          }
                        />
                        <label 
                          htmlFor={`day-${day}`} 
                          className="text-sm font-medium leading-none capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="mt-8 bg-sta-purple hover:bg-sta-purple-dark"
                  onClick={() => toast.success("Preferences saved successfully")}
                >
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
