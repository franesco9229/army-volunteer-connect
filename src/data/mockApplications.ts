
import { Application, ApplicationStatus, VolunteeringRecord } from '@/types';
import { mockOpportunities } from './mockOpportunities';

// Mock applications
export const mockApplications: Application[] = [
  {
    id: "app-1",
    userId: "user-1",
    opportunityId: "opp-1",
    status: ApplicationStatus.Approved,
    appliedDate: new Date(2025, 4, 2).toISOString(),
    notes: "I've been working with React for 3 years and would love to help.",
    lastUpdated: new Date(2025, 4, 4).toISOString()
  },
  {
    id: "app-2",
    userId: "user-1",
    opportunityId: "opp-3",
    status: ApplicationStatus.Pending,
    appliedDate: new Date(2025, 3, 22).toISOString(),
    notes: "I have experience with Node.js and MongoDB and would like to contribute.",
    lastUpdated: new Date(2025, 3, 22).toISOString()
  },
  {
    id: "app-3",
    userId: "user-1",
    opportunityId: "opp-5",
    status: ApplicationStatus.Pending,
    appliedDate: new Date(2025, 4, 6).toISOString(),
    notes: "I'm passionate about environmental issues and have content creation experience.",
    lastUpdated: new Date(2025, 4, 6).toISOString()
  },
  {
    id: "app-4",
    userId: "user-1",
    opportunityId: "opp-6",
    status: ApplicationStatus.Approved,
    appliedDate: new Date(2025, 2, 17).toISOString(),
    notes: "I've been working with data analysis for 2 years and would like to help.",
    lastUpdated: new Date(2025, 2, 19).toISOString()
  },
  {
    id: "app-5",
    userId: "user-1",
    opportunityId: "opp-7",
    status: ApplicationStatus.Rejected,
    appliedDate: new Date(2025, 3, 3).toISOString(),
    notes: "I have some experience with React Native and would like to learn more.",
    lastUpdated: new Date(2025, 3, 5).toISOString()
  }
];

// Mock volunteering history
export const mockVolunteeringRecords: VolunteeringRecord[] = [
  {
    id: "record-1",
    userId: "user-1",
    opportunityId: "opp-6",
    hoursLogged: 45,
    startDate: new Date(2025, 2, 20).toISOString(),
    endDate: new Date(2025, 3, 15).toISOString(),
    feedback: "Great work analyzing the health data. Your insights were valuable for our recommendations.",
    impact: "Helped identify key trends that informed policy decisions affecting underserved communities."
  },
  {
    id: "record-2",
    userId: "user-1",
    opportunityId: "opp-7",
    hoursLogged: 65,
    startDate: new Date(2025, 3, 5).toISOString(),
    endDate: new Date(2025, 4, 1).toISOString(),
    feedback: "Excellent contribution to the mobile app development. The app is now used by hundreds of community members.",
    impact: "Developed key features that improved access to support services for 500+ community members."
  }
];

export const fetchUserApplications = async (userId: string): Promise<Application[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockApplications.filter(app => app.userId === userId);
};

export const fetchUserVolunteeringRecords = async (userId: string): Promise<VolunteeringRecord[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockVolunteeringRecords.filter(record => record.userId === userId);
};

export const updateApplicationStatus = async (
  applicationId: string, 
  newStatus: ApplicationStatus
): Promise<Application> => {
  // Find application
  const applicationIndex = mockApplications.findIndex(app => app.id === applicationId);
  
  if (applicationIndex === -1) {
    throw new Error("Application not found");
  }
  
  // Update status
  const updatedApplication = {
    ...mockApplications[applicationIndex],
    status: newStatus,
    lastUpdated: new Date().toISOString()
  };
  
  // In a real app, this would update the database
  mockApplications[applicationIndex] = updatedApplication;
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return updatedApplication;
};
