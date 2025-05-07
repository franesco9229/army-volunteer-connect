
import { Application, ApplicationStatus, Opportunity } from '@/types';
import { mockUsers } from './mockUsers';

// Mock opportunities
export const mockOpportunities: Opportunity[] = [
  {
    id: "opp-1",
    title: "Frontend Developer - React",
    organization: "Health App Project",
    description: "Help build a React-based health tracking application for nonprofits.",
    requiredSkills: ["React", "TypeScript", "CSS"],
    timeCommitment: "5-10 hours/week",
    duration: "3 months",
    location: "Remote",
    postedDate: new Date(2025, 4, 1).toISOString(),
    applicationDeadline: new Date(2025, 6, 1).toISOString(),
    status: "active",
    roleType: "developer",
    projectStatus: "active"
  },
  {
    id: "opp-2",
    title: "UI/UX Designer",
    organization: "Community Outreach Platform",
    description: "Design intuitive interfaces for a community outreach platform connecting volunteers with local nonprofits.",
    requiredSkills: ["Figma", "UI Design", "Prototyping"],
    timeCommitment: "10-20 hours/week",
    duration: "2 months",
    location: "Remote",
    postedDate: new Date(2025, 4, 15).toISOString(),
    applicationDeadline: new Date(2025, 5, 15).toISOString(),
    status: "active",
    roleType: "designer",
    projectStatus: "active"
  },
  {
    id: "opp-3",
    title: "Backend Developer - Node.js",
    organization: "Education Platform",
    description: "Develop APIs and database structures for an education platform serving underprivileged communities.",
    requiredSkills: ["Node.js", "Express", "MongoDB"],
    timeCommitment: "5-10 hours/week",
    duration: "4 months",
    location: "Remote",
    postedDate: new Date(2025, 3, 20).toISOString(),
    applicationDeadline: new Date(2025, 4, 20).toISOString(),
    status: "active",
    roleType: "developer",
    projectStatus: "active"
  },
  {
    id: "opp-4",
    title: "Project Manager",
    organization: "Disaster Relief App",
    description: "Coordinate development efforts for an app connecting disaster relief organizations with volunteers.",
    requiredSkills: ["Project Management", "Agile", "Communication"],
    timeCommitment: "10-20 hours/week",
    duration: "6 months",
    location: "Remote with occasional in-person meetings",
    postedDate: new Date(2025, 3, 10).toISOString(),
    applicationDeadline: new Date(2025, 4, 10).toISOString(),
    status: "active",
    roleType: "project-manager",
    projectStatus: "active"
  },
  {
    id: "opp-5",
    title: "Content Creator",
    organization: "Environmental Awareness Campaign",
    description: "Create engaging content for an environmental awareness campaign targeting youth.",
    requiredSkills: ["Content Writing", "Social Media", "Video Editing"],
    timeCommitment: "under5",
    duration: "Ongoing",
    location: "Remote",
    postedDate: new Date(2025, 4, 5).toISOString(),
    applicationDeadline: new Date(2025, 5, 5).toISOString(),
    status: "active",
    roleType: "content-creator",
    projectStatus: "active"
  },
  {
    id: "opp-6",
    title: "Data Analyst",
    organization: "Public Health Research",
    description: "Analyze public health data to identify trends and insights for policy recommendations.",
    requiredSkills: ["Data Analysis", "Python", "Visualization"],
    timeCommitment: "5-10 hours/week",
    duration: "3 months",
    location: "Remote",
    postedDate: new Date(2025, 2, 15).toISOString(),
    applicationDeadline: new Date(2025, 3, 15).toISOString(),
    status: "closed",
    roleType: "business-analyst",
    projectStatus: "completed"
  },
  {
    id: "opp-7",
    title: "Mobile App Developer",
    organization: "Community Support Network",
    description: "Develop a mobile app to connect community members with local support services.",
    requiredSkills: ["React Native", "Firebase", "Mobile Development"],
    timeCommitment: "10-20 hours/week",
    duration: "4 months",
    location: "Remote",
    postedDate: new Date(2025, 3, 1).toISOString(),
    applicationDeadline: new Date(2025, 4, 1).toISOString(),
    status: "closed",
    roleType: "developer",
    projectStatus: "completed"
  },
  {
    id: "opp-8",
    title: "Marketing Specialist",
    organization: "Nonprofit Fundraising Campaign",
    description: "Create and implement marketing strategies for a major nonprofit fundraising campaign.",
    requiredSkills: ["Digital Marketing", "Campaign Management", "Analytics"],
    timeCommitment: "5-10 hours/week",
    duration: "2 months",
    location: "Remote",
    postedDate: new Date(2025, 2, 20).toISOString(),
    applicationDeadline: new Date(2025, 3, 20).toISOString(),
    status: "closed",
    roleType: "marketing",
    projectStatus: "completed"
  }
];

export const fetchOpportunities = async (): Promise<Opportunity[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockOpportunities;
};

export const fetchOpportunity = async (id: string): Promise<Opportunity | undefined> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockOpportunities.find(opp => opp.id === id);
};
