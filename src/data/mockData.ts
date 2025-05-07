
import { SkillLevel } from '@/types';

// Re-export all mock data from separate files
export { 
  mockCurrentUser,
  mockUsers,
  fetchUser 
} from './mockUsers';

export { 
  mockSkills, 
  fetchUserSkills, 
  updateUserSkill 
} from './mockSkills';

export { 
  mockOpportunities, 
  fetchOpportunities, 
  fetchOpportunity 
} from './mockOpportunities';

export { 
  mockApplications, 
  mockVolunteeringRecords,
  fetchUserApplications, 
  fetchUserVolunteeringRecords,
  updateApplicationStatus,
  applyForOpportunity,
  updateVolunteerHours
} from './mockApplications';
