
// User-related types
export interface User {
  id: string;
  name: string;
  email: string;
  skills: Skill[];
  totalVolunteerHours: number;
}

// Skill-related types
export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
}

export enum SkillLevel {
  None = "None",
  Learning = "Learning",
  Competent = "Competent",
  Advanced = "Advanced",
  Expert = "Expert",
  Teacher = "I can teach others"
}

// Opportunity-related types
export interface Opportunity {
  id: string;
  title: string;
  description: string;
  client: string;
  requiredSkills: string[];
  timeCommitment: string;
  projectDuration: string;
  status: OpportunityStatus;
  postedDate: string;
  role?: string; // Added role field
}

export enum OpportunityStatus {
  Open = "Open",
  Filled = "Filled",
  Completed = "Completed"
}

// Application-related types
export interface Application {
  id: string;
  userId: string;
  opportunityId: string;
  status: ApplicationStatus;
  appliedDate: string;
  notes?: string; // Added notes field
}

export enum ApplicationStatus {
  Pending = "Pending",
  Successful = "Successful",
  Unsuccessful = "Unsuccessful",
  Approved = "Approved", // Added for admin workflow
  Rejected = "Rejected"  // Added for admin workflow
}

// Volunteering Record types
export interface VolunteeringRecord {
  id: string;
  userId: string;
  opportunityId: string;
  hoursContributed: number;
  startDate: string;
  endDate?: string;
  status: VolunteeringRecordStatus;
}

export enum VolunteeringRecordStatus {
  Active = "Active",
  Completed = "Completed",
  Dropped = "Dropped"
}
