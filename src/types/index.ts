// User-related types
export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  skills?: Skill[];
  totalVolunteerHours: number;
  isAdmin?: boolean;
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
  Familiar = "Familiar",
  Competent = "Competent", 
  Proficient = "Proficient",
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
  role?: string;
  organization?: string;
  applicationDeadline?: string;
  roleType?: string;
  projectStatus?: string;
  duration?: string;
  location?: string;
  video?: {
    url: string;
    thumbnail?: string;
    title?: string;
  };
}

export enum OpportunityStatus {
  Open = "Open",
  Active = "active",
  Closed = "closed",
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
  notes?: string;
  lastUpdated?: string;
}

export enum ApplicationStatus {
  Pending = "Pending",
  Successful = "Successful",
  Unsuccessful = "Unsuccessful",
  Approved = "Approved",
  Rejected = "Rejected"
}

// Volunteering Record types
export interface VolunteeringRecord {
  id: string;
  userId: string;
  opportunityId: string;
  hoursContributed: number;
  hoursLogged?: number;
  startDate: string;
  endDate?: string;
  status: VolunteeringRecordStatus;
  feedback?: string;
  impact?: string;
}

export enum VolunteeringRecordStatus {
  Active = "Active",
  Completed = "Completed",
  Dropped = "Dropped"
}
