
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { StatsSection } from '@/components/dashboard/StatsSection';
import { RecentOpportunities } from '@/components/dashboard/RecentOpportunities';
import { ApplicationsStatus } from '@/components/dashboard/ApplicationsStatus';
import { Opportunity, Application, VolunteeringRecord, VolunteeringRecordStatus, ApplicationStatus } from '@/types';
import { 
  fetchOpportunities, 
  fetchUserApplications, 
  fetchUserVolunteeringRecords,
  mockCurrentUser
} from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function Index() {
  const { isAuthenticated, user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [volunteeringRecords, setVolunteeringRecords] = useState<VolunteeringRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const [oppsData, appsData, recordsData] = await Promise.all([
        fetchOpportunities(),
        fetchUserApplications(mockCurrentUser.id),
        fetchUserVolunteeringRecords(mockCurrentUser.id)
      ]);
      
      setOpportunities(oppsData);
      setApplications(appsData);
      setVolunteeringRecords(recordsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  // Show loading skeleton while data loads
  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8 animate-fade-in">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </AppLayout>
    );
  }

  // Calculate statistics
  const totalHours = mockCurrentUser.totalVolunteerHours;
  const activeProjects = volunteeringRecords.filter(
    record => record.status === VolunteeringRecordStatus.Active
  ).length;
  const completedProjects = volunteeringRecords.filter(
    record => record.status === VolunteeringRecordStatus.Completed
  ).length;
  const pendingApplications = applications.filter(
    app => app.status === ApplicationStatus.Pending
  ).length;

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {mockCurrentUser.name}</h1>
          <p className="text-muted-foreground">
            Track your volunteering journey and find new opportunities.
          </p>
        </div>
        
        <StatsSection
          totalHours={totalHours}
          activeProjects={activeProjects}
          completedProjects={completedProjects}
          pendingApplications={pendingApplications}
        />
        
        <ApplicationsStatus 
          applications={applications} 
          opportunities={opportunities} 
        />
        
        <RecentOpportunities 
          opportunities={opportunities}
          applications={applications}
          userId={mockCurrentUser.id}
          onApplicationSubmitted={fetchData}
        />
      </div>
    </AppLayout>
  );
}
