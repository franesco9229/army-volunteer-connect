
import { useState, useEffect } from 'react';
import { Skill, SkillLevel } from '@/types';
import { fetchUserSkills, updateUserSkill, mockCurrentUser } from '@/data/mockData';
import { SocialLink } from '@/components/profile/SocialLinksTab';
import { toast } from '@/components/ui/sonner';
import { Linkedin, Twitter } from 'lucide-react';

export interface Preferences {
  wantToMentor: boolean;
  wantToBeMentored: boolean;
  hoursPerWeek: number;
  availability: {
    [key: string]: boolean;
  };
}

export function useProfileData() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [preferences, setPreferences] = useState<Preferences>({
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
  
  const handlePreferencesChange = (updatedPreferences: Preferences) => {
    setPreferences(updatedPreferences);
  };

  return {
    skills,
    socialLinks,
    preferences,
    isLoading,
    handleSkillUpdate,
    handleAddSkill,
    handleSocialLinksChange,
    handlePreferencesChange
  };
}
