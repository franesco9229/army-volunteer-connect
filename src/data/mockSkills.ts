
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
  console.log(`Fetching skills for user ${userId}`);
  
  // Return different skills for different users
  let skills: Skill[] = [];
  
  switch (userId) {
    case "user-1":
      skills = mockSkills.slice(0, 5);
      break;
    case "user-2":
      skills = mockSkills.slice(2, 6);
      break;
    case "user-3":
      skills = mockSkills.slice(4, 8);
      break;
    case "user-123": // Default mock user ID
      skills = mockSkills.slice(0, 4);
      break;
    default:
      skills = [];
  }
  
  console.log(`Returning ${skills.length} skills for user ${userId}:`, skills);
  return skills;
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
