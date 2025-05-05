
import { 
  User, 
  Skill, 
  SkillLevel, 
  Opportunity, 
  OpportunityStatus, 
  Application, 
  ApplicationStatus, 
  VolunteeringRecord,
  VolunteeringRecordStatus 
} from '@/types';

// Mock Skills Data
export const mockSkills: Skill[] = [
  { id: "1", name: "React", level: SkillLevel.Advanced },
  { id: "2", name: "Node.js", level: SkillLevel.Competent },
  { id: "3", name: "UI/UX Design", level: SkillLevel.Learning },
  { id: "4", name: "Project Management", level: SkillLevel.Expert },
  { id: "5", name: "AWS", level: SkillLevel.Competent },
  { id: "6", name: "Python", level: SkillLevel.Teacher },
  { id: "7", name: "Data Science", level: SkillLevel.Advanced },
  { id: "8", name: "TypeScript", level: SkillLevel.Competent },
  { id: "9", name: "Git", level: SkillLevel.Advanced },
  { id: "10", name: "Agile Methodologies", level: SkillLevel.Expert },
];

// Mock User Data
export const mockCurrentUser: User = {
  id: "1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  skills: mockSkills.slice(0, 5), // First 5 skills from the list
  totalVolunteerHours: 120
};

// Mock Opportunities Data
export const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "Frontend Developer",
    description: "Help build a new website for a local charity.",
    client: "Edinburgh Food Bank",
    requiredSkills: ["React", "TypeScript", "UI/UX Design"],
    timeCommitment: "5-10 hours/week",
    projectDuration: "3 months",
    status: OpportunityStatus.Open,
    postedDate: "2025-04-15"
  },
  {
    id: "2",
    title: "Backend Developer",
    description: "Develop an API for a community garden app.",
    client: "Glasgow Green Spaces",
    requiredSkills: ["Node.js", "Express", "MongoDB"],
    timeCommitment: "8-12 hours/week",
    projectDuration: "4 months",
    status: OpportunityStatus.Open,
    postedDate: "2025-04-18"
  },
  {
    id: "3",
    title: "UX Researcher",
    description: "Conduct user research for a mental health application.",
    client: "Mind Scotland",
    requiredSkills: ["UI/UX Design", "User Research", "Prototyping"],
    timeCommitment: "4-6 hours/week",
    projectDuration: "2 months",
    status: OpportunityStatus.Open,
    postedDate: "2025-04-20"
  },
  {
    id: "4",
    title: "Project Manager",
    description: "Coordinate a team building a platform for local businesses.",
    client: "Highlands Business Collective",
    requiredSkills: ["Project Management", "Agile Methodologies", "Communication"],
    timeCommitment: "10-15 hours/week",
    projectDuration: "6 months",
    status: OpportunityStatus.Open,
    postedDate: "2025-04-22"
  },
  {
    id: "5",
    title: "Data Analyst",
    description: "Analyze environmental data for climate action group.",
    client: "Scottish Climate Action",
    requiredSkills: ["Data Science", "Python", "Visualization"],
    timeCommitment: "6-10 hours/week",
    projectDuration: "5 months",
    status: OpportunityStatus.Open,
    postedDate: "2025-04-25"
  },
  {
    id: "6",
    title: "DevOps Engineer",
    description: "Set up deployment pipelines for educational applications.",
    client: "Learning Scotland",
    requiredSkills: ["AWS", "CI/CD", "Docker"],
    timeCommitment: "8-12 hours/week",
    projectDuration: "3 months",
    status: OpportunityStatus.Filled,
    postedDate: "2025-03-15"
  },
  {
    id: "7",
    title: "Content Writer",
    description: "Create engaging content for community outreach program.",
    client: "Aberdeen Community Center",
    requiredSkills: ["Content Writing", "Editing", "SEO"],
    timeCommitment: "5-8 hours/week",
    projectDuration: "4 months",
    status: OpportunityStatus.Completed,
    postedDate: "2025-01-10"
  }
];

// Mock Applications Data
export const mockApplications: Application[] = [
  {
    id: "1",
    userId: "1",
    opportunityId: "1",
    status: ApplicationStatus.Successful,
    appliedDate: "2025-04-16"
  },
  {
    id: "2",
    userId: "1",
    opportunityId: "3",
    status: ApplicationStatus.Pending,
    appliedDate: "2025-04-21"
  },
  {
    id: "3",
    userId: "1",
    opportunityId: "5",
    status: ApplicationStatus.Unsuccessful,
    appliedDate: "2025-04-26"
  }
];

// Mock Volunteering Records
export const mockVolunteeringRecords: VolunteeringRecord[] = [
  {
    id: "1",
    userId: "1",
    opportunityId: "1",
    hoursContributed: 45,
    startDate: "2025-04-20",
    status: VolunteeringRecordStatus.Active
  },
  {
    id: "2",
    userId: "1",
    opportunityId: "6",
    hoursContributed: 75,
    startDate: "2025-03-20",
    endDate: "2025-04-15",
    status: VolunteeringRecordStatus.Completed
  }
];

// Service functions to mimic API calls
export const fetchOpportunities = (): Promise<Opportunity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOpportunities);
    }, 500);
  });
};

export const fetchUserApplications = (userId: string): Promise<Application[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userApplications = mockApplications.filter(app => app.userId === userId);
      resolve(userApplications);
    }, 500);
  });
};

export const fetchUserVolunteeringRecords = (userId: string): Promise<VolunteeringRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const records = mockVolunteeringRecords.filter(record => record.userId === userId);
      resolve(records);
    }, 500);
  });
};

export const fetchUserSkills = (userId: string): Promise<Skill[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userId === mockCurrentUser.id) {
        resolve(mockCurrentUser.skills);
      } else {
        resolve([]);
      }
    }, 500);
  });
};

export const updateUserSkill = (userId: string, skillId: string, level: SkillLevel): Promise<Skill[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userId === mockCurrentUser.id) {
        const updatedSkills = mockCurrentUser.skills.map(skill => 
          skill.id === skillId ? { ...skill, level } : skill
        );
        // In a real app, this would update the backend
        mockCurrentUser.skills = updatedSkills;
        resolve(updatedSkills);
      } else {
        resolve([]);
      }
    }, 500);
  });
};

export const applyForOpportunity = (userId: string, opportunityId: string): Promise<Application> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newApplication: Application = {
        id: `app-${Date.now()}`,
        userId,
        opportunityId,
        status: ApplicationStatus.Pending,
        appliedDate: new Date().toISOString().split('T')[0]
      };
      // In a real app, this would update the backend
      mockApplications.push(newApplication);
      resolve(newApplication);
    }, 500);
  });
};

export const updateVolunteerHours = (
  recordId: string, 
  hours: number
): Promise<VolunteeringRecord> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const record = mockVolunteeringRecords.find(r => r.id === recordId);
      if (record) {
        record.hoursContributed = hours;
        // Update total hours
        mockCurrentUser.totalVolunteerHours = mockVolunteeringRecords.reduce(
          (total, record) => total + record.hoursContributed, 
          0
        );
        resolve(record);
      } else {
        throw new Error("Record not found");
      }
    }, 500);
  });
};
