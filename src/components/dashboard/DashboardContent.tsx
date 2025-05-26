
import React from 'react';
import { DashboardStats } from './DashboardStats';
import { ApplicationsStatus } from './ApplicationsStatus';
import { RecentOpportunities } from './RecentOpportunities';
import { Opportunity, Application, VolunteeringRecord } from '@/types';

interface DashboardContentProps {
  userName: string;
  totalHours: number;
  opportunities: Opportunity[];
  applications: Application[];
  volunteeringRecords: VolunteeringRecord[];
  userId: string;
  onApplicationSubmitted: () => void;
}

export function DashboardContent({ 
  userName,
  totalHours,
  opportunities, 
  applications, 
  volunteeringRecords,
  userId,
  onApplicationSubmitted 
}: DashboardContentProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome, {userName}</h1>
        <p className="text-muted-foreground">
          Track your volunteering journey and find new opportunities.
        </p>
      </div>
      
      <DashboardStats
        totalHours={totalHours}
        volunteeringRecords={volunteeringRecords}
        applications={applications}
      />
      
      <ApplicationsStatus 
        applications={applications} 
        opportunities={opportunities} 
      />
      
      <RecentOpportunities 
        opportunities={opportunities}
        applications={applications}
        userId={userId}
        onApplicationSubmitted={onApplicationSubmitted}
      />
    </div>
  );
}
