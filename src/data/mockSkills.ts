
import { Skill, SkillLevel } from '@/types';

export const mockSkills: Skill[] = [
  { id: "skill-1", name: "React", level: SkillLevel.Expert },
  { id: "skill-2", name: "TypeScript", level: SkillLevel.Proficient },
  { id: "skill-3", name: "Node.js", level: SkillLevel.Learning },
  { id: "skill-4", name: "UI/UX Design", level: SkillLevel.Familiar },
  { id: "skill-5", name: "AWS", level: SkillLevel.Learning },
  { id: "skill-6", name: "Project Management", level: SkillLevel.Proficient },
  { id: "skill-7", name: "Python", level: SkillLevel.Expert },
  { id: "skill-8", name: "Data Analysis", level: SkillLevel.Familiar }
];

export const fetchUserSkills = async (userId: string): Promise<Skill[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return different skills for different users
  switch (userId) {
    case "user-1":
      return mockSkills.slice(0, 5);
    case "user-2":
      return mockSkills.slice(2, 6);
    case "user-3":
      return mockSkills.slice(4, 8);
    default:
      return [];
  }
};

export const updateUserSkill = async (userId: string, skillId: string, level: SkillLevel): Promise<Skill[]> => {
  // Get user's skills
  const userSkills = await fetchUserSkills(userId);
  
  // Update skill level
  const updatedSkills = userSkills.map(skill => 
    skill.id === skillId ? { ...skill, level } : skill
  );
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return updatedSkills;
};
