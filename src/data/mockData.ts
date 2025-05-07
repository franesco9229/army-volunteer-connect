
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
export const mockCurrentUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  photoUrl: '', // Empty string for now, will be filled when user uploads a photo
  skills: mockSkills.slice(0, 5), // First 5 skills from the list
  totalVolunteerHours: 120
};

// Mock Opportunities Data
export const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "Frontend Developer",
    description: "Help build a new website for a local charity focused on food security. Working with the design team to implement responsive, accessible user interfaces.",
    client: "Edinburgh Food Bank",
    requiredSkills: ["React", "TypeScript", "UI/UX Design"],
    timeCommitment: "5-10 hours/week",
    projectDuration: "3 months",
    status: OpportunityStatus.Open,
    postedDate: "2025-04-15",
    role: "Developer"
  },
  {
    id: "2",
    title: "Backend Developer",
    description: "Develop an API for a community garden app that tracks plant growth, volunteer scheduling, and resource management.",
    client: "Glasgow Green Spaces",
    requiredSkills: ["Node.js", "Express", "MongoDB"],
    timeCommitment: "8-12 hours/week",
    projectDuration: "4 months",
    status: OpportunityStatus.Open,
    postedDate: "2025-04-18",
    role: "Developer"
  },
  {
    id: "3",
    title: "UX Researcher",
    description: "Conduct user research for a mental health application supporting vulnerable communities. Includes interviews, usability testing, and creating user personas.",
    client: "Mind Scotland",
    requiredSkills: ["UI/UX Design", "User Research", "Prototyping"],
    timeCommitment: "4-6 hours/week",
    projectDuration: "2 months",
    status: OpportunityStatus.Open,
    postedDate: "2025-04-20",
    role: "Designer"
  },
  {
    id: "4",
    title: "Project Manager",
    description: "Coordinate a team building a platform for local businesses affected by COVID-19 to showcase their services and enable online ordering.",
    client: "Highlands Business Collective",
    requiredSkills: ["Project Management", "Agile Methodologies", "Communication"],
    timeCommitment: "10-15 hours/week",
    projectDuration: "6 months",
    status: OpportunityStatus.Open,
    postedDate: "2025-04-22",
    role: "Manager"
  },
  {
    id: "5",
    title: "Data Analyst",
    description: "Analyze environmental data for climate action group to identify trends and create visualizations for public awareness campaigns.",
    client: "Scottish Climate Action",
    requiredSkills: ["Data Science", "Python", "Visualization"],
    timeCommitment: "6-10 hours/week",
    projectDuration: "5 months",
    status: OpportunityStatus.Open,
    postedDate: "2025-04-25",
    role: "Analyst"
  },
  {
    id: "6",
    title: "DevOps Engineer",
    description: "Set up deployment pipelines for educational applications that teach programming to underprivileged youth in rural communities.",
    client: "Learning Scotland",
    requiredSkills: ["AWS", "CI/CD", "Docker"],
    timeCommitment: "8-12 hours/week",
    projectDuration: "3 months",
    status: OpportunityStatus.Filled,
    postedDate: "2025-03-15",
    role: "Engineer"
  },
  {
    id: "7",
    title: "Content Writer",
    description: "Create engaging content for community outreach program focused on digital literacy for elderly populations.",
    client: "Aberdeen Community Center",
    requiredSkills: ["Content Writing", "Editing", "SEO"],
    timeCommitment: "5-8 hours/week",
    projectDuration: "4 months",
    status: OpportunityStatus.Completed,
    postedDate: "2025-01-10",
    role: "Content"
  },
  {
    id: "8",
    title: "AI Ethics Researcher",
    description: "Research ethical implications of AI implementations in public services and develop guidelines for responsible use.",
    client: "Scottish Digital Ethics Council",
    requiredSkills: ["Research", "Ethics", "AI/ML"],
    timeCommitment: "10-20 hours/week",
    projectDuration: "8 months",
    status: OpportunityStatus.Open,
    postedDate: "2025-05-01",
    role: "Researcher"
  },
  {
    id: "9",
    title: "Accessibility Specialist",
    description: "Audit websites of local nonprofits for accessibility compliance and implement improvements to meet WCAG standards.",
    client: "Digital Inclusion Scotland",
    requiredSkills: ["Accessibility", "HTML/CSS", "WCAG"],
    timeCommitment: "6-10 hours/week",
    projectDuration: "3 months",
    status: OpportunityStatus.Open,
    postedDate: "2025-05-03",
    role: "Specialist"
  },
  {
    id: "10",
    title: "Mobile App Developer",
    description: "Help develop a mobile app for community resource sharing during emergencies, including offline functionality.",
    client: "Disaster Resilience Network",
    requiredSkills: ["React Native", "Mobile Development", "Offline-First"],
    timeCommitment: "10-15 hours/week",
    projectDuration: "5 months",
    status: OpportunityStatus.Filled,
    postedDate: "2025-02-20",
    role: "Developer"
  }
];

// Mock Applications Data
export const mockApplications: Application[] = [
  {
    id: "1",
    userId: "user-1",
    opportunityId: "1",
    status: ApplicationStatus.Successful,
    appliedDate: "2025-04-16",
    notes: "Great fit for my frontend skills and I'm passionate about food security issues."
  },
  {
    id: "2",
    userId: "user-1",
    opportunityId: "3",
    status: ApplicationStatus.Pending,
    appliedDate: "2025-04-21",
    notes: "My UX research experience would be valuable for this mental health project."
  },
  {
    id: "3",
    userId: "user-1",
    opportunityId: "5",
    status: ApplicationStatus.Unsuccessful,
    appliedDate: "2025-04-26",
    notes: "Would like to contribute my data analysis skills to climate action."
  },
  {
    id: "4",
    userId: "user-1",
    opportunityId: "8",
    status: ApplicationStatus.Pending,
    appliedDate: "2025-05-02",
    notes: "I have extensive research experience in ethical implications of technology."
  },
  {
    id: "5",
    userId: "user-1",
    opportunityId: "9",
    status: ApplicationStatus.Approved,
    appliedDate: "2025-05-04",
    notes: "I'm passionate about digital accessibility and have experience with WCAG audits."
  },
  {
    id: "6",
    userId: "user-1",
    opportunityId: "6",
    status: ApplicationStatus.Rejected,
    appliedDate: "2025-03-17",
    notes: "My DevOps experience would be valuable for setting up these deployment pipelines."
  }
];

// Mock Volunteering Records
export const mockVolunteeringRecords: VolunteeringRecord[] = [
  {
    id: "1",
    userId: "user-1",
    opportunityId: "1",
    hoursContributed: 45,
    startDate: "2025-04-20",
    status: VolunteeringRecordStatus.Active
  },
  {
    id: "2",
    userId: "user-1",
    opportunityId: "6",
    hoursContributed: 75,
    startDate: "2025-03-20",
    endDate: "2025-04-15",
    status: VolunteeringRecordStatus.Completed
  },
  {
    id: "3",
    userId: "user-1",
    opportunityId: "7",
    hoursContributed: 32,
    startDate: "2025-01-15",
    endDate: "2025-02-28",
    status: VolunteeringRecordStatus.Completed
  },
  {
    id: "4",
    userId: "user-1",
    opportunityId: "10",
    hoursContributed: 38,
    startDate: "2025-02-25",
    endDate: "2025-03-30",
    status: VolunteeringRecordStatus.Dropped
  },
  {
    id: "5",
    userId: "user-1",
    opportunityId: "9",
    hoursContributed: 18,
    startDate: "2025-05-10",
    status: VolunteeringRecordStatus.Active
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

// Admin functions
export const updateApplicationStatus = (
  applicationId: string,
  newStatus: ApplicationStatus
): Promise<Application> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const application = mockApplications.find(a => a.id === applicationId);
      if (application) {
        application.status = newStatus;
        
        // If approved and no volunteering record exists, create one
        if (newStatus === ApplicationStatus.Approved) {
          const existingRecord = mockVolunteeringRecords.find(
            r => r.userId === application.userId && r.opportunityId === application.opportunityId
          );
          
          if (!existingRecord) {
            const newRecord: VolunteeringRecord = {
              id: `record-${Date.now()}`,
              userId: application.userId,
              opportunityId: application.opportunityId,
              hoursContributed: 0,
              startDate: new Date().toISOString().split('T')[0],
              status: VolunteeringRecordStatus.Active
            };
            mockVolunteeringRecords.push(newRecord);
          }
        }
        
        resolve(application);
      } else {
        throw new Error("Application not found");
      }
    }, 500);
  });
};
